# Build (contexto: raíz del monorepo)
FROM node:18-alpine AS build
WORKDIR /app
COPY frontend/packages ./frontend/packages
COPY frontend/app/innovatech-web ./frontend/app/innovatech-web
WORKDIR /app/frontend/app/innovatech-web
RUN npm install && npm run build

# Runtime con nginx (proxy /api -> BFF)
FROM nginx:alpine
COPY --from=build /app/frontend/app/innovatech-web/dist /usr/share/nginx/html
COPY frontend/app/innovatech-web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
