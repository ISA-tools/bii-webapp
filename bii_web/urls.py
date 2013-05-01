from django.conf.urls import patterns, include, url
# from accounts.forms import RegistrationFormWithUniqueEmailAndName
from django.conf import settings
from django.contrib import admin

admin.autodiscover()

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
(r'^accounts/', include('accounts.urls')),
#   url('register/$', 'registration.views.register',
#                          {'form_class': RegistrationFormWithUniqueEmailAndName,
#                          'backend': 'bii_web.registration.backend.CustomBackend'},
#                          name='registration_register'),
#   (r'^accounts/', include('registration.urls')),
  url(r'^$', include('main.urls')),
  (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
  #url(r'^accounts/profile', profile),
  url(r'^admin/', include(admin.site.urls)),
  # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
  # url('^accounts/profile/', 'bii_web.views.private_profile'),
  # url('^profile/(\w+)', 'bii_web.views.public_profile'),
  # url(r'^profiles/', include('profiles.urls')),
    
)

