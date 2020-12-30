const buttonRefresh = document.getElementById("control_button");
const buttonFarenheit = document.getElementById("farenheit");
const buttonCelsius = document.getElementById("celsius");
const buttonSearch = document.getElementById("search_button");
const locationCity = document.getElementById("location_city");
const dateNow = document.querySelector(".date_now");
const timeNow = document.querySelector(".time_now");
const tempretureNow = document.querySelector(".tempreture_now");
const latitude = document.querySelector(".latitude");
const longitude = document.querySelector(".longitude");
const body = document.getElementById("body");
const overcast = document.getElementById("overcast");
const feelsLike = document.getElementById("feelsLike");
const speedWind = document.getElementById("speedWind");
const humidity = document.getElementById("humidity");
const iconWeatherNow = document.querySelector(".icon_weatherNow");



const getLocation = async() => {
  return fetch('https://ipinfo.io/json?token=bc42e9ca6258a9')
      .then(response => response.json());
}
async function showLocation() {
  let cityAndCountry = await getLocation();
  locationCity.textContent = `${cityAndCountry.city}, ${cityAndCountry.country}`
}















const getWeatherNow = async() => {
    return fetch('https://api.openweathermap.org/data/2.5/forecast?q=Kiev&lang=en&units=metric&appid=acb152250020945076707f815f4ffbb1')
        .then(response => response.json());
}
async function showWeatherNow() {
    let weather = await getWeatherNow();
  tempretureNow.textContent = weather.list[0].main.temp.toFixed(1);
 overcast.textContent = weather.list[0].weather[0].description;
  feelsLike.textContent = `Feels like: ${weather.list[0].main.feels_like.toFixed(1)}`;
  humidity.textContent = `Humidity: ${weather.list[0].main.humidity}%`;
  speedWind.textContent = `Wind: ${weather.list[0].wind.speed.toFixed()} m/s`; 
  console.log(weather);
}














function showDateNow() {
  const dayOfWeekEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsEn = {
    0: January,
    1: February,
    2: March,
    3:April,
    4:May,
    5: June,
    6: July,
    7: August,
    8: September,
    9: October,
    10: November,
    11: December,
  };
  let now = new Date();
  let dayofWeek = now.getDay();
  let dayNumber = now.getDate();
  let month = now.getMonth();
  dateNow.textContent =
    dayOfWeekEn[dayofWeek] + " " + dayNumber + " " + month;
}
showDateNow();

function showTime() {
  let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds();
  timeNow.textContent = `${hour}:${addZero(min)}:${addZero(sec)}`;
  setTimeout(showTime, 1000);
}
showTime();
function addZero(n) {
  return (parseInt(n, 10) < 10 ? "0" : "") + n;
}




function createMap() {
  navigator.geolocation.getCurrentPosition(showMap, handle_error, {
    maximumAge: 75000,
  });
  function showMap(position) {
    const posLatitude = position.coords.latitude;
    const posLongitude = position.coords.longitude;
    latitude.textContent = "Latitude:" + posLatitude.toFixed(2);
    longitude.textContent = "Longitude" + posLongitude.toFixed(2);

    mapboxgl.accessToken =
      "pk.eyJ1IjoieWF1aGVuaWJlaWR1ayIsImEiOiJja2o3b2llMzUwcDNwMnJwNWtuOG82MzlpIn0.cNTogxbQEyS45pQYibK8mA";
    let map = new mapboxgl.Map({
      container: "map", // container id
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [posLongitude, posLatitude], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });
    var marker = new mapboxgl.Marker()
      .setLngLat([posLongitude, posLatitude])
      .addTo(map);
  }

  function handle_error(err) {
    if (err.code == 1) {
    }
  }
}

//createMap();


const getLinkToImage = async() => {
  const url =
    "https://api.unsplash.com/photos/random?&client_id=e2077ad31a806c894c460aec8f81bc2af4d09c4f8104ae3177bb809faf0eac17";
  const response = await fetch(url);
  const data = await response.json();
  return data.urls.regular;
}

async function getBackground() {
  try {
    const backgroundLink = await getLinkToImage();
    body.style.backgroundImage = `url(${backgroundLink})`;
  } catch (error) {
    console.error(error);
  }
}


buttonRefresh.addEventListener('click', getBackground);