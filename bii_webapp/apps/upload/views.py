from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json
import re

import requests


def upload(request):
    return render_to_response("upload.html", {"WS_SERVER": settings.WEBSERVICES_URL},
                              context_instance=RequestContext(request))


@csrf_exempt
@login_required
def uploadFile(request):
    if request.is_ajax():
        sessionID = request.session.session_key
        file = request.FILES['file']
        name = file.name
        size = file.size
        mimetype = file.content_type
        extension = file.name[file.name.rindex('.'):]

        valid_ext = '(\.(?i)(zip|tar|gz)$)'
        valid_mime = '^application/(zip|x-tar|x-gzip|octet-stream)$'

        # Validate file type
        if not (re.match(valid_mime, mimetype) and re.match(valid_ext, extension)):
            errorMsg = 'Invalid file type'
            error = {
                'stage': 'uploading',
                'uploading': {
                    'errors': {
                        'total': 1,
                        'messages': errorMsg[0].upper() + errorMsg[1:]
                    }
                }
            }
            return HttpResponse(json.dumps(error))

        files = {'file': file}
        data = {'sessionID': sessionID, 'filesize': size}
        url = settings.WEBSERVICES_URL + 'upload'
        r = requests.post(url, data=data, files=files)
        return HttpResponse(r)
    else:
        return HttpResponse('Invalid request', content_type="text/plain")


@csrf_exempt
@login_required
def uploadFileProgress(request):
    if request.is_ajax():
        url = settings.WEBSERVICES_URL + 'upload/progress'
        sessionID = request.session.session_key
        url+='?sessionID='+sessionID
        r = requests.get(url)
        return HttpResponse(r)
    else:
        return HttpResponse('Invalid request', content_type="text/plain")