from django.shortcuts import render_to_response
from django.template import RequestContext
import requests, json
from django.conf import settings
from django.http import HttpResponse
from bii_webapp.settings import common
from django.shortcuts import redirect
from django.contrib.auth import decorators, views

import re


TIMEOUT = 60 #seconds


@decorators.login_required(login_url=views.login)
def browse(request, page=1):
    json_data = open(common.SITE_ROOT + '/fixtures/browse.json')
    r = requests.post(settings.WEBSERVICES_URL + 'retrieve/browse',
                      data=json.dumps({'username': request.user.username, 'page': page}))
    loaded = json.loads(r.content)
    if 'ERROR' in loaded:
        if page != 1:
            return redirect(browse,1)


    invs=json.loads(loaded['results'])
    json_data.close()

    blist = generateBreadcrumbs(request.path)
    request.breadcrumbs(blist)
    return render_to_response("browse.html", {"data": invs,'number_of_pages':loaded['number_of_pages'], 'current_page':page,
                                              'pageNotice':'This page shows the accessible studies for your account, click on each to get more details'},
                              context_instance=RequestContext(request))


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


@decorators.login_required(login_url=views.login)
def investigation(request, invID=None):
    if invID == None:
        return redirect(browse)

    json_data = open(common.SITE_ROOT + '/fixtures/investigation.json')
    loaded = json.load(json_data)
    investigation = json.dumps(loaded).replace("'", "\\'")
    json_data.close()

    blist = generateBreadcrumbs(request.path)
    request.breadcrumbs(blist)
    return render_to_response("investigation.html", {"investigation": loaded, "investigation_json": investigation,
                                                     'pageNotice': 'Various fields can be edited by clicking'},
                              context_instance=RequestContext(request))


@decorators.login_required(login_url=views.login)
def study(request, invID=None, studyID=None):
    if studyID == None:
        return redirect(browse)

    json_data = open(common.SITE_ROOT + '/fixtures/study.json')
    loaded = json.load(json_data)
    study = json.dumps(loaded).replace("'", "\\'")
    json_data.close()

    blist = generateBreadcrumbs(request.path)
    request.breadcrumbs(blist)

    return render_to_response("study.html", {"investigation": {"i_id": invID}, "study": loaded, "study_json": study,
                                             'pageNotice': 'Various fields can be edited by clicking on them'},
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
