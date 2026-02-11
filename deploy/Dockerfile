## ─── Stage 1: Build ─────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY foundation/ foundation/
COPY tools/ tools/
COPY agents/ agents/
COPY districts/ districts/
COPY evals/ evals/

RUN npm run build

## ─── Stage 2: Run ───────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app
COPY --from=builder /app/dist dist/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/package.json .

COPY districts/*.yaml districts/
COPY evals/ evals/

# Traces directory
RUN mkdir -p /app/traces

ENV NODE_ENV=production
ENV TRACE_STORAGE_PATH=/app/traces

EXPOSE 3000
CMD ["node", "dist/foundation/smoke-test.js"]
