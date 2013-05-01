CALL heroku apps:destroy bii --confirm bii
CALL heroku create bii
CALL git remote add production git@heroku.com:bii.git
CALL production
CALL heroku run --app bii python manage.py syncdb