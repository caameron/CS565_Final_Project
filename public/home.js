//Javascript file for home.html
$(document).ready( () => {

  // Get values of cities and their coordinates from local json file
  // implementation based on : https://stackoverflow.com/questions/14484613/load-local-json-file-into-variable
  var cities = (function() {
    var cities = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "./cities.json",
        'dataType': "json",
        'success': function (data) {
            cities = data;
        }
    });
    return cities;
    })();

    // long and lat of the current selected place. default portland
    let lat = 45.5155;
    let long = -122.6793;
    let option = "Portland Trials"

    var objectSocket = io.connect("/");

    $("#to_results").click(() =>{
      location.href = "results";
    });

    $('#searchButton').on('click', () => {
      console.log("DS");
      objectSocket.emit('searchData', {
        'query': $("#searchCriteria").val(),
        'lat': lat,
        'long': long,
        'geo': false
      });
    });

    $('#geolocation').on('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCurrent);
      } else {
        alert("current location not found");
      }
    });

    function getCurrent(pos){
      var latitude = pos.coords.latitude;
      var longitude = pos.coords.longitude;
      objectSocket.emit('searchData', {
        'query': 'hike',
        'lat': latitude,
        'long': longitude,
        'geo': true
      });
    }

    objectSocket.on('searchResults', (data) => {
      $("#choices").empty();
      var selectList = $("#choices");
      for(result in data.results)
      {
        var optionValue = data.results[result].geometry.location.lat + "," + data.results[result].geometry.location.lng;
        var choice = $("<option />", {value: optionValue, text: data.results[result].formatted_address});
        selectList.append(choice);
      }
      $("#choices").append(selectList);
      option = data.results[0].formatted_address;
      console.log(option);
      lat = data.results[0].geometry.location.lat;
      long = data.results[0].geometry.location.lng;
      //set local storage for these results so that results.html can use this info
      //otherwise run into asnych issues without this local storage.
      localStorage.setItem('lat',data.results[0].geometry.location.lat);
      localStorage.setItem('long',data.results[0].geometry.location.lng);
      localStorage.setItem('option',data.results[0].formatted_address);
      initMap();
    });

    //On change of selection update google map to the selected area
    $("#choices").on('change', () => {
      var newLocation = $("#choices option:selected").val().split(',');
      option = $("#choices option:selected").text();
      console.log(option);
      lat = Number(newLocation[0]);
      long = Number(newLocation[1]);
      //set local storage for these results so that results.html can use this info
      //otherwise run into asnych issues without this local storage.
      localStorage.setItem('lat',Number(newLocation[0]));
      localStorage.setItem('long',Number(newLocation[1]));
      localStorage.setItem('option',$("#choices option:selected").text());
      initMap();
    });


    //Allow the user to change the default location of the search area.
    //Whenever the selection is changed it will update the long and lat of the
    //seach area
    //The default is portland.
    var selectLocation = $("#locations");
    for(city in cities.cities)
    {
      var choice = $("<option />", {value: city, text: city});
      selectLocation.append(choice);
    }

    $("#locations").on('change', () => {
      var value = $("#locations option:selected").val();
      lat = cities.cities[value].Lat;
      long = cities.cities[value].Long;
    });

    initMap = () => {
      var mapOptions = {
        center: {lat: lat, lng:long},
        zoom: 14
      }

      var map = new google.maps.Map(document.getElementById('map'), mapOptions);

      //Add marker
      var marker = new google.maps.Marker({
        position: {lat: lat, lng: long},
        map: map
      });
    }
});
