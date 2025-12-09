let apiKey = "442bae3791eb40b2922134552250611"; //deleted as of now

async function getWeather() {
    let cityInput = document.getElementById('city-input');
    let temperatureText = document.getElementById('temperature');
    let dayOrNightText = document.getElementById('isDay');
    let currentWeatherText = document.getElementById('current');
    let city = cityInput.value.trim();
    try {
        let response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
        );

        let data = await response.json();
        console.log(data);

        currentWeatherText.innerText = '☁️ ' + data.current.condition.text;
        temperatureText.innerText = '🌡️ ' + data.current.temp_c + ' deg.C';
        if(data.current.is_day === 1){
            dayOrNightText.innerText = '🕒 Currently day time';
        }
        else{
            dayOrNightText.innerText = '🕒 Currently Night time';
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        currentWeatherText.innerText = 'Error loading weather';
    }
    currentWeatherText.style.display = "block";
    temperatureText.style.display = "block";
    dayOrNightText.style.display = "block";
}