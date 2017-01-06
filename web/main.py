import os
import json

import requests
from bottle import (route, post, run, template, request, response, redirect,
                    static_file)

API_BASE = "http://localhost.localdomain:8000/api/v2/"
OAUTH_BASE = 'http://localhost.localdomain:8000/o'
TOKEN_URL = OAUTH_BASE + '/token/'
AUTH_URL = OAUTH_BASE + '/authorize/'
REDIRECT_URI = "http://localhost.localdomain:8888/cb"

client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')


if client_id is None or client_secret is None:
    print "You must supply CLIENT_ID and CLIENT_SECRET"
    import sys
    sys.exit(-1)


@route('/')
def index():
    with open('index.html') as f:
        idx_html = f.read()
    return template(idx_html, auth_url=AUTH_URL, client_id=client_id)


@route('/cb')
def cb():
    # exchange the auth code for an access token
    data = {
        "grant_type": "authorization_code",
        "code": request.query['code'],
        "redirect_uri": REDIRECT_URI,
        "client_id": client_id,
        "client_secret": client_secret,
    }
    resp = json.loads(requests.post(TOKEN_URL, data=data).content)

    # redirect to the "app" page with the token
    redirect('/app?access_token=' + resp['access_token'])


class StrApi():
    def __init__(self, access_token):
        self.access_token = access_token
        self._headers = {"Authorization": "Bearer " + access_token}

    def get(self, path):
        return json.loads(requests.get(API_BASE + path,
                                       headers=self._headers).content)


@route('/app')
def app():
    # access_token should be in the query string
    access_token = request.query['access_token']
    with open('app.html') as f:
        app_html = f.read()
    return template(app_html, access_token=access_token)


@post('/app')
def ajax_get_items():
    access_token = request.forms.get('access_token')
    api = StrApi(access_token)
    action = request.forms.get('action')
    data = {'success': True}
    if action == 'items':
        data['items'] = api.get('items')
    else:
        data = {'success': False, 'message': 'Invalid action'}
    response.content_type = 'application/json'
    return json.dumps(data)


@route('/static/<filename>')
def server_static(filename):
    return static_file(filename, root=os.path.dirname(__file__))


run(host='localhost', port=8888)
