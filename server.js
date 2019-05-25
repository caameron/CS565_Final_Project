'use strict';

var express = require('express');
var path = require('path');
var parser = require('body-parser');
var socket = require('socket.io');
var myKey = require('./public/key.js');
var https = require('https');

var server = express();
server.use(express.static(__dirname + '/public'));
var googleMapsClient = require('@google/maps').createClient({
  key: myKey
});
server.use(parser.json());
server.use(parser.urlencoded({extended: true}));


var io = socket(server.listen(process.env.PORT || 3000));
let dataSearch = 'toBeFilled';

var lat_info = "";
var long_info = "";
var option_info = "";
var info_info = "";

io.on('connection', (objectSocket) => {
  console.log("CONNECTED");
  //When data is sent, use places api to search for nearby places and then
  //send them back to client using socket
  //   objectSocket.on('searchData', (data) => {
  //     console.log(data);
  //     var long = Number(data.long);
  //     var lat = Number(data.lat);
  //     console.log(typeof 45.22);
  //     console.log(long);
  //     googleMapsClient.places({
  //       query: data.query,
  //       language: 'en',
  //       location: {"lat":data.lat, "lng":data.long},
  //       radius: 5000,
  //       minprice: 1,
  //       maxprice: 4,
  //       opennow: true
  //       }, (err, response) => {
  //       if(!err){
  //         dataSearch = response.json.results;
  //         objectSocket.emit('searchResults', {
  //           'results': dataSearch,
  //           'query': data.query
  //         });
  //       }
  //       else{
  //         console.log(err);
  //       }
  //     });
  // });
  objectSocket.on('searchData', (data) => {
    if (data.geo === true){
      console.log(data.long + " " + data.lat);
      console.log(data);
      googleMapsClient.places({
        query: data.query,
        language: 'en',
        location: [data.lat, data.long],
        radius: 100000,
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
        location: [data.lat, data.long],
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
  objectSocket.on('searchWeather', (data) => {
    console.log("HEREER");
    https.get('https://api.openweathermap.org/data/2.5/weather?lat='+data.lat+'&lon='+data.long+'&appid=9fa05a0944cccb31dad4729352b5c805', (resp) => {
    let weather = '';

    resp.on('data', (chunk) => {
      weather += chunk;
    });

    resp.on('end', () => {
      console.log(weather);
      var finalresult = JSON.parse(weather);
      objectSocket.emit('weatherResults', {
        'lat': data.lat,
        'long': data.long,
        'option': data.selection,
        'info': finalresult
      });
    });
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  });
});

//Home Page
server.get('/', (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname + '/home.html'))
});

//Results Page
server.get('/results', (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname + '/results.html'))
});
