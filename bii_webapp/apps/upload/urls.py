from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib import admin
from views import *

urlpatterns = patterns('',
    url(r'^$', upload, name='upload.upload'),
    # (r'^delete/(?P<pk>\d+)$', PictureDeleteView.as_view(), {}, 'upload-delete'),
)

