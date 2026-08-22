-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN "company" TEXT;
ALTER TABLE "Inquiry" ADD COLUMN "serviceInterest" TEXT;

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "eyebrow" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "colorTheme" TEXT NOT NULL,
    "lottie" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ServiceDetail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "problems" TEXT NOT NULL,
    "solutions" TEXT NOT NULL,
    "process" TEXT NOT NULL,
    "deliverables" TEXT NOT NULL,
    "useCases" TEXT NOT NULL,
    "cta" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ServiceDetail_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "serviceInterest" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "bio" TEXT,
    "photo" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "group" TEXT NOT NULL DEFAULT 'general',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AiSetting" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "provider" TEXT NOT NULL DEFAULT 'disabled',
    "defaultModel" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "temperature" REAL NOT NULL DEFAULT 0.7,
    "maxTokens" INTEGER NOT NULL DEFAULT 1200,
    "systemPrompt" TEXT NOT NULL DEFAULT 'You are a helpful ecommerce AI assistant. Return practical, accurate, production-ready content.',
    "safetyMode" TEXT NOT NULL DEFAULT 'standard',
    "monthlyTokenLimit" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AiGenerationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "provider" TEXT NOT NULL,
    "model" TEXT,
    "featureType" TEXT NOT NULL,
    "inputSummary" TEXT NOT NULL,
    "outputSummary" TEXT,
    "tokenInput" INTEGER,
    "tokenOutput" INTEGER,
    "estimatedCost" REAL,
    "status" TEXT NOT NULL,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AiTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "featureType" TEXT NOT NULL,
    "promptTemplate" TEXT NOT NULL,
    "outputSchemaJson" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AiGeneratedContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "featureType" TEXT NOT NULL,
    "relatedEntityType" TEXT,
    "relatedEntityId" TEXT,
    "title" TEXT NOT NULL,
    "contentJson" TEXT,
    "contentText" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "generatedBy" TEXT,
    "approvedBy" TEXT,
    "appliedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AiAgentIntegration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "agentType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "endpointUrl" TEXT,
    "apiKeyEnvName" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "configJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AiAgentTask" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentIntegrationId" TEXT,
    "taskType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "inputJson" TEXT NOT NULL,
    "outputJson" TEXT,
    "errorMessage" TEXT,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AiAgentTask_agentIntegrationId_fkey" FOREIGN KEY ("agentIntegrationId") REFERENCES "AiAgentIntegration" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SeoMetadata" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "seoTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "metaKeywords" TEXT,
    "slug" TEXT NOT NULL,
    "canonicalUrl" TEXT,
    "robotsIndex" BOOLEAN NOT NULL DEFAULT true,
    "robotsFollow" BOOLEAN NOT NULL DEFAULT true,
    "ogTitle" TEXT,
    "ogDescription" TEXT,
    "ogImage" TEXT,
    "twitterTitle" TEXT,
    "twitterDescription" TEXT,
    "twitterImage" TEXT,
    "focusKeyword" TEXT,
    "secondaryKeywordsJson" TEXT,
    "schemaType" TEXT,
    "schemaJson" TEXT,
    "hreflangJson" TEXT,
    "seoScore" INTEGER,
    "lastAuditedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SeoAudit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "url" TEXT,
    "score" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "issuesJson" TEXT NOT NULL,
    "suggestionsJson" TEXT NOT NULL,
    "auditedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SeoRedirect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourcePath" TEXT NOT NULL,
    "targetPath" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 301,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "hitCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SeoInternalLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceEntityType" TEXT NOT NULL,
    "sourceEntityId" TEXT NOT NULL,
    "targetEntityType" TEXT NOT NULL,
    "targetEntityId" TEXT NOT NULL,
    "anchorText" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SeoImageAlt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "titleText" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SeoSitemapEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "priority" REAL NOT NULL DEFAULT 0.7,
    "changeFrequency" TEXT NOT NULL DEFAULT 'weekly',
    "includeInSitemap" BOOLEAN NOT NULL DEFAULT true,
    "lastModified" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SeoSetting" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "siteName" TEXT NOT NULL DEFAULT 'Inception 23',
    "defaultTitle" TEXT NOT NULL DEFAULT 'Inception 23',
    "titleTemplate" TEXT NOT NULL DEFAULT '%s | Inception 23',
    "defaultMetaDescription" TEXT NOT NULL DEFAULT 'Premium advisory, consulting, AI, legal, management, and creative solutions.',
    "defaultOgImage" TEXT,
    "robotsTxt" TEXT NOT NULL DEFAULT 'User-agent: *
