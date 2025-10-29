# Etapa 1: Builder
FROM node:lts-slim AS builder
USER node
WORKDIR /app

COPY --chown=node:node package*.json tsconfig.json ./
RUN npm install
COPY --chown=node:node . .
RUN npm run build

# Etapa 2: Runner
FROM node:lts-slim AS runner
USER node
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm install --omit=dev

EXPOSE 3000
CMD ["node", "dist/main.js"]