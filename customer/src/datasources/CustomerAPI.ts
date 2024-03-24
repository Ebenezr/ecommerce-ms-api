import logMessages from '../utils/logMessages';
import {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from '../utils';
import { PrismaClient } from '@prisma/client';
import { addMinutes } from 'date-fns';
import { log } from 'console';

class CustomerAPI {
  prisma: PrismaClient;
  context: any;

  constructor(options: any) {
    this.prisma = new PrismaClient();
    this.context = options.context;
  }
  async signIn(input: any) {
    const { email, password } = input;
    const dateNow = Date.now();
    try {
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { email },
      });
      if (!existingCustomer)
        throw new Error('user not found with provided email id!');
      const validPassword = await ValidatePassword(
        password,
        existingCustomer.password,
        existingCustomer.salt
      );
      if (!validPassword) throw new Error('password does not match!');
      const token = await GenerateSignature({
        email: existingCustomer.email,
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
      return true;
    } catch (error) {
      logMessages(error, 'Error occured during sign in', '/signIn', {});
      return false;
    }
  }

  async signUp(input: any) {
    const { email, password, phone, name } = input;
    const dateNow = Date.now();
    try {
      // create salt
      let salt = await GenerateSalt();

      let userPassword = await GeneratePassword(password, salt);

      const existingCustomer = await this.prisma.customer.create({
        data: {
          name,
          email,
          password: userPassword,
          phone,
          salt,
        },
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
    } catch (error) {
      logMessages(error, 'Error occured during sign up', '/signUp', {});
      return {
        status: false,
        message: 'Sign up failed',
      };
    }
  }

  async customer() {
    const { customerToken } = this.context.session;
    if (!customerToken) {
      throw new Error('Unauthorized');
    }
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { email: customerToken.email },
      });
      return customer;
    } catch (error: any) {
      logMessages(
        error,
        'Wrror occured during customer query',
        '/customer',
        {}
      );
      throw new Error('Unauthorized');
    }
  }

  async signOut() {
    delete this.context.session.customerToken;
    return true;
  }
}

export default CustomerAPI;
