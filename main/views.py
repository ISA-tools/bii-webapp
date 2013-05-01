from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.contrib.auth.decorators import login_required

def index(request):
    #    todo: we can also load in latest standards added, blog posts, etc
    return render_to_response("index.html", context_instance=RequestContext(request))

#Registration view override

# @login_required(login_url='/accounts/login/')
# def profile(request):
#     user_profile = request.user.get_profile()
#     url = user_profile.url

