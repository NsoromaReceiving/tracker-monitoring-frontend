FROM node:10-alpine AS node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

FROM nginx:alpine
COPY --from:node /app/dist/nsoromajsmNG usr/share/nginx/html