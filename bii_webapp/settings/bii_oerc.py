from common import *

import logging
logger = logging.getLogger('bii_webapp')
logger.info("PRODUCTION SETTINGS")

COMPRESS_ENABLED=True

ALLOWED_HOSTS = ["bii.oerc.ox.ac.uk"]

DEBUG=False
TEMPLATE_DEBUG = DEBUG
# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

import dj_database_url
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',  # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'bii',  # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': 'root',
        'PASSWORD': '852456',
        'HOST': 'localhost',  # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '5432',  # Set to empty string for default.
    }
}


# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

SITE_ID=5

WEBSERVICES_URL='http://bii.oerc.ox.ac.uk:8080/bii-ws/'