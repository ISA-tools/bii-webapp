from django import template
from django.conf import settings

register = template.Library()

@register.filter
def cap(value):
    return value.upper()

@register.filter
def capFirstLetter(value):
    return value.title()