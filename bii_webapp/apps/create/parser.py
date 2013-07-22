import xmltodict
import xml.etree.ElementTree as ElementTree
import xmltodict
from bii_webapp.settings import common
import os
import csv

configurations = {}

def loadConfigurations():
    directory = common.SITE_ROOT + '/config/'
    for root, dirs, files in os.walk(directory):
        for dir in dirs:

            measurements = []
            technologiesPlatforms = []
            headers = []
            sampleHeaders=[]
            config={}
            config ['measurements']= measurements
            config['headers'] = headers
            config['sampleHeaders'] = sampleHeaders
            configurations[dir] = config

            for root, dirs, files in os.walk(directory + dir):
                for file in files:
                    f = open(directory + dir + '/' + file)
                    strFile = f.read()
                    tree = ElementTree.XML(strFile)
                    o = xmltodict.parse(strFile)
                    configFile = o['isatab-config-file']
                    fileconfig = configFile['isatab-configuration']
                    if '@isatab-assay-type' not in fileconfig:
                        if '@table-name' in fileconfig and fileconfig['@table-name']=='studySample':
                            parseFields(tree,fileconfig['field'])
                            sampleHeaders.append({'name': '[Sample]','fields':fileconfig['field']})
                            continue
                        else:
                            continue
                    measurement = fileconfig['measurement']
                    measurementObj = next((m for m in measurements if m['measurement'] == measurement['@term-label']),
                                          None)
                    if measurementObj == None:
                        measurementObj = {'measurement': measurement['@term-label']}
                        measurements.append(measurementObj)

                    technology = fileconfig['technology']
                    tech = technology['@term-label']
                    if tech == '':
                        tech = 'no technology required'

                    parseFields(tree, fileconfig['field'])
                    headers.append({'name': measurement['@term-label'] + ',' + tech, 'fields': fileconfig['field']})

                    techObj = next((t for t in technologiesPlatforms if t['technology'] == tech), None)
                    if techObj == None:
                        techObj = {'technology': tech}
                        if tech == 'no technology required':
                            techObj['platforms'] = ['Not Available']
                        technologiesPlatforms.append(techObj)

                    if 'technologies' in measurementObj:
                        measurementObj['technologies'].append(techObj)
                    else:
                        measurementObj['technologies'] = [techObj]

    f = open(directory + 'platforms.xml')
    o = xmltodict.parse(f)
    for techType in o['technology-platforms']['technology']:
        type = techType['@type'].replace('Section[', '')[:-1].lower();
        platforms = []
        if techType['platforms'] != None:
            for plat in techType['platforms']['platform']:
                if plat['machine'] != None:
                    platforms.append(plat['machine'] + ' (' + plat['vendor'] + ')')
                else:
                    platforms.append(plat['vendor'])
        else:
            platforms = ['Not Available']
        for techObj in technologiesPlatforms:
            if type in techObj['technology']:
                techObj['platforms'] = platforms


def parseFields(tree, fields):
    tags = tree._children[0]._children
    i = 0
    for tag in tags:
        type = tag.tag[tag.tag.rindex('}') + 1:]
        if 'header' in tag.attrib and tag.attrib['header'] == fields[i]['@header']:
            i += 1

        if type != 'field' and 'field' in type:
            fields[i - 1][type] = tag.attrib


def writeInvestigation(f,investigation):
    f.writerow(['ONTOLOGY SOURCE REFERENCE'])
    f.writerow(['Term Source Name']+['""'])
    f.writerow(['Term Source File']+['""'])
    f.writerow(['Term Source Version']+['""'])
    f.writerow(['Term Source Description']+['""'])
    f.writerow(['INVESTIGATION'])
    f.writerow(['Investigation Identifier']+['"'+investigation['i_id']+'"'])
    f.writerow(['Investigation Title']+['"'+investigation['i_title']+'"'])
    f.writerow(['Investigation Description']+['"'+investigation['i_description']+'"'])
    f.writerow(['Investigation Submission Date']+['"'+investigation['i_submission_date']+'"'])
    f.writerow(['Investigation Public Release Date']+['"'+investigation['i_public_release_date']+'"'])


