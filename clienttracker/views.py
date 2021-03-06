from .models import ClientTrace, LoginTimes
from django.http import HttpResponse
import logging
from django.conf import settings

logging.config.dictConfig({
    'version': 1,
    'handlers': {
        'ticker_handler': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            # Modify file location
            'filename': '/logs/ticker.log'
        }
    },
    'loggers': {
        'ticker_log': {
            'level': 'INFO',
            'handlers': ['ticker_handler']
        }
    }

})

logger = logging.getLogger('ticker_log')


def ticker(request):
    if 'client-sid' in request.COOKIES:
        sid = request.COOKIES['client-sid']
        # if cookies are not present
        if not ClientTrace.objects.filter(sessionID=sid).exists():
            ip = ''
            city = ''
            region = ''
            country = ''
            latitude = None
            longitude = None
            # if client information has been fetched successfully
            if 'client-ip' in request.COOKIES:
                ip = request.COOKIES['client-ip']
                city = request.COOKIES['client-city']
                region = request.COOKIES['client-region']
                country = request.COOKIES['client-country-name']
                latitude = request.COOKIES['client-latitude']
                longitude = request.COOKIES['client-longitude']
            client = ClientTrace.objects.create(sessionID=sid, ip_address=ip,
                                                city=city, region=region,
                                                country=country,
                                                latitude=latitude,
                                                longitude=longitude)
        else:
            client = ClientTrace.objects.get(sessionID=sid)
        logintime = LoginTimes.objects.create(client=client)
        print('time to log it')
        logger.info(str(logintime))
    return HttpResponse('Saved')


def frequency(request):
    if hasattr(settings, 'CLIENT_TRACKER_FREQUENCY') and isinstance(settings.CLIENT_TRACKER_FREQUENCY, int):
        freq = settings.CLIENT_TRACKER_FREQUENCY
        if freq < 0:
            return HttpResponse('1')
        elif freq > 24 * 60:
            return HttpResponse('1440')
        else:
            return HttpResponse(str(freq))
    else:
        return HttpResponse('10')
