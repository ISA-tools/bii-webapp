from django.contrib.auth import decorators, views
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

import json
import re
import requests

# @decorators.login_required(login_url=views.login)
def upload(request):
    sess = uploadSession(request)
    if (sess and not 'errors' in sess and sess['stage'] != 'complete'):
        uploadFileProgress(request)
    return render_to_response("upload.html", {"WS_SERVER": settings.WEBSERVICES_URL},
                              context_instance=RequestContext(request))


@csrf_exempt
def uploadFile(request):
    if request.is_ajax():
        sessionID = request.session.session_key
        file = request.FILES['file']
        name = file.name
        size = file.size
        mimetype = file.content_type
        extension = file.name[file.name.rindex('.'):]

        valid_ext = '(\.(?i)(zip|tar|gz)$)'
        valid_mime = '^application/(zip|x-zip-compressed|x-tar|x-gzip|octet-stream)$'

        # Validate file type
        if not (re.match(valid_mime, mimetype) and re.match(valid_ext, extension)):
            errorMsg = 'Invalid file type'
            error = {
                'stage': 'uploading',
                'uploading': getError(1, errorMsg)
            }
            return HttpResponse(json.dumps(error))
        files = {'file': file}
        data = {'sessionID': sessionID, 'filesize': size, 'filename': name}
        url = settings.WEBSERVICES_URL + 'upload'
        r = requests.post(url, data=data, files=files)
        return respond(request, r)
    else:
        return HttpResponse('Invalid request', content_type="text/plain")


def getError(numOfErrors, errorMsg):
    errors = {
        'total': numOfErrors,
        'messages': errorMsg[0].upper() + errorMsg[1:]
    }
    return errors


def respond(request, response):
    if (response.status_code != 200):
        session = uploadSession(request)
        session['errors'] = True
        session[session['stage']]['errors'] = getError(1, 'Server error with status code ' + str(response.status_code))
        request.session['upload_session'] = json.dumps(session)
    else:
        request.session['upload_session'] = response.text

    return HttpResponse(response)


@csrf_exempt
def cancelUpload(request):
    url = settings.WEBSERVICES_URL + 'upload/cancel'
    sessionID = request.session.session_key
    url += '?sessionID=' + sessionID
    r = requests.get(url)
    del request.session['upload_session']
    return HttpResponse(r)


def uploadSession(request):
    if ('upload_session' in request.session):
        sess= json.loads(request.session['upload_session'])
    else:
        sess=None
    return sess


@csrf_exempt
def uploadFileProgress(request):
    url = settings.WEBSERVICES_URL + 'upload/progress'
    sessionID = request.session.session_key
    url += '?sessionID=' + sessionID
    r = requests.get(url)
    return respond(request, r)