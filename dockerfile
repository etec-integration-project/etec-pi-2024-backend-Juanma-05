# Usar una imagen de Node para el backend (o la imagen que necesites para tu backend)
FROM node:20-alpine

WORKDIR /app

# Copiar el código fuente del backend
COPY . .

# Copiar los archivos de configuración de nginx desde el contexto de construcción (asegúrate de que existan)
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Instalar dependencias y construir el backend (si es necesario)
RUN npm install

# Exponer el puerto en el que se ejecuta el backend
EXPOSE 5000

# Comando para iniciar el servidor
CMD ["npm", "start"]
