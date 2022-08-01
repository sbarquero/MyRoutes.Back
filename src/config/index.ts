import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
  DB_CONNECTION_OPTIONS,
  MAILSERVICE_HOST,
  MAILSERVICE_PORT,
  MAILSERVICE_USER,
  MAILSERVICE_PASSWORD,
  RECOVER_URL,
  RECOVER_TOKEN_DURATION,
  ACTIVATION_URL,
  SECRET_KEY,
  TOKEN_DURATION,
  REFRESH_TOKEN_DURATION,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
} = process.env;
