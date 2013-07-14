from django.shortcuts import render_to_response
from django.template import RequestContext
import requests, json
from django.conf import settings
from django.http import HttpResponse
from bii_webapp.settings import common
from django.shortcuts import redirect
from django.contrib.auth import decorators, views
from django.views.decorators.csrf import csrf_exempt
import re

@csrf_exempt
@decorators.login_required(login_url=views.login)
def updateInvestigation(request):
    data=request.POST.copy()
    data['type']='investigation';
    url = settings.WEBSERVICES_URL + 'update'
    r=requests.post(url, data=json.dumps(data))
    return HttpResponse(r)


@decorators.login_required(login_url=views.login)
def browse(request, page=1):
    # json_data = open(common.SITE_ROOT + '/fixtures/browse.json')
    r = requests.post(settings.WEBSERVICES_URL + 'retrieve/browse',
                      data=json.dumps({'username': request.user.username, 'page': page}))
    try:
        loaded = json.loads(r.content)
    except ValueError:
        return render_to_response("browse.html", {"data": {"ERROR":{"messages":"Results could not be retrieved","total":1}},'number_of_pages':0, 'current_page':0,
                                                  'pageNotice':'This page shows the accessible studies for your account, click on each to get more details'},
                                  context_instance=RequestContext(request))
    except Exception:
        return render_to_response("browse.html", {"data": {"ERROR":{"messages":"Server is down","total":1}},'number_of_pages':0, 'current_page':0,
                                                  'pageNotice':'This page shows the accessible studies for your account, click on each to get more details'},
                                  context_instance=RequestContext(request))

    # loaded2 = json.load(json_data)
    if 'ERROR' in loaded:
        if (int)(page) != 1:
            return redirect(browse,1)


    results=json.loads(loaded['results'])
    # json_data.close()

    blist = generateBreadcrumbs(request.path)
    request.breadcrumbs(blist)
    return render_to_response("browse.html", {"data": results,'number_of_pages':loaded['number_of_pages'], 'current_page':page,
                                              'pageNotice':'This page shows the accessible studies for your account, click on each to get more details'},
                              context_instance=RequestContext(request))

@decorators.login_required(login_url=views.login)
def investigation(request, invID=None):
    if invID == None:
        return redirect(browse)

    r = requests.post(settings.WEBSERVICES_URL + 'retrieve/investigation',
                      data=json.dumps({'username': request.user.username, 'investigationID':invID}))

    json_data = open(common.SITE_ROOT + '/fixtures/study.json')
    loaded = json.loads(r.content)
    investigation = json.dumps(loaded).replace("'", "\\'")
    json_data.close()

    blist = generateBreadcrumbs(request.path)
    request.breadcrumbs(blist)
    return render_to_response("investigation.html", {"investigation": loaded, "investigation_json": investigation,
                                                     'pageNotice': 'Various fields can be edited by clicking'},
                              context_instance=RequestContext(request))


@decorators.login_required(login_url=views.login)
def study(request, invID=None, studyID=None):
    path=request.path
    if path.find('investigation',7,21)==-1:
        studyID=invID
    if studyID == None:
        return redirect(browse)

    r = requests.post(settings.WEBSERVICES_URL + 'retrieve/study',
                      data=json.dumps({'username': request.user.username, 'studyID':studyID}))

    json_data = open(common.SITE_ROOT + '/fixtures/study.json')
    loaded = json.loads(r.content)
    study = json.dumps(loaded).replace("'", "\\'")
    json_data.close()

    blist = generateBreadcrumbs(request.path)
    request.breadcrumbs(blist)
    return render_to_response("study.html", {"investigation": {"i_id": invID},"study": loaded, "study_json": study,
                                                     'pageNotice': 'Various fields can be edited by clicking'},
                              context_instance=RequestContext(request))


def generateBreadcrumbs(path=None):
    split = path.split('/')

    bPath = '/browse/'
    breadcrumbs = [('Browse the BII', bPath)]

    investigation = re.search('(?<=investigation/)[^/.]+', path)
    if (investigation):
        investigation = investigation.group(0)
        bPath += 'investigation/' + investigation + '/'
        breadcrumbs.append(('Investigation ' + investigation, bPath))

    study = re.search('(?<=study/)[^/.]+', path)
    if (study):
        study = study.group(0)
        bPath += 'study/' + study + '/'
        breadcrumbs.append(('Study ' + study, bPath))

    sample = re.search('(?<=sample/)[^/.]+', path)
    if (sample):
        sample = sample.group(0)
        bPath += 'sample/' + sample + '/'
        breadcrumbs.append(('Sample ' + sample, bPath))

    assay = re.search('(?<=assay/)[^/.]+', path)
    if (assay):
        assay = assay.group(0)
        bPath += 'assay/' + assay + '/'
        breadcrumbs.append(('Assay ' + assay, bPath))

    return breadcrumbs


@decorators.login_required(login_url=views.login)
def assay(request, invID=None, studyID=None, assayID=None):
    if studyID == None or assayID == None:
        return redirect(browse)

    json_data = open(common.SITE_ROOT + '/fixtures/assay.json')
    loaded = json.load(json_data)
    assay = json.dumps(loaded).replace("'", "\\'")
    json_data.close()

    blist = generateBreadcrumbs(request.path)
    request.breadcrumbs(blist)
    return render_to_response("assay.html",
                              {"investigation": {"i_id": None}, "study": {"s_id": studyID}, "assay": loaded,
                               "assay_json": assay}, context_instance=RequestContext(request))


@decorators.login_required(login_url=views.login)
def sample(request, invID=None, studyID=None, sample=-1):
    if studyID == -1 or sample == -1:
        return redirect(browse)

    blist = generateBreadcrumbs(request.path)
    request.breadcrumbs(blist)

    return render_to_response("sample.html", context_instance=RequestContext(request))
