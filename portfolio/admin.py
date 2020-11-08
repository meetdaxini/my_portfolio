from django.contrib import admin
from .models import Project, Education, Cv

class cvAdmin(admin.ModelAdmin):
    list_display = ('id','pdf')

# Register your models here.
admin.site.register(Project)
admin.site.register(Education)
admin.site.register(Cv, cvAdmin)