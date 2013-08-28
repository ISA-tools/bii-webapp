ENVIRONMENT VARIABLES THAT MUST BE SET
DJANGO_SETTINGS_MODULE to the settings
of the deployment server

Steps to run the web app:

1. python manage.py syncdb
2. python manage.py createcachetable browse_cache
3. python manage.py runserver