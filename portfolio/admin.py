from django.contrib import admin
from .models import Project, Education, Tool, Project_tool

# Register your models here.
admin.site.register(Project)
admin.site.register(Tool)
admin.site.register(Project_tool)
admin.site.register(Education)
