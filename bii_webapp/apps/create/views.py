from django.contrib.auth import decorators, views
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext
from bii_webapp.settings import common
from django.views.decorators.csrf import csrf_exempt
import json
import os
import csv
import time
import zipfile
import parser

# def parseHeaders(fileconfig):
#     headers=[]
#     for field in fileconfig['field']:


@decorators.login_required(login_url=views.login)
def create(request, config=None):
    if len(parser.configurations) == 0:
        parser.loadConfigurations()

    if 'config' not in request.session and config == None:
        return render_to_response("select_config.html", {'configurations': parser.configurations.keys()},
                                  context_instance=RequestContext(request))

    if config != None:
        request.session['config'] = config
    else:
        del request.session['config']
        return redirect(create)

    json_data = open(common.SITE_ROOT + '/fixtures/assay_mapping.json')
    jsonf = json.load(json_data)
    json_data.close()
    return render_to_response("create.html", {"configuration": json.dumps(parser.configurations[config])},
                              context_instance=RequestContext(request))

@csrf_exempt
@decorators.login_required(login_url=views.login)
def save(request,config):
    investigation=json.loads(request.POST['investigation'])
    millis = int(round(time.time() * 1000))
    directory=common.SITE_ROOT + '/tmp/'+str(millis)
    if not os.path.exists(directory):
        os.makedirs(directory)
        os.chmod(directory,0o777)


    f = csv.writer(open(directory+'/i_investigation.txt', "wb+"), delimiter='\t',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)

    if not investigation['i_skip_investigation']:
        parser.writeInvestigation(f,investigation)
        parser.writePubsFor(f,investigation['i_pubs'],'INVESTIGATION')
        parser.writeContactsFor(f,investigation['i_contacts'],'INVESTIGATION')

    for study in investigation['i_studies']:
        parser.writeStudy(f,study,directory)
        parser.writePubsFor(f,study['s_pubs'],'STUDY')
        parser.writeFactors(f,study['s_factors'])
        parser.writeAssays(f,study['s_assays'],directory)
        parser.writeProtocols(f,study['s_protocols'])
        parser.writeContactsFor(f,study['s_contacts'],'STUDY')

    zipName=(str)(millis)+"_archive.zip"
    zf = zipfile.ZipFile(directory+"/"+zipName, "w")
    for dirname, subdirs, files in os.walk(directory):
        for filename in files:
            if filename==zipName:
                continue
            zf.write(os.path.join(dirname, filename), arcname=filename)
        zf.close()


    return HttpResponse(json.dumps({'INFO':{'messages':'File saved','total':1}}))


