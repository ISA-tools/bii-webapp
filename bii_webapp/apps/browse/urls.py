from django.conf.urls import patterns, include, url
from django.views.generic import RedirectView
# from accounts.forms import RegistrationFormWithUniqueEmailAndName
from django.conf import settings
from django.contrib import admin
from views import *
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
  url(r'^$',RedirectView.as_view(url='/browse/')),
  url(r'^browse/', browse,name='browse.browse'),
  url(r'^browse/investigation/',investigation,name='browse.investigation'),
#   url(r'^upload/',upload,name='upload'),
  # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
  # url('^accounts/profile/', 'main.views.private_profile'),
  # url('^profile/(\w+)', 'main.views.public_profile'),
  # url(r'^profiles/', include('profiles.urls')),
    
)

