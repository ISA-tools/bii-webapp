from django.contrib.auth import decorators, views
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from resources import *

import json
import re

TIMEOUT = 100


class Enum(set):
    def __getattr__(self, name):
        if name in self:
            return name
        raise AttributeError


Errors = Enum(["BAD_REQUEST", "UPLOADING", "CONNECTION"])

# @decorators.login_required(login_url=views.login)
def upload(request):
    sess = uploadSession(request)
    if sess and 'errors' in sess:
        errorsType = sess['errors']
    else:
        errorsType = Errors.CONNECTION

    if (sess and (errorsType == Errors.CONNECTION) and sess['stage']!='complete'):
        uploadFileProgress(request)
    return render_to_response("upload.html", {"WS_SERVER": settings.WEBSERVICES_URL},
                              context_instance=RequestContext(request))