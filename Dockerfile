# Builder image
FROM node:17-alpine AS builder

WORKDIR /usr/src/app

COPY . .

RUN rm -rf .yarn/cache/bcrypt-*
RUN rm -rf .yarn/unplugged/*
RUN yarn install
RUN yarn build

# Runner image
FROM node:17-alpine

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app/.pnp.js ./.pnp.js
COPY --chown=node:node --from=builder /usr/src/app/.yarn ./.yarn
COPY --chown=node:node --from=builder /usr/src/app/.yarnrc.yml ./.yarnrc.yml
COPY --chown=node:node --from=builder /usr/src/app/logs ./logs
COPY --chown=node:node --from=builder /usr/src/app/ormconfig.json ./ormconfig.json
COPY --chown=node:node --from=builder /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=builder /usr/src/app/yarn.lock ./yarn.lock
COPY --chown=node:node --from=builder /usr/src/app/dist/src ./src

USER node
CMD yarn start
