# MyRoutes.Back

## Traducciones

- [EN English](./README.md)

Esta es la **API** en **Node.JS** de mi proyecto **MyRoutes**.

## Requerimientos del proyecto

**Nota:** Funciona con `Node JS` versión **16.20.2**, **20.11.1**, pero no con la versión 18.

## Configuración del proyecto

### Instalacion de dependencias
Esto instala todos los paquetes necesarios.
```shell
npm install
```

### Configuración del entorno
Tenemos que configurar el archivo de entorno. Podemos ver un ejemplo en el archivo ```.env.example```.

```conf
# Environment file example

# API PORT
PORT = 3000

# DATABASE
DB_HOST = <your_db_host>
DB_PORT = <your_db_port>
DB_DATABASE = myroutes
DB_USER = <your_db_user>
DB_PASSWORD = <your_db_password>
DB_CONNECTION_OPTIONS = authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false

# MAIL SERVICE
MAILSERVICE_HOST = <your_mail_service_host>
MAILSERVICE_PORT = <your_mail_service_port>
MAILSERVICE_USER = <your_mail_service_user>
MAILSERVICE_PASSWORD = <your_mail_service_password>

# RECOVER PASSWORD
RECOVER_URL = http://localhost:8080/reset-password
RECOVER_TOKEN_DURATION = 5 # minutes

# USER ACCOUNT ACTIVATION
ACTIVATION_URL = http://localhost:8080/activate-user

# TOKEN
SECRET_KEY = <your_secret_key>
TOKEN_DURATION = 5 # minutes
REFRESH_TOKEN_DURATION = 30 # minutes

# LOG
LOG_FORMAT = dev
LOG_DIR = ../logs

# CORS
ORIGIN = *
CREDENTIALS = true
```
Para uso local en modo de desarrollo, el archivo se llamará `.env.development.local` y para uso local en modo de producción, se llamará `.env.production.local`.

### Compilación y recarga en caliente para el desarrollo
```shell
npm run dev
```

### Comprobación de API
```
http://localhost:3000
```

#### Captura de pantalla de la documentación de la API de Swagger

![](doc_img/swagger-doc.png)

## Gestión con Docker

### Crear imagen Docker

Para crear la imagen Docker, se ha empleado el siguiente comando:

```
docker build -t sbarquero/myroutes.back:1.1.1 .
docker build -t sbarquero/myroutes.back:latest .
```

### Subir imagen al repositorio

Para subir la imagen a Docker, se empleado el siguiente comando:

```
docker push sbarquero/myroutes.back:1.1.1
docker push sbarquero/myroutes.back:latest
```

### Puesta en marcha del backend en contenedores Docker

Ejecutando el siguiente comando, se levantan los contenedores necesarios para poner en marcha el backend.

Los contenedores creados son:
  - `mongodb` - Servidor MongoDB (Puerto 27018)
  - `mongo-express` - Cliente Mongo Express (Puerto 8081)
  - `myroutes.back` - Backend de MyRoutes con NodeJS (Puerto 3000)

```
docker-compose up
```

### Puesta en marcha del back y front en contenedores Docker

Visite el proyecto [MyRoutes.Docker en Github](https://github.com/sbarquero/MyRoutes.Docker)
