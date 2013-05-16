from django.conf.urls import patterns, include, url
# from accounts.forms import RegistrationFormWithUniqueEmailAndName
from django.conf import settings
from django.contrib import admin
from django.views.generic import RedirectView
import os

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^accounts/', include('bii_webapp.apps.accounts.urls')),
    url(r'^browse/', include('bii_webapp.apps.browse.urls')),
    url(r'^$',RedirectView.as_view(url='/browse/')),
    url(r'^upload/', include('bii_webapp.apps.fileupload.urls')),
    (r'^media/(.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
    url(r'^bii_webapp/static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
    url(r'^admin/', include(admin.site.urls)),
)

