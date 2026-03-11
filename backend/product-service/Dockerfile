# Stage 1: Build
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

FROM node:20-slim

WORKDIR /app

RUN useradd -ms /bin/bash appuser
USER appuser

COPY --from=builder /app /app

EXPOSE 5003

ENV NODE_ENV=production

CMD ["node", "server.js"]