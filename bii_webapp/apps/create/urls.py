from django.conf.urls import *
from views import *

urlpatterns = patterns('',
    url(r'^$', create, name='create.create'),
    url(r'^([^//]+)/$', create, name='create.create'),
    url(r'^([^//]+)/initSave$', initSave, name='create.initSave$'),
    url(r'^([^//]+)/uploadSave$', uploadSave, name='create.uploadSave$'),
)

