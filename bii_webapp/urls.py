from django.conf.urls import patterns, include, url
# from accounts.forms import RegistrationFormWithUniqueEmailAndName
from django.conf import settings
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^accounts/', include('bii_webapp.apps.accounts.urls')),
    url(r'^browse/', include('bii_webapp.apps.browse.urls')),
    url(r'^create/', include('bii_webapp.apps.create.urls')),
    url(r'^$',include('bii_webapp.apps.base.urls')),
    url(r'^upload/', include('bii_webapp.apps.upload.urls')),
    # url(r'^files/', include('bii_webapp.apps.files.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^bii_webapp/static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),

    )

