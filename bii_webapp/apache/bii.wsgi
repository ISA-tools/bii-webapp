import os
import sys

path = '/var/www/bii-webapp'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'bii_webapp.settings.linuxprod'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()