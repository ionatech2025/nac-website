-- CreateTable
CREATE TABLE "AnalyticsDayTotal" (
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL,
    "uniqueVisitors" INTEGER NOT NULL,
    "rolledUpAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsDayTotal_pkey" PRIMARY KEY ("date")
);
