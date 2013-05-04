from django import forms
from registration.forms import RegistrationFormUniqueEmail
from django.utils.translation import ugettext_lazy as _
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from models import UserProfile

class UserForm(forms.ModelForm):
    class Meta:
                model = User
                exclude=('password','last_login','date_joined','is_active','is_superuser','is_staff')
                
    username = forms.CharField(widget=forms.TextInput(attrs={'readonly':'readonly'}))
        
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
    
    email = forms.RegexField(regex=r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$',
                                max_length=50,
                                required=True,
                                widget=forms.TextInput(),
                                label=_("Email"),
                                error_messages={'invalid': _("This value must be a valid email address.")})
    
    ''' Called by django form validation to validate email '''
    def clean_email(self):
        curremail=self.cleaned_data['email']
        username = self.cleaned_data["username"]
        user=User.objects.get(username=username)
        if user.email!=curremail and User.objects.filter(email=curremail):
            raise forms.ValidationError(_("This email address is already in use. Please supply a different email address."))
        return curremail
    

class ProfileForm(forms.ModelForm):
    class Meta:
                model = UserProfile
                exclude=('user')
                
    website=forms.URLField(label=_("Website"),
                           widget=forms.TextInput(),
                           required=False,
                           error_messages={'invalid': _("This value must be in the form of a website link")})
    
    company = forms.RegexField(regex=r'^[\w.@+-]+$',
                                required=False,
                                widget=forms.TextInput(),
                                label=_("Company"),
                                error_messages={'invalid': _("This value may contain only letters, numbers and @/./+/-/_ characters.")})
    
    
        