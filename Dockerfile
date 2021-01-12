FROM node:lts

RUN mkdir -p /var/www/crosswordyan
WORKDIR /var/www/crosswordyan

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "run", "server" ]