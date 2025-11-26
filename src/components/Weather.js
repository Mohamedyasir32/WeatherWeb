import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Weather.css";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherList, setWeatherList] = useState([]);
  const [time, setTime] = useState("");

  const navigate = useNavigate();
  const API_KEY = "e7f3c7c6aca9367b5dfe04fc715bdbb0";

  // Live Clock
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString());
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load saved cards
  useEffect(() => {
    const savedWeatherList = localStorage.getItem("multiWeatherData");
    if (savedWeatherList) {
      setWeatherList(JSON.parse(savedWeatherList));
    }
  }, []);

  // Fetch weather
  const fetchWeather = async () => {
    if (!city.trim()) return;

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();

    if (data.cod !== 200) {
      alert("City not found!");
      return;
    }

    if (weatherList.some((item) => item.name === data.name)) {
      alert("Weather card already added!");
      return;
    }

    const updatedList = [...weatherList, data];
    setWeatherList(updatedList);
    localStorage.setItem("multiWeatherData", JSON.stringify(updatedList));

    setCity("");
  };

  // ❌ Delete Weather Card
  const deleteCard = (name) => {
    const updatedList = weatherList.filter((item) => item.name !== name);
    setWeatherList(updatedList);
    localStorage.setItem("multiWeatherData", JSON.stringify(updatedList));
  };

  return (
    <div className="weather-app">
      <h1>🌤 Weather App</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter City..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
        />
        <button onClick={fetchWeather}>Add City</button>
      </div>

      <div className="weather-card-list">
        {weatherList.map((weather, index) => (
          <div key={index} className="weather-container">
            <div className="container-head">
            <h2>
              {weather.name}, {weather.sys.country}
            </h2>
              <button
              className="delete-btn"
              onClick={() => deleteCard(weather.name)}
            >
             Delete
            </button>
            </div>

            <p className="district">
              Weather Condition: {weather.weather[0].main}
            </p>

            <p className="time">🕒 {time}</p>

            <p className="temperature">{weather.main.temp}°C</p>
            <p className="weather-desc">{weather.weather[0].description}</p>

            <div className="weather-details">
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind: {weather.wind.speed} km/h</p>
              <p>Latitude: {weather.coord.lat}</p>
              <p>Longitude: {weather.coord.lon}</p>
            </div>

            <button
              className="forecast-btn"
              onClick={() => navigate(`/forecast/${weather.name}`)}
            >
              View Forecast →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;
