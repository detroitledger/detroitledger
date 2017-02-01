## Installation & development

You'll need npm, bower, and gulp (`npm install -g gulp; npm install -g bower`). Also, you need compass (see .travis.yml for an example of how to fulfil the compass and sass dependencies).

`npm install`

`gulp build`

`gulp watch` to recompile and run tests on file change

`gulp watch-sans-test` to recompile without tests on file change

## Installing a new module

Say you need a new third party library: 

1. Add it to `bower.json`
2. `gulp install`
3. Add it to `package.json` -- make sure it's under `browser`.

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

In your local repo, `git remote add live root@data.detroitledger.org:repos/detroitledger.git`.

Later on, `git push live gh-pages` when you want to deploy.

In the background, the following `post-receive` hook happens:

```
#!/usr/bin/env bash

. $HOME/.nvm/nvm.sh

export GIT_WORK_TREE="$HOME/repos/detroitledger"
git checkout -f gh-pages

cd $GIT_WORK_TREE

npm install
gulp install
NODE_ENV=production gulp build
docker build -t detroitledger/gnl-frontend:`cd ../detroitledger.git && git log --pretty=format:'%h' -n 1` .
docker stop gnl-frontend
docker rm gnl-frontend
docker run -d --name=gnl-frontend -e PRERENDER_SERVICE_URL=http://`docker inspect --format='{{.NetworkSettings.IPAddress}}' prerender`:3000 detroitledger/gnl-frontend:`cd ../detroitledger.git && git log --pretty=format:'%h' -n 1`
```

