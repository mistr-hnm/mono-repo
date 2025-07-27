FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch --prod
RUN pnpm install -r --offline --prod
ADD . .
RUN pnpm --filter myschool-be build
RUN pnpm --filter myschool-be deploy --prod /prod/api

FROM base AS prod-be
COPY --from=build /prod/api /prod/api
WORKDIR /prod/api
EXPOSE 3000
CMD ["node", "dist/main.js"]