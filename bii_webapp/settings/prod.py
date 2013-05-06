import logging
logger = logging.getLogger('bii_webapp')
logger.info("PRODUCTION SETTINGS")

from common import *

ALLOWED_HOSTS = [".herokuapp.com"]

DEBUG=False
TEMPLATE_DEBUG = DEBUG
# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

import dj_database_url
DATABASES = {'default': dj_database_url.config(env='DATABASE_URL')}

PROJECT_PATH = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

SITE_ID=4