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
```

then run the app using your `client_id` and `client_secret`.  If you don't
have these, you'll need to send an email to
contact+developers@directangular.com to get an app set up for yourself.

```
REDIRECT_URI=http://localhost.localdomain:8888/cb \
    STR_URL=https://beta.shoptheroe.com \
    CLIENT_ID=<your_client_id> \
    CLIENT_SECRET=<your_client_secret> \
    env/bin/python main.py
```

You should now be able to browse to http://localhost:8888 to view the app.
