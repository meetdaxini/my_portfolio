from django.db import models
# Create your models here.


class Project(models.Model):
    title = models.CharField(max_length=100)
    demo_link = models.URLField(blank=True)
    github_link = models.URLField(blank=True)
    img = models.ImageField(upload_to='portfolio/images/')
    order = models.IntegerField(default=0)
    tools = models.ManyToManyField('Tool', through='Project_tool')

    def __str__(self):
        return self.title


class Tool(models.Model):
    name = models.CharField(max_length=40)
    img = models.ImageField(upload_to='portfolio/images/')
    projects = models.ManyToManyField('Project', through='Project_tool')
    link = models.URLField(blank=True)

    def __str__(self):
        return self.name


class Project_tool(models.Model):
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        string = "{0} uses {1}".format(self.project.title, self.tool.name)
        return string


class Education(models.Model):
    institute = models.CharField(max_length=100)
    course_title = models.CharField(max_length=100)
    course_time = models.CharField(max_length=100)
    description = models.CharField(max_length=100, blank=True)
    link = models.URLField(blank=True)

    # YEAR_CHOICES = [(y,y) for y in range(2000, datetime.date.today().year+3)]
    # MONTH_CHOICE = [(m,m) for m in range(0,13)]

    # start_year = models.IntegerField(choices=YEAR_CHOICES,
    #              default=datetime.datetime.now().year,)
    # start_month = models.IntegerField(choices=MONTH_CHOICE,
    #               default=datetime.datetime.now().month,)
    # end_year = models.IntegerField(choices=YEAR_CHOICES,
    #            default=datetime.datetime.now().year,)
    # end_month = models.IntegerField(choices=MONTH_CHOICE,
    #             default=datetime.datetime.now().month,)

    # @property
    # def start_date(self):
    #     if self.start_year and self.start_month:
    #         return datetime.date(self.start_year, self.start_month)
    #     elif self.start_year:
    #         return datetime.date(self.start_year)
    #     else:
    #         return None

    # @property
    # def end_date(self):
    #     if self.end_year and self.end_month:
    #         return datetime.date(self.end_year, self.end_month)
    #     elif self.end_year:
    #         return datetime.date(self.end_year)
    #     else:
    #         return None

    def __str__(self):
        return self.course_title

