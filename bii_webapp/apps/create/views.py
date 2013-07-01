from django.contrib.auth import decorators, views
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render_to_response,redirect
from django.template import RequestContext
from bii_webapp.settings import common
from django.views.decorators.csrf import csrf_exempt
import json
import os
import xmltodict
import xml.etree.ElementTree as ElementTree



configurations={}

# def parseHeaders(fileconfig):
#     headers=[]
#     for field in fileconfig['field']:


def parseFields(tree,fields):
    tags=tree._children[0]._children
    i=0
    for tag in tags:
       if 'header' in tag.attrib and tag.attrib['header']==fields[i]['@header']:
            i+=1

       if 'protocol-type' in tag.attrib:
           fields[i-1]['protocol-type']=tag.attrib['protocol-type']

    pass


def loadConfigurations():
    directory = common.SITE_ROOT+'/config/'
    measurements=[]
    technologiesPlatforms=[]
    headers=[]

    config={'measurements':measurements}
    config['headers']=headers
    for root,dirs,files in os.walk(directory):
        for dir in dirs:
            configurations[dir]=config
            for root,dirs,files in os.walk(directory+dir):
                for file in files:
                    f=open(directory+dir+'/'+file)
                    strFile=f.read()
                    tree=ElementTree.XML(strFile)
                    o = xmltodict.parse(strFile)
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

                    parseFields(tree,fileconfig['field'])
                    headers.append({'name':measurement['@term-label']+','+tech,'fields':fileconfig['field']})

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
        global configurations
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


