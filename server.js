'use strict';

var express = require('express');
var path = require('path');

var server = express();

//Home Page
server.get('/', (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname + '/home.html'))
  // res.send('<!DOCTYPE html><html><body>HOME</body></html>');
});

//Results Page
server.get('/results', (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname + '/results.html'))
});

server.listen(process.env.PORT || 3000);
