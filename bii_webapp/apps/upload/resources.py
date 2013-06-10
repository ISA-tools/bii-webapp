from django.contrib.auth import decorators, views
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from beans import *
import json
import requests
import re

TIMEOUT = 100


class Enum(set):
    def __getattr__(self, name):
        if name in self:
            return name
        raise AttributeError


Errors = Enum(["BAD_REQUEST", "UPLOADING", "CONNECTION"])


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

        obj = dict()
        obj.update({'filename': name, 'filesize': size, 'stage': 'uploading', 'uploading': {'progress': 0}})
        request.session['upload_session'] = json.dumps(obj)

        # Validate file type
        if not (re.match(valid_mime, mimetype) and re.match(valid_ext, extension)):
            r = errorResponse(request, 'Invalid file type', 1, Errors.UPLOADING)
            return r

        files = {'file': file}
        data = {'sessionID': sessionID, 'filesize': size}
        url = settings.WEBSERVICES_URL + 'upload'
        try:
            r = requests.post(url, data=data, files=files, timeout=TIMEOUT)
        except requests.exceptions.RequestException, e:
            r = errorResponse(request, 'Upload server could not be reached', 1, Errors.CONNECTION)
        except requests.exceptions.Timeout, e:
            r = errorResponse(request, 'Connection timed out, please try again later', 1, Errors.CONNECTION)

        return respond(request, r)

    else:
        return HttpResponse('Invalid request', content_type="text/plain")


def getError(numOfErrors, errorMsg, type):
    errors = {
        'total': numOfErrors,
        'messages': errorMsg[0].upper() + errorMsg[1:],
        'type': type
    }
    return errors


def respond(request, response):
    if (response.status_code != 200):
        resp = errorResponse(request, 'Server error with status code ' + str(response.status_code), 1,
                             Errors.BAD_REQUEST)
        return resp
    else:
        obj = json.loads(response.text)
        if('requestErrors' in obj):
           return errorResponse(request, obj['requestErrors'], 1, Errors.BAD_REQUEST)

        request.session['upload_session'] = json.dumps(obj).replace('\\', '\\\\')
        return HttpResponse(json.dumps(obj))


def errorResponse(request, strerror, numOfErrors, type):
    session = uploadSession(request)
    if session == None:
        session = dict()
        session['stage'] = 'uploading'
        session['uploading'] = {'progress': 0}

    session[session['stage']]['errors'] = getError(numOfErrors, strerror, type)
    session['errors'] = type
    request.session['upload_session'] = json.dumps(session)
    r = HttpResponse(json.dumps(session))
    r.text = json.dumps(session)
    return r


def cancelResponse(request, resp):
    cancelResp = dict()
    cancelResp['cancel'] = Messages(1, resp)
    request.session['upload_session'] = json.dumps(cancelResp)
    r = HttpResponse(json.dumps(cancelResp))
    return r


@csrf_exempt
def cancelUpload(request):
    if (uploadSession(request)):
        del request.session['upload_session']
        url = settings.WEBSERVICES_URL + 'upload/cancel'
        sessionID = request.session.session_key
        url += '?sessionID=' + sessionID
        try:
            r = requests.get(url, timeout=TIMEOUT)
        except requests.exceptions.ConnectionError, e:
            r = cancelResponse('Upload server could not be reached, please delete the file')
        except requests.exceptions.Timeout, e:
            r = cancelResponse('Connection timed out, please delete the file')
        return HttpResponse(r)
    else:
        return HttpResponse(cancelResponse('No cancellation required'))


@csrf_exempt
def resetUpload(request):
    if (uploadSession(request)):
        del request.session['upload_session']
    return HttpResponse('')


def uploadSession(request):
    if ('upload_session' in request.session):
        sess = json.loads(request.session['upload_session'].replace('\\\\', '\\'))
    else:
        sess = None
    return sess


@csrf_exempt
def uploadFileProgress(request):
    url = settings.WEBSERVICES_URL + 'upload/progress'
    sessionID = request.session.session_key
    if sessionID:
        url += '?sessionID=' + sessionID
        try:
            r = requests.get(url, timeout=TIMEOUT)
        except requests.exceptions.ConnectionError, e:
            r = errorResponse(request, 'Upload server could not be reached', 1, Errors.CONNECTION)
        except requests.exceptions.Timeout, e:
            r = errorResponse(request, 'Connection timed out, please try again later', 1, Errors.CONNECTION)
    else:
        r = errorResponse(request, 'Invalid SessionID', 1, Errors.BAD_REQUEST)
    return respond(request, r)