import json
import requests


"""Interface to the STR API.  Ideally the front-end js would just query the
remote API directly, but setting up CORS on the local STR django dev server
is a bit of a pain, so we provide a small shim here (server-side requests
aren't subject to the browser-specific CORS policies).
"""


API_BASE = "http://localhost.localdomain:8000/api/v2/"


class StrApi():
    def __init__(self, access_token, api_base=API_BASE):
        self.access_token = access_token
        self._headers = {"Authorization": "Bearer " + access_token}
        self._api_base = api_base

    def get(self, path):
        if not path.startswith('http'):
            url = self._api_base + path
        else:
            url = path

        return json.loads(requests.get(url, headers=self._headers).content)
