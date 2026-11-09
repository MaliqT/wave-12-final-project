async function getWeather() {
    const url = "https://api.open-meteo.com/v1/forecast";

    try {
        const response = await axios.get(url, {
            params: {
                latitude: 47.61,
                longitude: -122.33,
                current: "temperature_2m,weather_code",
                temperature_unit: "fahrenheit",
                timezone: "auto"
            }
        });

        console.log(response.data);

        const weatherCode = response.data.current.weather_code;
        const temp = response.data.current.temperature_2m;
        const tempEl = document.getElementById("weather-temperature");
        tempEl.textContent = `${temp}°F`;

        const weatherCondition = document.getElementById("weather-condition");
        weatherCondition.textContent = getWeatherDescription(weatherCode);

        const weatherIcon = document.getElementById("weather-icon");
        weatherIcon.textContent = getWeatherIcons(weatherCode);
        
    } catch (err) {
        console.err(`Failed to retrieve weather: ${err}`);
    }
}

getWeather();

function getWeatherDescription(weatherCode) {
    if (weatherCode === 0) {
        return `Clear Sky`;
    } else if (weatherCode >= 1 && weatherCode <= 3) {
        return `Mostly clear, partly cloudy`;
    } else if (weatherCode >= 61 && weatherCode <= 63) {
        return `Rainy`;
    } else if (weatherCode >= 71 && weatherCode <= 75) {
        return `Snow`;
    } else {
        return `Thunderstorm`;
    }
}

function getWeatherIcons(weatherCode) {
    if (weatherCode === 0) {
        return `sunny`;
    } else if (weatherCode >= 1 && weatherCode <= 3) {
        return `partly_cloudy_day`;
    } else if (weatherCode >= 61 && weatherCode <= 63) {
        return `rainy`;
    } else if (weatherCode >= 71 && weatherCode <= 75) {
        return `weather_snowy`;
    } else {
        return `thunderstorm`;
    }
}