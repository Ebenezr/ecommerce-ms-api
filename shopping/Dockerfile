FROM node:18

WORKDIR /app/products

COPY package.json .

RUN npm install -g pnpm

RUN pnpm install

COPY . .

EXPOSE 8003

CMD ["pnpm", "start"]
