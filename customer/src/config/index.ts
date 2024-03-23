import dotEnv from 'dotenv';

if (process.env.NODE_ENV !== 'prod') {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

export const PORT: string | undefined = process.env.PORT;
export const DB_URL: string | undefined = process.env.MONGODB_URI;
export const APP_SECRET: string | undefined = process.env.APP_SECRET;
export const EXCHANGE_NAME: string | undefined = process.env.EXCHANGE_NAME;
export const MSG_QUEUE_URL: string | undefined = process.env.MSG_QUEUE_URL;
export const CUSTOMER_SERVICE: string = 'customer_service';
export const SHOPPING_SERVICE: string = 'shopping_service';
