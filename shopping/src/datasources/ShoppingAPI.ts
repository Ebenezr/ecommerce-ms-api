import config from 'dotenv';

config.config();
const configValues = process.env;

class ShoppingAPI {
  context: any;

  constructor(options: any) {
    this.context = options.context;
    // this.repository = new CustomerRepository();

    // this.timeout = 30000;
  }
  errorHandler(error: any) {
    if (error instanceof Error) throw error;
    return {
      status: false,
      message: error,
    };
  }
}

export default ShoppingAPI;
