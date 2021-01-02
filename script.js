const buttonRefresh = document.getElementById('control_button');
const buttonFarenheit = document.getElementById('farenheit');
const buttonCelsius = document.getElementById('celsius');
const buttonSearch = document.getElementById('search_button');
const locationCity = document.getElementById('location_city');
const dateNow = document.querySelector('.date_now');
const timeNow = document.querySelector('.time_now');
const tempretureNow = document.querySelector('.tempreture_now');
const latitude = document.querySelector('.latitude');
const longitude = document.querySelector('.longitude');
const body = document.getElementById('body');
const overcast = document.getElementById('overcast');
const feelsLike = document.getElementById('feelsLike');
const speedWind = document.getElementById('speedWind');
const humidity = document.getElementById('humidity');
const iconWeatherNow = document.querySelector('.icon_weatherNow');
const iconOne = document.querySelector('.icon_one')

function getAdress(posLatitude, posLongitude) {
  return fetch(`https://api.opencagedata.com/geocode/v1/json?q=${posLatitude}+${posLongitude}&key=8466357058924cb6ab7663a46faa152a&language=en&pretty=1`)
      .then((response) => response.json());
}

async function showAdress(posLatitude,posLongitude) {
  let adress = await getAdress(posLatitude,posLongitude);
  const city = adress.results[0].components.city;
  locationCity.textContent = `${city}, ${adress.results[0].components.country}`;
  console.log(adress);
  showWeatherNow(city);
  showIcon(city);
}




// function getLocation() {
//   return fetch('https://ipinfo.io/json?token=bc42e9ca6258a9').then((response) =>
//     response.json()
//   );
// };
// async function showLocation() {
//   let cityAndCountry = await getLocation();
//   locationCity.textContent = `${cityAndCountry.city}, ${cityAndCountry.country}`;
//   console.log(cityAndCountry)
// }

const getWeatherNow = async (city) => {
  return fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=en&units=metric&appid=acb152250020945076707f815f4ffbb1`
  ).then((response) => response.json());
};
async function showWeatherNow(city) {
  let weather = await getWeatherNow(city);
  tempretureNow.textContent = weather.list[0].main.temp.toFixed(1);
  overcast.textContent = weather.list[0].weather[0].description;
  feelsLike.textContent = `Feels like: ${weather.list[0].main.feels_like.toFixed(
    1
  )}`;
  humidity.textContent = `Humidity: ${weather.list[0].main.humidity}%`;
  speedWind.textContent = `Wind: ${weather.list[0].wind.speed.toFixed()} m/s`;
  console.log(weather);
}
async function showIcon(city) {
  let icon = await getWeatherNow(city);
  const icons = icon.list[0].weather[0].icon;
  iconOne.style.backgroundImage = `${icons}`;
  console.log(icon);

}













function showDateNow() {
  const dayOfWeekEn = {
   0: 'Sun',
   1: 'Mon',
   2: 'Tue',
   3: 'Wed',
   4: 'Thu',
   5: 'Fri',
   6: 'Sat'
  };
  const monthsEn = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
  };
  let now = new Date();
  let dayofWeek = now.getDay();
  let dayNumber = now.getDate();
  let month = now.getMonth();
  dateNow.textContent = dayOfWeekEn[dayofWeek] + ' ' + dayNumber + ' ' + monthsEn[month];
}
showDateNow();

function showTime() {
  let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds();
  timeNow.textContent = `${addZero(hour)}:${addZero(min)}:${addZero(sec)}`;
  setTimeout(showTime, 1000);
}
showTime();
function addZero(n) {
  return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

function createMap() {
  navigator.geolocation.getCurrentPosition(showMap);
  function showMap(position) {
    const posLatitude = position.coords.latitude;
    const posLongitude = position.coords.longitude;
    latitude.textContent = 'Latitude:' + posLatitude.toFixed(2);
    longitude.textContent = 'Longitude' + posLongitude.toFixed(2);
    showAdress(posLatitude,posLongitude);
    mapboxgl.accessToken =
      'pk.eyJ1IjoieWF1aGVuaWJlaWR1ayIsImEiOiJja2o3b2llMzUwcDNwMnJwNWtuOG82MzlpIn0.cNTogxbQEyS45pQYibK8mA';
    let map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [posLongitude, posLatitude], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });
    var marker = new mapboxgl.Marker()
      .setLngLat([posLongitude, posLatitude])
      .addTo(map);  
  }

}

createMap();

const getLinkToImage = async () => {
  const url =
    'https://api.unsplash.com/photos/random?&client_id=e2077ad31a806c894c460aec8f81bc2af4d09c4f8104ae3177bb809faf0eac17';
  const response = await fetch(url);
  const data = await response.json();
  return data.urls.regular;
};

async function getBackground() {
  try {
    const backgroundLink = await getLinkToImage();
    body.style.backgroundImage = `url(${backgroundLink})`;
  } catch (error) {
    console.error(error);
  }
}

buttonRefresh.addEventListener('click', getBackground);
