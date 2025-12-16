let apiKey = "Generate you own!"; 

function getCurrentLocation() {
    const loading = document.getElementById('loading');
    const errorDiv = document.getElementById('error');

    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }

    window.addEventListener('load', () => {

         getCurrentLocation();
    });
    loading.style.display = 'block';

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log(`Lat: ${latitude}, Lon: ${longitude}`);
            try {
                const response = await fetch(
                    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`
                );

                if (!response.ok) throw new Error('Failed to fetch weather');

                const data = await response.json();
                displayWeather(data);

                document.getElementById('city-input').value = data.location.name;

            } catch (error) {
                showError('Could not fetch weather for your location');
            } finally {
                loading.style.display = 'none';
            }
        },

        (error) => {
            loading.style.display = 'none';

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    showError('Location permission denied. Please enable location access in your browser settings.');
                    break;
                case error.POSITION_UNAVAILABLE:
                    showError('Location information unavailable');
                    break;
                case error.TIMEOUT:
                    showError('Location request timed out');
                    break;
                default:
                    showError('An unknown error occurred');
            }
        },
        {
            enableHighAccuracy: true, 
            timeout: 10000, 
            maximumAge: 0 
        }
    );
}
function getInfoForNavBar() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const dayName = days[date.getDay()];

    document.getElementById("time").innerText = `${hours}:${minutes}:${seconds}`;
    document.getElementById("date").innerText = `${year}/${month}/${day}`;
    document.getElementById("day").innerText = dayName;
}

setInterval(getInfoForNavBar, 1000);
getInfoForNavBar();

async function getWeather() {
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value.trim();

    if (!city) {
        showError('Please enter a city name');
        return;
    }

    const loading = document.getElementById('loading');
    const weatherDisplay = document.getElementById('weather-display');
    const errorDiv = document.getElementById('error');

    loading.style.display = 'block';
    weatherDisplay.classList.add('hidden');
    errorDiv.style.display = 'none';

    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
        );

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        displayWeather(data);

    } catch (error) {
        showError('Could not find weather data for that city. Please try again.');
    } finally {
        loading.style.display = 'none';
    }
}

function displayWeather(data) {
    const weatherDisplay = document.getElementById('weather-display');
    const body = document.body;

   
    document.getElementById('currentLocation').innerText = data.location.name;
    document.getElementById('locationName').innerText = `${data.location.name}, ${data.location.country}`;

 
    document.getElementById('weatherCondition').innerText = data.current.condition.text;
    document.getElementById('mainTemp').innerText = `${Math.round(data.current.temp_c)}°`;
    document.getElementById('feelsLike').innerText = `Feels like ${Math.round(data.current.feelslike_c)}°C`;


    const iconMap = {
        'Sunny': '☀️',
        'Clear': '🌙',
        'Partly cloudy': '⛅',
        'Cloudy': '☁️',
        'Overcast': '☁️',
        'Mist': '🌫️',
        'Patchy rain possible': '🌦️',
        'Patchy snow possible': '🌨️',
        'Patchy sleet possible': '🌨️',
        'Patchy freezing drizzle possible': '🌧️',
        'Thundery outbreaks possible': '⛈️',
        'Blowing snow': '🌨️',
        'Blizzard': '❄️',
        'Fog': '🌫️',
        'Freezing fog': '🌫️',
        'Patchy light drizzle': '🌧️',
        'Light drizzle': '🌧️',
        'Freezing drizzle': '🌧️',
        'Heavy freezing drizzle': '🌧️',
        'Patchy light rain': '🌧️',
        'Light rain': '🌧️',
        'Moderate rain at times': '🌧️',
        'Moderate rain': '🌧️',
        'Heavy rain at times': '🌧️',
        'Heavy rain': '🌧️',
        'Light freezing rain': '🌧️',
        'Moderate or heavy freezing rain': '🌧️',
        'Light sleet': '🌨️',
        'Moderate or heavy sleet': '🌨️',
        'Patchy light snow': '🌨️',
        'Light snow': '🌨️',
        'Patchy moderate snow': '🌨️',
        'Moderate snow': '🌨️',
        'Patchy heavy snow': '❄️',
        'Heavy snow': '❄️',
        'Ice pellets': '🧊',
        'Light rain shower': '🌦️',
        'Moderate or heavy rain shower': '🌧️',
        'Torrential rain shower': '🌧️',
        'Light sleet showers': '🌨️',
        'Moderate or heavy sleet showers': '🌨️',
        'Light snow showers': '🌨️',
        'Moderate or heavy snow showers': '❄️',
        'Light showers of ice pellets': '🧊',
        'Moderate or heavy showers of ice pellets': '🧊',
        'Patchy light rain with thunder': '⛈️',
        'Moderate or heavy rain with thunder': '⛈️',
        'Patchy light snow with thunder': '⛈️',
        'Moderate or heavy snow with thunder': '⛈️'
    };

    const icon = iconMap[data.current.condition.text] || '🌤️';
    document.getElementById('mainIcon').innerText = icon;

 
    document.getElementById('humidity').innerText = `${data.current.humidity}%`;
    document.getElementById('windSpeed').innerText = `${data.current.wind_kph} km/h`;
    document.getElementById('windDir').innerText = `Direction: ${data.current.wind_dir}`;
    document.getElementById('visibility').innerText = `${data.current.vis_km} km`;
    document.getElementById('pressure').innerText = `${data.current.pressure_mb} mb`;
    document.getElementById('uvIndex').innerText = data.current.uv;


    const uvLevel = data.current.uv;
    let uvDesc = '';
    if (uvLevel <= 2) uvDesc = 'Low';
    else if (uvLevel <= 5) uvDesc = 'Moderate';
    else if (uvLevel <= 7) uvDesc = 'High';
    else if (uvLevel <= 10) uvDesc = 'Very High';
    else uvDesc = 'Extreme';
    document.getElementById('uvDescription').innerText = uvDesc;

    document.getElementById('timeOfDay').innerText = data.current.is_day ? 'Day' : 'Night';


    if (data.current.is_day) {
        body.className = 'day';
    } else {
        body.className = 'night';
    }

    weatherDisplay.classList.remove('hidden');
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.innerText = message;
    errorDiv.style.display = 'block';
}

document.getElementById('city-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});