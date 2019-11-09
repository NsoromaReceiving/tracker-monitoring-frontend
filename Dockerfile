<<<<<<< HEAD
# base image
FROM node:10.16.3

# install chrome for protractor tests
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -yq google-chrome-stable

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli@7.3.9

COPY . /app

CMD ng serve --host 0.0.0.0 --port 4200 --disableHostCheck true
=======
FROM node:10-alpine AS node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

FROM nginx:alpine
COPY --from=node /app/dist/nsoromajsmNG usr/share/nginx/html
>>>>>>> ad6391868073eaa050953a314122f5c69a6bab62
