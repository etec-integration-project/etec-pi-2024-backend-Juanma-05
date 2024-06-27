FROM node:18-slim

WORKDIR /myapp
COPY package.json .
RUN npm install

COPY . .
CMD npm start 

## https://www.youtube.com/watch?v=eOGlouhsIjY
## https://www.youtube.com/watch?v=U5C_VbKCaIc 38:11
## https://www.youtube.com/watch?v=aHPeMYFh5Cg finalizado