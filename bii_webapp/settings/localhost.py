from common import *

DEBUG=True
TEMPLATE_DEBUG = DEBUG
COMPRESS_ENABLED=False
SITE_ID=1

WEBSERVICES_URL='http://localhost:9090/bii-ws/'
#WEBSERVICES_URL='http://bii.oerc.ox.ac.uk:8080/bii-ws/'

MIDDLEWARE_CLASSES += (
    'debug_toolbar.middleware.DebugToolbarMiddleware',
)


#postgres://root:852456@localhost:5432/bii
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',  # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'bii.db',  # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': 'root',
        'PASSWORD': '852456',
        'HOST': 'localhost',  # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '5432',  # Set to empty string for default.
    }
}

