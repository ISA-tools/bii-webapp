from django.contrib.auth import decorators, views
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from resources import *
from bii_webapp.settings import common

@decorators.login_required(login_url=views.login)
def upload(request):
      return render_to_response("upload.html", {"WS_SERVER": settings.WEBSERVICES_URL},
                              context_instance=RequestContext(request))