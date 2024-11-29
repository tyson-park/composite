/*
  Warnings:

  - A unique constraint covering the columns `[stock_code,report_date,report_title,securities_firm]` on the table `stock_reports` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "stock_reports_stock_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "stock_reports_stock_code_report_date_report_title_securitie_key" ON "stock_reports"("stock_code", "report_date", "report_title", "securities_firm");
