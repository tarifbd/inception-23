-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CaseStudy" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CaseStudy_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CaseStudy" ("categoryId", "challengeBn", "challengeEn", "clientBn", "clientEn", "id", "img", "isActive", "metricsBn", "metricsEn", "order", "solutionBn", "solutionEn", "summaryBn", "summaryEn", "titleBn", "titleEn", "updatedAt") SELECT "categoryId", "challengeBn", "challengeEn", "clientBn", "clientEn", "id", "img", "isActive", "metricsBn", "metricsEn", "order", "solutionBn", "solutionEn", "summaryBn", "summaryEn", "titleBn", "titleEn", CURRENT_TIMESTAMP FROM "CaseStudy";
DROP TABLE "CaseStudy";
ALTER TABLE "new_CaseStudy" RENAME TO "CaseStudy";
CREATE INDEX "CaseStudy_categoryId_idx" ON "CaseStudy"("categoryId");
CREATE TABLE "new_ContactSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "serviceInterest" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ContactSubmission" ("company", "createdAt", "email", "id", "message", "name", "serviceInterest", "status") SELECT "company", "createdAt", "email", "id", "message", "name", "serviceInterest", "status" FROM "ContactSubmission";
DROP TABLE "ContactSubmission";
ALTER TABLE "new_ContactSubmission" RENAME TO "ContactSubmission";
CREATE TABLE "new_ServiceCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT,
    "labelEn" TEXT NOT NULL,
    "labelBn" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "colorTheme" TEXT NOT NULL DEFAULT 'brand',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ServiceCategory" ("colorTheme", "id", "isActive", "labelBn", "labelEn", "order", "slug", "summary", "updatedAt") SELECT "colorTheme", "id", "isActive", "labelBn", "labelEn", "order", "slug", "summary", CURRENT_TIMESTAMP FROM "ServiceCategory";
DROP TABLE "ServiceCategory";
ALTER TABLE "new_ServiceCategory" RENAME TO "ServiceCategory";
CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON "ServiceCategory"("slug");
CREATE TABLE "new_ServiceItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleBn" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "descBn" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ServiceItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ServiceItem" ("categoryId", "descBn", "descEn", "icon", "id", "order", "theme", "titleBn", "titleEn", "updatedAt") SELECT "categoryId", "descBn", "descEn", "icon", "id", "order", "theme", "titleBn", "titleEn", CURRENT_TIMESTAMP FROM "ServiceItem";
DROP TABLE "ServiceItem";
ALTER TABLE "new_ServiceItem" RENAME TO "ServiceItem";
CREATE INDEX "ServiceItem_categoryId_idx" ON "ServiceItem"("categoryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
