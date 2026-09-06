# Production audit and release gate

Observed 2026-09-06. No production changes were applied.

## Local fixes

- Patched sanitize-html to 2.17.7 and compatible transitive dependencies;
  npm reported zero vulnerabilities after the update.
- Blocked backslash/control-character redirect paths and credential-bearing URLs.
- Protected CMS asset reference checks from malformed percent escapes.
- Added three security regression tests and a GitHub Actions quality gate.
- For builds while the dev server runs, set `NEXT_BUILD_DIR=.next-production`.
  The default production output remains `.next` for existing deployments.

## Performance impact

- `next.config.ts`: correct WASM MIME and one-day cache headers should avoid the
  slower compilation fallback and repeat downloads. Low risk; LiteSpeed's direct
  static serving still needs its own mapping. No LCP improvement is claimed.
- Existing hero dynamic loading, font-display swap and Tailwind content coverage
  were retained. Homepage first-load JavaScript was 178 kB in the completed build.

## Hosting fixes requiring a release

- LiteSpeed returns only `upgrade-insecure-requests` as CSP. Preserve the complete
  Next.js CSP at the proxy, then verify the public response. Do not disable CSP.
- `/wasm/dotlottie-player.wasm` returns `text/plain` and no Cache-Control.
  Configure the static server's `.wasm` MIME mapping to `application/wasm`.
  Next.js now supplies the same mapping when it handles the request.
- Use one-day caching for stable public asset paths (WASM, fonts, animations,
  images). Reserve one-year immutable caching for content-hashed filenames.
- Redirect www to the configured non-www canonical HTTPS origin in one hop.
  Check both HTTP hostnames. Do not change DNS to implement an HTTP redirect.

## Database and deployment

- Back up SQLite using its online backup API or stop writes before copying it;
  retain encrypted off-host backups and test restoration.
- Existing Docker volumes are not migrated by the entrypoint. Run
  `npm run db:migrate` in the release environment against the persistent database
  before starting the new version, after reviewing migrations and taking a backup.
- The entrypoint assumes `/app/data/inception23.db`; use that documented path
  until configurable startup behavior is separately tested.
- Keep the previous image available. Roll back the image only if schema-compatible;
  restore the corresponding database backup during a controlled maintenance window
  otherwise. Never reset the production database.
- Test admin login, upload, inquiry submission and appointment navigation in staging.

## Remaining security review

- Process-local rate limits rely on forwarded IP headers. Configure the trusted
  proxy to replace client-supplied headers and enforce an edge rate limit.
- Custom server-side tracking URLs need DNS-resolution/IP validation to fully
  prevent DNS rebinding and private-address SSRF. Keep custom endpoints restricted
  to trusted administrators; URL syntax checks alone are not sufficient.
- Upload validation trusts declared MIME type. Add signature validation and bounded
  multipart parsing before extending upload access to untrusted users.
- Shared Basic Auth lacks individual sessions/MFA/audit identity. Retain least
  privilege and edge protection; plan per-user authentication before team expansion.

## Automation

- Included GitHub Actions gate: clean install, disposable CI database migration,
  lint/typecheck, security regression tests, production dependency audit and build.
- Add scheduled dependency scans and a staging Lighthouse mobile budget check.
- Configure external uptime monitoring for `/api/health`, privacy-filtered error
  monitoring, daily database backups and restore drills. These are recommendations,
  not activated services.
- Check response headers after every Hostinger configuration or deployment change.

## Scope limits

This is a targeted audit, not a penetration test. No fresh Lighthouse score was
measured. Mobile menu opened after a second click; Jump-to and appointment browser
checks need completion. No live forms were submitted. Scores are provisional
engineering assessments, not certified measurements.

## Verification record

| Command | Result | Error / fix | Final status |
| --- | --- | --- | --- |
| `npm run check` | TypeScript and ESLint pass | Test file switched to ESM imports | Pass |
| `npm test` | Three regression tests pass | None | Pass |
| `npm run audit:prod` | Initial moderate sanitize-html advisory | Patched to 2.17.7 | Patched |
| `npm audit fix --ignore-scripts` | Compatible dependency patches; zero advisories | No force/major override | Pass |
| `npm run build` | Initial build passed; shared-output retry failed; final isolated build passed | `NEXT_BUILD_DIR=.next-production` avoids dev conflict | Pass |
| `git diff --check` | No whitespace errors | CRLF notices only | Pass |
| Local homepage HTTP GET | 200 | Temporarily delayed during shared-output build | Pass |

No deployment, push, database migration, or paid service activation was performed
in the user's environment. The migration step in CI targets its disposable database.
