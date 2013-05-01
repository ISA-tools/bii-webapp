from registration.backends.default import DefaultBackend
from forms import RegistrationFormWithUniqueEmailAndName
 
class CustomBackend(DefaultBackend):
    def get_form_class(self, request):
        return RegistrationFormWithUniqueEmailAndName
     
    def register(self,request,**kwargs):
        new_user = super(CustomBackend, self).register(request,**kwargs)
 
        #put them on the User model instead of the profile and save the user
        new_user.first_name = kwargs['first_name']
        new_user.last_name = kwargs['last_name']
        new_user.save()
 
        #return the User model
        return new_user