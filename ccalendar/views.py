import os

from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseBadRequest
from django.http import HttpResponseRedirect

from django.contrib.auth.decorators import login_required
from ccalendar.models import *
from CalendarApp import settings
from oauth2client.contrib import xsrfutil
from oauth2client.client import flow_from_clientsecrets
from oauth2client.contrib.django_util.storage import DjangoORMStorage
from googleapiclient.discovery import build

SCOPES = 'https://www.googleapis.com/auth/calendar'
CLIENT_SECRETS = os.path.join(os.path.dirname(__file__), '..', 'client_secrets.json')

FLOW = flow_from_clientsecrets(
        CLIENT_SECRETS,
        SCOPES,
        redirect_uri='http://localhost:8000/ccalendar/')

def index(request):
	return HttpResponse("Hello, this is ccalendar index")

def events(request, month, year):
        return HttpResponse("year is" + year + " and month is " + month)

def createEvent(request):
	return HttpResponse("Hello, this is ccalendar create")

def update(request):
        print "here yo"
	return HttpResponse("Hello, this is ccalendar update")

def retrieve(request):
	return HttpResponse("Hello, this is ccalendar retrieve")

def delete(request):
	return HttpResponse("Hello, this is ccalendar delete")

def googleSync(request):
        U = User(
                username = 'example',
                firstname= 'Bla Bla',
                lastname= 'Bla Blaq',
                email = 'example@gmail.com'
        )
        U.save()
        storage = DjangoORMStorage(CredentialsModel, 'id', U, 'credential')
        credential = storage.get()
        if credential is None or credential.invalid == True:
                FLOW.params['state'] = xsrfutil.generate_token(settings.SECRET_KEY, U)
                authorize_url = FLOW.step1_get_authorize_url()
                return HttpResponseRedirect(authorize_url)


def auth_return(request):
  if not xsrfutil.validate_token(settings.SECRET_KEY, request.REQUEST['state'],
                                 request.user):
    return  HttpResponseBadRequest()
  credential = FLOW.step2_exchange(request.REQUEST)
  storage = Storage(CredentialsModel, 'id', request.user, 'credential')
  storage.put(credential)
  return HttpResponse("Success logging in!")

