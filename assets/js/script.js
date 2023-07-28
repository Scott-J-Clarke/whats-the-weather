// For Open Weather:
var apiKey = "5c94e30f21e7776fe6e78eefc9d73926";

// Today's date:
var todayEl = dayjs();

// Search button element:
var searchButtonEl = document.getElementById("searchButton");

// Variables for HTML elements in top card:
var cityEl = document.getElementById("city");
var todayDate = document.getElementById("today-date");
var todayWeatherIcon = document.getElementById("today-icon")
var todayTemperatureEl = document.getElementById("today-temperature");
var todayWindEl = document.getElementById("today-wind");
var todayHumidityEl = document.getElementById("today-humidity");

// Variables for 5-day forecast:
var fiveDayIconEl = document.querySelectorAll(".weather-icon");
var fiveDayTempEl = document.querySelectorAll(".temperature");
var fiveDayWindEl = document.querySelectorAll(".wind");
var fiveDayHumidityEl = document.querySelectorAll(".humidity");

// Keeps list of previously searched cities under "Search" button:
var cityList = document.getElementById("city-list");

// Function sets dates for today's weather and 5-day forecast:
function setDates() {

  var allDates = document.querySelectorAll(".date");

  for (var i = 0; i < allDates.length; i++) {
    allDates[i].textContent = todayEl.add([i + 1], "d").format(" (MM/DD/YYYY)");
  }
}

function getApi(cityTextEl) {

  // Returns temperature in Celsius:
  var weatherToday = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityTextEl + '&units=metric&appid=' + apiKey;

  fetch(weatherToday)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      cityEl.textContent = data.name;
      todayDate.textContent = todayEl.format(" (MM/DD/YYYY)");
      var weatherIcon = data.weather[0].icon;
      var todayIconUrl = "http://openweathermap.org/img/w/" + weatherIcon + ".png";
      todayWeatherIcon.setAttribute("src", todayIconUrl); // Sets current weather icon
      todayTemperatureEl.textContent = data.main.temp; // Current temperature
      todayWindEl.textContent = data.wind.speed; // Current wind speed
      todayHumidityEl.textContent = data.main.humidity; // Current humidity
    });

  var fiveDayForecast = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityTextEl + '&units=metric&appid=' + apiKey;

  // Returns array of 40 weather forecast objects, with each object at the next 3-hour increment:
  fetch(fiveDayForecast)
    .then(function (response) {
      return response.json();
    })
    // Returns arry of 5 weather forecast objects, with each object representing one day in the 5-day forecast:
    .then(function (data) {
      var fiveDayData = [];
      for (let i = 7; i < data.list.length; i += 8) {
        fiveDayData = [...fiveDayData, data.list[i]];
      }

      // Five-day weather icon for loop:
      for (var i = 0; i < fiveDayData.length; i++) {
        var iconUrl = "http://openweathermap.org/img/w/" + fiveDayData[i].weather[0].icon + ".png";
        fiveDayIconEl[i].setAttribute("src", iconUrl);
      }

      // Five-day temperature for loop:
      for (var i = 0; i < fiveDayData.length; i++) {
        fiveDayTempEl[i].textContent = fiveDayData[i].main.temp;
      }

      // Five-day wind speed for loop:
      for (var i = 0; i < fiveDayData.length; i++) {
        fiveDayWindEl[i].textContent = fiveDayData[i].wind.speed;
      }

      // Five-day humidity for loop:
      for (var i = 0; i < fiveDayData.length; i++) {
        fiveDayHumidityEl[i].textContent = fiveDayData[i].main.humidity;
      }
    })
  
  // Calling function to store city name in history under "Search" button:
  storeCity("City name", cityTextEl);
  
  // Local storage:
  function storeCity(key, value) {
    var values = JSON.parse(localStorage.getItem(key)) || [];

    // If city from search history is clicked on, prevents city from being added to local storage array:
    if (!values.includes(value)) {
      values.push(value);
      localStorage.setItem(key, JSON.stringify(values));
    }
  }
}

function retrieveCity() {
  var cityName = JSON.parse(localStorage.getItem("City name")) || [];
  
  // Clears out the previous city in list:
  cityList.textContent = "";
  // Adds each new city to search history under "Search" button:
  cityName.map(function (city) {
    var cityListEl = document.createElement("li");
    cityListEl.textContent = city;
    cityListEl.setAttribute("class", "city");
    cityList.appendChild(cityListEl);
  })
}

// Removes hidden class on "Search" button click from some elements, like weather icon:
function displayElements() {
  todayWeatherIcon.classList.remove("hidden");
  for (var i = 0; i < fiveDayIconEl.length; i++) {
    fiveDayIconEl[i].classList.remove("hidden")
  }
}

searchButtonEl.addEventListener("click", function (event) {
  event.preventDefault();
  // Holds city name typed into the "Search for a City" input:
  var cityTextEl = document.getElementById("searchBox").value;
  setDates();
  getApi(cityTextEl);
  retrieveCity();
  displayElements();
})

// Calls up data - today's weather and 5-day forecast - for any cities clicked on in search history:
cityList.onclick = function (event) {
  if (event.target.className === "city") {
    getApi(event.target.innerHTML)
  }
}

// Calls retrieveCity function related to local storage:
retrieveCity();
