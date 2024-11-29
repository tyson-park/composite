import axios from 'axios';
import { load } from 'cheerio';
import { parseDate } from '@/lib/date_utils';

// Function to introduce delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface ScrapedData {
  stock_name: string;
  stock_code: string;
  report_title: string;
  report_url: string;
  securities_firm: string;
  report_date: string | null;
  views: number;
}

async function scrape_pages(base_url: string, start_page = 1, max_pages = 10, delay_time = 1000): Promise<ScrapedData[]> {
  const all_data: ScrapedData[] = [];

  for (let page = start_page; page <= max_pages; page++) {
    try {
      const url = `${base_url}&page=${page}`;
      const response = await axios.get(url);
      if (!response.data) {
        throw new Error('Response data is undefined');
      }
      const $ = load(response.data);

      $('table.type_1 tbody tr').each((i, element) => {

        if (i === 0) return;
        const row = $(element);

        if (row.find('td.blank_07').length > 0) return;

        const stock_name = row.find('td:nth-child(1) a').text().trim();

        if (!stock_name) return;

        const stock_code = row.find('td:nth-child(1) a').attr('href')?.split('=')[1] || '';
        const report_title = row.find('td:nth-child(2) a').text().trim();
        const report_url = row.find('td:nth-child(2) a').attr('href') || '';
        const securities_firm = row.find('td:nth-child(3)').text().trim();
        const report_date = row.find('td:nth-child(5)').text().trim();
        const views = parseInt(row.find('td:nth-child(6)').text().trim(), 10) || 0;

        const parsedDate = parseDate(report_date);

        all_data.push({
          stock_name,
          stock_code,
          report_title,
          report_url,
          securities_firm,
          report_date: parsedDate,
          views,
        });
      });

      await delay(delay_time);

    } catch (error) {
      console.error(`Error scraping page ${page}:`, error);
    }
  }

  return all_data;
}

export default scrape_pages;