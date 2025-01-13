const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;
const units = "metric"; // metric, imperial, standard

app.get("/weather", async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

    const geoResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct`,
      {
        params: {
          q: city, // The city name, e.g., "New York"
          limit: 1, // Get only the first matching city
          appid: API_KEY, // Your OpenWeatherMap API key
        },
      }
    );

    if (geoResponse.data.length === 0) {
      return res.status(404).json({ error: "City not found" });
    }

    const { lat, lon } = geoResponse.data[0];

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall`,
      {
        params: {
          lat: lat,
          lon: lon,
          units: units,
          appid: API_KEY,
        },
      }
    );

    res.json(weatherResponse.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
