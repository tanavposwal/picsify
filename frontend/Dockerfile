FROM node:16-alpine

WORKDIR /app/frontend

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build
RUN npm install -g serve

EXPOSE 80

CMD ["serve", "-s", "dist", "-l", "80"]