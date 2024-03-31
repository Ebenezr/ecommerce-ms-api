import { CustomerRepository } from '../repository/CustomerRepository';
import logMessages from '../utils/logMessages';
import { GenerateSignature, ValidatePassword } from '../utils';
import { addMinutes } from 'date-fns';
import config from 'dotenv';
import bcrypt from 'bcrypt';

config.config();
const configValues = process.env;

class CustomerAPI {
  context: any;
  repository: CustomerRepository;

  constructor(options: any) {
    this.context = options.context;
    this.repository = new CustomerRepository();

    // this.timeout = 30000;
  }

  errorHandler(error: any) {
    if (error instanceof Error) throw error;
    return {
      status: false,
      message: error,
    };
  }
  /**
   * Make request for customer token
   * @param {object} obj Parent object
   * @param {SignIn} input - form data
   * @param {string} input.email - user email
   * @param {string} input.password - user password
   * @return {Promise<boolean>} true if login was successful
   */
  async signIn(input: any) {
    const { email, password, autoSignIn } = input;
    const LOCKOUT_DURATION_MINUTES = parseInt(
      process.env.LOCKOUT_DURATION_MINUTES || '15'
    ); // Default to 15 if the env variable is not set
    const SESSION_DURATION_HOURS = autoSignIn ? 24 * 7 : 1; // 1 hour for normal sessions, 1 week for "Remember Me"

    const dateNow = Date.now();
    try {
      const existingCustomer = await this.repository.findCustomer(email);

      if (!existingCustomer)
        throw new Error('user not found with provided email id!');

      // Check if the account is locked
      if (
        existingCustomer.lockedUntil &&
        existingCustomer.lockedUntil > new Date(dateNow)
      ) {
        const remainingMinutes = Math.round(
          (existingCustomer.lockedUntil.getTime() - dateNow) / 60000
        );
        throw new Error(
          `Your account is locked due to multiple failed sign in attempts. Please try again after ${remainingMinutes} minutes.`
        );
      }

      const validPassword = await ValidatePassword(
        password,
        existingCustomer.password
      );
      if (!validPassword) {
        // Increment the retry count
        existingCustomer.retryCount = (existingCustomer.retryCount || 0) + 1;
        // If the retry count exceeds 5, reset it, lock the account and throw an error
        if (existingCustomer.retryCount > 5) {
          existingCustomer.retryCount = 0;
          existingCustomer.lockedUntil = new Date(
            dateNow + LOCKOUT_DURATION_MINUTES * 60 * 1000
          ); // Lock the account for LOCKOUT_DURATION_MINUTES minutes

          await this.repository.updateCustomer(email, existingCustomer);
          throw new Error(
            'You did not sign in correctly or your account is not active. No more attempts left.'
          );
        } else {
          await this.repository.updateCustomer(email, existingCustomer);
          throw new Error(
            `You did not sign in correctly or your account is not active. Remaining ${
              5 - existingCustomer.retryCount
            } attempts.`
          );
        }
      }
      const token = await GenerateSignature({
        email: existingCustomer.email,
        _id: existingCustomer.id,
      });
      const validTime: number = 60 * 60 * 1000 * SESSION_DURATION_HOURS;

      const tokenValidationTimeInMinutes = validTime / (60 * 1000);
      const tokenExpirationTime = addMinutes(
        dateNow,
        tokenValidationTimeInMinutes
      );
      this.context.session.customerToken = {
        token,
        expirationTime: tokenExpirationTime,
        email: existingCustomer.email,
      };
      // Reset the retry count and unlock the account on successful sign in
      existingCustomer.retryCount = 0;
      existingCustomer.lockedUntil = null;
      await this.repository.updateCustomer(email, existingCustomer);
      return {
        status: true,
        message: 'Sign in successfully',
      };
    } catch (error: any) {
      logMessages(
        error,
        'Error occured during sign in',
        'signin',
        '/signIn',
        {}
      );
      return {
        status: false,
        message: error?.message || 'Sign in failed',
      };
    }
  }

  async signUp(input: any) {
    const { email, password, phoneNumber, name, newsletter, autoSignIn } =
      input;
    const dateNow = Date.now();
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingCustomer = await this.repository.createCustomer({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        newsletter,
        autoSignIn,
      });

      const token = await GenerateSignature({
        email: email,
        _id: existingCustomer.id,
      });
      const validTime: number = 60 * 60 * 1000;

      const tokenValidationTimeInMinutes = validTime / (60 * 1000);
      const tokenExpirationTime = addMinutes(
        dateNow,
        tokenValidationTimeInMinutes
      );
      this.context.session.customerToken = {
        token,
        expirationTime: tokenExpirationTime,
        email: existingCustomer.email,
      };

      return {
        status: true,
        message: 'Sign up successfully',
      };
    } catch (error: any) {
      logMessages(
        error,
        'Error occured during sign up',
        'signup',
        '/signUp',
        {}
      );
      return {
        status: false,
        message: 'Sign up failed',
      };
    }
  }
  /**
   * Fetch customer data
   * @return - converted customer data
   */
  async customer() {
    const { customerToken } = this.context.session;
    if (!customerToken) {
      throw new Error('Unauthorized');
    }
    try {
      const customer = await this.repository.findCustomer(customerToken.email, {
        addresses: true,
      });

      return customer;
    } catch (error: any) {
      logMessages(
        error,
        'Wrror occured during customer query',
        'customer',
        '/customer'
      );
      throw new Error('Unauthorized');
    }
  }

  async signOut() {
    delete this.context.session.customerToken;
    return true;
  }

  /*
   * Get Cookie Consent
   */
  async getCookieConsent() {
    const { allowClientToBrowse } = this.context.session;
    const response: {
      status: boolean;
    } = { status: false };
    response.status = !!allowClientToBrowse;
    return response;
  }
  /**
   * Change password
   * @param {object} obj Parent object
   * @param {changePassword} input - form data
   * @param {string} input.email - user email
   * @param {string} input.password - user password
   * @return {Promise<boolean>} true if password was changed successfully
   */
  async changePassword(input: any) {
    const { email, password } = input;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      await this.repository.changePassword(email, hashedPassword);
      return {
        status: true,
        message: 'Password changed successfully',
      };
    } catch (error: any) {
      logMessages(
        error,
        'Error occured during password change',
        'changePassword',
        '/changePassword'
      );
      return {
        status: false,
        message: 'Password change failed',
      };
    }
  }
  /**
   * Add customer address
   * @param {object} obj Parent object
   * @param {AddressInput} input - form data
   * @param {string} input.email - user email
   * @param {string} input.address - user address
   * @return {Promise<boolean>} true if address was added successfully
   */
  async addCustomerAddress(input: any) {
    try {
      return await this.repository.addCustomerAddress(input);
    } catch (error: any) {
      logMessages(
        error,
        'Error occured during address addition',
        'addCustomerAddress',
        '/addCustomerAddress',
        {} // Add an empty object as the fourth argument
      );
      return {
        status: false,
        message: 'Address addition failed',
      };
    }
  }
}

export default CustomerAPI;
