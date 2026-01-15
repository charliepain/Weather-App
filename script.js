async function getWeatherData(location) {
    try {
        const response = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=XKG3RWDBXC4S88GBXU4QWHFBY&contentType=json`
        );
        const weatherData = await response.json();
        return weatherData;
    } catch (err) {
        console.log(`Error getWeatherData("${location}")`);
        throw err;
    }
}

function processWeatherData(weatherData) {
    const currentWeather = weatherData.currentConditions;
    const {datetime, temp, humidity, precip, snow, windspeed, conditions} = currentWeather;
    return {datetime, temp, humidity, precip, snow, windspeed, conditions};
}

const processedWeatherData = getWeatherData("London")
    .then((weatherData) => console.log(processWeatherData(weatherData)));
