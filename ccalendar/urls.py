from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^$',views.index,name='index'),
	url(r'new',views.createEvent,name='newEvent'),
	url(r'edit',views.update,name='updateEvent'),
	url(r'eventDetails',views.retreive,name='readEvent'),
	url(r'delete',views.delete,name='deleteEvent')
]