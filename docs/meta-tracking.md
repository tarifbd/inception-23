# Meta tracking implementation and operations

Implemented locally on 2026-09-26. Live Meta acceptance and Events Manager deduplication are **NOT TESTED**: no real dataset credentials or Meta account were supplied. Local tests use synthetic fixtures and block Meta network traffic. Tracking is left disabled after testing.

## Project and audit

Existing Next.js 15.5.22 App Router / React 19 / TypeScript site, Node runtime, Prisma 5.22 and SQLite. It is an advisory/service business with public service pages, contact briefs, a newsletter, resource content and an authenticated CMS. Deployment supports a persistent self-hosted/Docker database. There is no shopping cart, payment, registration or booking completion lifecycle in the inspected application.

Previously, `TrackingScripts` initialized multiple advertising integrations, and `/api/tracking/event` dispatched PageViews to a real Meta Graph API request. This was partial CAPI, not just a saved-token field. Verified defects:

- Browser PageView lacked `eventID`; server generated an unrelated ID and even changed it on beacon fallback.
- Inquiry and newsletter forms never invoked tracking after success.
- Server ignored global denied-consent mode if a client posted `consent: granted`.
- Public endpoint allowed arbitrary conversion names and customer fields.
- Meta used v20.0, a query-string token, generic phone hashing, no fbp/fbc, no response-body acceptance check, no persistent retry/diagnostic record.
- Admin GET/PUT returned saved secret values; plaintext settings were stored in SiteSetting.
- No provider-specific browser/server switches, and “backend event ready” implied more evidence than existed.

## Architecture and event mapping

| Action | Event | Trigger | Browser / server | Parameters and reason |
| --- | --- | --- | --- | --- |
| Public page navigation | PageView | Consent granted and pathname changes | Both, one UUID | Public origin/path only; query and fragment removed. Measures public visits. |
| Direct email, telephone or WhatsApp link | Contact | Trusted click on the corresponding link | Both, one UUID | `content_name`: email, phone or whatsapp. Measures contact intent, not a completed conversation or booking. |
| Inquiry/brief | Lead | `/api/contact` validates and persists the submission | Both, `inquiry:<submission ID>` | `content_name: inquiry`; legitimate submitted email is normalized and hashed on the server. |
| New newsletter subscriber | Lead | First successful unique subscriber creation | Both, `newsletter:<subscriber ID>` | `content_name: newsletter`; repeated signup does not create another acquisition event. |

Lead responses hand the canonical persisted-record event ID back to the browser. The browser uses `trackSingle` with `{eventID}`; the server uses the same `event_name` and `event_id`. No independent second ID is generated. Contact-form request keys persist in sessionStorage for identical form payloads and have a database uniqueness constraint; a key reused with changed data returns 409. Refreshed thank-you states do not trigger events. Inquiry replays older than 24 hours do not re-enqueue events after outbox retention expires; server timestamps use the original record creation time.

Service/resource visits are covered by PageView; no extra ViewContent or client-side filter Search signal is added. Unused legacy `/api/inquiries` has no public UI caller and is unchanged. No Purchase, registration, checkout, payment, subscription-payment or completed-booking events are invented. Do not add these without their corresponding lifecycle.

### Files

