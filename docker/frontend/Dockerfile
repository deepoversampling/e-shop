# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build Angular SSR (browser + server bundles)
RUN npx ng b

# Runtime stage
FROM node:18-alpine AS runtime

WORKDIR /app

# Copy SSR server bundle
COPY --from=build /app/dist/shop-ui/server ./server

# Copy browser bundle
COPY --from=build /app/dist/shop-ui/browser ./browser

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

EXPOSE 4000

CMD ["node", "server/server.mjs"]