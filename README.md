# Eckman Solutions

Marketing website and client portal for https://eckman.solutions built with Next.js.

## What is included

- Public-facing services website for analytics, websites, apps, custom software, and small business hardware support.
- Protected portal login backed by a real SQLite database and signed HTTP-only session cookies.
- Self-hosting support for a single VPS, Docker, Nginx, PM2, and systemd.

## Stack

- Next.js 16 App Router
- Tailwind CSS 4
- Prisma with SQLite for the initial self-hosted portal database
- bcrypt password hashing
- jose signed session cookies

## Environment variables

Copy `.env.example` to `.env` and set real values:

```bash
cp .env.example .env
```

Required values:

```bash
DATABASE_URL="file:../data/portal.db"
SESSION_SECRET="generate-with-openssl-rand-base64-32"
```

Generate a session secret with:

```bash
openssl rand -base64 32
```

## Local development

Install dependencies:

```bash
npm install
```

Create the database schema:

```bash
npm run db:push
```

Create the first portal user:

```bash
npm run user:create -- --email client@eckman.solutions --password 'change-this-now' --name 'Portal Client' --role ADMIN
```

Start the app:

```bash
npm run dev
```

The public site lives at `/` and the protected portal lives at `/portal`.

## Portal authentication

The portal now uses a real server-side authentication flow:

- Passwords are hashed with bcrypt.
- Users are stored in SQLite through Prisma.
- Successful login writes an HTTP-only signed cookie.
- `/portal` redirects to `/portal/login` when no valid session exists.

This is designed for a single self-hosted instance. If you later run multiple app instances, move the database to Postgres and consider a shared session or cache layer.

## Docker Compose deployment

If you want this installed and deployed 100% through Docker Compose, use this path.

1. Copy the environment file:

```bash
cp .env.example .env
```

2. Edit `.env` and set at minimum:

```bash
SESSION_SECRET="your-real-secret"
BOOTSTRAP_ADMIN="true"
PORTAL_ADMIN_EMAIL="owner@eckman.solutions"
PORTAL_ADMIN_PASSWORD="change-this-before-production"
PORTAL_ADMIN_NAME="Owner"
ECKMAN_IMAGE="ghcr.io/slackerchris/eckman-solutions:latest"
```

3. Start the full app:

```bash
docker compose up -d
```

That is the full install path. On container startup it will:

- Pull and start the published Next.js image from GHCR
- Create or update the SQLite schema
- Bootstrap the first admin user when `BOOTSTRAP_ADMIN=true`
- Publish the app on host port `3001`
- Persist the database in the Docker volume mounted at `/app/data`

Useful Docker Compose commands:

```bash
docker compose pull
docker compose up -d
docker compose logs -f app
docker compose restart app
docker compose down
```

If you want to pin a specific image version instead of `latest`, set:

```bash
ECKMAN_IMAGE="ghcr.io/slackerchris/eckman-solutions:sha-c299823"
```

If port `3000` is already used on your server, this Compose file already avoids the conflict by publishing to host port `3001` while keeping the app on container port `3000`.

```bash
http://your-server:3001
```

After the first successful boot, you can set `BOOTSTRAP_ADMIN="false"` in `.env` so later restarts do not re-run admin bootstrap logic unnecessarily.

## Single VPS deployment

This repo includes the base files for a straightforward VPS setup:

- Nginx config: `deploy/nginx/eckman.solutions.conf`
- PM2 app config: `ecosystem.config.cjs`
- systemd unit: `deploy/systemd/eckman.service`

Suggested Ubuntu flow:

1. Install Node.js 22, Nginx, and PM2.
2. Clone this repo to `/var/www/eckman`.
3. Copy `.env.example` to a real env file and store production values in `/etc/eckman/eckman.env`.
4. Run `npm install`.
5. Run `npm run build`.
6. Run `npm run db:push`.
7. Run `npm run user:create -- --email you@eckman.solutions --password 'strong-password-here' --name 'Owner' --role ADMIN`.
8. Copy `deploy/nginx/eckman.solutions.conf` into your Nginx sites config and reload Nginx.
9. Copy `deploy/systemd/eckman.service` to `/etc/systemd/system/eckman.service`.
10. Run `sudo systemctl daemon-reload && sudo systemctl enable --now eckman`.
11. Add TLS with Let's Encrypt.

The included Nginx config is intentionally minimal. Add your SSL config, stronger rate limiting, and any backup policy you need for production.

## Production notes

- SQLite is fine for a single VPS or one Docker container with a mounted volume.
- Back up the `data` directory because it contains the portal database.
- Keep `SESSION_SECRET` stable across restarts.
- If you move to multiple instances later, switch the database to Postgres and revisit session, cache, and deployment coordination.

## Useful commands

```bash
npm run lint
npm run build
npm run db:push
npm run user:create -- --email client@example.com --password 'strong-password' --name 'Client Name' --role CLIENT
```
