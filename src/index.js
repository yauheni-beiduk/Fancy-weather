import {LanguageEN} from './languageEn.js';
import {LanguageRU} from './languageRu.js';
import './style.css';

window.onload = function () {
  let posLatitude;
  let posLongitude;
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
  const buttonRussianLanguage = document.getElementById('language_ru');
  const buttonEnglishlanguage = document.getElementById('language_en');
  const localLang = localStorage.getItem('lang');
  console.log(localLang)
  let weather;
  let adress;
  let city = localStorage.getItem('city');
  let isFarengeit = true;
  let isRu = localLang && localLang == 'ru'
  let lang = isRu
    ? 'ru'
    : 'en';
  let info = isRu
      ? LanguageRU
      : LanguageEN;

  (function initializeLangButton() {
    if (isRu) {
      buttonRussianLanguage.classList.add('active');
      buttonRussianLanguage.classList.remove('not_active');
      buttonEnglishlanguage.classList.remove('active');
      buttonEnglishlanguage.classList.add('not_active');
    }
  })();

  function langRu() {
    lang = 'ru';
    info = LanguageRU;
    console.log(info)
    buttonRussianLanguage.classList.add('active');
    buttonRussianLanguage.classList.remove('not_active');
    buttonEnglishlanguage.classList.remove('active');
    buttonEnglishlanguage.classList.add('not_active');

    localStorage.setItem('lang', 'ru');

    showAdress(posLatitude, posLongitude);
    showWeatherNow(city);
    getCoordinats(posLatitude, posLongitude);
  }

  function langEn() {
    lang = 'en';
    info = LanguageEN;

    buttonRussianLanguage.classList.remove('active');
    buttonRussianLanguage.classList.add('not_active');
    buttonEnglishlanguage.classList.remove('not_active');
    buttonEnglishlanguage.classList.add('active');

    localStorage.setItem('lang', 'en');

    showAdress(posLatitude, posLongitude);
    showWeatherNow(city);
    getCoordinats(posLatitude, posLongitude);
  }

  function getAdress(posLatitude, posLongitude) {
    return fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${posLatitude}+${posLongitude}&key=8466357058924cb6ab7663a46faa152a&language=${lang}&pretty=1`
    ).then((response) => response.json());
  }

  async function showAdress(posLatitude, posLongitude) {
    try {
      adress = await getAdress(posLatitude, posLongitude);

      let locations = adress.results[0].components;
      city = locations.city;
      const country = locations.country;

      locationCity.textContent = `${city}, ${country}`;
      console.log(adress);
      showWeatherNow(city);
    } catch (error) {
      alert(error);
    }
  }

  function searchSity(city) {
    console.log(city);
    return fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=8466357058924cb6ab7663a46faa152a&language=${lang}&pretty=1`
    ).then((response) => response.json());
  }

  async function showSearchCity(city) {
    try {
      if (!city) {
        city = inputCity.value
      } 
      adress = await searchSity(city);
      
      console.log(adress)
      if (adress) {
      let result = adress.results[0].components;
      city = result.city
        ? result.city
        : result.town
        ? result.town
        : result.village;

      let country = result.country;
      locationCity.textContent = `${city}, ${country}`;

      let pos = adress.results[0].geometry;

      posLatitude = pos.lat.toFixed(2);
      posLongitude = pos.lng.toFixed(2);

      localStorage.setItem('city',city);
      inputCity.value = '';

      showWeatherNow(city);
      getMap(posLatitude, posLongitude);
      getCoordinats(posLatitude, posLongitude);
      }
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
      let feelLike = data[0].main.feels_like;
      let tempNow = Math.round(data[0].main.temp);
      let firstTemp = data[8].main.temp;
      let secTemp = data[16].main.temp;
      let thirdTemp = data[24].main.temp;

      tempretureNow.textContent = isFarengeit
        ? tempNow + '°'
        : Math.round(tempNow * (9 / 5) + 32) + '°';
      firstTemperature.textContent = isFarengeit
        ? Math.round(firstTemp) + '°'
        : Math.round(firstTemp * (9 / 5) + 32) + '°';
      secondTemperature.textContent = isFarengeit
        ? Math.round(secTemp) + '°'
        : Math.round(secTemp * (9 / 5) + 32) + '°';
      thirdTemperature.textContent = isFarengeit
        ? Math.round(thirdTemp) + '°'
        : Math.round(thirdTemp * (9 / 5) + 32) + '°';

      overcast.textContent = data[0].weather[0].description;

      feelsLike.textContent = isFarengeit
        ? `${info.summary.feels} ${Math.round(feelLike) + '°'}`
        : `${info.summary.feels} ${Math.round(feelLike * (9 / 5) + 32) + '°'}`;

      humidity.textContent = `${info.summary.humidity} ${data[0].main.humidity}%`;
      speedWind.textContent = `${
        info.summary.wind
      } ${data[0].wind.speed.toFixed()} ${info.summary.speed}`;

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

    dateNow.textContent = `${info.dayOfWeekAbbreviated[dayofWeek]} ${dayNumber} ${info.months[month]}`;
    dayofWeek++;

    if (dayofWeek > 6) {
      dayofWeek = 0;
      firstDay.textContent = `${info.dayOfWeek[dayofWeek]}`;
    }
    firstDay.textContent = `${info.dayOfWeek[dayofWeek]}`;
    dayofWeek++;
    if (dayofWeek > 6) {
      dayofWeek = 0;
      secondDay.textContent = `${info.dayOfWeek[dayofWeek]}`;
    }
    secondDay.textContent = `${info.dayOfWeek[dayofWeek]}`;
    dayofWeek++;
    if (dayofWeek > 6) {
      dayofWeek = 0;
      thirdDay.textContent = `${info.dayOfWeek[dayofWeek]}`;
    }
    thirdDay.textContent = `${info.dayOfWeek[dayofWeek]}`;

    setTimeout(showTime, 1000);
  }

  function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
  }

  function createMap() {
    navigator.geolocation.getCurrentPosition(showMap);

    function showMap(position) {
      posLatitude = position.coords.latitude.toFixed(2);
      posLongitude = position.coords.longitude.toFixed(2);

      getCoordinats(posLatitude, posLongitude);
      showAdress(posLatitude, posLongitude);
      getMap(posLatitude, posLongitude);
    }
  }

  //createMap();

  (function initializeCity() {
    if (city) {
      console.log(city)
      showSearchCity(city)
    } else {
      createMap()
    }
  })(); 
  function getCoordinats(posLatitude, posLongitude) {
    let lat = String(posLatitude).split('.');
    let lon = String(posLongitude).split('.');
    let latMinutes = lat[0];
    let latSeconds = lat[1];
    let lonMinutes = lon[0];
    let lonSeconds = lon[1];

    latitude.textContent = `${info.positions.latit} ${latMinutes}°  ${latSeconds}'`;
    longitude.textContent = `${info.positions.longit} ${lonMinutes}°  ${lonSeconds}'`;
    buttonSearch.textContent = `${info.search.but}`;
    inputCity.placeholder = `${info.search.input}`;
  }

  function getMap(posLatitude, posLongitude) {
    mapboxgl.accessToken =
      'pk.eyJ1IjoieWF1aGVuaWJlaWR1ayIsImEiOiJja2o3b2llMzUwcDNwMnJwNWtuOG82MzlpIn0.cNTogxbQEyS45pQYibK8mA';
    let map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [posLongitude, posLatitude],
      zoom: 9,
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
    isFarengeit = false;
    buttonCelsius.classList.remove('active');
    buttonFarenheit.classList.add('active');

    localStorage.setItem('isFarengeit', 'false');

    showAdress(posLatitude, posLongitude);
    showWeatherNow(city);
    getTempLocalStorage();
  }
  function transferFarenheitToCelsius() {
    isFarengeit = true;
    buttonFarenheit.classList.remove('active');
    buttonCelsius.classList.add('active');

    localStorage.setItem('isFarengeit', 'true');

    showAdress(posLatitude, posLongitude);
    showWeatherNow(city);
    getTempLocalStorage();
  }

  getTempLocalStorage();

  buttonSearch.addEventListener('click', showSearchCity);
  window.addEventListener('keypress', addKeyBoard);
  buttonRefresh.addEventListener('click', getBackground);
  buttonCelsius.addEventListener('click', transferFarenheitToCelsius);
  buttonFarenheit.addEventListener('click', transferCelsiusToFarenheit);
  buttonEnglishlanguage.addEventListener('click', langEn);
  buttonRussianLanguage.addEventListener('click', langRu);
};
