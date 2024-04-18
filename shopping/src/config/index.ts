import config from 'dotenv';
config.config();

if (process.env.NODE_ENV !== 'prod') {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  config.config({ path: configFile });
} else {
  config.config();
}

export const DATABASE_URL: string | undefined = process.env.DATABASE_URL;
export const SERVER_PORT: string | undefined = process.env.SERVER_PORT;
export const APP_SECRET: string | undefined = process.env.APP_SECRET;
export const EXCHANGE_NAME: string | undefined = process.env.EXCHANGE_NAME;
export const MSG_QUEUE_URL: string | undefined = process.env.MSG_QUEUE_URL;
export const CUSTOMER_SERVICE: string = 'customer_service';
export const SHOPPING_SERVICE: string = 'shopping_service';
