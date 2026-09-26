# Lighthouse remediation — 26 September 2026

Implemented and verified locally. The live site has not been deployed or re-audited.

## Evidence and results

The supplied Lighthouse 13.4.1 mobile report for https://inception23.com/ scored performance 68, accessibility 97, best practices 96 and SEO 100. It explicitly warned about Chrome extensions and stored IndexedDB data. All 5,132,153 bytes reported as unused JavaScript belonged to `chrome-extension://` resources, not application bundles. Several console errors also originated from extensions. The site's own tracking-config 500 and accessibility findings were actionable.

The comparison below uses clean Lighthouse 13.4.1 sessions against local production builds, with default mobile simulated throttling and no audit warnings. Baseline and final used the same audit runner. Scores are individual measurements, not a guarantee for production hardware, network, hosting, or future runs.

| Metric | Clean local baseline | Updated local build |
| --- | ---: | ---: |
| Performance | 65 | 87 |
| Accessibility | 97 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| First contentful paint | 1.5 s | 1.5 s |
| Largest contentful paint, simulated | 9.8 s | 3.8 s |
| Total blocking time | 390 ms | 150 ms |
| Speed index | 2.7 s | 1.8 s |
| Cumulative layout shift | 0 | 0 |

The initial CLI baseline run was excluded from this comparison: it used a different launcher and reported a Windows temporary-profile cleanup error after writing its JSON. The comparison uses the subsequent clean programmatic runner for both builds.

## Changes

- **Hero animation:** render through `DotLottieWorker` and OffscreenCanvas where supported, with the standard player on browsers without OffscreenCanvas. Only the active slide mounts a player. Frame interpolation is disabled. Pausing for visibility/reduced-motion preferences and carousel controls remain in place. Each effect creates a fresh canvas to survive React Strict Mode's setup/cleanup cycle. Worker URLs are absolute because a blob worker has no document base URL.
- **Critical loading:** remove unconditional preload of the WASM player and first animation, which together transferred more than 1 MB. The dynamically loaded visible player requests these assets after hydration instead of competing with initial page content.
- **Contrast:** darken the main-services cyan accent and small explanatory text; increase contrast of unselected contact-form dropdown labels.
- **Accessible names/roles:** let the mobile brand link derive its name from its visible text, and use a `div` rather than `article` for the ecosystem tabpanel.
- **Tracking resilience:** `/api/tracking/config` returns disabled tracking with `Cache-Control: no-store` when configuration retrieval throws, and logs a safe server diagnostic. This does not bypass consent or expose secrets. Admin failures remain visible. The production database/configuration cause of the supplied 500 cannot be established from the report alone and still requires deployment logs.
- **Crawler index:** add static `public/llms.txt` referencing verified public pages, avoiding the database-backed catch-all route for that resource.
- **Dependency:** declare the already-used `@lottiefiles/dotlottie-web` version 0.74.0 directly for the imperative worker API.

## Validation

- Production build, TypeScript and ESLint completed successfully.
- All 25 Node tests passed, including the added database-outage/fail-closed tracking-config test.
- Browser regression passed in development Strict Mode and in the updated production build: animation loads, slide switching works, one canvas is mounted, a worker is created, no page errors occur, and tracking config/llms.txt return 200.
- Desktop and mobile screenshots were visually inspected.
- Final Lighthouse reports no contrast, label-content/name or console-error failures. The main accessibility category is 100; the experimental agentic-browsing category was not included in the clean comparison.

Re-run `tests/homepage-performance.e2e.mjs` against a local production build using `TEST_ORIGIN`, `PLAYWRIGHT_MODULE` (or installed Playwright), and optional `CHROME_PATH`. The test is restricted to localhost/127.0.0.1.

Audit artifacts are in `.cache/lighthouse/`: `before-clean.json`, `after-final.json`, `hero-desktop.png`, and `hero-mobile.png`. This directory and the `.next-lighthouse` build directory are ignored by version control.

## Remaining scope

Performance is improved, not perfect: simulated LCP remains 3.8 seconds. Do not remove features or weaken consent/security merely to chase a score. Deploy using the normal release process, then rerun Lighthouse on the live site in a clean browser profile. Confirm the production database is healthy and inspect server logs for configuration failures. No production deployment, hosting configuration change, or user browser-extension change was performed.
