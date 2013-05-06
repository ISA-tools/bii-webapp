from common import *

DEBUG=True
TEMPLATE_DEBUG = DEBUG

SITE_ID=1

#postgres://root:852456@localhost:5432/bii
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

# PROJECT_PATH = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

# STATIC_ROOT = os.path.join(PROJECT_PATH,os.path.join("apps","static/"))

STATICFILES_DIRS = (
#     os.path.join(PROJECT_PATH,"apps/accounts/static/"),
#     os.path.join(PROJECT_PATH,"apps/main/static/"),
#     os.path.join(PROJECT_PATH,"apps/static/"),
)
