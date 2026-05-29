# Advanced SEO

Advanced SEO provides a database-backed metadata, audit, sitemap, robots, redirect, image-alt, and AI suggestion foundation for the admin panel.

## Architecture

- SEO scoring lives in `src/lib/seo/audit.ts`.
- JSON-LD helpers live in `src/lib/seo/schema.ts`.
- Admin APIs are handled by `src/app/api/v1/admin/seo/[[...path]]/route.ts`.
- Public sitemap is served from `/sitemap.xml`.
- Public robots file is served from `/robots.txt`.
- Admin UI routes live under `/admin/seo`.

## Database Models

- `SeoMetadata`
- `SeoAudit`
- `SeoRedirect`
- `SeoInternalLink`
- `SeoImageAlt`
- `SeoSitemapEntry`
- `SeoSetting`

The current codebase does not yet include ecommerce `Product` or `Category` models, so product/category SEO stores generic `entityType` and `entityId` records until a catalog is added.

## Endpoints

Base path: `/api/v1/admin/seo`

- `GET /dashboard`
- `GET /metadata`
- `POST /metadata`
- `GET /metadata/:id`
- `PATCH /metadata/:id`
- `DELETE /metadata/:id`
- `GET /products`
- `GET /products/:productId`
- `PATCH /products/:productId`
- `POST /products/:productId/audit`
- `POST /products/:productId/generate-ai-suggestions`
- `GET /categories`
- `GET /categories/:categoryId`
- `PATCH /categories/:categoryId`
- `POST /categories/:categoryId/audit`
- `POST /categories/:categoryId/generate-ai-suggestions`
- `GET /audits`
- `GET /audits/:id`
- `POST /audit/bulk`
- `GET /redirects`
- `POST /redirects`
- `GET /redirects/:id`
- `PATCH /redirects/:id`
- `DELETE /redirects/:id`
- `GET /sitemap`
- `POST /sitemap/regenerate`
- `PATCH /sitemap/entries/:id`
- `GET /robots`
- `PATCH /robots`
- `GET /image-alts`
- `POST /image-alts`
- `PATCH /image-alts/:id`
- `POST /image-alts/generate-ai`
- `GET /settings`
- `PATCH /settings`

## SEO Scoring

The scoring system returns `score`, `status`, `issues`, and `suggestions`.

Checks include:

- SEO title exists and length is reasonable
- Meta description exists and length is reasonable
- Focus keyword exists
- Focus keyword appears in title and description
- Slug is clean
- Image alt text exists
- Open Graph data exists
- Schema markup exists
- Canonical/robots are configured
- Internal links exist
- Content length is acceptable

Statuses:

- `GOOD`: 85+
- `NEEDS_IMPROVEMENT`: 60-84
- `POOR`: below 60

## Sitemap

Run:

```http
POST /api/v1/admin/seo/sitemap/regenerate
```

Then visit:

```text
/sitemap.xml
```

## Robots.txt

Admin reads and updates robots content through:

```http
GET /api/v1/admin/seo/robots
PATCH /api/v1/admin/seo/robots
```

Public output is available at `/robots.txt`.

## AI SEO Suggestions

If AI is configured, SEO pages can request AI suggestions through the AI service. Suggestions are saved as generated content and must be reviewed by an admin before applying.

AI should never overwrite metadata automatically.

## RBAC Permissions

SEO permissions:

- `seo.view`
- `seo.update`
- `seo.audit`
- `seo.manage_redirects`
- `seo.manage_sitemap`
- `seo.manage_robots`
- `seo.manage_settings`
- `seo.use_ai`
- `seo.apply_ai_suggestions`

Current project has no real auth system yet. `src/lib/admin/rbac.ts` provides a typed permission layer that defaults local admin requests to `admin` and supports future auth integration through request role mapping.

## Manual Testing

1. Open `/admin/seo`.
2. Create quick homepage metadata.
3. Call `POST /api/v1/admin/seo/HOME/home/audit`.
4. Check dashboard score cards.
5. Regenerate sitemap.
6. Visit `/sitemap.xml`.
7. Visit `/robots.txt`.
8. Create redirects through API.
9. Add image alt text through API.
10. If AI is configured, request product/category SEO suggestions and review output in AI library.
