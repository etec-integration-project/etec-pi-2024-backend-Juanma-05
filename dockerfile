# Usar una imagen de Node para el backend (o la imagen que necesites para tu backend)
FROM node:20-alpine

WORKDIR /app

# Copiar el código fuente del backend
COPY . .

# Instalar dependencias y construir el backend (si es necesario)
RUN npm install

# Exponer el puerto en el que se ejecuta el backend
EXPOSE 3001

# Comando para iniciar el servidor
CMD ["npm", "start"]
