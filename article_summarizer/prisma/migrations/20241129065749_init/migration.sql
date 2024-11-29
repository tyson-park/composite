-- CreateTable
CREATE TABLE "StockReport" (
    "id" SERIAL NOT NULL,
    "stock_name" TEXT NOT NULL,
    "stock_code" TEXT NOT NULL,
    "report_title" TEXT NOT NULL,
    "report_url" TEXT NOT NULL,
    "securities_firm" TEXT NOT NULL,
    "report_date" TIMESTAMP(3) NOT NULL,
    "views" INTEGER NOT NULL,

    CONSTRAINT "StockReport_pkey" PRIMARY KEY ("id")
);
