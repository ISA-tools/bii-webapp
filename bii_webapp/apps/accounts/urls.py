from django.conf.urls import *
from django.views.generic.base import TemplateView
from registration.forms import RegistrationFormUniqueEmail
from registration.views import activate
from views import profile

urlpatterns = patterns('',
                         url('register/$', 'registration.views.register',
                         {'form_class': RegistrationFormUniqueEmail,
                         'backend': 'registration.backends.default.DefaultBackend'},
                         name='registration_register'),
                       url(r'^activate/complete/$',
                           TemplateView.as_view(template_name='registration/activation_complete.html'),
                           name='registration_activation_complete'),
                       # Activation keys get matched by \w+ instead of the more specific
                       # [a-fA-F0-9]{40} because a bad activation key should still get to the view;
                       # that way it can return a sensible "invalid key" message instead of a
                       # confusing 404.
                       url(r'^activate/(?P<activation_key>\w+)/$',
                           activate,
                           {'backend': 'registration.backends.default.DefaultBackend'},
                           name='registration_activate'),
                       url(r'^register/complete/$',
                           TemplateView.as_view(template_name='registration/registration_complete.html'),
                           name='registration_complete'),
                       url(r'^register/closed/$',
                           TemplateView.as_view(template_name='registration/registration_closed.html'),
                           name='registration_disallowed'),
                       (r'', include('registration.auth_urls')),
                       
                       url(r'^email/change/$', 'email_change.views.email_change_view', name='email_change'),
                       url(r'^email/verification/sent/$',
                           TemplateView.as_view(template_name='email_change/email_verification_sent.html'),
                           name='email_verification_sent'),
                        # Note taken from django-registration
                        # Verification keys get matched by \w+ instead of the more specific
                        # [a-fA-F0-9]{40} because a bad verification key should still get to the view;
                        # that way it can return a sensible "invalid key" message instead of a
                        # confusing 404.
                        url(r'^email/verify/(?P<verification_key>\w+)/$', 'email_change.views.email_verify_view', name='email_verify'),
                        url(r'^email/change/complete/$',
                            TemplateView.as_view(template_name='email_change/email_change_complete.html'),
                            name='email_change_complete'),
                       
                       url(r'^password/change/$',
                            TemplateView.as_view(template_name='registration/password_change_form.html'),
                            name='password_change'),
                       
                       url(r'^profile/$',profile,
                          name='accounts.profile'),
                       )