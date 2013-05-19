from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.contrib.auth.decorators import login_required

# @login_required(None, index, None)
def browse(request):
    request.breadcrumbs( 'Browse the BII',  request.path)
    return render_to_response("browse.html", context_instance=RequestContext(request))

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

