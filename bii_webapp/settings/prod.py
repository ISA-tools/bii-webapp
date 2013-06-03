import logging
logger = logging.getLogger('bii_webapp')
logger.info("PRODUCTION SETTINGS")

ALLOWED_HOSTS = [".herokuapp.com"]

DEBUG=False
TEMPLATE_DEBUG = DEBUG
# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

import dj_database_url
DATABASES = {'default': dj_database_url.config(env='DATABASE_URL')}

SITE_ID=4

WEBSERVICES_URL='http://ws-bii.herokuapp.com'