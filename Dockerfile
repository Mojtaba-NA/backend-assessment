FROM node:22.14.0-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm

# Copy dependency files only (for caching)
COPY package.json pnpm-lock.yaml ./

RUN pnpm i

COPY . .

ENV NODE_ENV=production

RUN pnpm build

EXPOSE 3000

CMD ["node", "dist/main"]
