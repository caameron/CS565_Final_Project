'use strict';

var express = require('express');
var path = require('path');

var server = express();

//Home Page
server.get('/', (req, res) => {
  res.status(200);
  res.send('<!DOCTYPE html><html><body>HOME</body></html>');
});

//Results Page
server.get('/results', (req, res) => {
  res.status(200);
  res.send('<!DOCTYPE html><html><body>Results page</body></html>');
});

server.listen(process.env.PORT || 3000);
