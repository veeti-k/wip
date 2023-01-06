FROM node:18-bullseye-slim as base

WORKDIR /app

FROM base as pruner

ARG APP

RUN yarn global add turbo@1.4.4

COPY ./*.json ./yarn.lock ./
COPY ./apps ./apps
COPY ./packages ./packages

RUN turbo prune --scope=${APP} --docker


FROM base as deps

COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/yarn.lock ./yarn.lock

RUN yarn --pure-lockfile


FROM base as builder

COPY --from=deps /app/ ./
COPY --from=pruner /app/out/full/ ./

RUN yarn build

FROM base as runner 

ARG APP
ENV APP=${APP}

COPY --from=builder /app/ ./

CMD cd ./apps/${APP} && yarn start