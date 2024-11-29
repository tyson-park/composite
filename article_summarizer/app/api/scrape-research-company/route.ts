import { NextResponse } from 'next/server';
import scrape_pages from '@/lib/research-company/scrape_pages';
import { pool, execute_query } from '@/lib/db/db_connection';
import { parseDate } from '@/lib/date_utils';
import type { ScrapedData } from '@/lib/research-company/scrape_pages';
import { PoolClient } from 'pg';

export const build_upsert_query = (record: ScrapedData): { query: string; values: any[] } => {
  const query = `
    INSERT INTO stock_reports (stock_name, stock_code, report_title, report_url, securities_firm, report_date, views)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (stock_code, report_date, report_title, securities_firm) DO UPDATE SET
      stock_name = EXCLUDED.stock_name,
      report_url = EXCLUDED.report_url,
      views = EXCLUDED.views
  `;

  const values = [
    record.stock_name,
    record.stock_code,
    record.report_title,
    record.report_url,
    record.securities_firm,
    record.report_date,
    record.views,
  ];

  return { query, values };
};

export const insert_data = async (data: ScrapedData[], client:PoolClient): Promise<void> => {
  for (const record of data) {
    try {
      console.log('Processing record:', record);
      const { query, values } = build_upsert_query(record);
      await execute_query(query, values, client);
    } catch (error) {
      console.error('Error processing record:', record, error);
      throw error;
    }
  }
};

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