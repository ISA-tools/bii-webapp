from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext

def index(request):
    #    todo: we can also load in latest standards added, blog posts, etc
    return render_to_response("index.html",context_instance=RequestContext(request))

def public_profile(request, username):
    userQuery = User.objects.filter(username=username)

    requestedUser = None

    loggedInUser = False

    if len(userQuery) > 0:
        requestedUser = userQuery.get(username=username)
        loggedInUser = (requestedUser == request.user)
    else:
        return render_to_response("information.html",
                                  {"header": "User does not exist",
                                   "message": "No user with the username " + username + " exists."},
                                  context_instance=RequestContext(request))

    profile = None

    try:
        if not requestedUser.get_profile() is None:
            profile = requestedUser.get_profile()
    except:
        profile = UserProfile(user=requestedUser)
        profile.save()

    bioDBCoreApprovals, bioDBCoreOwnerships, biodbcore, policies, policyApprovals, policyOwnerships, standardApprovals, standardOwnerships, standards = getProfileContent(
        request, requestedUser)

    return render_to_response("profile.html",
                              {"loggedInUser": loggedInUser, "profile": profile, "standards": standards,
                               "biodbcore": biodbcore, "policies": policies, "biodbcore_approval": [],
                               "standard_approval": [],
                               "policy_approval": [], "biodbcore_ownerships": [],
                               "policy_ownerships": [], "standard_ownerships": []},
                              context_instance=RequestContext(request))


def private_profile(request):
    requestedUser = None
    loggedInUser = False

    if request.user.is_authenticated:
        requestedUser = request.user
        loggedInUser = True
    else:
        return render_to_response("information.html",
                                  {"header": "You must be logged in to view this page",
                                   "message": "Please log in before attempting to view this content."},
                                  context_instance=RequestContext(request))

    profile = None

    try:
        if not requestedUser.get_profile() is None:
            profile = requestedUser.get_profile()
    except:
        profile = UserProfile(user=requestedUser)
        profile.save()

    bioDBCoreApprovals, bioDBCoreOwnerships, biodbcore, policies, policyApprovals, policyOwnerships, standardApprovals, standardOwnerships, standards = getProfileContent(
        request, requestedUser)

    return render_to_response("profile.html",
                              {"loggedInUser": loggedInUser, "profile": profile, "standards": standards,
                               "biodbcore": biodbcore, "policies": policies,
                               "biodbcore_ownerships": bioDBCoreOwnerships,
                               "policy_ownerships": policyOwnerships, "standard_ownerships": standardOwnerships,
                               "biodbcore_approval": bioDBCoreApprovals, "standard_approval": standardApprovals,
                               "policy_approval": policyApprovals},
                              context_instance=RequestContext(request))

#returns the orcid profile for a given user
def orcid_profile(request):
    orcid = request.GET['orcid']

    request = urllib2.Request('http://pub.orcid.org/' + orcid + "/orcid-bio",
                              headers={"Accept": "application/orcid+json"})
    response = urllib2.urlopen(request).read()

    return HttpResponse(response, mimetype='application/json')
