from django.db import models
from django.contrib.auth.models import User
from django.core.validators import URLValidator
# class B(models.Model):
#     b1=models.CharField(max_length=200)
#  
# class UserProfile(models.Model):
#     user = models.ForeignKey(User, unique=True)
#     url = models.URLField("Website", blank=True)
#     company = models.CharField(max_length=50, blank=True)