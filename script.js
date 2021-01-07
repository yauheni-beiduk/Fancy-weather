//import info from './languageRu'
//import info from './languageEn';

function init() {

async function languageRussian() {
 info = await import('./languageRu.js');
console.log(info);

async function languageEnglish() {
 english = await import('./languageEn.js');
 console.log(english)




  const dayOfWeekAbbreviated = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
  };
  const dayOfWeekEn = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
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
  const buttonRefresh = document.getElementById('control_button');
  const buttonFarenheit = document.getElementById('farenheit');
  const buttonCelsius = document.getElementById('celsius');
  const inputCity = document.querySelector('.search_input');
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
  const iconOne = document.querySelector('.icon_one');
  const iconTwo = document.querySelector('.icon_two');
  const iconThree = document.querySelector('.icon_three');
  const firstDay = document.getElementById('firstDay');
  const secondDay = document.getElementById('secondDay');
  const thirdDay = document.getElementById('thirdDay');
  const firstTemperature = document.getElementById('firstTemperature');
  const secondTemperature = document.getElementById('secondTemperature');
  const thirdTemperature = document.getElementById('thirdTemperature');

  let lang = 'en';
  let weather;
  let adress;
  let city;
  let isFarengeit = true;

  function getAdress(posLatitude, posLongitude) {
    return fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${posLatitude}+${posLongitude}&key=8466357058924cb6ab7663a46faa152a&language=${lang}&pretty=1`
    ).then((response) => response.json());
  }
  async function showAdress(posLatitude, posLongitude) {
    adress = await getAdress(posLatitude, posLongitude);
    locations = adress.results[0].components;
    city = adress.results[0].components.city;
    const country = adress.results[0].components.country;
    locationCity.textContent = `${city}, ${country}`;
    console.log(adress);
    showWeatherNow(city);
  }

  function searchSity(city) {
    return fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=8466357058924cb6ab7663a46faa152a&language=en&pretty=1`
    ).then((response) => response.json());
  }
  async function showSearchCity(city) {
    try {
      city = inputCity.value;
      let adress = await searchSity(city);
      city = inputCity.value;
      let result = adress.results[0];
      city = result.components.city
        ? result.components.city
        : result.components.town
        ? result.components.town
        : result.components.village;
      country = result.components.country;
      locationCity.textContent = `${city}, ${country}`;
      posLatitude = result.geometry.lat.toFixed(2);
      posLongitude = result.geometry.lng.toFixed(2);
      console.log(adress);
      // QESTIONS?????????????
      // inputCity.value = '';
      getMap(posLatitude, posLongitude);
      getCoordinats(posLatitude, posLongitude);
      showWeatherNow(city);
    } catch (error) {
      alert(error);
    }
  }

  const getWeatherNow = async (city) => {
    return fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=${lang}&units=metric&appid=acb152250020945076707f815f4ffbb1`
    ).then((response) => response.json());
  };
  async function showWeatherNow(city) {
    try {
      weather = await getWeatherNow(city);
      const data = weather.list;
      tempNow = Math.round(data[0].main.temp);
      tempretureNow.textContent = isFarengeit
        ? tempNow + '°'
        : Math.round(tempNow * (9 / 5) + 32) + '°';
      firstTemperature.textContent = isFarengeit
        ? Math.round(data[8].main.temp) + '°'
        : Math.round(data[8].main.temp * (9 / 5) + 32) + '°';
      secondTemperature.textContent = isFarengeit
        ? Math.round(data[16].main.temp) + '°'
        : Math.round(data[16].main.temp * (9 / 5) + 32) + '°';
      thirdTemperature.textContent = isFarengeit
        ? Math.round(data[24].main.temp) + '°'
        : Math.round(data[24].main.temp * (9 / 5) + 32) + '°';
      overcast.textContent = data[0].weather[0].description;
      feelsLike.textContent = isFarengeit
        ? `Feels like: ${Math.round(data[0].main.feels_like) + '°'}`
        : `Feels like: ${
            Math.round(data[0].main.feels_like * (9 / 5) + 32) + '°'
          }`;
      humidity.textContent = `Humidity: ${data[0].main.humidity}%`;
      speedWind.textContent = `Wind: ${data[0].wind.speed.toFixed()} m/s`;

      iconWeatherNow.style.backgroundImage = `url(http://openweathermap.org/img/wn/${data[0].weather[0].icon}@2x.png)`;
      iconOne.style.backgroundImage = `url(http://openweathermap.org/img/wn/${data[8].weather[0].icon}@2x.png)`;
      iconTwo.style.backgroundImage = `url(http://openweathermap.org/img/wn/${data[16].weather[0].icon}@2x.png)`;
      iconThree.style.backgroundImage = `url(http://openweathermap.org/img/wn/${data[24].weather[0].icon}@2x.png)`;
      console.log(weather);
      showTime();
    } catch (error) {
      alert(error);
    }
  }

  function showTime() {
    let now = new Date();
    let currentTimeZoneOffsetInHours = now.getTimezoneOffset() * 60000;
    let localTime =
      now.getTime() +
      currentTimeZoneOffsetInHours +
      weather.city.timezone * 1000;
    let today = new Date(localTime);
    let hour = today.getHours();
    let min = today.getMinutes();
    let sec = today.getSeconds();
    timeNow.textContent = `${addZero(hour)}:${addZero(min)}:${addZero(sec)}`;
    let dayofWeek = today.getDay();
    let dayNumber = today.getDate();
    let month = today.getMonth();
    dateNow.textContent =
      dayOfWeekAbbreviated[dayofWeek] + ' ' + dayNumber + ' ' + monthsEn[month];
    dayofWeek++;
    if (dayofWeek > 6) {
      dayofWeek = 0;
      firstDay.textContent = dayOfWeekEn[dayofWeek];
    }
    firstDay.textContent = dayOfWeekEn[dayofWeek];
    dayofWeek++;
    if (dayofWeek > 6) {
      dayofWeek = 0;
      secondDay.textContent = dayOfWeekEn[dayofWeek];
    }
    secondDay.textContent = dayOfWeekEn[dayofWeek];
    dayofWeek++;
    if (dayofWeek > 6) {
      dayofWeek = 0;
      thirdDay.textContent = dayOfWeekEn[dayofWeek];
    }
    thirdDay.textContent = dayOfWeekEn[dayofWeek];
    setTimeout(showTime, 1000);
  }
  function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
  }

  function createMap() {
    navigator.geolocation.getCurrentPosition(showMap);
    function showMap(position) {
      const posLatitude = position.coords.latitude.toFixed(2);
      const posLongitude = position.coords.longitude.toFixed(2);
      getCoordinats(posLatitude, posLongitude);
      showAdress(posLatitude, posLongitude);
      getMap(posLatitude, posLongitude);
    }
  }
  createMap();

  function getCoordinats(posLatitude, posLongitude) {
    lat = String(posLatitude).split('.');
    lon = String(posLongitude).split('.');
    latMinutes = lat[0];
    latSeconds = lat[1];
    lonMinutes = lon[0];
    lonSeconds = lon[1];
    latitude.textContent = 'Latitude:' + latMinutes + '°' + latSeconds + "'";
    longitude.textContent = 'Longitude:' + lonMinutes + '°' + lonSeconds + "'";
  }

  function getMap(posLatitude, posLongitude) {
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
      body.style.transition = '1s';
    } catch (error) {
      console.error(error);
    }
  }

  function addKeyBoard(e) {
    if (e.which == 13) {
      showSearchCity();
    }
  }

  //  LOCAL STORAGE TEMPERATURE

  function getTempLocalStorage() {
    if (localStorage.getItem('isFarengeit') == 'true') {
      buttonCelsius.classList.add('active');
    } else {
      isFarengeit = false;
      buttonFarenheit.classList.add('active');
    }
  }
  function transferCelsiusToFarenheit() {
    city = inputCity.value || adress.results[0].components.city;
    isFarengeit = false;
    buttonCelsius.classList.remove('active');
    buttonFarenheit.classList.add('active');
    localStorage.setItem('isFarengeit', 'false');
    showWeatherNow(city);
    getTempLocalStorage();
  }
  function transferFarenheitToCelsius() {
    city = inputCity.value || adress.results[0].components.city;
    isFarengeit = true;
    buttonFarenheit.classList.remove('active');
    buttonCelsius.classList.add('active');
    localStorage.setItem('isFarengeit', 'true');
    showWeatherNow(city);
    getTempLocalStorage();
  }
  getTempLocalStorage();

  buttonSearch.addEventListener('click', showSearchCity);
  window.addEventListener('keypress', addKeyBoard);
  buttonRefresh.addEventListener('click', getBackground);
  buttonCelsius.addEventListener('click', transferFarenheitToCelsius);
  buttonFarenheit.addEventListener('click', transferCelsiusToFarenheit);
}
languageEnglish()
}
languageRussian()
}
