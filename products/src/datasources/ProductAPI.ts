import logMessages from '../utils/logMessages';
import { GenerateSignature, ValidatePassword } from '../utils';
import { PrismaClient } from '@prisma/client';
import { addMinutes } from 'date-fns';
import config from 'dotenv';
import bcrypt from 'bcrypt';

config.config();
const configValues = process.env;

class ProductAPI {
  prisma: PrismaClient;
  context: any;

  constructor(options: any) {
    this.prisma = new PrismaClient();
    this.context = options.context;
    // this.timeout = 30000;
  }

  errorHandler(error: any) {
    if (error instanceof Error) throw error;
    return {
      status: false,
      message: error,
    };
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
}

export default ProductAPI;

/*
@TODO
Session management: You're storing the JWT token in the session, which is fine for a server-side session. However, if you're using a client-side session (like a cookie), you should consider storing the token on the client side to reduce server load and make your application more scalable.
*/
