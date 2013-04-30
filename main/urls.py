from django.conf.urls import patterns, include, url
# from accounts.forms import RegistrationFormWithUniqueEmailAndName
from django.conf import settings
from django.contrib import admin
from main import views

admin.autodiscover()

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
     url(r'^$', views.index),
)

