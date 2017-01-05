import os
import httplib2
import datetime
import calendar

from django.views.decorators.csrf import csrf_protect
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
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
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


FLOW = flow_from_clientsecrets(
        CLIENT_SECRETS,
        SCOPES,
        redirect_uri='http://localhost:8000/ccalendar/authcallback')

U = User(
        username = 'example',
        firstname= 'default',
        lastname= 'default',
        email = 'example@gmail.com'
)

@csrf_protect
def index(request):
        return render(request, "ccalendar/templates/index.html", {})

@csrf_protect
def events(request, month, year):
        month = int(month)
        year = int(year)
        storage = DjangoORMStorage(CredentialsModel, 'id', U, 'credential')
        credential = storage.get()
        http = httplib2.Http()
        http = credential.authorize(http)
        service = build('calendar', 'v3', http=http)
        monthStart = datetime.datetime(year, month, 1, 00, 00).isoformat() + 'Z'
        lastDate = calendar.monthrange(year, month)[1]
        monthEnd = datetime.datetime(year, month, lastDate, 23, 00).isoformat() + 'Z'

        eventsResult = service.events().list(
                calendarId='primary', timeMin=monthStart, timeMax=monthEnd, maxResults=15,
                singleEvents=True, orderBy='startTime').execute()
        events = eventsResult.get('items', [])
        eventsArr = []
        for event in events:
                start = event['start'].get('dateTime', event['start'].get('date'))
                end = event['end'].get('dateTime', event['end'].get('date'))
                title = event['summary']
                description = event.get('description', "Not Available")
                where = event.get('location', 'Not Available')
                item = {
                        'start': start,
                        'end': end,
                        'title': title,
                        'description': description,
                        'location': where
                }
                eventsArr.append(item);

        res = {}
        res['result'] = 'SUCCESS'
        res['data'] = eventsArr

        return JsonResponse(res)

@csrf_protect
def createEvent(request):
  print("hello")
  return render(request,"ccalendar/index.html")

@csrf_protect
def update(request):
  
	return HttpResponse("Hello, this is ccalendar update")

@csrf_protect
def retrieve(request):
	return HttpResponse("Hello, this is ccalendar retrieve")

@csrf_protect
def delete(request):
	return HttpResponse("Hello, this is ccalendar delete")

@csrf_protect
def googleSync(request):
        U = User(
                username = 'example',
                firstname= 'default',
                lastname= 'default',
                email = 'example@gmail.com'
        )
        U.save()
        storage = DjangoORMStorage(CredentialsModel, 'id', U, 'credential')
        credential = storage.get()
        if credential is None or credential.invalid == True:
                FLOW.params['state'] = xsrfutil.generate_token(settings.SECRET_KEY, U)
                authorize_url = FLOW.step1_get_authorize_url()
                return HttpResponseRedirect(authorize_url)
        return HttpResponseRedirect('/ccalendar')

def auth_return(request):
  if not xsrfutil.validate_token(settings.SECRET_KEY, (request.GET['state']).encode('utf-8'), U):
    return  HttpResponseBadRequest()
  credential = FLOW.step2_exchange(request.GET)
  storage = DjangoORMStorage(CredentialsModel, 'id', U, 'credential')
  storage.put(credential)
  return HttpResponseRedirect('/ccalendar')

