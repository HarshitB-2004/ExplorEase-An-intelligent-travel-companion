const API_BASE_URL = "http://localhost:5000/api";

export const getFlights = async (city) => {
  const res = await fetch(`${API_BASE_URL}/flights/search?from=DEL&to=BOM`);
  return res.json();
};

export const getHotels = async (city) => {
  const res = await fetch(`${API_BASE_URL}/hotels/search?city=${city}`);
  return res.json();
};

export const getActivities = async (city) => {
  const res = await fetch(`${API_BASE_URL}/activities/search?city=${city}`);
  return res.json();
};
