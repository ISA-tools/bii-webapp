from common import *

import logging
logger = logging.getLogger('bii_webapp')
logger.info("PRODUCTION SETTINGS")

COMPRESS_ENABLED=True

ALLOWED_HOSTS = ["bii.herokuapp.com"]

DEBUG=False
TEMPLATE_DEBUG = DEBUG
# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

import dj_database_url
DATABASES = {'default': dj_database_url.config(default=os.environ.get('DATABASE_URL'))}

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

SITE_ID=4

WEBSERVICES_URL='http://bii-ws.herokuapp.com/'