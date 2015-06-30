FROM dockerfile/nodejs
MAINTAINER Benjamin Chodoroff, bc@thermitic.net

ADD . /opt/gnl-frontend

EXPOSE 3334

CMD node /opt/gnl-frontend/server.js
