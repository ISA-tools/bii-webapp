from django.conf.urls import patterns, include, url
# from accounts.forms import RegistrationFormWithUniqueEmailAndName
from django.conf import settings
from django.contrib import admin
from django.views.generic import RedirectView
import os

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$',RedirectView.as_view(url='/browse/')),
)

