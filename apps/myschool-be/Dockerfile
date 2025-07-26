FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY apps/myschool-be/package.json apps/myschool-be/
COPY pnpm-workspace.yaml ./
COPY . .
RUN pnpm install -r --frozen-lockfile
RUN pnpm --filter myschool-be build

FROM base AS prod-be
WORKDIR /app
COPY --from=build /app /app
RUN rm -rf node_modules
RUN pnpm --filter myschool-be install
RUN pnpm --filter myschool-be add express
RUN pnpm --filter myschool-be deploy --prod /app/prod
WORKDIR /app/prod
EXPOSE 3000
CMD ["node", "dist/main.js"]