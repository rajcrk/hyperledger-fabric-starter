FROM node:8.16.0

COPY package*.json ./

RUN npm install

COPY src/ ./src/

COPY nodemon.json ./

COPY ts*.json ./

COPY jest.json ./

CMD [ "npm", "start" ] 