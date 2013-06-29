from django.contrib.auth import decorators, views
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render_to_response,redirect
from django.template import RequestContext
from bii_webapp.settings import common
from django.views.decorators.csrf import csrf_exempt
import json
import os
import xmltodict


configurations=dict()

def loadConfigurations():
    directory = common.SITE_ROOT+'/config/'
    measurements=[]
    technologiesPlatforms=[]

    config={'measurements':measurements}
    for root,dirs,files in os.walk(directory):
        for dir in dirs:
            configurations[dir]=config
            for root,dirs,files in os.walk(directory+dir):
                for file in files:
                    f=open(directory+dir+'/'+file)
                    o = xmltodict.parse(f)
                    configFile=o['isatab-config-file']
                    fileconfig=configFile['isatab-configuration']
                    if '@isatab-assay-type' not in fileconfig:
                        continue
                    measurement=fileconfig['measurement']
                    measurementObj=next((m for m in measurements if m['measurement']==measurement['@term-label']),None)
                    if measurementObj==None:
                        measurementObj={'measurement':measurement['@term-label']}
                        measurements.append(measurementObj)

                    technology=fileconfig['technology']
                    tech=technology['@term-label']

                    techObj=next((t for t in technologiesPlatforms if t['technology']==tech),None)
                    if techObj==None:
                        techObj={'technology':tech}
                        if tech=='':
                            techObj['technology']='no technology required'
                            techObj['platforms']=['Not Available']
                        technologiesPlatforms.append(techObj)

                    if 'technologies' in measurementObj:
                        measurementObj['technologies'].append(techObj)
                    else:
                        measurementObj['technologies']=[techObj]

    f=open(directory+'platforms.xml')
    o = xmltodict.parse(f)
    for techType in o['technology-platforms']['technology']:
        type=techType['@type'].replace('Section[','')[:-1].lower();
        platforms=[]
        if techType['platforms']!=None:
            for plat in techType['platforms']['platform']:
                if plat['machine']!=None:
                    platforms.append(plat['machine']+' ('+plat['vendor']+')')
                else:
                    platforms.append(plat['vendor'])
        else:
            platforms=['Not Available']
        for techObj in technologiesPlatforms:
               if type in techObj['technology']:
                   techObj['platforms']=platforms

@decorators.login_required(login_url=views.login)
def create(request,config=None):
        if(len(configurations)==0):
            loadConfigurations()

        if 'config' not in request.session and config==None:
            return render_to_response("select_config.html",{'configurations':configurations.keys()},context_instance=RequestContext(request))

        if config!=None:
            request.session['config']=config
        else:
            del request.session['config']
            return redirect(create)

        json_data = open(common.SITE_ROOT+'/fixtures/assay_mapping.json')
        jsonf=json.load(json_data)
        json_data.close()
        return render_to_response("create.html", {"configuration": json.dumps(configurations[config])},
                                context_instance=RequestContext(request))


