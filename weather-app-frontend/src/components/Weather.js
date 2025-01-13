import React, { useState } from "react";
import axios from "axios";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    try {
      setError(""); // Clear previous errors
      const response = await axios.get("http://localhost:5000/weather", {
        params: { city },
      });
      setWeather(response.data); // Set the fetched weather data
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch weather data");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Weather</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div>
          <h2>Weather for {city}</h2>
          <p>Temperature: {weather.current.temp}°C</p>
          <p>Humidity: {weather.current.humidity}%</p>
          <p>Weather: {weather.current.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
