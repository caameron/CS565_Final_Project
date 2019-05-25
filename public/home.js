//Javascript file for home.html
$(document).ready( () => {

    // long and lat of the current selected place. default portland
    let lat = 45.5155;
    let long = -122.6793;
    let option = "Portland Trials"
    console.log(option);

    // $("#to_results").click(() =>{
    //   location.href = "results";
    // });

    var objectSocket = io.connect("/");

    $("#to_results").click(() =>{
      objectSocket.emit('searchWeather', {
        'selection': option,
        'lat': lat,
        'long': long,
      });
      location.href = "results";
    });

    $('#searchButton').on('click', () => {
      objectSocket.emit('searchData', {
        'query': $("#searchCriteria").val(),
        'lat': 45.5155,
        'long': -122.6793,
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
      initMap();
    });

    //On change of selection update google map to the selected area
    $("#choices").on('change', () => {
      var newLocation = $("#choices option:selected").val().split(',');
      option = $("#choices option:selected").text();
      console.log(option);
      lat = Number(newLocation[0]);
      long = Number(newLocation[1]);
      initMap();
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
