/*
  Warnings:

  - A unique constraint covering the columns `[stock_code]` on the table `stock_reports` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "stock_reports_stock_code_key" ON "stock_reports"("stock_code");