Allow: /
Sitemap: /sitemap.xml',
    "enableAutoSitemap" BOOLEAN NOT NULL DEFAULT true,
    "enableSchemaMarkup" BOOLEAN NOT NULL DEFAULT true,
    "enableOpenGraph" BOOLEAN NOT NULL DEFAULT true,
    "enableTwitterCards" BOOLEAN NOT NULL DEFAULT true,
    "enableCanonicalUrls" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ServiceCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT,
    "labelEn" TEXT NOT NULL,
    "labelBn" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "colorTheme" TEXT NOT NULL DEFAULT 'brand',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_ServiceCategory" ("id", "isActive", "labelBn", "labelEn", "order") SELECT "id", "isActive", "labelBn", "labelEn", "order" FROM "ServiceCategory";
DROP TABLE "ServiceCategory";
ALTER TABLE "new_ServiceCategory" RENAME TO "ServiceCategory";
CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON "ServiceCategory"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceDetail_serviceId_key" ON "ServiceDetail"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");

-- CreateIndex
CREATE INDEX "AiGenerationLog_featureType_idx" ON "AiGenerationLog"("featureType");

-- CreateIndex
CREATE INDEX "AiGenerationLog_status_idx" ON "AiGenerationLog"("status");

-- CreateIndex
CREATE INDEX "AiGenerationLog_createdAt_idx" ON "AiGenerationLog"("createdAt");

-- CreateIndex
CREATE INDEX "AiTemplate_featureType_idx" ON "AiTemplate"("featureType");

-- CreateIndex
CREATE INDEX "AiGeneratedContent_featureType_idx" ON "AiGeneratedContent"("featureType");

-- CreateIndex
CREATE INDEX "AiGeneratedContent_relatedEntityType_relatedEntityId_idx" ON "AiGeneratedContent"("relatedEntityType", "relatedEntityId");

-- CreateIndex
CREATE INDEX "AiGeneratedContent_status_idx" ON "AiGeneratedContent"("status");

-- CreateIndex
CREATE INDEX "AiAgentIntegration_agentType_idx" ON "AiAgentIntegration"("agentType");

-- CreateIndex
CREATE INDEX "AiAgentIntegration_isEnabled_idx" ON "AiAgentIntegration"("isEnabled");

-- CreateIndex
CREATE INDEX "AiAgentTask_status_idx" ON "AiAgentTask"("status");

-- CreateIndex
CREATE INDEX "AiAgentTask_taskType_idx" ON "AiAgentTask"("taskType");

-- CreateIndex
CREATE INDEX "SeoMetadata_slug_idx" ON "SeoMetadata"("slug");

-- CreateIndex
CREATE INDEX "SeoMetadata_seoScore_idx" ON "SeoMetadata"("seoScore");

-- CreateIndex
CREATE UNIQUE INDEX "SeoMetadata_entityType_entityId_key" ON "SeoMetadata"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "SeoAudit_entityType_entityId_idx" ON "SeoAudit"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "SeoAudit_status_idx" ON "SeoAudit"("status");

-- CreateIndex
CREATE INDEX "SeoAudit_createdAt_idx" ON "SeoAudit"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SeoRedirect_sourcePath_key" ON "SeoRedirect"("sourcePath");

-- CreateIndex
CREATE INDEX "SeoInternalLink_sourceEntityType_sourceEntityId_idx" ON "SeoInternalLink"("sourceEntityType", "sourceEntityId");

-- CreateIndex
CREATE INDEX "SeoInternalLink_targetEntityType_targetEntityId_idx" ON "SeoInternalLink"("targetEntityType", "targetEntityId");

-- CreateIndex
CREATE INDEX "SeoImageAlt_entityType_entityId_idx" ON "SeoImageAlt"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "SeoSitemapEntry_url_key" ON "SeoSitemapEntry"("url");

-- CreateIndex
CREATE INDEX "SeoSitemapEntry_includeInSitemap_idx" ON "SeoSitemapEntry"("includeInSitemap");
