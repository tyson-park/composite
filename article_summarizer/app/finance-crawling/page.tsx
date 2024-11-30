"use client";

import React, { useEffect, useState } from 'react';
import EnhancedMobileTable from '@/components/EnhancedMobileTable';
import Layout from '@/app/layout';

import type { StockReport } from '@/types/interfaces';
import type { ColumnDefinition } from '@/types/interfaces';

const FinanceCrawlingPage = () => {
  const [stockReports, setStockReports] = useState<StockReport[]>([]);

  useEffect(() => {
    const fetchStockReports = async () => {
      try {
        const response = await fetch('/api/fetch-stock-reports');
        if (!response.ok) {
          throw new Error('Failed to fetch stock reports');
        }
        const reports = await response.json();
        setStockReports(reports);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStockReports();
  }, []);

  const columns: ColumnDefinition<StockReport>[] = [
    { key: 'id', header: 'ID', width: '100px' },
    { key: 'stock_name', header: 'Stock Name' },
    { key: 'stock_code', header: 'Stock Code' },
    { key: 'report_title', header: 'Report Title' },
    { key: 'report_url', header: 'Report URL' },
    { key: 'securities_firm', header: 'Securities Firm' },
    { key: 'report_date', header: 'Report Date' },
    { key: 'views', header: 'Views' },
  ];

  return (
    <Layout>
      <div>
        <h1>Stock Reports</h1>
        <EnhancedMobileTable 
          data={stockReports} 
          columns={columns} 
          caption="A list of stock reports" 
        />
      </div>
    </Layout>
  );
};

export default FinanceCrawlingPage;
