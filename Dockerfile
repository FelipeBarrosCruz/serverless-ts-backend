# BASE
FROM node:12.18.0-alpine AS base

WORKDIR /src

ADD package.json yarn.lock ./
RUN yarn install

ADD / ./

# DEVELOPMENT
FROM node:12.18.0-alpine AS development

RUN apk add --no-cache curl

WORKDIR /src

COPY --from=base /src .

RUN yarn install

CMD ["yarn", "watch"]

# DEVELOPMENT
FROM node:12.18.0-alpine AS test

RUN apk add --no-cache curl

WORKDIR /src

COPY --from=base /src .

RUN yarn install
