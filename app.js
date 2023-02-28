function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];

  return `${day} ${hours}:${minutes}`;
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class= row>`;

  let days = ["Thu", "Fri", "Sat", "Sun"];

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col">
                <div class="weather-forecast-date">${formatDay(
                  forecastDay.time
                )}</div>
                <img
                  src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                    forecastDay.condition.icon
                  }.png"
                  alt=""
                  width="42"
                />
                <div class="weather-forecast-temperatures">
                  <span class="weather-forecast-temp-max"> ${Math.round(
                    forecastDay.temperature.maximum
                  )}°
                  </span>
                  <span class="weather-forecast-temp-min"> ${Math.round(
                    forecastDay.temperature.minimum
                  )}°
                  </span>
                </div>
              </div>
        `;
    }
  });
  forecastHTML = forecastHTML + `</div> `;
  forecastElement.innerHTML = forecastHTML;
}
function getForecast(coordinates) {
  let apiKey = "0a67b3414ce60t375c8b0o92fa83e7a7";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&key=0a67b3414ce60t375c8b0o92fa83e7a7&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// Feature #1
let dateElement = document.querySelector("#date");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

// Feature #2
function searchCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let city = document.querySelector("#city");
  city.innerHTML = `${cityInput.value}`;
  searchCurrentCity(cityInput.value);
}

let cityForm = document.querySelector("#search-form");
cityForm.addEventListener("submit", searchCity);

// 🙀Bonus Feature

function toFahrenheit(event) {
  let temperatureChange = document.querySelector("#temperature");
  temperatureChange.innerHTML = Math.round(
    (temperatureChange.innerHTML * 9) / 5 + 32
  );
}

function toCelcius(event) {
  let temperatureChange = document.querySelector("#temperature");
  temperatureChange.innerHTML = Math.round(
    ((temperatureChange.innerHTML - 32) * 5) / 9
  );
}
let temperatureF = document.querySelector("#fahrenheit-link");
temperatureF.addEventListener("click", toFahrenheit);
let temperatureC = document.querySelector("#celsius-link");
temperatureC.addEventListener("click", toCelcius);

function displayWeatherCondition(response) {
  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.temperature.current
  );

  document.querySelector("#humidity").innerHTML =
    response.data.temperature.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.condition.description;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );

  getForecast(response.data.coordinates);
}

function searchCurrentCity(city) {
  let apiKey = "0a67b3414ce60t375c8b0o92fa83e7a7";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function searchPosition(position) {
  let apiKey = "0a67b3414ce60t375c8b0o92fa83e7a7";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${position.coords.longitude}&lat=${position.coords.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchPosition);
}
let currentLocation = document.querySelector("#current-button");

currentLocation.addEventListener("click", getCurrentLocation);
searchCurrentCity("Johannesburg");
