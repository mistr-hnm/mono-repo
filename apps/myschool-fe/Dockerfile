FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
RUN corepack enable
WORKDIR /app
COPY . . 
RUN pnpm install -r --frozen-lockfile
RUN pnpm --filter myschool-fe build
WORKDIR /app/apps/myschool-fe
CMD [ "pnpm", "preview", "--port", "8000", "--host"]


# FROM node:20-slim AS base
# ENV PNPM_HOME="/pnpm"
# ENV PATH="${PNPM_HOME}:${PATH}"
# RUN corepack enable

# FROM base AS build
# WORKDIR /app
# COPY . . 
# RUN pnpm install -r --frozen-lockfile
# RUN pnpm --filter myschool-fe build


# FROM base AS prod
# WORKDIR /app
# COPY --from=build /app/apps/myschool-fe/package.json ./
# COPY --from=build /app/apps/myschool-fe/dist ./dist
# COPY --from=build /app/node_modules ./node_modules
# EXPOSE 8000
# CMD [ "pnpx", "serve","-s", "dist", "-l", "8000"]