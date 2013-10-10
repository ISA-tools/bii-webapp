from django.shortcuts import render_to_response
from django.template import RequestContext
import requests, json
from django.conf import settings
from django.http import HttpResponse
from bii_webapp.settings import common
from django.shortcuts import redirect
from django.contrib.auth import decorators, views
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import cache
import re

cache.clear()
cache_time=25102040

@csrf_exempt
@decorators.login_required(login_url=views.login)
def deleteInvestigation(request):
    url = settings.WEBSERVICES_URL + 'update/delete'
    try:
        r = requests.post(url, data=request.body, timeout=20);
    except requests.exceptions.Timeout:
        return HttpResponse(json.dumps({"ERROR": {"messages": "Web Service timeout", "total": 1}}))
    except Exception:
        return HttpResponse(json.dumps({"ERROR": {"messages": "Web Server error", "total": 1}}))

    loaded = json.loads(r.content)
    if 'ERROR' in loaded:
        return HttpResponse(json.dumps(loaded))

    print 'investigation deleted'
    cache.delete('browse')
    loaded = json.loads(request.body)
    inv = cache.get(loaded['pk'])
    studies = inv['i_studies']
    for study in studies:
        assays = study['s_assays']
        for assay in assays:
            cache.delete((str)(study['s_id']) + "_" + (str)(assay['measurement']) + "_" + (str)(assay['technology'
                                                                                                      '']))
        cache.delete(study['s_id'])

    cache.delete(loaded['pk'])

    return HttpResponse(json.dumps(loaded))


@csrf_exempt
@decorators.login_required(login_url=views.login)
def deleteStudy(request):
    url = settings.WEBSERVICES_URL + 'update/delete'
    try:
        r = requests.post(url, data=request.body, timeout=20);
    except requests.exceptions.Timeout:
        return HttpResponse(json.dumps({"ERROR": {"messages": "Web Service timeout", "total": 1}}))
    except Exception:
        return HttpResponse(json.dumps({"ERROR": {"messages": "Web Server error", "total": 1}}))

    loaded = json.loads(r.content)
    if 'ERROR' in loaded:
        return HttpResponse(json.dumps(loaded))

    print 'study deleted'
    cache.delete('browse')
    loaded = json.loads(request.body)

    study = cache.get(loaded['pk'])
    assays = study['s_assays']
    for assay in assays:
        cache.delete((str)(study['s_id']) + "_" + (str)(assay['measurement']) + "_" + (str)(assay['technology']))
    cache.delete(loaded['pk'])

    return HttpResponse(json.dumps(loaded))


@csrf_exempt
@decorators.login_required(login_url=views.login)
def updateInvestigation(request):
    data = request.POST.copy()
    data['type'] = 'investigation';
    url = settings.WEBSERVICES_URL + 'update'
    try:
        r = requests.post(url, data=json.dumps(data),timeout=20);
    except requests.exceptions.Timeout:
        return HttpResponse(json.dumps({"ERROR":{"messages":"Web Service timeout","total":1}}))
    except Exception:
        return HttpResponse(json.dumps({"ERROR": {"messages": "Web Server error", "total": 1}}))

    loaded = json.loads(r.content)
    if 'ERROR' in loaded:
        return HttpResponse(json.dumps(loaded))

    loaded['field'] = field = data['name']

    pk = request.POST['pk']

    investigation = cache.get(pk)
    if (investigation != None):
        investigation[loaded['field']] = data['value']
        cache.set(pk, investigation)

    return HttpResponse(json.dumps(loaded))


def updateBrowseCache(pk, field, value):
    browse = cache.get('browse')
    if browse == None:
        return

    found = False
    results = json.loads(browse['results'])
    if 'studies' in results:
        studies = results['studies']
        for s in studies:
            if s['s_id'] == pk:
                found = True
                s[field] = value
                break
        if not found:
            investigations = results['investigations']
            for i in investigations:
                for s in i['i_studies']:
                    if s['s_id'] == pk:
                        s[field] = value
                        break

    browse['results'] = json.dumps(results)
    cache.set('browse', browse)


@csrf_exempt
@decorators.login_required(login_url=views.login)
def updateStudy(request):
    data = request.POST.copy()
    data['type'] = 'study';
    url = settings.WEBSERVICES_URL + 'update'
    url2 = settings.WEBSERVICES_URL + 'rollback'
    try:
        r = requests.post(url, data=json.dumps(data),timeout=20)
    except requests.exceptions.Timeout:
        return HttpResponse(json.dumps({"ERROR":{"messages":"Web Service timeout","total":1}}))
    except Exception:
        return HttpResponse(json.dumps({"ERROR": {"messages": "Web Server error", "total": 1}}))

    loaded = json.loads(r.content)
    if 'ERROR' in loaded:
        return HttpResponse(json.dumps(loaded))

    loaded['field'] = field = data['name']

    pk = request.POST['pk']
    updateBrowseCache(pk, field, data['value'])

    study = cache.get(pk)
    if (study != None):
        study[loaded['field']] = data['value']
        cache.set(pk, study)

    return HttpResponse(json.dumps(loaded))


