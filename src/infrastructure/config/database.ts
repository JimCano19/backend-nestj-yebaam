import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let db: any = null;

try {
  // Construir connection string solo si todas las variables existen
  const host = process.env.DB_HOST;
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  const port = process.env.DB_PORT || '5432';
  const database = process.env.DB_NAME;
  
  if (host && username && password && database) {
    const sslMode = process.env.NODE_ENV === 'production' ? 'require' : 'disable';
    const connectionString = `postgresql://${username}:${password}@${host}:${port}/${database}?sslmode=${sslMode}`;
    
    const client = postgres(connectionString, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    
    db = drizzle(client, { schema });
  }
} catch (error) {
  console.warn('Database connection failed:', error.message);
}

export { db };
export { db as database };
