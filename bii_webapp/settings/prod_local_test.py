from dev import *

ALLOWED_HOSTS = [".192.168.56.1",".localhost"]

SITE_ID=2

MIDDLEWARE_CLASSES += (
    'debug_toolbar.middleware.DebugToolbarMiddleware',
)

INSTALLED_APPS += (
    'debug_toolbar',
)

INTERNAL_IPS = ('127.0.0.1','192.168.56.1')

DEBUG=True