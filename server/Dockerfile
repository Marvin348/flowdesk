FROM node:24-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends libcurl4 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app/server

COPY server/package.json server/package-lock.json ./

RUN npm ci

COPY server ./
COPY shared ../shared

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]