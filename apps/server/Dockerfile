FROM node:22-alpine AS base

RUN apk update

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY . /repo
WORKDIR /repo

ARG BASE_DIR=packages/db/node_modules
ARG ENGINE_FILE=${BASE_DIR}/prisma/libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node
ARG DEST_FOLDER=.prisma/client/

RUN pnpm install --frozen-lockfile


FROM base AS prod-deps
WORKDIR /repo
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile


FROM base AS build
WORKDIR /repo

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build --filter @monorepo/server


FROM base AS prisma
WORKDIR /repo

COPY --from=prod-deps /repo/node_modules /repo/node_modules
COPY --from=prod-deps /repo/${BASE_DIR} /repo/${BASE_DIR}

RUN mkdir -p ${DEST_FOLDER}
RUN cp ${ENGINE_FILE} ${DEST_FOLDER}


FROM base AS packager
WORKDIR /repo

# Step 1: Extract package names and prepare files
RUN set -e; \
    grep -E '"workspace:.*"' apps/server/package.json | sed -E 's/.*"@monorepo\/([^"]+)": "workspace:.*/\1/' > /tmp/workspace_deps.txt && \
    mkdir -p /tmp/packages && \
    while IFS= read -r pkg; do \
    mkdir -p /tmp/packages/$pkg; \
    # Check and copy dist, node_modules, and package.json only if they exist
    cp -R packages/$pkg/dist/* /tmp/packages/$pkg/dist/ || true; \
    cp -R packages/$pkg/node_modules/* /tmp/packages/$pkg/node_modules/ || true; \
    cp packages/$pkg/package.json /tmp/packages/$pkg/ || true; \
    done < /tmp/workspace_deps.txt


FROM base AS runner
WORKDIR /repo

COPY --from=prod-deps /repo/node_modules /repo/node_modules
COPY --from=prisma /repo/${DEST_FOLDER} /repo/${DEST_FOLDER}
COPY --from=build /repo/packages/ /repo/packages/
COPY --from=build /repo/apps/server/dist/ /repo/apps/server/dist/
COPY --from=build /repo/apps/server/node_modules/ /repo/apps/server/node_modules/ 
COPY --from=build /repo/apps/server/package.json  /repo/apps/server/package.json

# Step 2: Copy the prepared files
COPY --from=packager /tmp/packages/ /repo/packages/
# Clean up temporary files
RUN rm -rf /tmp/workspace_deps.txt /tmp/packages

WORKDIR /repo/apps/server

EXPOSE 8000

USER node
CMD [ "pnpm", "run", "start" ]
