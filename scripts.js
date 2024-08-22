const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const card = document.querySelector('.card');

const apiKey = 'ff04ff0412a2e164297cf91781b4c31f';

searchBtn.addEventListener('click', async () => {
    await handleSearch();
});

// Event listener for Enter key press
cityInput.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        await handleSearch();
    }
});

async function handleSearch() {

    const cityName = cityInput.value;

    if (cityName) {
        try {
            const weatherData = await getWeatherData(cityName);
            displayWeatherInfo(weatherData);
            saveWeatherData(cityName, weatherData); // Save to localStorage
        }
        catch(error){
            displayCityError();
            clearWeatherData();
        }
    }
    else {
        displayNoCityError();
        clearWeatherData();
    }
}

window.addEventListener('load', () => {
    const savedCityName = localStorage.getItem('savedCityName');
    const savedWeatherData = localStorage.getItem('savedWeatherData');

    if (savedCityName && savedWeatherData) {
        const weatherData = JSON.parse(savedWeatherData);
        displayWeatherInfo(weatherData);
        cityInput.value = savedCityName; // Optionally, show the saved city in the input
    }
});

async function getWeatherData(city) {
    
    const fetchURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await fetch(fetchURL);

    if(!response.ok) {
        throw new Error('Could not Fetch Weather Data');
    }
    
    return await response.json();
}

function displayWeatherInfo(data){

    const {name: city, 
           main: {temp, humidity, feels_like}, 
           weather: [{description, id}]} = data;

    card.textContent = "";
    card.style.display = "block";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const feelsLikeDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${((temp - 273.15)).toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    feelsLikeDisplay.textContent = `Feels like: ${(feels_like - 273.15).toFixed(1)}`;
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("city", "name");
    tempDisplay.classList.add("city", "temp");
    humidityDisplay.classList.add("city", "hum");
    feelsLikeDisplay.classList.add("city", "feels");
    descDisplay.classList.add("city", "weather");
    weatherEmoji.classList.add("city", "emoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(feelsLikeDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
}

function getWeatherEmoji(weatherId){

    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌦️";
        case (weatherId >= 600 && weatherId < 700):
            return "🌨️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
        case (weatherId === 800):
            return "🌞";
        case (weatherId >= 801 && weatherId < 810):
            return "💨";
        default:
            return "❓";
    }
}

function displayCityError() {
    card.textContent = "";
    card.style.display = "block";

    const cityDisplay = document.createElement("h1");
    cityDisplay.classList.add("city", "name");

    cityDisplay.textContent = 'City was not Found';

    card.appendChild(cityDisplay);

}

function displayNoCityError() {
    card.textContent = "";
    card.style.display = "block";
    card.style.width = "100%";
    card.style.background = "whitesmoke";

    const cityDisplay = document.createElement("p");
    cityDisplay.classList.add("city");

    cityDisplay.textContent = 'Please enter a city';
    
    card.appendChild(cityDisplay);

}

function saveWeatherData(city, data) {
    localStorage.setItem('savedCityName', city);
    localStorage.setItem('savedWeatherData', JSON.stringify(data));
}

// Clear weather data from localStorage
function clearWeatherData() {
    localStorage.removeItem('savedCityName');
    localStorage.removeItem('savedWeatherData');
}