from django.contrib import admin
from .models import Project, Education, Cv, Tool, Project_tool


class cvAdmin(admin.ModelAdmin):
    list_display = ('id', 'pdf')


# Register your models here.
admin.site.register(Project)
admin.site.register(Tool)
admin.site.register(Project_tool)
admin.site.register(Education)
admin.site.register(Cv, cvAdmin)
