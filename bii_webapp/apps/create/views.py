from django.contrib.auth import decorators, views
from django.http import HttpResponse,HttpRequest, HttpResponseBadRequest
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext
from bii_webapp.settings import common
from django.views.decorators.csrf import csrf_exempt
from bii_webapp.apps import upload
import json,os,csv,time,zipfile,parser
from threading import Thread
import shutil
import requests

# def parseHeaders(fileconfig):
#     headers=[]
#     for field in fileconfig['field']:


@decorators.login_required(login_url=views.login)
def create(request, config=None):
    if len(parser.configurations) == 0:
        parser.loadConfigurations()

    path=request.path
    if path.endswith('create/') or path.endswith('create'):
        request.breadcrumbs('Select configuration', request.path)
        return render_to_response("select_config.html", {'configurations': parser.configurations.keys(),
                                                         "pageNotice":'Here you need to select the configuration from which the creator fields will be generated'},
                                  context_instance=RequestContext(request))

    request.breadcrumbs([('Select configuration','/create'),('Create', request.path)])

    json_data = open(common.SITE_ROOT + '/fixtures/assay_mapping.json')
    jsonf = json.load(json_data)
    json_data.close()
    return render_to_response("create.html", {"configuration": json.dumps(parser.configurations[config]),"pageNotice":'In this page you can create and save a new ISA Tab file'},
                              context_instance=RequestContext(request))

@csrf_exempt
@decorators.login_required(login_url=views.login)
def initSave(request,config):
    investigation=json.loads(request.POST['investigation'])
    millis = int(round(time.time() * 1000))
    directory=common.SITE_ROOT + '/tmp/'+request.user.username+'/'

    zipName=request.user.username+'_'
    if not investigation['i_skip_investigation']:
        zipName+=investigation['i_id']
    else:
        study=investigation['i_studies'][0]
        zipName+=study['s_id']

    directory+=zipName+'/'
    if not os.path.exists(directory):
        os.makedirs(directory)
    os.chmod(directory,0o777)
    file=open(directory+'/i_investigation.txt', "wb+")
    f = csv.writer(file, delimiter='\t',
                   quotechar='|', quoting=csv.QUOTE_MINIMAL)

    parser.writeInvestigation(f,investigation)
    parser.writePubsFor(f,investigation['i_pubs'],'Investigation')
    parser.writeContactsFor(f,investigation['i_contacts'],'Investigation')

    for study in investigation['i_studies']:
        parser.writeStudy(f,study,directory)
        parser.writePubsFor(f,study['s_pubs'],'Study')
        parser.writeFactors(f,study['s_factors'])
        parser.writeAssays(f,study['s_assays'],directory)
        parser.writeProtocols(f,study['s_protocols'])
        parser.writeContactsFor(f,study['s_contacts'],'Study')

    file.close()

    zipName+=".zip"
    zf = zipfile.ZipFile(directory+"/"+zipName, "w")
    for dirname, subdirs, files in os.walk(directory):
        for filename in files:
            if filename==zipName:
                continue
            zf.write(os.path.join(dirname, filename), arcname=filename)
        zf.close()

    request1=request
    filesize=(str)(os.path.getsize(directory+"/"+zipName))

    request1.POST={'filename':zipName,'filesize':filesize}
    response=upload.resources.postInit(request1)
    return response


@csrf_exempt
@decorators.login_required(login_url=views.login)
def uploadSave(request,config):
    name=request.POST['filename']
    name=name[:name.rindex('.')]
    directory=common.SITE_ROOT + '/tmp/'+request.user.username+'/'+name
    f=open(directory+"/"+request.POST['filename'], 'rb')
    request.FILES['file']=f
    response=upload.resources.uploadFile(request)
    f.close()
    shutil.rmtree(common.SITE_ROOT + '/tmp/'+request.user.username+'/')
    return response