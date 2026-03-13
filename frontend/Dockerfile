FROM node:20 as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
 
FROM node:20-alpine

WORKDIR /app

# RUN useradd -ms /bin/bash appuser
# USER appuser

COPY --from=builder /app /app

EXPOSE 5173

ENV NODE_ENV=dev

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]