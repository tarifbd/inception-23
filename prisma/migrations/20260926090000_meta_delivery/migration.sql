ALTER TABLE "ContactSubmission" ADD COLUMN "requestKey" TEXT;
ALTER TABLE "ContactSubmission" ADD COLUMN "requestHash" TEXT;
ALTER TABLE "ContactSubmission" ADD COLUMN "metaConsent" BOOLEAN NOT NULL DEFAULT false;
CREATE UNIQUE INDEX "ContactSubmission_requestKey_key" ON "ContactSubmission"("requestKey");
CREATE TABLE "MetaDelivery" (
  "id" TEXT NOT NULL PRIMARY KEY, "eventName" TEXT NOT NULL,
  "datasetId" TEXT NOT NULL, "payload" TEXT NOT NULL,
  "testCode" TEXT NOT NULL DEFAULT '', "status" TEXT NOT NULL DEFAULT 'pending',
  "attempts" INTEGER NOT NULL DEFAULT 0, "nextAttempt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "httpStatus" INTEGER, "errorCode" INTEGER, "summary" TEXT NOT NULL DEFAULT '',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL
);
CREATE INDEX "MetaDelivery_status_nextAttempt_idx" ON "MetaDelivery"("status", "nextAttempt");
