FROM node:10-alpine AS Builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

FROM nginx:alpine
COPY --from:Builder /app/dist/mg-app usr/share/nginx/html