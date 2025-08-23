import { envs } from "./envs";

export const REDIS = 'REDIS';
export const SQS = 'SQS';
export const isProduction = envs.NODE_ENV === 'production';
export const isDevelopment = envs.NODE_ENV === 'development';
