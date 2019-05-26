$(document).ready( () => {
  var objectSocket = io.connect("/");

  $("#to_home").click(() =>{
    location.href = "/";
  });

  objectSocket.emit('searchWeather', {
    'selection': localStorage.getItem('option'),
    'lat': localStorage.getItem('lat'),
    'long': localStorage.getItem('long'),
  });

  objectSocket.on('weatherResults', (data) => {
    //going to display results of weather in grid with info recieved from server.
    //need to convert kelvin to celius.
    console.log(data.lat);
    console.log(data.long);
    console.log(data.option);
    console.log(data.info["weather"][0]["main"]);
    console.log(data.info["main"]);
  });
});
