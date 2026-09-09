# Progressive Web App

- Manifest: `/manifest.webmanifest`; stable app identity and root scope.
- Icons: `/app-icon/180`, `/app-icon/192`, `/app-icon/512`, `/app-icon/maskable`, derived from the existing brand mark. The Node deployment must include `public`, as required by the existing standalone setup.
- Registration runs in production only, on public routes. Development intentionally does not install a worker.
- HTTPS is required in production. Localhost is suitable for a production-mode test.
- Supported browsers show an install action when they emit `beforeinstallprompt`. iOS users can use Safari's Share > Add to Home Screen. The website remains fully usable without installation.
- Only `/offline.html` is cached. Navigations use the network; a failed public navigation receives the generic offline page. APIs, admin/auth routes, submissions, assets and Next.js RSC requests are not intercepted or cached.
- No push notifications, background form submissions, or personal-data caches are enabled.
- Worker upgrades wait for existing tabs to close; there is no forced reload that could lose an unfinished form. Bump the worker cache version when changing the offline page.

## Release verification

After deploying a production build over HTTPS, verify the manifest and icons in browser Application tools, confirm `/sw.js` has scope `/`, and reload once after activation. Go offline and navigate to a public page: the offline message should appear. Admin and API requests must not return that page. Reconnect, then test installation in Android Chrome and Add to Home Screen in iOS Safari. Also test upgrading with an existing open form.

Local checks cover manifest/icon HTTP responses, icon dimensions, worker headers, type checking and worker cache/routing unit tests. Real-device installation and production worker activation still require release verification.

Reference: https://nextjs.org/docs/app/guides/progressive-web-apps
