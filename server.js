var express = require('express');
var request = require('request');
var _ = require('underscore');
var app = express();

app.use(require('prerender-node').set('protocol', 'https'));

app.use(express.static(__dirname + '/dist'));

function fetch(options, memo, done) {
  var url = 'https://data.detroitledger.org/api/1.0/';
  url += options.type + '.json?limit=100&offset=' + options.offset;

  request({url: url, strictSSL: false}, function (error, response, body) {
    body = JSON.parse(body);
    var ids = _.pluck(body.orgs, 'id');
    memo = memo.concat(ids);
    if (ids.length === 100) {
      options.offset += 100;
      fetch(options, memo, done);
    } else {
      done(memo);
    }
  });
}

app.get('/sitemap.xml', function(req, res){
  fetch({type: 'orgs', offset: 0}, [], function(ids) {
    var sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    _.each(ids, function(id) {
      sitemap += '<url><loc>https://detroitledger.org/#!/organizations/' + id;
      sitemap += '</loc></url>\n';
    });

    sitemap += '</urlset>\n';
    res.set('Content-Type', 'text/xml');
    res.send(sitemap);
  });
});

var port = process.env.PORT || 3334;
app.listen(3334);
