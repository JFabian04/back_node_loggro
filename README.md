## Ejecutar el Proyecto (Desarrollador en Nodejs 22.12.0)

Incluye: 
Base de Datos MongoDB
Registro de usuario (Perfil), autenticación con JWT y Cookies, Cierre sesión
Conversor de images a PNG. Con la librería SHARP. (Se almecenan en el servidor)
Consulta de Imagenes por rango de fechas y agrupadas la cantidad por horas.


1. Crear la Base de Datos Mongo con el nombre images_loggro (Para evitar posibles errores)

2. Instalar Dependencias NPM del proyecto:

npm install

3. Correr el seeder, para crear el perfil de Administrador

node seeder.js

4. Inciar proyecto.

npm start


NOTA: Se incluye el .env en el repositorio para facilitar la ejecución. Por defecto estará corriendo en el puerto 5000
Dentro del .env está la clave (REACT_DOMAIN) que referencia al dominio del front, tener en cuenta.


CREDENCIALES PARA ADMINISTRADOR:
correo: admin@gmail.com
password: admin123
