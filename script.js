async function getWeatherData(location) {

    const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&include=current&key=XKG3RWDBXC4S88GBXU4QWHFBY&contentType=json`
    );
    const weatherData = await response.json();
    return weatherData;
}

function processWeatherData(weatherData) {
    const address = weatherData.resolvedAddress;
    const currentWeather = weatherData.currentConditions;
    const { temp, humidity, precip, snow, windspeed, conditions, icon } = currentWeather;
    return { address, temp, humidity, precip, snow, windspeed, conditions, icon };
}

function createWeatherEntry(key, value, unit = null) {
    const entry = document.createElement("p");
    entry.textContent = value === null? `${key}: Unknown` : 
        unit === null ? `${key}: ${value}` :
        `${key}: ${value} ${unit}`;
    return entry;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function displayWeatherInfo(processedWeatherData, tempIsCelsius) {
    const weatherInfoContainer = document.querySelector(".weather-info-container");
    removeAllChildNodes(weatherInfoContainer);

    const tempUnit = tempIsCelsius ? "°C" : "°F";
    const temp = tempIsCelsius ? processedWeatherData.temp : (processedWeatherData.temp * 1.8 + 32).toFixed(1);
    weatherInfoContainer.appendChild(createWeatherEntry("Location", processedWeatherData.address));
    const weatherIcon = document.createElement("img");
    weatherIcon.classList.add("weather-icon");
    weatherIcon.src = `./icons/${processedWeatherData.icon}.svg`;
    weatherInfoContainer.appendChild(weatherIcon);
    weatherInfoContainer.appendChild(createWeatherEntry("Temperature", temp, tempUnit));
    weatherInfoContainer.appendChild(createWeatherEntry("Conditions", processedWeatherData.conditions));
    weatherInfoContainer.appendChild(createWeatherEntry("Humidity", processedWeatherData.humidity, "%"));
    weatherInfoContainer.appendChild(createWeatherEntry("Precipitation", processedWeatherData.precip, "mm"));
    weatherInfoContainer.appendChild(createWeatherEntry("Snow", processedWeatherData.snow, "cm"));
    weatherInfoContainer.appendChild(createWeatherEntry("Wind speed", processedWeatherData.windspeed, "km/h"));
}

function displayGetWeatherError(location) {
    const weatherContextContainer = document.querySelector(".weather-context-container");
    const errorElem = document.createElement("p");
    errorElem.classList.add("get-error");
    errorElem.textContent = `Error when fetching weather from location "${location}"`;
    weatherContextContainer.appendChild(errorElem);
}

function removeGetWeatherError() {
    const weatherContextContainer = document.querySelector(".weather-context-container");
    const errorElem = document.querySelector(".get-error");
    if (errorElem)
        weatherContextContainer.removeChild(errorElem);
}

async function getAndDisplayWeather(location) {
    try {
        const weatherData = await getWeatherData(location);
        const processedWeatherData = processWeatherData(weatherData);
        displayWeatherInfo(processedWeatherData, tempIsCelsius);
    } catch (err) {
        displayGetWeatherError(location);
    }
}

const getWeatherButton = document.querySelector(".weather-context input[type='submit']");
getWeatherButton.addEventListener("click", (e) => {
    e.preventDefault();
    removeGetWeatherError();

    const locationInput = document.querySelector("#location");
    const location = locationInput.value;
    getAndDisplayWeather(location);
});

let tempIsCelsius = true;
getAndDisplayWeather("Rome");
