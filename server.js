'use strict';

var express = require('express');
var path = require('path');
var parser = require('body-parser');

var server = express();
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDv4A1my3d9B16HqH_6tHPXwSbAoZILZx4'
});
server.use(parser.json());
server.use(parser.urlencoded({extended: true}));

//Home Page
server.get('/', (req, res) => {
  res.status(200);
  var search = req.query.searchCriteria;
  if(search !== undefined)
  {
    googleMapsClient.places({
      query: search,
      language: 'en',
      location: [45.5155, -122.6793],
      radius: 5000,
      minprice: 1,
      maxprice: 4,
      opennow: true
    }, (err, response) => {
      if(!err){
        console.log(response.json.results);
      }
      else{
        console.log(err);
      }
    });
  }
  res.sendFile(path.join(__dirname + '/home.html'))
});

//Get location or name of hike from client
server.post('/searchData', (req, res) => {
  res.status(302);
  console.log(req.body.searchCriteria);
  res.location('/?' + req.body.searchCriteria);
  res.end();
});

//Results Page
server.get('/results', (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname + '/results.html'))
});

server.listen(process.env.PORT || 3000);
