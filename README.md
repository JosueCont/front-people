# KUIZ #

KUIZ ENGINE

Made with love by HiumanLab.

## Initializing data base. 

1.Execute this line: 

````shell script
$ python manage.py migrate_schemas --shared
````

## Creating a tenant. 

````shell script
$ python manage.py create_tenant
````
The shell will ask you some questions: 
For example, let's create a tenant in "localhost" domain named "alex"
* schema name: 'alex'
* name: 'Alex Tenant'
* domain: 'alex.localhost'
* is primary (leave blank to use 'True'): True

## Create superuser.

Write this en shell: 

````shell script
$ python manage.py create_tenant_superuser
````

