-- AlterTable
ALTER TABLE "Resource" ADD COLUMN "tagsJson" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "Resource" ADD COLUMN "accessLabel" TEXT;
ALTER TABLE "Resource" ADD COLUMN "readingMinutes" INTEGER;
ALTER TABLE "Resource" ADD COLUMN "seoTitle" TEXT;
ALTER TABLE "Resource" ADD COLUMN "seoDescription" TEXT;

-- CreateTable
CREATE TABLE "ResourceAccessEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resourceId" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'resource-page',
    "referrer" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ResourceAccessEvent_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ResourceAccessEvent_resourceId_createdAt_idx" ON "ResourceAccessEvent"("resourceId", "createdAt");

-- CreateIndex
CREATE INDEX "ResourceAccessEvent_createdAt_idx" ON "ResourceAccessEvent"("createdAt");
