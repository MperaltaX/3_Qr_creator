FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite port
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
