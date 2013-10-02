from django.conf.urls import *
from views import *

urlpatterns = patterns('',
    url(r'^$', files, name='files.files'),
    url(r'^download/', downloadFile, name='files.downloadFile'),
)

