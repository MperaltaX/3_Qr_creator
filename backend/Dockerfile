FROM node:22-alpine

WORKDIR /app

# Instalar dependencias necesarias para Prisma (openssl)
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
