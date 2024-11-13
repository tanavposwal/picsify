FROM node:16

RUN apt-get update && apt-get install -y \
    libc6-dev \
    libpng-dev \
    libjpeg-dev \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
