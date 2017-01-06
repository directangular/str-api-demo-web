This is a simple [Python Bottle](http://bottlepy.org/) web app
demonstrating basic usage of the ShopTheRoe API.  A live instance of this
app is available [here](https://str-api-demo.herokuapp.com).

# Running locally

To run this app locally, grab the code and set up a python environment:

```
$ git clone https://github.com/directangular/str-api-demo-web.git
$ cd str-api-demo-web
$ virtualenv env
$ env/bin/install -r requirements.txt
$ REDIRECT_URI=http://localhost.localdomain:8888/cb \
    STR_URL=https://beta.shoptheroe.com \
    CLIENT_ID=<your_client_id> \
    CLIENT_SECRET=<your_client_secret> \
    env/bin/python main.py
```

If you don't have a client ID and secret, you'll need to send an email to
contact+developers@directangular.com to get an app set up for yourself on
the beta site.

You should now be able to browse to http://localhost:8888 to view the app.

# Important stuff

The code here is quite small, but it's still useful to call out some of the
more salient bits.  In all of the examples below I'll be using the URLs
from the beta site, even though those can be overridden to point at your
local setup.

## Getting the token

To get the token, we send the user to the following web page:

```
https://beta.shoptheroe.com/o/authorize/?response_type=code&client_id=<client_id>&state=random_state_string&redirect_uri=https://str-api-demo.herokuapp.com/cb
```

If the user clicks "authorize" on that page, they will be redirected to the
`redirect_uri` with a `code` in the query string, which we can extract in
bottle like so:

```python
request.query['code']
```

Note that for a mobile app this redirect URI would be using a custom schema
handled by your app, as described
[here](https://aaronparecki.com/2012/07/29/2/oauth2-simplified#mobile-apps).

Once we have the `code`, we can get an access token by doing a `POST` to
`https://beta.shoptheroe.com/token/` with the following arguments:

```json
{
  "grant_type": "authorization_code",
  "code": <code>,
  "redirect_uri": "https://str-api-demo.herokuapp.com/cb",
  "client_id": <client_id>,
  "client_secret": <client_secret>,
}
```

Note that the reason we can use `client_secret` here is because this is a
server-side application where the code is presumably secret.  In a mobile
app, for example, you wouldn't be able to use `client_secret` since the
code can be extracted by the user (thereby compromising your secret).

The return value will be a JSON object of the format:

```json
{
  "access_token": <token>
}
```

The access token obtained can now be used to make STR API calls.

## Using the token

Now that we have an access token we can make authorized requests to the STR
API by adding the following HTTP header: `Authorization: Bearer <token>`
(see `strapi.py`).  For example:

```
GET https://beta.shoptheroe.com/api/v2/items/
Authorization: Bearer <token>
```

The result is a JSON object.  It includes paging in order to reduce load on
the STR servers.  For example:

```json
{
  "count": 579,
  "next": "http://localhost.localdomain:8000/api/v2/items/?page=2",
  "previous": null,
  "results": [
    {
      "pk": 11466409,
      "style": "Carly",
      "size": "3XL",
      "listingLink": null
    },
    ...
  ]
}
```

To traverse the paging results, just use the URLs returned in the `next` or
`previous` properties.  Just make sure you include the `Authorization`
header when making requests to the `next` and `previous` URLs as well.

## Renewing the token

TODO

## Sneaky shimming to work around CORS

You'll notice that we're actually "shimming" the API here.  Our front-end
(javascript) code isn't actually making remote API calls to the STR API.
Instead, it's calling our own backend code which is, in turn, making a
remote API call to STR.  The reason for this is to get around CORS
protection on the browser (since our server-side code isn't subject to the
same security policies as a web browser).  This should eventually be fixed
on the STR side so that it can be called directly.

This shouldn't be a problem for mobile apps.
