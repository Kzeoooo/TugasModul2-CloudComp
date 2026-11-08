# syntax=docker/dockerfile:1

# ---------- Tahap 1: deps ----------
# Memasang dependensi produksi saja berdasarkan package-lock.json
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ---------- Tahap 2: runtime ----------
# Image akhir ringan: hanya source, node_modules, dan aset publik
FROM node:22-alpine AS runtime
ENV NODE_ENV=production \
    PORT=3000
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json server.js ./
COPY public ./public

# Jalankan sebagai user non-root bawaan image node
RUN chown -R node:node /app
USER node

EXPOSE 3000
CMD ["node", "server.js"]
