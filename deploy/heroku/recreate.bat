CALL cd bii
CALL heroku apps:destroy bii --confirm bii
CALL heroku create bii
CALL ../deploy.bat
CALL heroku run python manage.py syncdb
CALL cd ..