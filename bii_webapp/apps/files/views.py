from django.contrib.auth import decorators, views
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.conf import settings
from models import ISATabFile,FILES_PATH
from django.utils.encoding import smart_str
from django.core.servers.basehttp import FileWrapper
from django_tables2   import RequestConfig
from django.shortcuts import render
from tables import FilesTable
import os

@decorators.login_required(login_url=views.login)
def files(request):
    user=request.user
    table = FilesTable(ISATabFile.objects.filter(access=user))
    table.exclude='id'
    RequestConfig(request, paginate={"per_page": 25}).configure(table)
    # table.order_by='-uploaded_date'
    return render(request,"files.html",{'table': table})

@decorators.login_required(login_url=views.login)
def downloadFile(request):
    filepath=request.path.replace('/files/download/','')
    user=request.user
    filesSet=ISATabFile.objects.filter(isafile=filepath)
    if len(filesSet)==0:
        return HttpResponseBadRequest('File not found')

    file=filesSet[0].isafile.file
    access=filesSet[0].access.all()

    if user in access:
        filename=filepath[filepath.rindex('/')+1:]
        wrapper = FileWrapper(file)
        response = HttpResponse(wrapper, content_type='application/force-download')
        response['Content-Length'] = file.size
        return response
    else:
        return HttpResponseBadRequest('File not found')