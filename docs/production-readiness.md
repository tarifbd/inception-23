# Production Readiness

## Required environment

Copy `.env.example` into the deployment secret manager. Do not commit production
values. Before launch, set:

- `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin.
- `ADMIN_USERNAME` and a unique password of at least 24 characters.
- `ADMIN_ROLE` to the least-privileged role needed.
- `BLOB_READ_WRITE_TOKEN` for CMS media uploads.
- Search-engine verification values after the domain is connected.

AI keys are optional. Keep `AI_PROVIDER=disabled` when the admin AI tools are not
in use.

Production admin authentication fails closed when credentials are missing, the
username is shorter than three characters, the password is shorter than 24
characters, or the username and password are identical. Admin mutations also
reject cross-site browser requests.

## Container deployment

The repository ships a multi-stage `Dockerfile` using Next.js standalone output.
It stores the SQLite database at `/app/data/inception23.db`; attach a persistent,
encrypted volume to `/app/data`. A clean database is created from committed
Prisma migrations during the image build; local database files are never copied
into the image.

```bash
docker build -t inception-23 .
docker run --env-file .env.production \
  -p 3000:3000 \
  -v inception23-data:/app/data \
  inception-23
```

Terminate TLS at the hosting load balancer or reverse proxy. The app health check
is `GET /api/health`.

## Database note

The current Prisma datasource is SQLite. This is production-capable on one
container with a persistent volume and backups, but it is not appropriate for
ephemeral or horizontally scaled serverless instances.

Before deploying to Vercel Functions or multiple application replicas, migrate
the Prisma datasource and migrations to managed PostgreSQL, set `DATABASE_URL`,
and test the migration against a copy of production data. Do not deploy the
current SQLite database to ephemeral storage.

## Release gate

Run these commands from a clean checkout:

```bash
npm ci
npm run check
npm run audit:prod
npm run build
```

Then verify:

- `/`, the service pages, resources, contact, and `/admin`.
- `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, and `/opengraph-image`.
- Contact and newsletter submissions, admin authentication, and media upload.
- Analytics remains blocked until consent when consent mode is `manual`.
- Security headers at the public origin and TLS renewal.
- Automated encrypted database and Blob retention backups.

The built-in rate limiter is process-local. Use an edge/WAF or shared rate-limit
store before running multiple replicas or exposing high-volume public forms.
