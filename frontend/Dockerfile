FROM node:23-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./ ./

EXPOSE 5143

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5143"]