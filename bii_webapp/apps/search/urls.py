from django.conf.urls import url,patterns
from views import search

urlpatterns = patterns('',
  url(r'^$',search,name='search'),
)

