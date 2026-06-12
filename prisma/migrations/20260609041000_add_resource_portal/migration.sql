-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "audience" TEXT,
    "coverImage" TEXT,
    "fileUrl" TEXT,
    "externalUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Resource_slug_key" ON "Resource"("slug");

-- CreateIndex
CREATE INDEX "Resource_category_idx" ON "Resource"("category");

-- CreateIndex
CREATE INDEX "Resource_resourceType_idx" ON "Resource"("resourceType");

-- CreateIndex
CREATE INDEX "Resource_isPublished_publishedAt_idx" ON "Resource"("isPublished", "publishedAt");

-- CreateIndex
CREATE INDEX "Resource_isFeatured_idx" ON "Resource"("isFeatured");

-- SeedContent
INSERT INTO "Resource" (
    "id", "slug", "title", "excerpt", "content", "category", "resourceType",
    "audience", "isFeatured", "isPublished", "publishedAt", "updatedAt"
) VALUES
(
    'resource-business-health-check',
    'business-health-check-framework',
    'Business Health Check Framework',
    'A practical review framework for leadership teams assessing strategy, finance, operations, people, risk, and technology readiness.',
    'Use this framework to structure a leadership review across six operating areas: strategy, finance, operations, people, risk, and technology. Score each area, record evidence, assign an owner, and turn the gaps into a 90-day action plan.',
    'Management',
    'Framework',
    'Founders and leadership teams',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'resource-ai-readiness',
    'ai-automation-readiness-checklist',
    'AI & Automation Readiness Checklist',
    'A concise checklist for identifying processes that are suitable for automation and the controls required before implementation.',
    'Map repetitive work, identify the source data, document decision rules, confirm exception handling, define ownership, and estimate the operational value. Start with processes that are frequent, measurable, rules-based, and supported by reliable data.',
    'Technology',
    'Checklist',
    'Operations and technology leaders',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'resource-compliance-calendar',
    'compliance-calendar-starter-guide',
    'Compliance Calendar Starter Guide',
    'A starter structure for organizing recurring tax, VAT, corporate, policy, and evidence-management obligations.',
    'Create one calendar with obligation, due date, owner, reviewer, evidence location, status, and escalation rule. Review it monthly and connect each obligation to the documents needed for filing or management review.',
    'Compliance',
    'Guide',
    'Finance, legal, and compliance teams',
    false,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
