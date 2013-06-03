from django.shortcuts import render_to_response
from django.template import RequestContext
from django.conf import settings
from django import forms


def upload(request):
    if request.method == 'POST':
        form = forms.Form(request.POST)
        if form.is_valid():
            url = settings.WEBSERVICES_URL + 'validate'
            headers = {'content_type': 'form-data'}
            data = {'ZipFile': form.cleaned_data['ZipFile']}
            x = 1
            return render_to_response("upload.html", context_instance=RequestContext(request))
    else:
        return render_to_response("upload.html",{"WS_SERVER":settings.WEBSERVICES_URL}, context_instance=RequestContext(request))