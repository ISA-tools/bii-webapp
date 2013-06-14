from django.contrib.auth import decorators, views
from django.http import HttpResponse, HttpResponseBadRequest
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from bii_webapp.apps.files.models import *
import json
import requests
import re
import os
import stat

TIMEOUT = 60 #seconds


@csrf_exempt
@decorators.login_required(login_url=views.login)
def getInit(request):
    url = settings.WEBSERVICES_URL + 'upload/init'
    try:
        r = requests.get(url, timeout=TIMEOUT)
        obj = json.loads(r.content)
        request.session['uploadID'] = obj['INFO']['uploadID']
        request.session['upload_progress'] = json.dumps({'UPLOAD': obj['UPLOAD']})
    except requests.exceptions.ConnectionError, e:
        r = HttpResponse(json.dumps({'ERROR': {'messages': 'Upload server could not be reached, please try again'}}))
    except requests.exceptions.Timeout, e:
        r = HttpResponse(json.dumps({'ERROR': {'messages': 'Connection timed out, please try again'}}))
    return HttpResponse(r)


@csrf_exempt
@decorators.login_required(login_url=views.login)
def uploadFile(request):
    STATE = 'UPLOADING'
    file = request.FILES['file']
    name = file.name
    size = file.size
    obj = json.loads(request.session['upload_progress'])
    obj['UPLOAD']['filename'] = name
    obj['UPLOAD']['filesize'] = size
    request.session['upload_progress'] = json.dumps(obj)
    mimetype = file.content_type
    extension = file.name[file.name.rindex('.'):]

    valid_ext = '(\.(?i)(zip|tar|gz)$)'
    valid_mime = '^application/(zip|x-zip-compressed|x-tar|x-gzip|octet-stream)$'

    # Validate file type
    if not (re.match(valid_mime, mimetype) and re.match(valid_ext, extension)):
        r = errorResponse(request, 'Invalid file type', 1)
        return r

    files = {'file': file}
    data = {'uploadID': request.session['uploadID'], 'filesize': size}
    url = settings.WEBSERVICES_URL + 'upload'
    try:
        r = requests.post(url, data=data, files=files, timeout=TIMEOUT)
        resp = json.loads(r.content);
        if (resp['UPLOAD']['stage'] == 'cancelled'):
            return HttpResponse(r)

        if resp['UPLOAD']['stage'] == 'complete':
            user = request.user

            model = ISATabFile(uploaded_by=user, isafile=file)
            model.save()
            model.access.add(user)

    except requests.exceptions.RequestException, e:
        r = errorResponse(request, 'Upload server could not be reached')
    except requests.exceptions.Timeout, e:
        r = errorResponse(request, 'Connection timed out, please try again later')

    return storeAndRespond(request, r)


@csrf_exempt
@decorators.login_required(login_url=views.login)
def getCancel(request):
    if 'upload_progress' in request.session:
        uploadID = request.session['uploadID']
        del request.session['upload_progress']
        del request.session['uploadID']
        url = settings.WEBSERVICES_URL + 'upload/cancel'
        url += '?uploadID=' + uploadID
        try:
            r = requests.get(url, timeout=TIMEOUT)
        except requests.exceptions.ConnectionError, e:
            r = errorResponse('Upload server could not be reached, please delete the file')
        except requests.exceptions.Timeout, e:
            r = errorResponse('Connection timed out, please delete the file')
        return HttpResponse(r)
    else:
        return HttpResponse('Cancel complete')

@csrf_exempt
@decorators.login_required(login_url=views.login)
def resetUpload(request):
    if 'upload_progress' in request.session:
        del request.session['upload_progress']
    return HttpResponse('')


@csrf_exempt
@decorators.login_required(login_url=views.login)
def getProgress(request):
    # if (errorsExist(request)):
    #     return HttpResponse(request.session['upload_progress'])
    uploadID = request.session['uploadID']
    url = settings.WEBSERVICES_URL + 'upload/progress'
    url += '?uploadID=' + uploadID
    try:
        r = requests.get(url, timeout=TIMEOUT)
    except requests.exceptions.ConnectionError, e:
        r = errorResponse(request, 'Upload server could not be reached')
    except requests.exceptions.Timeout, e:
        r = errorResponse(request, 'Connection timed out, please try again later')
    return storeAndRespond(request, r)


def errorsExist(request):
    obj = json.loads(request.session['upload_progress'])
    prog = obj['UPLOAD']
    if 'ERROR' in prog[prog['stage']] :
        return True
    return False


def errorResponse(request, objErrors):
    if 'upload_progress' in request.session:
        obj = json.loads(request.session['upload_progress'])
        prog = obj['UPLOAD']
        prog[prog['stage']]['ERROR'] = {'total': 1, 'messages': objErrors}
        request.session['upload_progress'] = json.dumps({'UPLOAD': prog})
        r = HttpResponse(json.dumps({'UPLOAD': prog}))
        return r
    else:
        return HttpResponse(objErrors)


def storeAndRespond(request, response):
    if (response.status_code != 200):
        resp = errorResponse(request, 'Server error with status code ' + str(response.status_code))
        return resp
    else:
        obj = json.loads(response.content)
        request.session['upload_progress'] = json.dumps(obj).replace('\\', '\\\\')
        return HttpResponse(json.dumps(obj))