from django.conf.urls.defaults import *
from views import *
from resources import *

urlpatterns = patterns('',
    url(r'^$', upload, name='upload.upload'),
    url(r'^uploadFile/$',uploadFile,name='upload.uploadFile'),
    url(r'^uploadFile/progress$',getProgress,name='upload.uploadFileProgress'),
    url(r'^uploadFile/cancel$',getCancel,name='upload.cancelUpload'),
    url(r'^uploadFile/reset$',resetUpload,name='upload.resetUpload'),
    url(r'^uploadFile/init$',getInit,name='upload.initUpload'),
)

