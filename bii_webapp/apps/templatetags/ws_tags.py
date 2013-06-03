from django import template
from django.conf import settings

register = template.Library()

@register.simple_tag
def ws_url():
    return settings.WEBSERVICES_URL
