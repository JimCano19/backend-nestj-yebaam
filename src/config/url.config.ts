import { envs } from "./envs";
import { isDevelopment, isProduction } from "./services";

  
  export let baseUrl: string;
  if (isProduction) {
    const host = process.env.HOST || process.env.DOMAIN || '[your-production-domain]';
    baseUrl = `https://${host}`;
  } else if (isDevelopment) {
    baseUrl = `http://localhost:${envs.PORT}`;
  } else {
    // Para test u otros ambientes
    baseUrl = `http://localhost:${envs.PORT}`;
  }