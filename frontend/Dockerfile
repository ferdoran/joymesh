FROM node:18-alpine as builder

RUN npm ci
RUN npm build

FROM nginx:alpine

COPY --from=builder build /usr/share/nginx/html
COPY nginx.default.conf /etc/nginx/conf.d/default.conf