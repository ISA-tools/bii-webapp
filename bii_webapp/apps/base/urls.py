from django.conf.urls import patterns, url
# from accounts.forms import RegistrationFormWithUniqueEmailAndName
from django.contrib import admin
from django.views.generic.base import RedirectView

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$',RedirectView.as_view(url='/browse')),
)

