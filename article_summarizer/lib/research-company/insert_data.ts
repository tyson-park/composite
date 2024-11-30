import type { ScrapedData } from '@/types/interfaces';
import { PoolClient } from 'pg';
import { execute_query } from '@/lib/db/db_connection';

export const build_upsert_query = (record: ScrapedData): { query: string; values: [string, string, string, string, string, string | null, number] } => {
  const query = `
    INSERT INTO stock_reports (stock_name, stock_code, report_title, report_url, securities_firm, report_date, views)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (stock_code, report_date, report_title, securities_firm) DO UPDATE SET
      stock_name = EXCLUDED.stock_name,
      report_url = EXCLUDED.report_url,
      views = EXCLUDED.views
  `;

  const values: [string, string, string, string, string, string | null, number] = [
    record.stock_name,
    record.stock_code,
    record.report_title,
    record.report_url,
    record.securities_firm,
    record.report_date,
    record.views ?? 0,
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