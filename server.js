'use strict';

var express = require('express');
var path = require('path');
var parser = require('body-parser');
var socket = require('socket.io');

var server = express();
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDv4A1my3d9B16HqH_6tHPXwSbAoZILZx4'
});
server.use(parser.json());
server.use(parser.urlencoded({extended: true}));


var io = socket(server.listen(process.env.PORT || 3000));
let d = 's';

io.on('connection', (objectSocket) => {
  console.log("CONNECTED");
  io.emit('done', {
    'name': "Test"
  });


  objectSocket.on('ret', (objectSocket) => {
    console.log("REN");
    io.emit('data', {
      'data': d
    });
  });
});

io.on('grab', () => {
  console.log("GRAB");
});

//Home Page
server.get('/', (req, res) => {
  res.status(200);
  // var search = req.query.searchCriteria;
  res.sendFile(path.join(__dirname + '/home.html'))
  // if(search !== undefined)
  // {
  //   d = "TEST";
  //   // googleMapsClient.places({
  //   //   query: search,
  //   //   language: 'en',
  //   //   location: [45.5155, -122.6793],
  //   //   radius: 5000,
  //   //   minprice: 1,
  //   //   maxprice: 4,
  //   //   opennow: true
  //   // }, (err, response) => {
  //   //   if(!err){
  //   //     d = response.json.results;
  //   //     console.log("DATA SET");
  //   //   }
  //   //   else{
  //   //     console.log(err);
  //   //   }
  //   // });
  // }
});

//Get location or name of hike from client
server.post('/searchData', (req, res) => {
  res.status(302);
  console.log(req.body.searchCriteria);
  // googleMapsClient.places({
  //   query: req.body.searchCriteria,
  //   language: 'en',
  //   location: [45.5155, -122.6793],
  //   radius: 5000,
  //   minprice: 1,
  //   maxprice: 4,
  //   opennow: true
  // }, (err, response) => {
  //   if(!err){
  //     d = response.json.results;
  //     console.log("DATA SET " + req.body.searchCriteria);
  //   }
  //   else{
  //     console.log(err);
  //   }
  // });
  d = req.body.searchCriteria;
  io.emit("sec", {
    's': 's'
  });
  res.location('/');
  // res.location('/?' + req.body.searchCriteria);
  res.end();
});

//Results Page
server.get('/results', (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname + '/results.html'))
});
