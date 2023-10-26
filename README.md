# FrontEnd People
## Welcome to this repository. 

## Introduction ##
Here you can find some important information.

### ¿How to publish changes to staging?
branch: staging
domain: people.hiumanlab.mx

TODO: Write commands to 

### ¿How to publish changes to production?
branch: staging
domain: people.khorplus.com
Follow the next steps to publish changes in production. 
Note: For production environment we use the "master" branch.
Important: Does not use "sudo" for any command listed bellow

```sh
$ git pull
```

```sh
$ yarn install
```

```sh
$ yarn build
```

```sh
$ pm2 restart 8
```
Note: The pm2 id number can vary

## Ejecución Local con Docker

Para ejecutar el proyecto localmente con Docker, sigue estos pasos:

1. Clona este repositorio en tu máquina local.

2. Abre una terminal y navega hasta la raíz del proyecto.

3. Ejecuta el siguiente comando para iniciar la aplicación en un contenedor Docker:

````shell
$ docker compose up -d
````
Este comando creará y ejecutará los contenedores necesarios para tu aplicación en el modo de fondo (-d).
Si tienes cambios en las dependencias ejecuta lo siguiente:

````shell
$ docker compose up -d --build
````


## Ejecución en producción con Docker

Para ejecutar el proyecto en un entorno de producción, sigue estos pasos:

1. Clona este repositorio en el servidor.

2. Navega hasta la raíz del proyecto.

3. Ejecuta el siguiente comando para compilar el proyecto en un contenedor Docker:

````shell
$ docker build -t people_front_build .
````

## Despliegue en producción

Asegúrate de tener un archivo de configuración de producción listo, como docker-compose-prod.yml.

1. Ejecuta el siguiente comando para iniciar la aplicación en un entorno de producción:

````shell
docker compose -f docker-compose-prod.yml up -d
````

Esto creará y ejecutará los contenedores necesarios para tu aplicación en producción. 

