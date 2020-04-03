# Introduction

Client Tracker is a Django app to keep track of clients visiting your website. 
Client IP, and location is fetched using a client-side script. Every 10 minutes
the script pings the server to inform that the client is still on the site.

## Prerequisites

- Django 2.0+

## Installation

- Copy "clienttracker" application to your project folder 
- Add "clienttracker" to your INSTALLED_APPS setting like this::

    INSTALLED_APPS = [
        ...
        'clienttracker',
    ]
- Include the clienttracker URLconf in your project urls.py like this::
    path('ticker/', include('clienttracker.urls'))
- Run "python manage.py migrate" to create the clienttracker models.
- Include tracer.js in base.html at the bottom of the page. If you do not use base.html you will need
   to include the js in every html file separately.
   
   <script src="{% static 'js/tracer.js' %}"></script>
- Start the development server and visit http://127.0.0.1:8000/. 

## Known Problems

- As of now the data is not represented in any format, it is only saved in database.
- There is an issue with logging (inside views.py) which was identified when it was put in pythonanywhere.com. Logging was removed from it since. 
