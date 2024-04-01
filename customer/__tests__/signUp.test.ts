import CustomerAPI from '../src/datasources/CustomerAPI';
import { test, expect, vi } from 'vitest';
import * as bcrypt from 'bcrypt';
import { describe } from 'node:test';
import { beforeEach } from 'vitest';
import prisma from '../src/libs/__mocks__/prisma';
import { GenerateSignature, ValidatePassword } from '../src/utils';
import sinon from 'sinon';


vi.mock('../src/repository/CustomerRepository');
vi.mock('../src/libs/prisma');
vi.mock('../src/utils/logMessages');

describe('CustomerAPI', () => {
  let customerAPI;

  const mockLoggedInContext = {
    session: {
      customerToken: {
        token: 'mockedCustomerToken',
        expirationTime: 60,
      },
    },
  };

  beforeEach(() => {
    customerAPI = new CustomerAPI({ context: mockLoggedInContext });
  });

  test('changePassword - success', async () => {
    const input = { email: 'masoko@masoko.com', password: 'password123' };

    prisma.customer.update.mockResolvedValueOnce({
      id: 'mockedId',
      name: 'mockedName',
      email: input.email,
      phoneNumber: 'mockedPhoneNumber',
      password: input.password,
      newsletter: false,
      autoSignIn: true,
      defaultBilling: null,
      defaultShipping: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lockedUntil: null,
      retryCount: 0,
    });
    const user = await customerAPI.changePassword(input);
    expect(user).toEqual({
      status: true,
      message: 'Password changed successfully',
    });
  });


  test('changePassword - failure', async () => {
    let input = { email: 'test@mail.com', password: 'password123' };


    prisma.customer.update.mockRejectedValueOnce(
      new Error('Password change failed')
    );

    const response = await customerAPI.changePassword(input);

    // expect(user).toEqual({
    //   status: false,
    //   message: 'Password change failed',
    // });

    // expect(prisma.customer.update).toHaveBeenCalledWith({
    //   data: {},
    // });

    // expect(customerAPI.changePassword).toHaveBeenCalledTimes(1);

  });

  describe('signIn', () => {
    test('signIn - success', async () => {
      const input = {
        email: 'ebbenenezar@masoko.com',
        password: 'H@rd1uck',
        autoSignIn: true,
      };

      const mockCustomer = {
        email: input.email,
        password: input.password,
        lockedUntil: null,
        retryCount: 0,
      };

      sinon
        .stub(customerAPI.repository, 'findCustomer')
        .returns(Promise.resolve(mockCustomer));
      // sinon.stub(ValidatePassword, 'validate').returns(Promise.resolve(true));

      const result = await customerAPI.signIn(input);

      // expect(result).toBe({
      //   status: false,
      //   message:
      //     'You did not sign in correctly or your account is not active. Remaining 4 attempts.',
      // });
    });

    test('signIn - failure due to incorrect password', async () => {
      const input = {
        email: 'masoko@masoko.com',
        password: 'wrongPassword',
        autoSignIn: true,
      };

      const mockCustomer = {
        email: input.email,
        password: 'password123',
        lockedUntil: null,
        retryCount: 0,
      };

      sinon
        .stub(customerAPI.repository, 'findCustomer')
        .returns(Promise.resolve(mockCustomer));
      // sinon.stub(ValidatePassword, 'validate').returns(Promise.resolve(false));

      try {
        await customerAPI.signIn(input);
      } catch (error) {
        expect(error.message).toBe('Invalid password');
      }
    });

  });
});
