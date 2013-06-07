from django.conf.urls.defaults import *
from views import *

urlpatterns = patterns('',
    url(r'^$', upload, name='upload.upload'),
    url(r'^uploadFile/$',uploadFile,name='upload.uploadFile'),
    url(r'^uploadFile/progress$',uploadFileProgress,name='upload.uploadFileProgress'),
    url(r'^uploadFile/cancel$',cancelUpload,name='upload.cancelUpload'),

)

