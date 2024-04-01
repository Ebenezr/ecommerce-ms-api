import prisma from '../libs/prisma';

export class CustomerRepository {
  private prisma;

  constructor() {
    this.prisma = prisma;
  }

  async createCustomer(data: any) {
    return await this.prisma.customer.create({ data });
  }

  async findCustomer(email: string, include?: { [key: string]: boolean }) {
    return await this.prisma.customer.findUnique({
      where: {
        email,
      },
      include,
    });
  }

  async updateCustomer(email: string, data: any) {
    return await this.prisma.customer.update({
      where: { email },
      data,
    });
  }

  async changePassword(email: string, password: string) {
    try {
      await this.prisma.customer.update({
        where: { email },
        data: {
          password,
        },
      });
      return {
        status: true,
        message: 'Password changed successfully',
      };
    } catch (error: any) {
      return {
        status: false,
        message: 'Password change failed',
      };
    }
  }

  async addCustomerAddress(input: any) {
    const { customerId, defaultShipping, defaultBilling, ...address } = input;

    try {
      const createdAddress = await this.prisma.address.create({
        data: {
          ...address,
          defaultBilling,
          defaultShipping,
          customer: {
            connect: {
              id: customerId,
            },
          },
        },
      });
      if (defaultShipping || defaultBilling) {
        await this.prisma.customer.update({
          where: { id: customerId },
          data: {
            defaultShipping: defaultShipping ? createdAddress.id : undefined,
            defaultBilling: defaultBilling ? createdAddress.id : undefined,
          },
        });
      }
      return {
        status: true,
        message: 'Address added successfully',
      };
    } catch (error: any) {
      return {
        status: false,
        message: 'Address addition failed',
      };
    }
  }
}
