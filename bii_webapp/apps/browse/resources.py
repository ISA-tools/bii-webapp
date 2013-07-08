from django.contrib.auth import decorators, views
from django.http import HttpResponse, HttpRequest, HttpResponseBadRequest, QueryDict
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from bii_webapp.apps.files.models import *
from threading import Thread
import json
import requests
from bii_webapp.settings import common
import re
import os
import stat

TIMEOUT = 1500 #seconds


@csrf_exempt
@decorators.login_required(login_url=views.login)
def postUpdate(request):
    url = settings.WEBSERVICES_URL + 'update/'
    try:
        data = request.POST

        r = requests.post(url, files=request.POST, timeout=TIMEOUT)
        obj = json.loads(r.content)
        request.session['uploadID'] = obj['INFO']['uploadID']
        request.session['upload_progress'] = json.dumps({'UPLOAD': obj['UPLOAD']})
    except requests.exceptions.ConnectionError, e:
        r = HttpResponse(
            json.dumps({'ERROR': {'total': 1, 'messages': 'Upload server could not be reached, please try again'}}))
    except requests.exceptions.Timeout, e:
        r = HttpResponse(json.dumps({'ERROR': {'total': 1, 'messages': 'Connection timed out, please try again'}}))
    return HttpResponse(r)


@csrf_exempt
@decorators.login_required(login_url=views.login)
def sampleFile(request):
    name = 'sample.zip'
    directory = common.SITE_ROOT + '/media/samples/'
    filesize = (str)(os.path.getsize(directory + "/" + name))

    # request.POST={'filename':name,'filesize':filesize}
    sample = {'filename': name, 'filesize': filesize}
    response = postInit(request, sample)
    obj = json.loads(response.content)
    if 'ERROR' in obj:
        return response

    # request.POST={'uploadID':obj['INFO']['uploadID'],'filename':name,'filesize':filesize}
    # request.FILES['file']=(open(directory+"/"+name, 'rb'))
    sample['file'] = open(directory + "/" + name, 'rb')
    sample['uploadID'] = obj['INFO']['uploadID']
    t = Thread(target=uploadFile, args=[request, sample])
    t.start()

    return response


@csrf_exempt
@decorators.login_required(login_url=views.login)
def uploadFile(request, sample=None):
    try:
        STATE = 'UPLOADING'

        if sample == None:
            file = request.FILES['file']
            name = request.POST['filename']
            size = request.POST['filesize']
            uploadID = request.POST['uploadID']
        else:
            file = sample['file']
            name = sample['filename']
            size = sample['filesize']
            uploadID = sample['uploadID']

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
        data = {'uploadID': uploadID, 'filesize': size}
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

    return respond(request, r)


@csrf_exempt
@decorators.login_required(login_url=views.login)
def getCancel(request):
    url = settings.WEBSERVICES_URL + 'upload/cancel'
    url += '?uploadID=' + uploadID
    try:
        r = requests.get(url, timeout=TIMEOUT)
    except requests.exceptions.ConnectionError, e:
        r = errorResponse('Upload server could not be reached, please delete the file')
    except requests.exceptions.Timeout, e:
        r = errorResponse('Connection timed out, please delete the file')
    return HttpResponse(r)


@csrf_exempt
@decorators.login_required(login_url=views.login)
def getProgress(request, uploadID=None):
    url = settings.WEBSERVICES_URL + 'upload/progress'
    url += '?uploadID=' + request.GET['uploadID']
    try:
        r = requests.get(url, timeout=TIMEOUT)
    except requests.exceptions.ConnectionError, e:
        r = errorResponse(request, 'Upload server could not be reached')
    except requests.exceptions.Timeout, e:
        r = errorResponse(request, 'Connection timed out, please try again later')
    return respond(request, r)


def errorResponse(request, objErrors):
    errorMsgs = {'total': 1, 'messages': objErrors}
    if 'upload_progress' in request.session:
        obj = json.loads(request.session['upload_progress'])
        if 'UPLOAD' in obj:
            prog = obj['UPLOAD']
            prog[prog['stage']]['ERROR'] = errorMsgs
        return HttpResponse(json.dumps({'UPLOAD': prog}))
    else:
        return HttpResponse(json.dumps({'ERROR': errorMsgs}))


def respond(request, response):
    if (response.status_code != 200):
        resp = errorResponse(request, 'Server error with status code ' + str(response.status_code))
        return resp
    else:
        obj = json.loads(response.content)
        return HttpResponse(json.dumps(obj).replace('\\', '\\\\'))