FROM node:22.23.1-bookworm-slim AS build
WORKDIR /workspace/frontend
RUN npm install --global pnpm@10.32.1
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml frontend/.npmrc ./
RUN pnpm install --frozen-lockfile
COPY frontend/ ./
COPY contracts/ /workspace/contracts/
RUN pnpm api:check && pnpm build

FROM nginx:1.28-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/frontend/dist/ /usr/share/nginx/html/
EXPOSE 80