def browse(request, page=1, msg=None):
    loaded = cache.get('browse')
    text = 'This page shows the publicly accessible ISA-TAB datasets, click on each investigation/study/assay to get more details'
    try:
        username = "default"

        if request.user:
            username = request.user.username

        if username == "default":
            text = 'This page shows the publicly accessible ISA-TAB datasets, click on each investigation/study/assay to get more details'
        else:
            text = 'This page shows publicly accessible ISA-TAB datasets and those accessible for your account, click on each investigation/study/assay to get more details'

        if loaded == None or loaded['page'] != page:

            r = requests.post(settings.WEBSERVICES_URL + 'retrieve/browse',
                              data=json.dumps({'username': username, 'page': page}),
                              headers={'Cache-Control': 'no-cache'})

            if r.status_code != 200:

                return render_to_response("browse.html",
                    {"data": {"ERROR": {"messages": "Web Service failed", "total": 1}},
                    'number_of_pages': 0, 'current_page': 0,
                    'pageNotice': text},
                    context_instance=RequestContext(request))


            loaded = json.loads(r.content)

            if 'ERROR' in loaded:
                if (int)(page) != 1:
                    return redirect(browse, 1)
                else:
                    return render_to_response("browse.html", {"data": loaded, 'number_of_pages': 0, 'current_page': 0,
                                                              'pageNotice': text},
                                              context_instance=RequestContext(request))

            if 'INFO' in loaded:
                return render_to_response("browse.html", {"data": loaded, 'number_of_pages': 0, 'current_page': 0,
                                                          'pageNotice': text},
                                          context_instance=RequestContext(request))

            loaded.update({'page': page})
            cache.set('browse', loaded,cache_time)

    except ValueError:
        return render_to_response("browse.html",
                                  {"data": {"ERROR": {"messages": "Results could not be retrieved", "total": 1}},
                                   'number_of_pages': 0, 'current_page': 0,
                                   'pageNotice': text},
                                  context_instance=RequestContext(request))
    except Exception:
        return render_to_response("browse.html", {"data": {"ERROR": {"messages": "Web Server error", "total": 1}},
                                                  'number_of_pages': 0, 'current_page': 0,
                                                  'pageNotice': text},
                                  context_instance=RequestContext(request))

    results = json.loads(loaded['results'])
    blist = generateBreadcrumbs(request.path)
    request.breadcrumbs(blist)

    return render_to_response("browse.html",
                              {"data": results, 'number_of_pages': loaded['number_of_pages'], 'current_page': page,
                               "toast": msg,
                               'pageNotice': text},
                              context_instance=RequestContext(request))


def investigation(request, invID=None):
    if invID == None:
        return redirect(browse)

    loaded = cache.get(invID)

    if loaded == None:
        username = "default"
        if request.user:
            username = request.user.username

        try:
            r = requests.post(settings.WEBSERVICES_URL + 'retrieve/investigation',
                              data=json.dumps({'username': username, 'investigationID': invID}),
                              headers={'Cache-Control': 'no-cache'})

            if r.status_code != 200:
                return browse(request, 1, {'ERROR': {"messages": "Web Service failed", "total": 1}})

            loaded = json.loads(r.content)
            if 'ERROR' in loaded or 'INFO' in loaded:
                request.path = '/browse/'
                return browse(request, 1, loaded)

            i_studies = None
            browse_data = cache.get('browse')
            if browse_data != None:
                results = json.loads(browse_data['results'])
                for inv in results['investigations']:
                    if inv['i_id'] == invID:
                        i_studies = inv['i_studies']
                        break
            if i_studies == None:
                r = requests.post(settings.WEBSERVICES_URL + 'retrieve/investigation/studies',
                                  data=json.dumps({'username': request.user.username, 'investigationID': invID}))
                i_studies = json.loads(r.content)['i_studies']

            loaded.update({'i_studies': i_studies})
            cache.set(invID, loaded,cache_time)

        except Exception:
            return browse(request, 1, {'ERROR': {"messages": "Web Server error", "total": 1}})

    blist = generateBreadcrumbs(request.path)
    request.breadcrumbs(blist)

    return render_to_response("investigation.html",
                              {"investigation": loaded, 'pageNotice': 'Various fields can be edited by clicking'},
                              context_instance=RequestContext(request))


