# Dependencias de desarrollo
FROM node:20.3.1-alpine3.18 AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

# Build
FROM node:20.3.1-alpine3.18 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production dependencies
FROM node:20.3.1-alpine3.18 AS prod-deps
WORKDIR /app
COPY package.json .
RUN npm install --omit-dev

# Run the APP
FROM node:20.3.1-alpine3.18 AS runner
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist .
# Swagger documentation
COPY swagger.yaml .

CMD [ "node", "server.js" ]
