from django import forms
from registration.forms import RegistrationFormUniqueEmail
from django.utils.translation import ugettext_lazy as _
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
 
class RegistrationFormWithUniqueEmailAndName(RegistrationFormUniqueEmail):
    first_name = forms.RegexField(regex=r'^[\w.@+-]+$',
                                max_length=30,
                                widget=forms.TextInput(),
                                label=_("First Name"),
                                error_messages={'invalid': _("This value may contain only letters, numbers and @/./+/-/_ characters.")})
    last_name = forms.RegexField(regex=r'^[\w.@+-]+$',
                                max_length=30,
                                widget=forms.TextInput(),
                                label=_("Last Name"),
                                error_messages={'invalid': _("This value may contain only letters, numbers and @/./+/-/_ characters.")})

class ProfileForm(RegistrationFormWithUniqueEmailAndName):
    website = forms.RegexField(regex=r'^[\w.@+-]+$',
                                max_length=60,
                                widget=forms.TextInput(),
                                label=_("Website"),
                                error_messages={'invalid': _("This value may contain only letters, numbers and @/./+/-/_ characters.")})
    company = forms.RegexField(regex=r'^[\w.@+-]+$',
                                max_length=30,
                                widget=forms.TextInput(),
                                label=_("Company"),
                                error_messages={'invalid': _("This value may contain only letters, numbers and @/./+/-/_ characters.")})
    
    def validateWebsite(self,website):
        validate = URLValidator(verify_exists=True)
        try:
            validate('http://www.somelink.com/to/my.pdf')
        except ValidationError, e:
            raise forms.ValidationError(_(e))
        