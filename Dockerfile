# Builder image
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY . .

RUN rm -rf .yarn/cache/bcrypt-*
RUN rm -rf .yarn/unplugged/*
RUN yarn install
RUN yarn build

# Runner image
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app/.pnp.cjs ./.pnp.cjs
COPY --chown=node:node --from=builder /usr/src/app/.pnp.loader.mjs ./.pnp.loader.mjs
COPY --chown=node:node --from=builder /usr/src/app/.yarn/cache ./.yarn/cache
COPY --chown=node:node --from=builder /usr/src/app/.yarn/plugins ./.yarn/plugins
COPY --chown=node:node --from=builder /usr/src/app/.yarn/releases ./.yarn/releases
COPY --chown=node:node --from=builder /usr/src/app/.yarnrc.yml ./.yarnrc.yml
COPY --chown=node:node --from=builder /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=builder /usr/src/app/yarn.lock ./yarn.lock

COPY --chown=node:node --from=builder /usr/src/app/logs ./logs
COPY --chown=node:node --from=builder /usr/src/app/ormconfig.json ./ormconfig.json
COPY --chown=node:node --from=builder /usr/src/app/dist/src ./src

USER node
CMD yarn start
