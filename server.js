'use strict';

var express = require('express');
var path = require('path');

var server = express();
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDv4A1my3d9B16HqH_6tHPXwSbAoZILZx4'
});


//Home Page
server.get('/', (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname + '/home.html'))
  // res.send('<!DOCTYPE html><html><body>HOME</body></html>');
  // googleMapsClient.places({
  //   query: 'fast food',
  //   language: 'en',
  //   location: [-33.865, 151.038],
  //   radius: 5000,
  //   minprice: 1,
  //   maxprice: 4,
  //   opennow: true,
  //   type: 'restaurant'
  // }, (err, response) => {
  //   if(!err){
  //     console.log(response.json.results);
  //   }
  //   else{
  //     console.log(err);
  //   }
  // });
});

//Results Page
server.get('/results', (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname + '/results.html'))
});

server.listen(process.env.PORT || 3000);
