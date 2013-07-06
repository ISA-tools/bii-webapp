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

TIMEOUT = 1500 #seconds

@csrf_exempt
@decorators.login_required(login_url=views.login)
def postInit(request):
    if 'uploadID' in request.session:
        del request.session['uploadID']

    if 'upload_progress' in request.session:
        del request.session['upload_progress']

    url = settings.WEBSERVICES_URL + 'upload/init'

    try:
        r = requests.post(url,files=request.POST, timeout=TIMEOUT)
        obj = json.loads(r.content)
        request.session['uploadID'] = obj['INFO']['uploadID']
        request.session['upload_progress'] = json.dumps({'UPLOAD': obj['UPLOAD']})
    except requests.exceptions.ConnectionError, e:
        r = HttpResponse(json.dumps({'ERROR': {'total': 1,'messages': 'Upload server could not be reached, please try again'}}))
    except requests.exceptions.Timeout, e:
        r = HttpResponse(json.dumps({'ERROR': {'total': 1,'messages': 'Connection timed out, please try again'}}))
    return HttpResponse(r)


@csrf_exempt
@decorators.login_required(login_url=views.login)
def uploadFile(request):
    try:
        STATE = 'UPLOADING'
        file = request.FILES['file']
        name = request.POST['filename']
        size = request.POST['filesize']
        obj = json.loads(request.session['upload_progress'])
        obj['UPLOAD']['filename'] = name
        obj['UPLOAD']['filesize'] = size
        request.session['upload_progress'] = json.dumps(obj)
        # mimetype = file.content_type
        extension = name[name.rindex('.'):]

        valid_ext = '(\.(?i)(zip|tar|gz)$)'
        valid_mime = '^application/(zip|x-zip-compressed|x-tar|x-gzip|octet-stream)$'

        # Validate file type
        # not (re.match(valid_mime, mimetype) and
        if not re.match(valid_ext, extension):
            r = errorResponse(request, 'Invalid file type', 1)
            return r

        files = {'file': file}
        data = {'uploadID': request.POST['uploadID'], 'filesize': size}
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
    except Exception, e:
        r = errorResponse(request, 'Oops something went wrong, please try again')

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
        return HttpResponse(json.dumps({'INFO': {'total': 1,'messages': 'Cancel complete'}}))

@csrf_exempt
@decorators.login_required(login_url=views.login)
def resetUpload(request):
    if 'upload_progress' in request.session:
        del request.session['upload_progress']
    return HttpResponse('')


@csrf_exempt
@decorators.login_required(login_url=views.login)
def getProgress(request,uploadID=None):
    url = settings.WEBSERVICES_URL + 'upload/progress'
    url += '?uploadID=' + request.GET['uploadID']
    try:
        r = requests.get(url, timeout=TIMEOUT)
    except requests.exceptions.ConnectionError, e:
        r = errorResponse(request, 'Upload server could not be reached')
    except requests.exceptions.Timeout, e:
        r = errorResponse(request, 'Connection timed out, please try again later')
    return storeAndRespond(request, r)

def errorResponse(request, objErrors):
    errorMsgs={'total': 1, 'messages': objErrors}
    if 'upload_progress' in request.session:
        obj = json.loads(request.session['upload_progress'])
        if 'UPLOAD' in obj:
            prog = obj['UPLOAD']
            prog[prog['stage']]['ERROR'] =errorMsgs
        return HttpResponse(json.dumps({'UPLOAD': prog}))
    else:
        return HttpResponse(json.dumps({'ERROR': errorMsgs}))


def storeAndRespond(request, response):
    if (response.status_code != 200):
        resp = errorResponse(request, 'Server error with status code ' + str(response.status_code))
        return resp
    else:
        obj = json.loads(response.content)
        request.session['upload_progress'] = json.dumps(obj).replace('\\', '\\\\')

        return HttpResponse(json.dumps(obj))