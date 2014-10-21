from django import forms
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from models import UserProfile

class UserForm(forms.ModelForm):
    class Meta:
                model = User
                exclude=('last_login','date_joined','is_active','is_superuser','is_staff')
                
    username = forms.CharField(widget=forms.TextInput(attrs={'readonly':'readonly'}))
    
    password = forms.CharField(widget=forms.PasswordInput(attrs={'readonly':'readonly','value':'00000000000000000'}))
        
    first_name = forms.RegexField(regex=r'^[\w.@+-]+$',
                                max_length=30,
                                required=False,
                                widget=forms.TextInput(),
                                label=_("First Name"),
                                error_messages={'invalid': _("This value may contain only letters, numbers and @/./+/-/_ characters.")})
    last_name = forms.RegexField(regex=r'^[\w.@+-]+$',
                                max_length=30,
                                required=False,
                                widget=forms.TextInput(),
                                label=_("Last Name"),
                                error_messages={'invalid': _("This value may contain only letters, numbers and @/./+/-/_ characters.")})
    
    email = forms.CharField(widget=forms.TextInput(attrs={'readonly':'readonly'}))


class ProfileForm(forms.ModelForm):
    class Meta:
                model = UserProfile
                exclude=['user']
                
    website=forms.URLField(label=_("Website"),
                           widget=forms.TextInput(),
                           required=False,
                           error_messages={'invalid': _("This value must be in the form of a website link")})
    
    company = forms.RegexField(regex=r'^[\w.@+-]+$',
                                required=False,
                                widget=forms.TextInput(),
                                label=_("Company"),
                                error_messages={'invalid': _("This value may contain only letters, numbers and @/./+/-/_ characters.")})
    
    
        