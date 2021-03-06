var debug = true;
var information;

// this is the frequency (in minutes) at which the server will be pinged.
// the frequency is configured by setting a new variable "CLIENT_TRACKER_FREQUENCY"
// in project's settings.py file. If unset, default value will be 10.
// value for "CLIENT_TRACKER_FREQUENCY" should be an integer between value 1 and
// 24 * 60 = 1440.
var frequency = 10;
var ticker_handler;
// modify this if you want specific url
var ticker_url = document.location.origin + '/ticker/';

// get client info from 3rd party API
function getClientInfo()
{
    $.getJSON('https://ipapi.co/json/', function(data) {
        information = data;
    });
}
getClientInfo();

// generate random SID
function generateSID()
{
    var id = ""
    for(var i = 0; i < 70; i++)
    {
        var r = Math.floor(Math.random() * 2);
        id += String.fromCharCode(65 + r * 32 + Math.floor(Math.random() * 26));
    }
    return id;
}

// get cookie by name
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

// create a persistent with expiry time
function createCookie(cookieName,cookieValue,daysToExpire)
{
  var date = new Date();
  date.setTime(date.getTime()+(daysToExpire*24*60*60*1000));
  document.cookie = cookieName + "=" + cookieValue + "; expires=" + date.toGMTString();
}

// Handles all tracing activity
function tracer()
{
    // if this is first time visiting the site
    if(getCookie('client-sid') == undefined)
    {
        var sk_sid = generateSID();
        createCookie('client-sid', sk_sid, 100 * 365);

        // if for some reason client info could not be fetched
        if(information == undefined || information == null)
        {
            createCookie('client-ip', null, 100 * 365);
            createCookie('client-city', null, 100 * 365);
            createCookie('client-region', null, 100 * 365);
            createCookie('client-country-name', null, 100 * 365);
            createCookie('client-latitude', null, 100 * 365);
            createCookie('client-longitude', null, 100 * 365);

            // attempt to get client info for next time
            getClientInfo();
        }
        else
        {
            createCookie('client-ip', information.ip, 100 * 365);
            createCookie('client-city', information.city, 100 * 365);
            createCookie('client-region', information.region, 100 * 365);
            createCookie('client-country-name', information.country_name, 100 * 365);
            createCookie('client-latitude', information.latitude, 100 * 365);
            createCookie('client-longitude', information.longitude, 100 * 365);
        }
        if(debug)
        console.log('cookies saved');
    }
    if(debug)
    console.log(information);
}

// ticker pings the server with status every 10 minutes
function ticker(){
    if(debug)
    console.log('tick');
    $.getJSON(ticker_url, function(data) {});
    ticker_handler = setTimeout(ticker, frequency * 60 * 1000);
    $.getJSON(ticker_url + 'frequency/', function(data) {
        if(isNaN(data))
        {
            frequency = 10;
        }
        else
        {
            try
            {
                new_frequency = parseInt(data);
                if(new_frequency != frequency)
                {
                    frequency = parseInt(data);
                    clearTimeout(ticker_handler);
                    ticker_handler = setTimeout(ticker, frequency * 60 * 1000);
                    if(debug)
                    {
                        console.log('timeout reset to ' + frequency);
                    }
                }
            }
            catch(err)
            {
                frequency = 10;
            }
        }
    });
}

// time out is required because fetching client information could take some time
setTimeout(function() {
  tracer();
  ticker();
}, 3000);

