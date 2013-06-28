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
    json_data = open(common.SITE_ROOT + '/fixtures/sample.json')
    loaded=json.load(json_data)
    request.session['data']=json.dumps(loaded)
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


def investigation(request, invIndex=None):
    if not 'data' in request.session or invIndex==None:
        return redirect(browse)

    request.session['currentInvestigation']=invIndex
    request.breadcrumbs(
        [('Browse the BII', '/browse/'), ('Investigation', request.path)])
    return render_to_response("investigation.html",{"data":json.dumps(request.session['data'])},context_instance=RequestContext(request))


def study(request,invIndex=None,studyIndex=None):
    if not 'data' in request.session or studyIndex==None:
        return render_to_response("browse.html",context_instance=RequestContext(request))

    request.session['currentStudy']=studyIndex
    request.breadcrumbs(
        [('Browse the BII', '/browse/'), ('Investigation', '/browse/investigation/'), ('Study', request.path)])
    return render_to_response("study.html", context_instance=RequestContext(request))


def assay(request,invIndex=None,studyIndex=None,assayIndex=None):
    if not 'data' in request.session or studyIndex==None or assayIndex==None:
        return render_to_response("browse.html",context_instance=RequestContext(request))

    request.breadcrumbs([('Browse the BII', '/browse/'), ('Investigation', '/browse/investigation/'),
                         ('Study', '/browse/investigation/study/'), ('Assay', request.path)])
    return render_to_response("assay.html", context_instance=RequestContext(request))


def sample(request,invIndex=-1,studyIndex=-1,sample=-1):
    if not 'data' in request.session or studyIndex==-1 or sample==-1:
        return render_to_response("browse.html",context_instance=RequestContext(request))

    request.breadcrumbs([('Browse the BII', '/browse/'), ('Investigation', '/browse/investigation/'),
                         ('Study', '/browse/investigation/study/'), ('Sample', request.path)])
    return render_to_response("sample.html", context_instance=RequestContext(request))

#Registration view override

# @login_required(login_url='/accounts/login/')
# def profile(request):
#     user_profile = request.user.get_profile()
#     url = user_profile.url