from django.conf.urls import *
from views import *
from resources import *

urlpatterns = patterns('',
    url(r'^$', upload, name='upload.upload'),
    url(r'^initSample/$',initSample,name='upload.initSample'),
    url(r'^uploadSample/$',uploadSample,name='upload.uploadSample'),
    url(r'^uploadFile/$',uploadFile,name='upload.uploadFile'),
    url(r'^uploadFile/progress/$',getProgress,name='upload.uploadFile.progress'),
    url(r'^uploadFile/cancel/$',getProgress,name='upload.uploadFile.cancel'),
    url(r'^uploadFile/progress(?P<uploadID>\w+})/$',getProgress),
    url(r'^uploadFile/cancel(?P<uploadID>\w+})/$',getCancel),
    url(r'^uploadFile/init$',postInit,name='upload.initUpload'),
)

