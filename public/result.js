$(document).ready( () => {
  var objectSocket = io.connect("/");

  $("#to_home").click(() =>{
    var query = "query=" + localStorage.getItem('query');
    var lat = "&lat=" + localStorage.getItem('lat');
    var long = "&long=" + localStorage.getItem('long');
    console.log(query);
    location.href = "/?" + query + lat + long;
  });

  objectSocket.emit('searchWeather', {
    'selection': localStorage.getItem('option'),
    'lat': localStorage.getItem('lat'),
    'long': localStorage.getItem('long'),
  });

  objectSocket.on('weatherResults', (data) => {
    //going to display results of weather in grid with info recieved from server.
    //need to convert kelvin to celius.
    // console.log(data.lat);
    // console.log(data.long);
    // console.log(data.option);
    // console.log(data.info["weather"][0]["main"]);
    // console.log(data.info["weather"][0]["description"]);
    // console.log(data.info["main"]);
    var icon = "http://openweathermap.org/img/w/" + data.info["weather"][0]["icon"] + ".png";
    $('#w_icon').attr('src', icon);
    document.getElementById("head_title").innerHTML = data.option;
    var far = Math.round(((data.info["main"]["temp"]- 273.15)*1.8)+32);
    $("#temp").append(far + '&#8457;');
    var minmax = Math.round(((data.info["main"]["temp_min"]- 273.15)*1.8)+32) + '&#176;' + " " + Math.round(((data.info["main"]["temp_max"]- 273.15)*1.8)+32) + '&#176;';
    document.getElementById("min_max").innerHTML = minmax;
    document.getElementById("description").innerHTML = data.info["weather"][0]["description"];
    var final = new Date(data.info['dt'] * 1000);
    // console.log(final);
    document.getElementById("date").innerHTML = final;

  });
});
