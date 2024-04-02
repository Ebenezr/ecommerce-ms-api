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
