from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'new', views.createEvent, name='newEvent'),
    url(r'edit', views.update, name='updateEvent'),
    url(r'eventDetails', views.retrieve, name='readEvent'),
    url(r'delete', views.delete, name='deleteEvent'),
    url(r'sync', views.googleSync, name='sync'),
    url(r'authcallback', views.auth_return, name='authSuccess'),
    url(r'events/(?P<month>\d{2})/(?P<year>\d{4})', views.events, name='events')
]