- `src/lib/meta/core.ts`: payload construction, normalization, SHA-256, identifier validation, URL minimization, v26.0 HTTP transport and response classification.
- `src/lib/meta/secrets.ts`: AES-256-GCM encryption using a server environment key.
- `src/lib/meta/server.ts`: consent context, successful lead handoff, durable outbox, leasing, retries and diagnostics.
- `src/lib/meta/browser.ts`: shared browser event service, real fbclid capture, paired event IDs, form handoff and replay suppression.
- `src/lib/tracking.ts`, `src/lib/tracking-dispatch.ts`: extend the existing configuration and replace only Meta transport; other integrations remain.
- `src/components/tracking/TrackingScripts.tsx`: consent, SPA PageViews, direct Contact links, exclusion of private routes, one SDK initializer per dataset, Meta auto-configuration disabled.
- `ContactForm.tsx`, `ContactBriefSection.tsx`, `NewsletterForm.client.tsx`: successful form handoffs. ContactBrief retains its form element before `await` so reset works after submission.
- `src/app/api/contact/route.ts`, `src/app/api/newsletter/route.ts`: persisted conversions and duplicate suppression.
- `/api/tracking/event`: same-origin, bounded/rate-limited PageView/Contact intake. Rejects public Lead/Purchase forgery and ignores arbitrary PII/custom values.
- `/api/v1/admin/tracking`: masked reads and write-only secret replacement; unchanged mask preserves existing values; empty input removes a secret.
- `/api/v1/admin/tracking/meta`: permission-protected diagnostics, dataset read check and queue processing.
- `TrackingAdminClient.tsx`: independent channel toggles, test mode/code and evidence-based delivery diagnostics.
- `src/lib/admin/auth.ts`: compare the incoming HTTP Host for same-origin validation, accounting for NextURL loopback normalization.
- Migration `20260926090000_meta_delivery`: `MetaDelivery` outbox plus contact request key/hash/consent fields.
- `.env.example`: encryption key and explicit trusted-proxy setting.
- `tests/meta-tracking.test.mjs`, `tests/meta-local.e2e.mjs`: unit/contract and local browser/API verification.

## Privacy, credentials and reliability

Manual visitor permission remains the default. Neither Meta SDK initialization nor server event intake runs without permission. Server-side denied mode overrides client claims. Public/admin switches are respected independently. Privacy preferences allow withdrawal, Meta consent revocation and deletion of the host's Meta cookies; changes in another tab propagate. Previously transmitted events cannot be recalled by this application.

No CAPI token is serialized in public config, HTML or saved admin responses. It is transmitted to Meta in an Authorization header. Saved tokens, API secrets and custom headers are encrypted. Existing legacy plaintext settings remain readable for migration and are encrypted on the next Save setup. The encryption key must stay outside the database and source control. Local development has a generated key in ignored `.env.local`.

Only inquiry/newsletter email is used as matching PII. Names, company, project text, budget and service descriptions are not sent. The core supports unambiguous international-format phone hashing; the forms do not extract phone numbers from free text. No city, address or country is guessed. `_fbp` is used only when it exists; `_fbc` is used when it exists or constructed from an actual `fbclid` after consent. Neither is hashed. IP is omitted unless `TRACKING_TRUST_PROXY=true`; use that only behind a proxy that overwrites incoming X-Forwarded-For. User agent is read from the request rather than arbitrary JSON.

Pending payloads are encrypted, with email already hashed. Delivery uses a six-second timeout, no redirects, a database claim lease, five total attempts with backoff for network/429/5xx/transient errors, and the original event ID/time for every attempt. HTTP 200 alone is insufficient: `events_received: 1` without an API error is required for `accepted`. Arbitrary Meta error text is not logged because it may echo secrets or customer data. Diagnostics retain only event ID/name, status, numeric HTTP/API codes, timestamps, test/live marker and a safe summary.

Success/permanent failure clears payloads; old records are deleted after seven days when the worker runs. Disabled tracking cancels pending work. A dataset/event configuration change prevents pending work from going to the wrong dataset. Test mode requires a Test Event Code, and a supplied code is always included in server requests. Queued test events retain their original test code even after live mode is selected.

Tracking setup/queue errors cannot fail a saved form. A queue insert failure is logged, but cannot guarantee delivery of that event; a catastrophic process exit between business persistence and enqueue has the same limitation. The outbox guarantees retry stability once queued, not exactly-once end-to-end delivery. Meta deduplication is still required after ambiguous network outcomes. Newsletter replay intentionally suppresses an additional browser acquisition event even if its first response was lost.

## Deployment and operation

