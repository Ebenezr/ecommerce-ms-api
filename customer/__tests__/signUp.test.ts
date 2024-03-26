const CustomerAPI = require('../src/datasources/CustomerAPI');
const PrismaClient = require('@prisma/client');

jest.mock('@prisma/client');

describe('CustomerAPI', () => {
  let customerAPI;
  const prisma = new PrismaClient();
  const mockContext = {
    session: {
      customerToken: {
        token: 'mockedCustomerToken',
        expirationTime: 60,
      },
    },
  };

  beforeEach(() => {
    customerAPI = new CustomerAPI({ context: mockContext });
  });

  test('Sign-in with invalid credentials', async () => {
    const input = {
      emailPhone: invalidUser.one,
      password: invalidUser.two,
    };

    customerAPI.post = jest.fn().mockRejectedValueOnce({
      statusCode: 401,
      response: {
        statusText: 'Unauthorized',
        body: {
          message:
            'You did not sign in correctly or your account is not active. Remaining 5 attempts.',
        },
      },
    });

    let error;
    try {
      await customerAPI.signIn(input);
    } catch (err) {
      error = err;
    }

    expect(customerAPI.ensureCart).toHaveBeenCalledTimes(1);
    expect(customerAPI.post).toHaveBeenCalledTimes(1);

    expect(error).toBeDefined();
    expect(error.statusCode).toBe(401);
    expect(error.response.statusText).toBe('Unauthorized');
    expect(error.response.body.message).toBe(
      'You did not sign in correctly or your account is not active. Remaining 5 attempts.'
    );
  });
});
