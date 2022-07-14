FROM node:16.9.0

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]