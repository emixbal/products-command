FROM node:16.20.2-alpine

# Set working directory di dalam container
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json (atau yarn.lock) ke dalam container
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin kode TypeScript ke direktori kerja
COPY . .

# Kompilasi kode TypeScript menjadi JavaScript
RUN npm run build

# # Copy semua file dari direktori src ke dalam container
# COPY ./build ./build

# Copy file .env ke dalam container
COPY .env ./

# Starting our application
# CMD [ "node", "./build/index.js" ]
CMD [ "npm", "start" ]

# Exposing server port
EXPOSE 2222

# docker run -d --name node_products_command -p 1111:1111 nodejs-product-coomand:latest