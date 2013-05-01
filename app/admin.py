from django.db.models import get_models, get_app
from django.contrib import admin
from django.contrib.admin.sites import AlreadyRegistered

from app.autoregister import autoregister

# register all models defined on each app
autoregister('accounts')