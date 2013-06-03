from django.conf.urls import patterns, url
from views import *
# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
  url(r'^$', browse,name='browse.browse'),
  url(r'^investigation/$',investigation,name='browse.investigation'),
  url(r'^investigation/study/$',study,name='browse.investigation.study'),
  url(r'^investigation/study/assay/$',assay,name='browse.investigation.study.assay'),
  url(r'^investigation/study/sample/$',sample,name='browse.investigation.study.sample'),
#   url(r'^upload/',upload,name='upload'),
  # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
  # url('^accounts/profile/', 'main.views.private_profile'),
  # url('^profile/(\w+)', 'main.views.public_profile'),
  # url(r'^profiles/', include('profiles.urls')),
    
)

