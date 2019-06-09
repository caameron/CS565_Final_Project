'use strict';

var express = require('express');
var path = require('path');
var parser = require('body-parser');
var socket = require('socket.io');
var https = require('https');

var server = express();
server.use(express.static(__dirname + '/public'));
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDXCRKzVIC3yDxE27l-Mergko7UI_LVulI'
});
server.use(parser.json());
server.use(parser.urlencoded({extended: true}));


var io = socket(server.listen(process.env.PORT || 3000));
let dataSearch = 'toBeFilled';


//Store variables for usage in API calls and other features
var lat_info = "";
var long_info = "";
var option_info = "";
var info_info = "";
let back = false;
let backQuery = undefined;
let backLat = undefined;
let backLong = undefined;


//Create Connection
io.on('connection', (objectSocket) => {
  console.log("CONNECTED");
  //If we are coming back from the results page, search for places Using
  //previous search criteria and render it for the page.
  if(back === true) {
    objectSocket.emit('backDetails', {
      'query': backQuery
    });
    googleMapsClient.places({
      query: backQuery,
      language: 'en',
      location: [backLat, backLong],
      radius: 50000
      }, (err, response) => {
      if(!err){
        dataSearch = response.json.results;
        objectSocket.emit('searchResults', {
          'results': dataSearch,
          'query': backQuery
        });
      }
      else{
        console.log(err);
      }
    });
    back = false;
  }

  //When data is sent through searchData emit, use places api to search for nearby places and then
  //send them back to client using socket
  //If data.geo equals true use the current location of the user instead and just search for hikes
  objectSocket.on('searchData', (data) => {
    if (data.geo === true){
      console.log(data.long + " " + data.lat);
      console.log(data);
      googleMapsClient.places({
        query: data.query,
        language: 'en',
        location: [data.lat, data.long],
        radius: 100000
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
        radius: 50000
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

  //Make call to weather api and send it back to the client for rendering on the results page
  objectSocket.on('searchWeather', (data) => {
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
  //check for previous seach criteria
  if(req.query.query !== undefined) {
    backQuery = req.query.query;
    backLat = req.query.lat;
    backLong = req.query.long;
    back = true;
  }

  res.sendFile(path.join(__dirname + '/home.html'))
});

//Results Page
server.get('/results', (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname + '/results.html'))
});
