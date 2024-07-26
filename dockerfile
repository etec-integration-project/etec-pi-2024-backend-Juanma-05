FROM node:18-slim

WORKDIR /myapp
COPY package.json .
RUN npm install

COPY . .
CMD npm start 


##entrar a la base de datos local, con el host:127.0.0.1 | port:3006
##ahi crear el esquema con la base de datos "backend"
##para corroborar los metodos post-get abrir postam  poner http://localhost:3000/users
##https://www.youtube.com/watch?v=pDky0NPvzZ8