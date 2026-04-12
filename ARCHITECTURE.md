# Eckman Solutions Architecture

Last updated: April 2026 (release 1.3.13)

## 1. System overview

Eckman Solutions is a single Next.js 16 application that serves two experiences:

- Public marketing site at root routes (services, about, contact, process).
- Authenticated client portal at /portal with ADMIN and CLIENT roles.

The application is designed for single-instance deployment with SQLite storage and Docker Compose.

## 2. Runtime topology

High-level runtime components:

- Browser client
- Next.js App Router server (Node 22)
- Prisma ORM layer
- SQLite database file at /app/data/portal.db in containerized deploys
- Optional SMTP provider for quote email delivery

Traffic flow:

1. Browser requests pages and submits forms.
2. Next.js server components and server actions execute business logic.
3. Prisma reads and writes data in SQLite.
4. Responses render UI or redirect to role-specific routes.

## 3. Application structure

Top-level source layout:

- src/app: App Router pages, layouts, route handlers, server actions
- src/components: shared UI components
- src/lib: auth, Prisma client singleton, constants, quote helpers
- prisma/schema.prisma: data model
- scripts: operational scripts for deploy and account bootstrap

Portal route organization:

- /portal/login: authentication entry point
- /portal: role-aware dashboard
- /portal/admin/*: admin-only management for users, projects, requests, quotes, invoices
- /portal/projects, /portal/quotes, /portal/invoices: client-facing entity views
- /portal/requests/new: client request submission
- /quote/[token]: public quote view by secure token

## 4. Auth and authorization

Authentication model:

- Login validates credentials against User.passwordHash using bcrypt.
- Session payload is signed with jose (HS256) and stored in an HTTP-only cookie.
- Session cookie name: eckman_portal_session.
- Session TTL: 7 days.

Authorization model:

- requireSession guards authenticated portal routes/actions.
- requireAdmin guards administrative actions/routes.
- Role enum: ADMIN, CLIENT.

## 5. Data architecture

Primary entities:

- User: identity, role, reset token fields, ownership links
- Project: core tracked delivery item
- Quote and QuoteLineItem: estimate model, pricing totals, share token, status lifecycle
- Invoice and InvoiceLineItem: billing model, optional linkage to quote and project
- SupportItem: request/change/support queue item
- Invite: one-time invite token records

Important relationship notes:

- Project can have many quotes, invoices, and support items.
- Quote can create and link to one or more invoices over time.
- Quote and Invoice both include workstream to separate tracks inside one project.
- SupportItem can be linked to project and user but can also exist unlinked for intake.

## 6. Request queue architecture

Queue routing is no longer based on free-text labels alone.

Canonical classification:

- purposeId (stable identifier)
- queueCategory (REQUEST, CHANGE, SUPPORT)
- purpose (human-readable label retained for display and compatibility)

Defined purpose IDs:

- NEW_PROJECT -> REQUEST
- CHANGE_REQUEST -> CHANGE
- SUPPORT_TICKET -> SUPPORT
- GENERAL_QUESTION -> SUPPORT

Fallback behavior:

- Legacy records without purposeId/queueCategory are mapped from purpose label.
- Unknown or missing values default to GENERAL_QUESTION semantics.

Result:

- Queue assignment stays stable across wording changes in UI labels.

## 7. Quote and invoice flow

Admin quote flow:

1. Admin creates quote with line items and optional project/user linkage.
2. Totals are derived server-side (subtotal, discount, tax, total).
3. Admin can generate a unique public token and share URL.
4. Admin can email the secure quote link through SMTP.

Public quote flow:

- /quote/[token] renders quote details without portal login.
- Page is marked noindex/nofollow in metadata.

Client acceptance flow:

1. Client accepts eligible quote in portal.
2. System verifies ownership via quote userId or linked project ownership.
3. If no invoice exists for that quote, invoice is created from quote line items.
4. Quote status updates to Accepted (client flow) or Converted (admin conversion flow).

## 8. Deployment architecture

Container image strategy:

- Multi-stage Dockerfile:
  - deps stage installs dependencies
  - builder stage compiles Next.js standalone output
  - prisma-cli stage installs minimal runtime tooling for Prisma startup tasks
  - runner stage assembles production runtime

Startup behavior in container:

1. Verify /app/data is writable.
2. Run prisma db push --accept-data-loss.
3. Optionally bootstrap admin if BOOTSTRAP_ADMIN=true.
4. Start Next.js standalone server with node server.js.

Compose deployment model:

- app service runs published GHCR image
- host port 3001 maps to container port 3000
- named volume persists /app/data for SQLite durability
- pull_policy is always for image freshness on deploy

## 9. Operations and release notes

Current release tagging practice:

- Semantic app version in package.json
- GHCR tags commonly published as:
  - latest
  - version tag (example: 1.3.13)
  - commit tag (example: sha-f881967)

Operational considerations:

- Keep SESSION_SECRET stable across restarts.
- Back up persisted SQLite volume data.
- For horizontal scaling or high write concurrency, plan migration from SQLite to Postgres.
