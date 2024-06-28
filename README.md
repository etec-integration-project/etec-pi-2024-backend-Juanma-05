[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/8aC6QzV2)
Juan Mateo Sancho
En la consola de tu editor realiza los siguientes pasos
1. Clona el repositorio

  ```
  git clone https://github.com/etec-integration-project/etec-pi-2024-backend-Juanma-05.git
  ```
2. Haz un cd para moverte hasta el directorio del proyecto
  ```
  cd etec-pi-2024-backend-Juanma-05
  ```
  
3. Inicia el contenedor
  ```
  docker compose up --build
  ```  
4. Accede a la aplicacion en el navegador
  Cuando los contenedores ya esten funcionando correctamente accede en tu navegador y por la direccion si lo inicias de tu host local. 
  ```
  http://localhost:3000/ping
  ```

token git: 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

31/05: pude agregar los formularios de register de usuario, con un console.log que agrege te muestra el usario registrado. Pero no pude hacer que los agrege a la base de datos porque no se me actualizan las tablas del Mysql, ya lo voy a resolver asi se pueden agregar los usuarios a la base de datos y asi poder empezar con el inicio de sesion. 
28/06: cambie toda la conexcion y creacion de tablas de la base de datos, ahora las tablas se crean automaticamente con la funcion sequelize. Ya que pude realizar bien la conecxion con MYSQL agrede los metodos GET para traerme los usuarios que tengo en la base de datos, y el metodo POST para enviar usuarios nuevos. Me queda agregar la funcion que no me permita agregar un usuario repetido.
