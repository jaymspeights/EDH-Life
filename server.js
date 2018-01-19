var express = require ('express');
var app = express();

var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('/etc/letsencrypt/live/edh.life/private.key', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/edh.life/cert.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'))

app.get('/.well-known/*', (req, res) => {
  res.sendFile(__dirname + req.originalUrl);
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);
