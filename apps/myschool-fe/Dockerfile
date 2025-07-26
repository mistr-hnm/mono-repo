FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY . . 
ARG VITE_BE_BASE_URL
ARG VITE_API_KEY
ENV VITE_BE_BASE_URL=$VITE_BE_BASE_URL
ENV VITE_API_KEY=$VITE_API_KEY
RUN pnpm install -r --frozen-lockfile
RUN pnpm --filter myschool-fe build


FROM nginx:alpine AS prod-fe
COPY ./apps/myschool-fe/nginx/nginx.conf /etc/nginx/conf.d/
COPY --from=build /app/apps/myschool-fe/dist /usr/share/nginx/html
CMD [ "nginx", "-g", "daemon off;" ]

