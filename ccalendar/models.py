from __future__ import unicode_literals

from django.db import models

class Event(models.Model):
	name = models.CharField(max_length = 1000)
	location = models.CharField(max_length = 10000)
	starttime = models.DateTimeField('start time')
	endtime = models.DateTimeField('End time')
	description = models.CharField(max_length = 1000000)

