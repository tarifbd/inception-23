-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titleEn" TEXT NOT NULL,
    "titleBn" TEXT NOT NULL,
    "clientEn" TEXT NOT NULL,
    "clientBn" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "summaryEn" TEXT NOT NULL,
    "summaryBn" TEXT NOT NULL,
    "metricsEn" TEXT NOT NULL,
    "metricsBn" TEXT NOT NULL,
    "challengeEn" TEXT NOT NULL,
    "challengeBn" TEXT NOT NULL,
    "solutionEn" TEXT NOT NULL,
    "solutionBn" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "CaseStudy_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
