FROM node:18-alpine as builder

WORKDIR /usr/local/app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY public ./public
COPY src ./src

RUN npm ci
RUN npm run build

FROM nginx:alpine

COPY --from=builder /usr/local/app/build /usr/share/nginx/html
COPY nginx.default.conf /etc/nginx/conf.d/default.conf