def study(request, invID=None, studyID=None):
    path = request.path
    if path.find('investigation', 7, 21) == -1:
        studyID = invID
        invID = None
    if studyID == None:
        return redirect(browse)

    loaded = cache.get(studyID)

    if loaded == None:
        username = "default"
        if request.user:
            username = request.user.username
        try:
            r = requests.post(settings.WEBSERVICES_URL + 'retrieve/study',
                              data=json.dumps({'username': username, 'studyID': studyID}),
                              headers={'Cache-Control': 'no-cache'})

            if r.status_code != 200:
                return browse(request, 1, {'ERROR': {"messages": "Web Service failed", "total": 1}})

            loaded = json.loads(r.content)

            if 'ERROR' in loaded or 'INFO' in loaded:
                request.path = '/browse/'
                return browse(request, 1, loaded)

            s_assays = None
            s_organisms = None
            studies = None
            browse_data = cache.get('browse')
            if browse_data != None:
                results = json.loads(browse_data['results'])
                if invID != None:
                    for inv in results['investigations']:
                        if inv['i_id'] == invID:
                            studies = inv['i_studies']
                            break
                else:
                    studies = results['studies']

                for study in studies:
                    if study['s_id'] == studyID:
                        s_assays = study['s_assays']
                        s_organisms = study['s_organisms']
                        break

            if s_assays == None:
                r = requests.post(settings.WEBSERVICES_URL + 'retrieve/study/browse_view',
                                  data=json.dumps({'username': request.user.username, 'studyID': studyID}))
                load = json.loads(r.content)
                s_assays = load['s_assays']
                s_organisms = load['s_organisms']

            loaded.update({'s_organisms': s_organisms})
            loaded.update({'s_assays': s_assays})
            cache.set(studyID, loaded,cache_time)

        except Exception:
            return browse(request, 1, {'ERROR': {"messages": "Web Server error", "total": 1}})

    blist = generateBreadcrumbs(request.path)
    request.breadcrumbs(blist)

    return render_to_response("study.html", {"investigation": {"i_id": invID}, "study": loaded,
                                             'pageNotice': 'Various fields can be edited by clicking'},
                              context_instance=RequestContext(request))


def assay(request, invID=None, studyID=None, measurement=None, technology=None):
    path = request.path
    if path.find('investigation', 7, 21) == -1:
        technology = measurement;
        measurement = studyID;
        studyID = invID
        invID = None
    if studyID == None or measurement == None or technology == None:
        return redirect(browse)

    loaded = cache.get((str)(studyID) + "_" + (str)(measurement) + "_" + (str)(technology))

    if loaded == None:
        username = "default"
        if request.user:
            username = request.user.username
        try:
            r = requests.post(settings.WEBSERVICES_URL + 'retrieve/study/assay',
                              data=json.dumps({'username': username, 'studyID': studyID
                                  , 'measurement': measurement, 'technology': technology}),
                              headers={'Cache-Control': 'no-cache'})
            if r.status_code != 200:
                return browse(request, 1, {'ERROR': {"messages": "Web Service failed", "total": 1}})

            loaded = json.loads(r.content)

            if 'ERROR' in loaded or 'INFO' in loaded:
                request.path = '/browse/'
                return browse(request, 1, loaded)

            organisms = None
            study = cache.get(studyID)
            if study != None:
                organisms = study['s_organisms']
            else:
                r = requests.post(settings.WEBSERVICES_URL + 'retrieve/study/browse_view',
                                  data=json.dumps({'username': request.user.username, 'studyID': studyID}))
                studyObj = json.loads(r.content);
                organisms = studyObj['s_organisms']

            loaded.update({'organisms': organisms})
            loaded.update({'measurement': stripIRI(measurement)})
            loaded.update({'technology': stripIRI(technology)})
            cache.set((str)(studyID) + "_" + (str)(measurement) + "_" + (str)(technology), loaded,cache_time)

        except Exception:
            return browse(request, 1, {'ERROR': {"messages": "Web Server error", "total": 1}})

    blist = generateBreadcrumbs(request.path)
    request.breadcrumbs(blist)

    return render_to_response("assay.html", {"study": {"s_id": studyID}, "assay": loaded,
                                             'pageNotice': 'Assay details including the samples per study group'},
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

    assay = re.search('(?<=assay/)[^.]+', path)
    if (assay):
        assay = assay.group(0)
        splitt = assay.split('/')
        assay = splitt[0] + '/' + splitt[1]
        bPath += 'assay/' + assay + '/'
        breadcrumbs.append(('Assay ' + stripIRI(splitt[0]).title() + ' with ' + stripIRI(splitt[1]), bPath))

    return breadcrumbs


def stripIRI(value):
    return value[value.index(':') + 1:]

def sample(request, invID=None, studyID=None, sample=-1):
    if studyID == -1 or sample == -1:
        return redirect(browse)

    blist = generateBreadcrumbs(request.path)
    request.breadcrumbs(blist)

    return render_to_response("sample.html", context_instance=RequestContext(request))
