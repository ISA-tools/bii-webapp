from django.conf.urls import patterns, include, url
# from accounts.forms import RegistrationFormWithUniqueEmailAndName
from django.conf import settings
from django.contrib import admin
import os

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^accounts/', include('bii_webapp.apps.accounts.urls')),
    url(r'^', include('bii_webapp.apps.main.urls')),
    url(r'^upload/', include('bii_webapp.apps.fileupload.urls')),
    (r'^media/(.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
    url(r'^bii_webapp/apps/static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
    url(r'^admin/', include(admin.site.urls)),
)