def writeSpreadsheet(directory,filename,spreadsheet):
    csvWriter = csv.writer(open(directory+'/'+filename, "wb+"), delimiter='\t', quotechar='"', quoting=csv.QUOTE_ALL)
    unOrderedHeaders=spreadsheet[0].keys()
    headers=[None]*len(unOrderedHeaders)
    for header in unOrderedHeaders:
        row=header[header.rindex('_'):]
        row=(int)(row.replace('_row',''))
        header=header[:header.rindex('_')]
        headers[row]=header;
    csvWriter.writerow(headers)

    for row in spreadsheet:
        csvWriter.writerow(row.values())



def writeStudy(f,study,directory):
    f.writerow(['STUDY'])
    f.writerow(['Study Identifier']+['"'+study['s_id']+'"'])
    f.writerow(['Study Title']+['"'+study['s_title']+'"'])
    f.writerow(['Study Description']+['"'+study['s_description']+'"'])
    f.writerow(['Comment[Study Grant Number]']+['"'+study['s_grand_number']+'"'])
    f.writerow(['Comment[Study Funding Agency]']+['"'+study['s_funding_agency']+'"'])
    f.writerow(['Study Submission Date']+['"'+study['s_submission_date']+'"'])
    f.writerow(['Study Public Release Date']+['"'+study['s_public_release_date']+'"'])
    f.writerow(['Study File Name']+['""'])
    f.writerow(['STUDY DESIGN DESCRIPTORS'])
    f.writerow(['Study Design Type']+['""'])
    f.writerow(['Study Design Type Term Accession Number']+['""'])
    f.writerow(['Study Design Type Term Source REF']+['""'])
    writeSpreadsheet(directory,study['s_sample_filename'],study['s_spreadsheet'])

def writePubsFor(f, pubs,forStr):
    author_list=[]
    doi=[]
    status=[]
    title=[]
    pub_med_id=[]
    accession=[]
    refs=[]

    for pub in pubs:
        pub_med_id.append('"'+pub['pub_med_id']+'"')
        doi.append('"'+pub['pub_doi']+'"')
        author_list.append('"'+pub['pub_author_list']+'"')
        title.append('"'+pub['pub_title']+'"')
        status.append('"'+pub['pub_status']+'"')
        accession.append('"'+''+'"')
        refs.append('"'+''+'"')

    f.writerow([forStr.upper()+' PUBLICATIONS'])
    f.writerow([forStr+' PubMed ID']+pub_med_id)
    f.writerow([forStr+' Publication DOI']+doi)
    f.writerow([forStr+' Publication Author List']+author_list)
    f.writerow([forStr+' Publication Title']+title)
    f.writerow([forStr+' Publication Status']+status)
    f.writerow([forStr+' Publication Status Term Accession Number']+accession)
    f.writerow([forStr+' Publication Status Term Source REF']+refs)


def writeContactsFor(f, contacts,forStr):
    lastNames=[]
    firstNames=[]
    midInitials=[]
    emails=[]
    phones=[]
    fax=[]
    addresses=[]
    affiliations=[]
    roles=[]
    accession=[]
    refs=[]
    for contact in contacts:
        lastNames.append('"'+contact['person_last_name']+'"')
        firstNames.append('"'+contact['person_first_name']+'"')
        midInitials.append('"'+contact['person_mid_initials']+'"')
        emails.append('"'+contact['person_email']+'"')
        phones.append('"'+contact['person_phone']+'"')
        fax.append('"'+contact['person_fax']+'"')
        addresses.append('"'+contact['person_address']+'"')
        affiliations.append('"'+contact['person_affiliation']+'"')
        roles.append('"'+contact['person_roles']+'"')
        accession.append('"'+''+'"')
        refs.append('"'+contact['person_ref']+'"')


    f.writerow([forStr.upper()+' CONTACTS'])
    f.writerow([forStr+' Person Last Name']+lastNames)
    f.writerow([forStr+' Person First Name']+firstNames)
    f.writerow([forStr+' Person Mid Initials']+midInitials)
    f.writerow([forStr+' Person Email']+emails)
    f.writerow([forStr+' Person Phone']+phones)
    f.writerow([forStr+' Person Fax']+fax)
    f.writerow([forStr+' Person Address']+addresses)
    f.writerow([forStr+' Person Affiliation']+affiliations)
    f.writerow([forStr+' Person Roles']+roles)
    f.writerow([forStr+' Person Roles Term Accession Number']+accession)
    f.writerow([forStr+' Person Roles Term Source REF']+refs)

