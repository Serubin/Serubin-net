FROM node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /app
ENV NODE_OPTIONS --openssl-legacy-provider
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

EXPOSE 80
CMD [ "yarn", "start", "-p", "80"]

