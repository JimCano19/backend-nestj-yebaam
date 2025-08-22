import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Construir connection string solo si todas las variables existen
const buildConnectionString = () => {
  const host = process.env.DB_HOST;
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  const port = process.env.DB_PORT || '5432';
  const database = process.env.DB_NAME;
  
  if (!host || !username || !password || !database) {
    throw new Error('Missing database environment variables');
  }
  
  const sslMode = process.env.NODE_ENV === 'production' ? 'require' : 'disable';
  return `postgresql://${username}:${password}@${host}:${port}/${database}?sslmode=${sslMode}`;
};

// Inicializar conexión
let queryClient: postgres.Sql;
let db: ReturnType<typeof drizzle>;

try {
  const connectionString = buildConnectionString();
  queryClient = postgres(connectionString);
  db = drizzle(queryClient, { schema });
} catch (error) {
  console.error('Database connection error:', error.message);
  // Crear un mock para evitar que la app falle
  queryClient = null as any;
  db = null as any;
}

export { db };
