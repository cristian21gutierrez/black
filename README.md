Sistema CRUD de Usuarios y Productos

    Una aplicación backend desarrollada con Node.js que permite gestionar usuarios, productos y pedidos. Incluye funcionalidades de autenticación y autorización, y está diseñada para manejar operaciones de tipo CRUD.

Características

   Gestor de Usuarios: Crear, leer, actualizar y eliminar usuarios.

   Gestor de Productos: Crear, leer, actualizar y eliminar productos.

   Autenticación y Autorización: Control de acceso mediante tokens JWT.

   Modelo de Pedidos: Manejo de pedidos asociados a usuarios y productos.

Tecnologías Utilizadas

   Node.js: Plataforma de desarrollo.

   Express.js: Framework para la creación de APIs.

   MongoDB (Mongoose): Base de datos NoSQL.

   JWT: Manejo de autenticación.

   Postman: Pruebas de la API.

Estructura del Proyecto

  A continuación se describe la estructura del proyecto y el propósito de cada componente:

 1. server/app.js

     Es el punto de entrada principal del servidor. Configura el middleware necesario, conecta con la base de datos y define las rutas principales para usuarios, productos y otros componentes futuros.

 2. Carpeta models

     Contiene los esquemas de Mongoose que definen la estructura de los datos en la base de datos.

       User.js: Define el esquema para los usuarios, incluyendo campos como nombre, apellido, correo, usuario y contraseña. También incluye la lógica para encriptar contraseñas y compararlas.

       Product.js: Define el esquema para los productos con campos como nombre, descripción, precio, categoría, imagen y stock.

       Order.js: Define el esquema para los pedidos, incluyendo información sobre el usuario, producto, cantidad, estado y fecha de creación.

 3. Carpeta controllers

     Aloja la lógica de las operaciones CRUD (Crear, Leer, Actualizar y Eliminar) para cada entidad.

     userController.js: Maneja las operaciones relacionadas con los usuarios, como registro, autenticación y administración.

     productController.js: Contiene la lógica para crear, leer, actualizar y eliminar productos.

     orderController.js: Implementa la lógica para gestionar pedidos.

 4. Carpeta routes

     Define las rutas del servidor y las conecta con los controladores correspondientes.

     userRoutes.js: Incluye las rutas para gestionar usuarios, como /api/users.

     productRoutes.js: Define las rutas para operaciones con productos, como /api/products.

     orderRoutes.js: Manejará las rutas relacionadas con los pedidos.

 5. Carpeta middleware

     Contiene funciones intermedias para la autenticación y autorización:

     authMiddleware.js: Incluye:

     protegerRuta: Protege rutas mediante la verificación de tokens JWT.

     verificarAdmin: Verifica si un usuario tiene permisos de administrador.

 6. Carpeta database

     Aloja la configuración para conectar con la base de datos.

     connect.js: Contiene la lógica para establecer la conexión con MongoDB utilizando Mongoose.
