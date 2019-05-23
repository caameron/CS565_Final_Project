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
let dataSearch = 'toBeFilled';

io.on('connection', (objectSocket) => {
  console.log("CONNECTED");

  //When data is sent, use places api to search for nearby places and then
  //send them back to client using socket
  objectSocket.on('searchData', (data) => {
    if (data.geo === true){
      console.log(data.long + " " + data.lat);
      googleMapsClient.places({
        query: data.query,
        language: 'en',
        location: [data.lat, data.long],
        radius: 10000,
        minprice: 1,
        maxprice: 4,
        opennow: true
        }, (err, response) => {
        if(!err){
          dataSearch = response.json.results;
          objectSocket.emit('searchResults', {
            'results': dataSearch,
            'query': data.query
          });
        }
        else{
          console.log(err);
        }
      });
    }
    else{
      googleMapsClient.places({
        query: data.query,
        language: 'en',
        location: [45.5155, -122.6793],
        radius: 5000,
        minprice: 1,
        maxprice: 4,
        opennow: true
        }, (err, response) => {
        if(!err){
          dataSearch = response.json.results;
          objectSocket.emit('searchResults', {
            'results': dataSearch,
            'query': data.query
          });
        }
        else{
          console.log(err);
        }
      });
    }
  });
});

//Home Page
server.get('/', (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname + '/home.html'))
});

//Get location or name of hike from client
// server.post('/searchData', (req, res) => {
//   res.status(302);
//   res.location('/');
//   res.end();
// });

//Results Page
server.get('/results', (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname + '/results.html'))
});
