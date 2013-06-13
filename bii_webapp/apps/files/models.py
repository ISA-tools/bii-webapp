from django.db import models
from bii_webapp.settings.common import MEDIA_URL
from django.contrib.auth.models import User
import os
import stat

FILES_PATH=MEDIA_URL+'files/'

class ISATabFile(models.Model):

    def upload_to(self,filename):
        filefolder=filename[:filename.rindex('.')]
        return FILES_PATH+self.uploaded_by.username+'/'+filefolder+'/'+filename

    uploaded_by = models.ForeignKey(User, related_name='uploaded_by')
    access=models.ManyToManyField(User, related_name='access')
    isafile=models.FileField(upload_to=upload_to, max_length=10000)
    uploaded_date = models.DateTimeField(auto_now_add=True)