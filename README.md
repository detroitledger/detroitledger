## Installation & development

You'll need npm, bower, and gulp (`npm install -g gulp; npm install -g bower`). Also, you need compass (see .travis.yml for an example of how to fulfil the compass and sass dependencies).

`npm install`

`gulp build`

`gulp watch` to recompile on change

`gulp deploy` to copy files to our live container (you need access, obviously!)

## Prerender

We use a little proxy server to pre-render pages for SEO.

First, you'll need to get a [prerender service](https://github.com/prerender/prerender) running somewhere.

Then, configure this app to use that service:

    $ export PRERENDER_SERVICE_URL=<new url>

Or on heroku:

    $ heroku config:add PRERENDER_SERVICE_URL=<new url>

You can customize the port the proxy server listens to:

    $ export PORT=<8080>

Finally, run the server:

    $ node server.js

To test that things are working, vist a URL and change the `#!` to
`?_escaped_fragment_=`. If you view source, you should see the full content.

## Docker

On the live server, check out this repository and situate yourself inside it.

Then,

```
# if prerender isn't already running
docker run -d --name=docker-prerender bnchdrff/docker-prerender
# rebuild & restart
docker build -t detroitledger/gnl-frontend .
docker stop gnl-frontend
docker rm gnl-frontend
docker run -d --name=gnl-frontend -e PRERENDER_SERVICE_URL=http://`docker inspect --format='{{.NetworkSettings.IPAddress}}' prerender`:3000 detroitledger/gnl-frontend
```
