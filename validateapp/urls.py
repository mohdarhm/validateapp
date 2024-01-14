import mainint.views 
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',mainint.views.homepage),
    path('get_user_ip/', mainint.views.get_user_ip, name='get_user_ip'),
    path('add_ip_to_firewall/', mainint.views.add_ip_to_firewall, name='add_ip_to_firewall'),
    path('getserverip/',mainint.views.getserverip,name='getserverip')
]
