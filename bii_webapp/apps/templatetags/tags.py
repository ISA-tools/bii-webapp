from django import template
from django.conf import settings
import json
from django.template import Library

register = template.Library()

@register.filter
def cap(value):
    return value.upper()

@register.filter
def capFirstLetter(value):
    return value.title()

@register.filter
def jsonify(object):
    return escape(json.dumps(object))

def escape(value):
    value = value.replace("\'", "\\'")
    value = value.replace("\\n", "\\\\n")
    value = value.replace("\\t", "\\\\t")
    return value

register.filter('jsonify', jsonify)