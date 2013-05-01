CALL heroku apps:destroy bii-test --confirm bii-test
CALL heroku create bii-test
CALL git remote add test git@heroku.com:bii-test.git
CALL %~dp0test.bat
CALL heroku run --app bii-test python manage.py syncdb