FROM node:22-bookworm-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Isolated install: only what the entrypoint needs at container startup
# (prisma db push, bootstrap-admin.mjs). No Next.js, React, etc.
FROM base AS prisma-cli
WORKDIR /app
COPY prisma ./prisma
RUN npm install --no-save --no-audit --no-fund --ignore-scripts \
      prisma@6 @prisma/client@6 bcryptjs && \
    npx --yes prisma generate

FROM node:22-bookworm-slim AS runner
WORKDIR /app
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV DATABASE_URL=file:/app/data/portal.db

# Layer 1: prisma CLI + all transitive deps (effect, c12, fast-check, etc.)
COPY --from=prisma-cli /app/node_modules ./node_modules

# Layer 2: standalone Next.js — traced modules merge on top of layer 1
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Schema (needed by db push) and startup scripts
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

RUN mkdir -p /app/data
RUN chmod +x /app/scripts/docker-entrypoint.sh

EXPOSE 3000

CMD ["/app/scripts/docker-entrypoint.sh"]