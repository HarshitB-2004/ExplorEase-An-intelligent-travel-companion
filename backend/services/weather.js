// server/src/services/weather.js
import axios from "axios";

export async function getWeatherForecast(location, start, end) {
  // location: e.g. "New York,NY" or "New York"
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}/${start}/${end}`;

  const params = {
    key: process.env.VISUALCROSSING_API_KEY,
    unitGroup: "metric",
    include: "days"
  };

  const { data } = await axios.get(url, { params });
  // Map to small useful structure
  return (data.days || []).map(day => ({
    date: day.datetime, // "2025-11-16"
    conditions: day.conditions || day.description || "",
    tempmax: Math.round(day.tempmax ?? 0),
    tempmin: Math.round(day.tempmin ?? 0),
    precipprob: day.precipprob ?? 0,
    icon: day.icon ?? null
  }));
}
