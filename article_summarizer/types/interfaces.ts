export interface ScrapedData {
  stock_name: string;
  stock_code: string;
  report_title: string;
  report_url: string;
  securities_firm: string;
  report_date: string | null;
  views: number;
}

export interface StockReport {
  id: number;
  stock_name: string;
  stock_code: string;
  report_title: string;
  report_url: string;
  securities_firm: string;
  report_date: Date;
  views: number;
}
  
export interface ColumnDefinition<T> {
  key: keyof T
  header: string
  width?: string
}

export interface EnhancedMobileTableProps<T> {
  data: T[]
  columns: ColumnDefinition<T>[]
  caption: string
}
