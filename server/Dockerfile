FROM node:24-alpine

WORKDIR /app/server

COPY server/package.json server/package-lock.json ./

RUN npm ci

COPY server ./
COPY shared ../shared

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]