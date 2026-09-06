# Search and AI discovery

## Implemented

- Homepage sections are server-rendered instead of waiting for client-side idle
  callbacks. Existing interactions and lazy media remain in their components.
- Public pages read CMS SEO titles, descriptions, index/follow flags, canonical
  paths and social previews. Use full page paths in the SEO slug field, such as
  `/services/legal-support`. Newest matching entry wins; cache refresh is up to
  five minutes. Missing resources stay noindex even when an override exists.
- Sitemaps use known published page URLs and exclude configured noindex pages,
  redirect sources, private routes, explicit exclusions and alternate canonicals.
  Query/hash variants are deduplicated; dates come from actual content records.
- Robots retains custom crawler policies and applies private-route exclusions to
  every group. Default wildcard access covers public search crawlers, including
  OAI-SearchBot and Claude-SearchBot. Training permissions are not changed.
- Service pages have visible questions and answers, matching FAQ structured data,
  related-service links and Bangladesh-specific titles. FAQ markup does not promise
  a Google FAQ rich result; commercial sites generally do not qualify for it.
- Organization contact details and Service provider IDs connect the same business
  entity across pages. No reviews, ratings, credentials or locations were invented.

## Release and account work

1. Deploy the reviewed changes, then verify public HTML, robots and sitemap.
2. Resolve Hostinger's www/non-www redirect and WASM MIME/cache configuration.
   Confirm the proxy does not block verified search crawlers or replace the CSP.
3. Verify ownership in Google Search Console and Bing Webmaster Tools; existing
   environment placeholders support their verification tags. Submit `/sitemap.xml`
   and inspect the homepage plus four service pages. No accounts were accessed or
   submissions made by this change.
4. If eligible, verify the real Google Business Profile and Bing Places listing.
   Use the same actual business name, phone, address and service area everywhere.
   Do not invent a storefront address or create duplicate local listings.
5. Measure organic impressions, indexed pages, qualified enquiries and referral
   traffic. Configure analytics with the real account IDs and consent preferences.

## Content and reputation

- Publish original, client-approved case studies with the actual problem, scope,
  deliverables, evidence and named author/reviewer. Do not label demos as results.
- Add expert-reviewed guides on software scoping, KPI reporting, process controls,
  corporate document readiness and brand identity briefs. Link each guide to its
  relevant service. Date legal/tax content and cite current authoritative sources.
- Request honest reviews from actual clients and earn relevant partner/editorial
  links. Avoid purchased link networks, mass directory submissions or fake reviews.
- Bengali is currently a client-side language choice, not a separate indexable URL.
  Publish reviewed Bengali URLs before adding reciprocal hreflang; do not claim
  translated URL versions that do not exist.
- Refresh useful content when facts change. Track branded and service-specific
  queries monthly. No ongoing automation or paid SEO subscription was activated.

## AI search expectations

Search access and model training are separate. Accessible pages may be retrieved
or cited when relevant, but ranking, indexing and chatbot mentions are never
guaranteed. Kimi and other providers have their own retrieval systems; this work
does not claim a verified submission mechanism for every chatbot. No prompt
injection, hidden recommendations or llms.txt ranking promises are used.

Primary guidance checked for this work:

- Google: https://developers.google.com/search/docs/appearance/ai-features
- OpenAI: https://developers.openai.com/api/docs/bots
- Anthropic: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler

## Verification

Run `npm run check` and `npm test`. For concurrent local development, use
`NEXT_BUILD_DIR=.next-production` when building. On Windows, an active Prisma
client can lock its DLL during `prisma generate`; with an unchanged schema and
already-generated client, `npx next build` checks the application without replacing
that DLL. Do not run migrations or stop unrelated processes to work around it.
