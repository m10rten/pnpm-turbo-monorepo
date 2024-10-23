FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY . /repo
WORKDIR /repo

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build --filter @monorepo/server

FROM base
COPY --from=prod-deps /repo/node_modules /repo/node_modules

COPY --from=build /repo/apps/server /repo/apps/server

WORKDIR /repo/apps/server

EXPOSE 8000

USER node
CMD [ "pnpm", "run", "start" ]
