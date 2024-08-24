import mainint.views 
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('',mainint.views.homepage),
    path('add_ip_to_firewall/', mainint.views.add_ip_to_firewall, name='add_ip_to_firewall'),
    path('getserverip/',mainint.views.getserverip,name='getserverip')
]
