from django.contrib.auth import decorators, views
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render_to_response
from django.template import RequestContext
from bii_webapp.settings import common
from django.views.decorators.csrf import csrf_exempt
import json
import os

@decorators.login_required(login_url=views.login)
def create(request):
        json_data = open(common.SITE_ROOT+'/fixtures/assay_mapping.json')
        jsonf=json.load(json_data)
        json_data.close()
        return render_to_response("create.html", {"assay_mapping": json.dumps(jsonf)},
                                context_instance=RequestContext(request))


@decorators.login_required(login_url=views.login)
@csrf_exempt
def upload(request):
    investigation=json.loads(request.POST['investigation'])
    investigation=investigation['investigation']
    studies=investigation['i_studies']
    x=1
    return render_to_response("create.html", context_instance=RequestContext(request))
