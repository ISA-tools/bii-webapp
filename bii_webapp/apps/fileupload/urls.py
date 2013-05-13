from django.conf.urls.defaults import *
from bii_webapp.apps.fileupload.views import PictureCreateView, PictureDeleteView
from django.contrib.auth.decorators import login_required
urlpatterns = patterns('',
    (r'^new/$', login_required(PictureCreateView.as_view()),{}, 'fileupload.upload-new'),
    (r'^delete/(?P<pk>\d+)$', login_required(PictureDeleteView.as_view()), {}, 'upload-delete'),
)

