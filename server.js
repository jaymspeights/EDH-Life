var express = require ('express');
var fs = require ('fs');
var app = express();

var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('/etc/letsencrypt/live/edh.life/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/edh.life/fullchain.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};

app.use (function (req, res, next) {
  if (req.secure) {
    next();
  } else {
    res.redirect('https://' + req.headers.host + req.url);
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'))


app.get('/.well-known/*', (req, res) => {
  res.sendFile(__dirname + req.originalUrl);
});

app.get('/manifest.json', (req, res) => {
  res.sendFile(__dirname + '/manifest.json');
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);
