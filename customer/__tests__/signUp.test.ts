import CustomerAPI from '../src/datasources/CustomerAPI';
import { test, expect, vi } from 'vitest';
import * as bcrypt from 'bcrypt';
import { describe } from 'node:test';
import { beforeEach } from 'vitest';
import prisma from '../src/libs/__mocks__/prisma';

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

    await customerAPI.changePassword(input);
    // expect(user).toEqual({
    //   status: false,
    //   message: 'Password change failed',
    // });

    // expect(prisma.customer.update).toHaveBeenCalledWith({
    //   data: {},
    // });

    // expect(customerAPI.changePassword).toHaveBeenCalledTimes(1);
  });
});
