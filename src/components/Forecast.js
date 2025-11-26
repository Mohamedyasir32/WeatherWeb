import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Forecast.css";

const Forecast = () => {
  const { city } = useParams();
  const navigate = useNavigate();

  const [forecast, setForecast] = useState([]);
  const [hourly12, setHourly12] = useState([]);
  const [current, setCurrent] = useState(null);
  const [time, setTime] = useState("");

  const API_KEY = "e7f3c7c6aca9367b5dfe04fc715bdbb0";

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString());
    tick();
    const int = setInterval(tick, 1000);
    return () => clearInterval(int);
  }, []);


const generateNext12Hours = (list) => {
  const now = new Date();
  const hourly = [];
  const futureList = list.filter(item => new Date(item.dt_txt) >= now);

  for (let i = 0; i < futureList.length - 1; i++) {
    const a = futureList[i];
    const b = futureList[i + 1];

    const start = new Date(a.dt_txt).getTime();

    hourly.push({
      time: new Date(start).toTimeString().slice(0, 5),
      temp: a.main.temp,
      humidity: a.main.humidity,
      wind: a.wind.speed,
      main: a.weather[0].main
    });

    for (let h = 1; h < 3; h++) {
      const factor = h / 3;
      const t = new Date(start + h * 3600000);

      hourly.push({
        time: t.toTimeString().slice(0, 5),
        temp: (a.main.temp + (b.main.temp - a.main.temp) * factor).toFixed(1),
        humidity: Math.round(a.main.humidity + (b.main.humidity - a.main.humidity) * factor),
        wind: (a.wind.speed + (b.wind.speed - a.wind.speed) * factor).toFixed(1),
        main: a.weather[0].main
      });
    }

    if (hourly.length >= 12) break;
  }

  return hourly.slice(0, 12);
};


 useEffect(() => {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
  )
    .then((res) => res.json())
    .then((data) => {
      if (!data.list) return;
              const now = new Date();
        const currentWeather = data.list.find(item => new Date(item.dt_txt) >= now) || data.list[0];
        setCurrent(currentWeather);

        const hourly = generateNext12Hours(data.list);
        setHourly12(hourly);

        const days = data.list.filter(d => d.dt_txt.includes("12:00:00"));
        setForecast(days.slice(0, 5));
      });
  }, [city]);



  return (
    <div className="forecast-page">
      <h1>📅 {city} - Forecast</h1>

      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      {current && (
        <div className="current-weather-box">
          <h2>{city}</h2>
          <p className="current-condition">{current.weather[0].main}</p>
          <p className="current-temp">{current.main.temp}°C</p>
          <p className="current-desc">{current.weather[0].description}</p>

          <div className="current-details">
            <p>Humidity: {current.main.humidity}%</p>
            <p>Wind: {current.wind.speed} km/h</p>
            <p>Date: {current.dt_txt.split(" ")[0]}</p>
            <p>Time: {time}</p>
          </div>
        </div>
      )}

      <h2 className="section-title">🕒 Next 12 Hours</h2>
    <div className="hours">
      <div className="hourly-scroll">
        {hourly12.map((hr, i) => (
          <div className="hour-item" key={i}>
            <p className="hour-time">{hr.time}</p>
            <p>🌡 {hr.temp}°C</p>
            <p>☁ {hr.main}</p>
            <p>💧 {hr.humidity}%</p>
            <p>💨 {hr.wind} km/h</p>
          </div>
        ))}
      </div>
      </div>
      <h2 className="section-title">📆 5 Day Forecast</h2>

      <div className="forecast-list">
        {forecast.map((day, i) => (
          <div className="forecast-item" key={i}>
            <h3>{day.dt_txt.split(" ")[0]}</h3>
            <p>🌡 {day.main.temp}°C</p>
            <p>☁ {day.weather[0].main}</p>
            <p>💧 {day.main.humidity}%</p>
            <p>💨 {day.wind.speed} km/h</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
