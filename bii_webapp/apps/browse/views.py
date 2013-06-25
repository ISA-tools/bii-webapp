from django.shortcuts import render_to_response
from django.template import RequestContext
import requests,json
from django.conf import settings
from django.http import HttpResponse
TIMEOUT = 60 #seconds

# @login_required(None, index, None)
def browse(request):
    request.breadcrumbs( 'Browse the BII',  request.path)
    return render_to_response("browse.html", context_instance=RequestContext(request))

def getPage(request, num="1"):
    request.breadcrumbs( 'Browse the BII',  request.path)
    # fetch page
    url = settings.WEBSERVICES_URL + 'retrieve'
    data = {'user': request.user.username, 'page': num}
    try:
        r = requests.post(url, data=json.dumps(data), timeout=TIMEOUT)
        return render_to_response("browse.html", {"data": r.content},context_instance=RequestContext(request))
    except requests.exceptions.RequestException, e:
        return HttpResponse(request, {"ERROR":{"total":1,"messages":"Upload server could not be reached"}})
    except requests.exceptions.Timeout, e:
        return HttpResponse(request,request, {"ERROR":{"total":1,"messages":'Connection timed out, please try again later'}})

def investigation(request):
    request.breadcrumbs([('Browse the BII','/browse/'),('Investigation',  request.path)])
    return render_to_response("investigation.html", context_instance=RequestContext(request))

def study(request):
    request.breadcrumbs([('Browse the BII','/browse/'),('Investigation',  '/browse/investigation/'),('Study',  request.path)])
    return render_to_response("study.html", context_instance=RequestContext(request))

def assay(request):
    request.breadcrumbs([('Browse the BII','/browse/'),('Investigation',  '/browse/investigation/'),('Study', '/browse/investigation/study/'),('Assay',  request.path)])
    return render_to_response("assay.html", context_instance=RequestContext(request))

def sample(request):
    request.breadcrumbs([('Browse the BII','/browse/'),('Investigation',  '/browse/investigation/'),('Study', '/browse/investigation/study/'),('Sample',  request.path)])
    return render_to_response("sample.html", context_instance=RequestContext(request))

#Registration view override

# @login_required(login_url='/accounts/login/')
# def profile(request):
#     user_profile = request.user.get_profile()
#     url = user_profile.url

