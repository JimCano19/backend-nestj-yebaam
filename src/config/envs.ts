import 'dotenv/config';
import * as Joi from 'joi';

interface EnvVars {
  PORT: number;
  NODE_ENV: string;
  
  // Database Configuration
  DATABASE_TYPE: string;
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  
  // Aurora Configuration (for production)
  AURORA_HOST?: string;
  AURORA_PORT?: number;
  AURORA_USER?: string;
  AURORA_PASSWORD?: string;
  AURORA_DB?: string;
  AURORA_SSL?: boolean;
  
  // AWS Configuration
  AWS_REGION?: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  
  // Cognito Configuration
  COGNITO_USER_POOL_ID?: string;
  COGNITO_CLIENT_ID?: string;
  COGNITO_CLIENT_SECRET?: string;
  
  // JWT Configuration
  JWT_SECRET?: string;
  JWT_EXPIRES_IN?: string;
  JWT_REFRESH_SECRET?: string;
  JWT_REFRESH_EXPIRES_IN?: string;
}

const envsSchema = Joi.object({
  PORT: Joi.number().optional(),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  
  // Database Configuration
  DATABASE_TYPE: Joi.string().default('postgres'),
  POSTGRES_HOST: Joi.string().optional(),
  POSTGRES_PORT: Joi.number().default(5432),
  POSTGRES_USER: Joi.string().optional(),
  POSTGRES_PASSWORD: Joi.string().optional(),
  POSTGRES_DB: Joi.string().optional(),
  
  // Aurora Configuration (optional, for production)
  AURORA_HOST: Joi.string().optional(),
  AURORA_PORT: Joi.number().optional(),
  AURORA_USER: Joi.string().optional(),
  AURORA_PASSWORD: Joi.string().optional(),
  AURORA_DB: Joi.string().optional(),
  AURORA_SSL: Joi.boolean().default(true),
  
  // AWS Configuration
  AWS_REGION: Joi.string().optional(),
  AWS_ACCESS_KEY_ID: Joi.string().optional(),
  AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
  
  // Cognito Configuration
  COGNITO_USER_POOL_ID: Joi.string().optional(),
  COGNITO_CLIENT_ID: Joi.string().optional(),
  COGNITO_CLIENT_SECRET: Joi.string().optional(),
  
  // JWT Configuration
  JWT_SECRET: Joi.string().optional(),
  JWT_EXPIRES_IN: Joi.string().default('24h'),
  JWT_REFRESH_SECRET: Joi.string().optional(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
}).unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

// Function to get database configuration based on environment
const getDatabaseConfig = () => {
  const isProduction = envVars.NODE_ENV === 'production';
  const useAurora = isProduction && envVars.AURORA_HOST;
  
  if (useAurora) {
    return {
      host: envVars.AURORA_HOST!,
      port: envVars.AURORA_PORT || 5432,
      user: envVars.AURORA_USER!,
      password: envVars.AURORA_PASSWORD!,
      database: envVars.AURORA_DB!,
      ssl: envVars.AURORA_SSL,
    };
  }
  
  // Default to PostgreSQL (development/local)
  return {
    host: envVars.POSTGRES_HOST,
    port: envVars.POSTGRES_PORT,
    user: envVars.POSTGRES_USER,
    password: envVars.POSTGRES_PASSWORD,
    database: envVars.POSTGRES_DB,
    ssl: envVars.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };
};

export const envs = {
  PORT: envVars.PORT,
  NODE_ENV: envVars.NODE_ENV,
  
  // Database configuration (switches between local PostgreSQL and Aurora)
  database: getDatabaseConfig(),
  
  // AWS Configuration
  AWS_REGION: envVars.AWS_REGION,
  AWS_ACCESS_KEY_ID: envVars.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: envVars.AWS_SECRET_ACCESS_KEY,
  
  // Cognito Configuration
  COGNITO_USER_POOL_ID: envVars.COGNITO_USER_POOL_ID,
  COGNITO_CLIENT_ID: envVars.COGNITO_CLIENT_ID,
  COGNITO_CLIENT_SECRET: envVars.COGNITO_CLIENT_SECRET,
  
  // JWT Configuration
  JWT_SECRET: envVars.JWT_SECRET,
  JWT_EXPIRES_IN: envVars.JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET: envVars.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: envVars.JWT_REFRESH_EXPIRES_IN,
};
