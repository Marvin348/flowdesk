FROM node:24-alpine

WORKDIR /app/client

COPY client/package.json client/package-lock.json ./

RUN npm ci

COPY client ./
COPY shared ../shared

EXPOSE 5173

CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0" ]