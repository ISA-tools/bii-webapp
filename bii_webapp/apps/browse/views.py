from django.shortcuts import render_to_response
from django.template import RequestContext
import requests, json
from django.conf import settings
from django.http import HttpResponse
from bii_webapp.settings import common
from django.shortcuts import redirect


TIMEOUT = 60 #seconds

# @login_required(None, index, None)
def browse(request):
    request.breadcrumbs('Browse the BII', request.path)
    json_data = open(common.SITE_ROOT + '/fixtures/browse.json')
    loaded=json.load(json_data)
    json_data.close()
    return render_to_response("browse.html",{"data":loaded},context_instance=RequestContext(request))

def getPage(request, num="1"):
    request.breadcrumbs('Browse the BII', request.path)
    # fetch page
    url = settings.WEBSERVICES_URL + 'retrieve'
    data = {'user': request.user.username, 'page': num}
    try:
        r = requests.post(url, data=json.dump(data), timeout=TIMEOUT)
        return render_to_response("browse.html", {"data": r.content}, context_instance=RequestContext(request))
    except requests.exceptions.RequestException, e:
        return HttpResponse(request, {"ERROR": {"total": 1, "messages": "Upload server could not be reached"}})
    except requests.exceptions.Timeout, e:
        return HttpResponse(request, request,
                            {"ERROR": {"total": 1, "messages": 'Connection timed out, please try again later'}})


def investigation(request, invID=None):
    if invID==None:
        return redirect(browse)

    json_data = open(common.SITE_ROOT + '/fixtures/investigation.json')
    loaded=json.load(json_data)
    investigation=json.dumps(loaded).replace("'","\\'")
    json_data.close()

    path=request.path
    request.breadcrumbs(
        [('Browse the BII', path[:path.rindex('investigation')]), ('Investigation', request.path)])
    return render_to_response("investigation.html",{"investigation":loaded,"investigation_json":investigation},context_instance=RequestContext(request))


def study(request,invID=None,studyID=None):
    if studyID==None:
        return redirect(browse)

    json_data = open(common.SITE_ROOT + '/fixtures/study.json')
    loaded=json.load(json_data)
    study=json.dumps(loaded).replace("'","\\'")
    json_data.close()

    path=request.path
    request.breadcrumbs(
        [('Browse the BII', path[:path.rindex('investigation')]), ('Investigation', path[:path.rindex('study')]), ('Study', request.path)])
    return render_to_response("study.html",{"investigation":{"i_id":invID},"study":loaded,"study_json":study},context_instance=RequestContext(request))


def assay(request,invID=None,studyID=None,assayID=None):
    if studyID==None or assayID==None:
        return redirect(browse)

    json_data = open(common.SITE_ROOT + '/fixtures/assay.json')
    loaded=json.load(json_data)
    assay=json.dumps(loaded).replace("'","\\'")
    json_data.close()

    path=request.path
    request.breadcrumbs([('Browse the BII', path[:path.rindex('investigation')]),('Investigation', path[:path.rindex('study')]),
                        ('Study', path[:path.rindex('assay')]), ('Assay', request.path)])
    return render_to_response("assay.html",{"investigation":{"i_id":None},"study":{"s_id":studyID},"assay":loaded,"assay_json":assay}, context_instance=RequestContext(request))


def sample(request,invID=None,studyID=None,sample=-1):
    if studyID==-1 or sample==-1:
        return redirect(browse)

    path=request.path
    request.breadcrumbs([('Browse the BII', path[:path.rindex('investigation')]), ('Investigation', path[:path.rindex('study')]),
                         ('Study', path[:path.rindex('sample')]), ('Sample', request.path)])
    return render_to_response("sample.html", context_instance=RequestContext(request))

#Registration view override

# @login_required(login_url='/accounts/login/')
# def profile(request):
#     user_profile = request.user.get_profile()
#     url = user_profile.url