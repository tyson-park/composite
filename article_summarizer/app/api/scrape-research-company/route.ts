import { NextResponse } from 'next/server';
import scrape_pages from '@/lib/research-company/scrape_pages';
import { insert_data } from '@/lib/research-company/insert_data';
import { pool } from '@/lib/db/db_connection';

export async function GET() {
  const client = await pool.connect();
  try {
    const scraped_data = await scrape_pages('https://finance.naver.com/research/company_list.naver?', 1, 1, 1000);
    await insert_data(scraped_data, client);

    return NextResponse.json({ message: 'Data inserted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in scraping and inserting data:', error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  } finally {
    client.release();
  }
}