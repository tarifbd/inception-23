UPDATE "Resource"
SET
  "tagsJson" = '["strategy","operations","leadership"]',
  "readingMinutes" = 4,
  "accessLabel" = 'Open framework'
WHERE "id" = 'resource-business-health-check';

UPDATE "Resource"
SET
  "tagsJson" = '["automation","operations","technology"]',
  "readingMinutes" = 3,
  "accessLabel" = 'Open checklist'
WHERE "id" = 'resource-ai-readiness';

UPDATE "Resource"
SET
  "tagsJson" = '["compliance","operations","governance"]',
  "readingMinutes" = 3,
  "accessLabel" = 'Open guide'
WHERE "id" = 'resource-compliance-calendar';
