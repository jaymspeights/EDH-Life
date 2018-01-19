var express = require ('express');
var app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'))

app.get('/.well-known/*', (req, res) => {
  res.sendFile(__dirname + req.originalUrl);
});

app.listen(80);
