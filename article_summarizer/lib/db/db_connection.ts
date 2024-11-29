import { Pool, PoolClient } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const timeout = 1000 * 60 * 10;
const timeoutPromise = new Promise<void>((_, reject) => {
  setTimeout(() => reject(new Error('Query timeout')), timeout);
});

export const execute_query = async (query: string, values: any[], client:PoolClient): Promise<void> => {
  try {
      await Promise.race([
      client.query(query, values),
      timeoutPromise,
    ]);
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};