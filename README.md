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

