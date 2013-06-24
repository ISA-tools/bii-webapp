from django.conf.urls.defaults import *
from views import *

urlpatterns = patterns('',
    url(r'^$', create, name='create.create'),
    url(r'^upload/$', upload, name='create.upload'),
)

