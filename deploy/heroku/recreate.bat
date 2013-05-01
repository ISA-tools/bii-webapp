CALL heroku apps:destroy bii --confirm bii
CALL heroku create bii
CALL git remote add production git@heroku.com:bii.git
CALL %~dp0\production.bat
CALL heroku run --app bii python manage.py syncdb