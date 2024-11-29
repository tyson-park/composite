/*
  Warnings:

  - You are about to drop the `StockReport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "StockReport";

-- CreateTable
CREATE TABLE "stock_reports" (
    "id" SERIAL NOT NULL,
    "stock_name" TEXT NOT NULL,
    "stock_code" TEXT NOT NULL,
    "report_title" TEXT NOT NULL,
    "report_url" TEXT NOT NULL,
    "securities_firm" TEXT NOT NULL,
    "report_date" TIMESTAMP(3) NOT NULL,
    "views" INTEGER NOT NULL,

    CONSTRAINT "stock_reports_pkey" PRIMARY KEY ("id")
);
