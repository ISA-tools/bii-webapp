import django_tables2 as tables
from models import ISATabFile

class FilesTable(tables.Table):
    # name = tables.TemplateColumn('<a href="asdsa">asdsa</a>')
    class Meta:
        model = ISATabFile
        order_by='-uploaded_by'
        # access=tables.Column(model.access.all())
        # exclude = ("id", )
        # add class="paleblue" to <table> tag
        attrs = {"class": "paleblue"}