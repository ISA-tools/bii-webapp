from django.conf.urls import patterns, include, url
from bii_web.views import *
from registration.forms import RegistrationFormUniqueEmail

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
url(r'^accounts/register/$', 'registration.views.register',
    {'form_class': RegistrationFormUniqueEmail,
     'backend': 'registration.backends.default.DefaultBackend'},
     name='registration_register'),
  (r'^accounts/', include('registration.urls')),
  url(r'^$', index),
  # url('^accounts/profile/', 'bii_web.views.private_profile'),
  # url('^profile/(\w+)', 'bii_web.views.public_profile'),
  # url(r'^profiles/', include('profiles.urls')),
    # Examples:
    # url(r'^$', 'bii.views.home', name='home'),
    # url(r'^bii/', include('bii.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
