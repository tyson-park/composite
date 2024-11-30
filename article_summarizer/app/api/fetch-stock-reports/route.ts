import { NextResponse } from 'next/server';
import { pool } from '@/lib/db/db_connection';

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM stock_reports');
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching stock reports:', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  } finally {
    client.release();
  }
}