from accounts.forms import ProfileForm,UserForm
from models import UserProfile
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect,render,render_to_response

@login_required
def edit_profile(request):
    user = request.user
    profile,created=UserProfile.objects.get_or_create(user=user)
    
    if request.method=='POST':
        profileform = ProfileForm(request.POST,instance=profile)
        userform = UserForm(request.POST,instance=user)
        if profileform.is_valid() and userform.is_valid():
            profileform.save()
            userform.save()
            return redirect('main.views.index')
    else:
        profileform=ProfileForm(instance=profile)
        userform=UserForm(instance=user)
        
        return render(request,'profiles/edit_profile.html',{'profileform':profileform,'userform':userform})
    
    return render(request,'profiles/edit_profile.html',{'profileform':profileform,'userform':userform})
    