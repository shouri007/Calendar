from __future__ import unicode_literals

from django.db import models

from oauth2client.contrib.django_util.models import CredentialsField
from django.contrib.auth.models import User

class User(models.Model):
	username=models.CharField(max_length=200,primary_key=True)
	firstname=models.CharField(max_length=20)
	lastname=models.CharField(max_length=20)
	email = models.EmailField()

	def __str__(self):
		return self.username

class Event(models.Model):
	name = models.CharField(max_length = 1000)
	location = models.CharField(max_length = 10000)
	starttime = models.DateTimeField('start time')
	endtime = models.DateTimeField('End time')
	description = models.CharField(max_length = 1000000)

	def __str__(self):
		return self.name

class CredentialsModel(models.Model):
  id = models.ForeignKey(User, primary_key=True)
  credential = CredentialsField()