def writeFactors(f, factors):
    name=[]
    type=[]
    accession=[]
    refs=[]
    for factor in factors:
        name.append('"'+factor['factor_name']+'"')
        type.append('"'+factor['factor_type']+'"')
        accession.append('""')
        refs.append('""')

    f.writerow(['STUDY FACTORS'])
    f.writerow(['Study Factor Name']+name)
    f.writerow(['Study Factor Type']+type)
    f.writerow(['Study Factor Type Term Accession Number']+accession)
    f.writerow(['Study Factor Type Term Source REF']+refs)

def writeAssays(f, assays,directory):
    filename=[]
    mtype=[]
    maccession=[]
    mrefs=[]
    ttype=[]
    taccession=[]
    trefs=[]
    platform=[]
    for assay in assays:
        filename.append('"'+assay['filename']+'"')
        mtype.append('"'+assay['measurement']+'"')
        maccession.append('""')
        mrefs.append('""')
        ttype.append('"'+assay['technology']+'"')
        taccession.append('""')
        trefs.append('""')
        platform.append('"'+assay['platform']+'"')

    f.writerow(['STUDY ASSAYS'])
    f.writerow(['Study Assay File Name']+filename)
    f.writerow(['Study Assay Measurement Type']+mtype)
    f.writerow(['Study Assay Measurement Type Term Accession Number']+maccession)
    f.writerow(['Study Assay Measurement Type Term Source REF']+mrefs)
    f.writerow(['Study Assay Technology Type']+filename)
    f.writerow(['Study Assay Technology Type Term Accession Number']+ttype)
    f.writerow(['Study Assay Technology Type Term Source REF']+taccession)
    f.writerow(['Study Assay Technology Platform']+platform)
    writeSpreadsheet(directory,assay['filename'],assay['spreadsheet'])

def writeProtocols(f, protocols):
    name=[]
    type=[]
    accession=[]
    refs=[]
    description=[]
    uri=[]
    version=[]
    pname=[]
    paccession=[]
    prefs=[]
    cname=[]
    ctype=[]
    caccession=[]
    crefs=[]

    for protocol in protocols:
        name.append('"'+protocol['protocol_name']+'"')
        type.append('"'+protocol['protocol_type']+'"')
        accession.append('""')
        refs.append('""')
        description.append('"'+protocol['protocol_description']+'"')
        uri.append('"'+protocol['protocol_uri']+'"')
        version.append('"'+protocol['protocol_version']+'"')
        pname.append('"'+protocol['protocol_parameters_name']+'"')
        paccession.append('""')
        prefs.append('""')
        cname.append('"'+protocol['protocol_components_name']+'"')
        ctype.append('"'+protocol['protocol_components_type']+'"')
        caccession.append('""')
        crefs.append('""')

    f.writerow(['STUDY PROTOCOLS'])
    f.writerow(['Study Protocol Name']+name)
    f.writerow(['Study Protocol Type']+type)
    f.writerow(['Study Protocol Type Term Accession Number']+accession)
    f.writerow(['Study Protocol Type Term Source REF']+refs)
    f.writerow(['Study Protocol Description']+description)
    f.writerow(['Study Protocol URI']+uri)
    f.writerow(['Study Protocol Version']+version)
    f.writerow(['Study Protocol Parameters Name']+pname)
    f.writerow(['Study Protocol Parameters Name Term Accession Number']+paccession)
    f.writerow(['Study Protocol Parameters Name Term Source REF']+prefs)
    f.writerow(['Study Protocol Components Name']+cname)
    f.writerow(['Study Protocol Components Type']+ctype)
    f.writerow(['Study Protocol Components Type Term Accession Number']+caccession)
    f.writerow(['Study Protocol Components Type Term Source REF']+crefs)