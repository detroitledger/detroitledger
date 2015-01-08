var express = require('express');
var app = express();

app.use(require('prerender-node').set('protocol', 'https'));

app.use(express.static(__dirname + '/dist'));

// app.get('/', function(req, res){
//   res.send('<html><body>hello world</html></body>');
// });

var port = process.env.PORT || 3334;
app.listen(3334);