1. Back up the existing SQLite database and deploy the code together with the additive migration. Run `npm ci`, `npm run db:migrate`, `npm run check`, `npm test`, `npm run build` in the release environment. Stop Windows Node processes before Prisma generation if the query-engine DLL is locked.
2. Set `TRACKING_ENCRYPTION_KEY` to 32 cryptographically random bytes represented by 64 hex characters. Generate using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` in a private administrative terminal. Store it in the hosting secret manager; preserve it across deployments and backup/restore. Never paste it in chat. The local key is not a production key.
3. Keep the database on durable storage. Existing Docker volumes must receive migrations before traffic switches; a new bootstrap DB does not migrate an already-mounted volume. Do not run this SQLite setup on ephemeral multi-instance storage.
4. Configure the existing production admin credentials and HTTPS. In Admin → Tracking, save the real Pixel / Dataset ID, CAPI token and Test Event Code, enable Meta's browser/server channels and test mode, and keep visitor permission enabled. Save credentials directly in the protected interface.
5. Arrange a hosting scheduler to POST `{"action":"drain"}` to `/api/v1/admin/tracking/meta` every minute using protected admin authentication. Keep the credential in the scheduler's secret store. This is required for retries on an otherwise idle site. Requests also opportunistically drain after responses; the admin provides Process pending events. There is no self-running durable worker when the app is asleep.
6. Open a fresh public browser tab, accept permission, view a page, use a contact link and submit a clearly identified test inquiry/newsletter signup. Inspect Meta Events Manager → Dataset → Test Events for browser/server pairs with identical name and ID. Check receipt, matching diagnostics and deduplication there. A dataset read test sends **no conversion** and may require read permissions separate from CAPI publishing permissions.
7. Before live use, clear the Test Event Code and disable test mode, then save. Previously queued test payloads keep their code. Check recent diagnostics for `accepted`, `failed`, or accumulating `pending`; monitor safe `meta_capi` server logs. A scheduler must continue to run for retry and retention cleanup.

Disable matching automatic events in Meta's Event Setup Tool and remove equivalent external/GTM tags if they exist in the ad account. Repository code initializes one Pixel and disables autoConfig, but account-side rules, injected extensions and external tag containers cannot be verified from this workspace.

### Rollback

Turn Meta off (or all website tracking off) and process the queue to cancel pending deliveries. Existing forms continue to work. The migration is additive: keep its table/columns when reverting application files; do not drop the database or business records. Old code cannot decrypt the new stored secrets—re-enter credentials securely or restore the pre-change settings backup if rolling all the way back. Keep the encryption key while encrypted records/backups exist. No deployment or Meta-account changes were performed here.

## Verification matrix

“PASS (local)” denotes tests with SDK capture and/or mocked HTTP transport, not a claim about the Meta account. Every overall event status remains NOT TESTED until the external acceptance and deduplication columns are verified.

| Event / trigger | Browser | Server payload | ID match | Parameters | Meta accepted | Meta deduplicated | Overall status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PageView / public navigation | PASS (local) | PASS (local) | PASS (local) | PASS (local) | NOT TESTED | NOT TESTED | NOT TESTED |
| Contact / direct communication link | PASS (local) | PASS (unit) | PASS (local) | PASS (local + unit) | NOT TESTED | NOT TESTED | NOT TESTED |
| Lead / persisted inquiry | PASS (local) | PASS (unit) | PASS (local + unit) | PASS (local + unit) | NOT TESTED | NOT TESTED | NOT TESTED |
| Lead / first newsletter signup | PASS (local) | PASS (local trigger + unit payload) | PASS (local + unit) | PASS (local + unit) | NOT TESTED | NOT TESTED | NOT TESTED |
| Purchase / checkout / registration / completed booking | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE | NOT APPLICABLE |

Validation executed: 24 Node tests passed; TypeScript and ESLint passed; production build passed; local Chromium browser/API integration passed for all four mapped actions. Test records were removed and tracking restored to disabled.

Automated checks cover normalization, hashing, invalid identifiers, secret encryption/masking, denied consent, private/foreign URLs, beacon fallback IDs, repeated sends, retry ID stability, response classification, redacted failures, successful persistence, form replay, invalid forms, duplicate subscribers and forged/cross-origin events. Real production credentials, CAPI network acceptance, ad-account rules and Events Manager deduplication remain external verification steps.

## Source verification

Meta's documentation pages returned HTTP 429 during research. The implementation's v26.0 pin was checked against [Meta's official Business SDK API definition](https://github.com/facebook/facebook-nodejs-business-sdk/blob/main/src/api.js); normalization and hashed/unhashed field conventions were checked against [Meta's server-side UserData implementation](https://github.com/facebook/facebook-nodejs-business-sdk/blob/main/src/objects/serverside/user-data.js). Recheck the [CAPI documentation](https://developers.facebook.com/docs/marketing-api/conversions-api/) and supported API version during future upgrades.
