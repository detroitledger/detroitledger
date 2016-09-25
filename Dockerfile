FROM dockerfile/nodejs
MAINTAINER Benjamin Chodoroff, bc@thermitic.net

RUN apt-get update
RUN apt-get install -y gzip git-core curl pkg-config build-essential ruby

RUN gem update
RUN gem install sass --version "=3.3.13"
RUN gem install compass --version="=0.12.7"

RUN npm install -g gulp

ADD . /data

ENV NODE_ENV production

RUN cd /data
RUN npm install
RUN gulp install
RUN gulp build
RUN gulp build

EXPOSE 3334

CMD node /data/server.js
