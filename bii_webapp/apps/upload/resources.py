from django.contrib.auth import decorators, views
from django.http import HttpResponse, HttpResponseBadRequest
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from models import *
import json
import requests
import re
import os
import stat

TIMEOUT = 100 #seconds

@csrf_exempt
@decorators.login_required(login_url=views.login)
def getInit(request):
    if request.is_ajax():
        url = settings.WEBSERVICES_URL + 'upload/init'
        try:
            r = requests.get(url, timeout=TIMEOUT)
            obj = json.loads(r.text)
            request.session['uploadID'] = obj['INFO']['uploadID']
            request.session['upload_progress'] = obj['UPLOAD']
        except requests.exceptions.ConnectionError, e:
            r = HttpResponse(json.dumps({'ERROR':{'messages':'Upload server could not be reached'}}))
        except requests.exceptions.Timeout, e:
            r = HttpResponse(json.dumps({'ERROR':{'messages':'Connection timed out, please try again later'}}))
        return HttpResponse(r)
    else:
        return errorResponse(request, 'Invalid request', 1)


@csrf_exempt
@decorators.login_required(login_url=views.login)
def uploadFile(request):
    if request.is_ajax():
        STATE='UPLOADING'
        file = request.FILES['file']
        name = file.name
        size = file.size
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
            resp=json.loads(r.text);
            if(resp['UPLOAD']['stage']=='cancelled'):
                return HttpResponse(r)

            if resp['UPLOAD']['stage']=='complete':
                user = request.user

                model = ISATabFile(uploaded_by=user,isafile=file)
                model.save()
                model.access.add(user)

        except requests.exceptions.RequestException, e:
            r = errorResponse(request, 'Upload server could not be reached', 1)
        except requests.exceptions.Timeout, e:
            r = errorResponse(request, 'Connection timed out, please try again later', 1)

        return storeAndRespond(request, r)
    else:
        return HttpResponse('Invalid request', content_type="text/plain")


@csrf_exempt
@decorators.login_required(login_url=views.login)
def getCancel(request):
    if request.is_ajax():
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
    else:
        return errorResponse(request, 'Invalid request', 1)


@csrf_exempt
@decorators.login_required(login_url=views.login)
def resetUpload(request):
    if request.is_ajax():
        if 'upload_progress' in request.session:
            del request.session['upload_progress']
        return HttpResponse('')
    else:
        return errorResponse(request, 'Invalid request', 1)


@csrf_exempt
@decorators.login_required(login_url=views.login)
def getProgress(request):
    if request.is_ajax():
        uploadID = request.session['uploadID']
        url = settings.WEBSERVICES_URL + 'upload/progress'
        url += '?uploadID=' + uploadID
        try:
            r = requests.get(url, timeout=TIMEOUT)
        except requests.exceptions.ConnectionError, e:
            r = errorResponse(request, 'Upload server could not be reached', 1)
        except requests.exceptions.Timeout, e:
            r = errorResponse(request, 'Connection timed out, please try again later', 1)
        return storeAndRespond(request, r)
    else:
        return errorResponse(request, 'Invalid request', 1)


def errorResponse(request, objErrors):
    if 'upload_progress' in request.session:
        prog = request.session['upload_progress']['UPLOAD']
        prog[prog['stage']]['errors'] = objErrors
        request.session['upload_progress'] = json.dumps(prog)
        r = HttpResponse(json.dumps(prog))
        r.text = json.dumps(prog)
        return r
    else:
        return HttpResponse(objErrors)


def storeAndRespond(request, response):
    if (response.status_code != 200):
        resp = errorResponse(request, 'Server error with status code ' + str(response.status_code), 1)
        return resp
    else:
        obj = json.loads(response.text)
        request.session['upload_progress'] = json.dumps(obj).replace('\\', '\\\\')
        return HttpResponse(json.dumps(obj))