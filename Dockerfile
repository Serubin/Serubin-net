FROM node:lts-alpine3.14 as deps

RUN apk update && \
    apk add --no-cache libc6-compat autoconf automake libtool make tiff jpeg zlib zlib-dev pkgconf nasm file gcc musl-dev

# COPY package.json .

RUN npm install -g npm

ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 80

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

FROM node:lts-alpine3.14
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN yarn build

CMD [ "yarn", "start", "-p", "80"]

