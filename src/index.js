import { LanguageEN } from "./language-en.js";
import { LanguageRU } from "./language-ru.js";
import "./style.css";

window.addEventListener("load", function () {
  let posLatitude;
  let posLongitude;
  const buttonRefresh = document.querySelector("#control_button");
  const buttonFarenheit = document.querySelector("#farenheit");
  const buttonCelsius = document.querySelector("#celsius");
  const inputCity = document.querySelector(".search_input");
  const buttonSearch = document.querySelector("#search_button");
  const locationCity = document.querySelector("#location_city");
  const dateNow = document.querySelector(".date_now");
  const timeNow = document.querySelector(".time_now");
  const tempretureNow = document.querySelector(".tempreture_now");
  const latitude = document.querySelector(".latitude");
  const longitude = document.querySelector(".longitude");
  const body = document.querySelector("#body");
  const overcast = document.querySelector("#overcast");
  const feelsLike = document.querySelector("#feelsLike");
  const speedWind = document.querySelector("#speedWind");
  const humidity = document.querySelector("#humidity");
  const iconWeatherNow = document.querySelector(".icon_weatherNow");
  const iconOne = document.querySelector(".icon_one");
  const iconTwo = document.querySelector(".icon_two");
  const iconThree = document.querySelector(".icon_three");
  const firstDay = document.querySelector("#firstDay");
  const secondDay = document.querySelector("#secondDay");
  const thirdDay = document.querySelector("#thirdDay");
  const firstTemperature = document.querySelector("#firstTemperature");
  const secondTemperature = document.querySelector("#secondTemperature");
  const thirdTemperature = document.querySelector("#thirdTemperature");
  const buttonRussianLanguage = document.querySelector("#language_ru");
  const buttonEnglishlanguage = document.querySelector("#language_en");
  const localLang = localStorage.getItem("lang");
  const localTemp = localStorage.getItem("isFarengeit");
  const isRu = localLang && localLang === "ru";
  let isFarengeit = localTemp === "true";
  let weather;
  let adress;
  let city = localStorage.getItem("city");
  let lang = isRu ? "ru" : "en";
  let info = isRu ? LanguageRU : LanguageEN;

  function activeButtonTemp(buttonFarenheit, buttonCelsius) {
    buttonFarenheit.classList.remove("active");
    buttonCelsius.classList.add("active");
    localStorage.setItem("isFarengeit", isFarengeit);
    showAdress(posLatitude, posLongitude);
    showWeatherNow(city);
  }

  function initializeTempButton() {
    if (isFarengeit) {
      buttonFarenheit.classList.add("active");
      buttonCelsius.classList.remove("active");
    }
  }

  initializeTempButton();

  function transferCelsiusToFarenheit() {
    isFarengeit = true;
    activeButtonTemp(buttonCelsius, buttonFarenheit);
  }

  function transferFarenheitToCelsius() {
    isFarengeit = false;
    activeButtonTemp(buttonFarenheit, buttonCelsius);
  }

  function activeButtonLang(buttonRussianLanguage, buttonEnglishlanguage) {
    buttonRussianLanguage.classList.add("active");
    buttonRussianLanguage.classList.remove("not_active");
    buttonEnglishlanguage.classList.remove("active");
    buttonEnglishlanguage.classList.add("not_active");
  }

  function initializeLangButton() {
    if (isRu) {
      activeButtonLang(buttonRussianLanguage, buttonEnglishlanguage);
    }
  }

  initializeLangButton();

  function changeLocalLang() {
    localStorage.setItem("lang", lang);
    showAdress(posLatitude, posLongitude);
    showWeatherNow(city);
    getCoordinats(posLatitude, posLongitude);
  }

  function langRu() {
    lang = "ru";
    info = LanguageRU;
    activeButtonLang(buttonRussianLanguage, buttonEnglishlanguage);
    changeLocalLang();
  }

  function langEn() {
    lang = "en";
    info = LanguageEN;
    activeButtonLang(buttonEnglishlanguage, buttonRussianLanguage);
    changeLocalLang();
  }

  function getAdress(posLatitude, posLongitude) {
    return fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${posLatitude}+${posLongitude}&key=8466357058924cb6ab7663a46faa152a&language=${lang}&pretty=1`
    ).then((response) => response.json());
  }

  async function showAdress(posLatitude, posLongitude) {
    try {
      adress = await getAdress(posLatitude, posLongitude);

      const locations = adress.results[0].components;
      city = locations.city;
      const { country } = locations;

      locationCity.textContent = `${city}, ${country}`;
      showWeatherNow(city);
    } catch (error) {
      alert(error);
    }
  }

  function searchSity(city) {
    return fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=8466357058924cb6ab7663a46faa152a&language=${lang}&pretty=1`
    ).then((response) => response.json());
  }

  async function showSearchCity(city) {
    try {
      if (!city) {
        city = inputCity.value;
      }
      adress = await searchSity(city);

      if (adress) {
        const result = adress.results[0].components;
        city = result.city
          ? result.city
          : result.town
          ? result.town
          : result.village;

        const { country } = result;
        locationCity.textContent = `${city}, ${country}`;

        const pos = adress.results[0].geometry;

        posLatitude = pos.lat.toFixed(2);
        posLongitude = pos.lng.toFixed(2);

        localStorage.setItem("city", city);
        inputCity.value = "";

        showWeatherNow(city);
        getMap(posLatitude, posLongitude);
        getCoordinats(posLatitude, posLongitude);
      }
    } catch (error) {
      alert(error);
    }
  }

  const getWeatherNow = async (city) =>
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=${lang}&units=metric&appid=acb152250020945076707f815f4ffbb1`
    ).then((response) => response.json());

  async function showWeatherNow(city) {
    try {
      weather = await getWeatherNow(city);

      const data = weather.list;
      const feelLike = data[0].main.feels_like;
      const temporaryNow = Math.round(data[0].main.temp);
      const firstTemporary = data[8].main.temp;
      const secTemporary = data[16].main.temp;
      const thirdTemporary = data[24].main.temp;

      tempretureNow.textContent = isFarengeit
        ? `${Math.round(temporaryNow * (9 / 5) + 32)}°`
        : `${temporaryNow}°`;
      firstTemperature.textContent = isFarengeit
        ? `${Math.round(firstTemporary * (9 / 5) + 32)}°`
        : `${Math.round(firstTemporary)}°`;
      secondTemperature.textContent = isFarengeit
        ? `${Math.round(secTemporary * (9 / 5) + 32)}°`
        : `${Math.round(secTemporary)}°`;
      thirdTemperature.textContent = isFarengeit
        ? `${Math.round(thirdTemporary * (9 / 5) + 32)}°`
        : `${Math.round(thirdTemporary)}°`;

      overcast.textContent = data[0].weather[0].description;

      feelsLike.textContent = isFarengeit
        ? `${info.summary.feels} ${`${Math.round(feelLike * (9 / 5) + 32)}°`}`
        : `${info.summary.feels} ${`${Math.round(feelLike)}°`}`;

      humidity.textContent = `${info.summary.humidity} ${data[0].main.humidity}%`;
      speedWind.textContent = `${
        info.summary.wind
      } ${data[0].wind.speed.toFixed()} ${info.summary.speed}`;

      iconWeatherNow.style.backgroundImage = `url(http://openweathermap.org/img/wn/${data[0].weather[0].icon}@2x.png)`;
      iconOne.style.backgroundImage = `url(http://openweathermap.org/img/wn/${data[8].weather[0].icon}@2x.png)`;
      iconTwo.style.backgroundImage = `url(http://openweathermap.org/img/wn/${data[16].weather[0].icon}@2x.png)`;
      iconThree.style.backgroundImage = `url(http://openweathermap.org/img/wn/${data[24].weather[0].icon}@2x.png)`;

      showTime();
    } catch (error) {
      alert(error);
    }
  }

  function showTime() {
    const now = new Date();
    const currentTimeZoneOffsetInHours = now.getTimezoneOffset() * 60000;
    const localTime =
      now.getTime() +
      currentTimeZoneOffsetInHours +
      weather.city.timezone * 1000;
    const today = new Date(localTime);
    const hour = today.getHours();
    const min = today.getMinutes();
    const sec = today.getSeconds();
    timeNow.textContent = `${addZero(hour)}:${addZero(min)}:${addZero(sec)}`;
    let dayofWeek = today.getDay();
    const dayNumber = today.getDate();
    const month = today.getMonth();

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
    return (Number.parseInt(n, 10) < 10 ? "0" : "") + n;
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

  function initializeCity() {
    if (city) {
      showSearchCity(city);
    } else {
      createMap();
    }
  }

  initializeCity();

  function getCoordinats(posLatitude, posLongitude) {
    const lat = String(posLatitude).split(".");
    const lon = String(posLongitude).split(".");
    const latMinutes = lat[0];
    const latSeconds = lat[1];
    const lonMinutes = lon[0];
    const lonSeconds = lon[1];

    latitude.textContent = `${info.positions.latit} ${latMinutes}°  ${latSeconds}'`;
    longitude.textContent = `${info.positions.longit} ${lonMinutes}°  ${lonSeconds}'`;
    buttonSearch.textContent = `${info.search.but}`;
    inputCity.placeholder = `${info.search.input}`;
  }

  function getMap(posLatitude, posLongitude) {
    mapboxgl.accessToken =
      "pk.eyJ1IjoieWF1aGVuaWJlaWR1ayIsImEiOiJja2o3b2llMzUwcDNwMnJwNWtuOG82MzlpIn0.cNTogxbQEyS45pQYibK8mA";
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [posLongitude, posLatitude],
      zoom: 9,
    });
    const marker = new mapboxgl.Marker()
      .setLngLat([posLongitude, posLatitude])
      .addTo(map);
  }

  const getLinkToImage = async () => {
    const url =
      "https://api.unsplash.com/photos/random?&client_id=e2077ad31a806c894c460aec8f81bc2af4d09c4f8104ae3177bb809faf0eac17";
    const response = await fetch(url);
    const data = await response.json();
    return data.urls.regular;
  };

  async function getBackground() {
    try {
      const backgroundLink = await getLinkToImage();
      body.style.backgroundImage = `url(${backgroundLink})`;
      body.style.transition = "1s";
    } catch (error) {
      alert(error);
    }
  }

  function addKeyBoard(e) {
    if (e.which === 13) {
      showSearchCity();
    }
  }

  buttonSearch.addEventListener("click", showSearchCity);
  window.addEventListener("keypress", addKeyBoard);
  buttonRefresh.addEventListener("click", getBackground);
  buttonCelsius.addEventListener("click", transferFarenheitToCelsius);
  buttonFarenheit.addEventListener("click", transferCelsiusToFarenheit);
  buttonEnglishlanguage.addEventListener("click", langEn);
  buttonRussianLanguage.addEventListener("click", langRu);
});
