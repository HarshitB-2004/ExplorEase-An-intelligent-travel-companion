import axios from "axios";
import crypto from "crypto";
import NodeCache from "node-cache";

export const cache = new NodeCache({ stdTTL: 60 * 15 }); // 15 min cache


// ================= AMADEUS =================

export async function amadeusToken() {
  const cached = cache.get("amadeus_token");
  if (cached) return cached;

  const res = await axios.post(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_CLIENT_ID,
      client_secret: process.env.AMADEUS_CLIENT_SECRET,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  cache.set("amadeus_token", res.data.access_token, res.data.expires_in - 60);

  return res.data.access_token;
}


// ================= HOTELBEDS SIGNATURE =================

export function hotelbedsSignature() {

  const timestamp = Math.floor(Date.now() / 1000).toString(); // IMPORTANT → STRING

  const signature = crypto
    .createHash("sha256")
    .update(
      process.env.HOTELBEDS_API_KEY +
      process.env.HOTELBEDS_API_SECRET +
      timestamp
    )
    .digest("hex");

  return { timestamp, signature };
}


// ================= AMADEUS GET =================

export async function amadeusGet(url, params = {}) {
  const token = await amadeusToken();

  return axios.get(url, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


// ================= HOTELBEDS GET =================

export async function hotelbedsGet(path, params = {}) {

  const { timestamp, signature } = hotelbedsSignature();

  return axios.get(`https://api.test.hotelbeds.com${path}`, {
    params,
    headers: {
      "Api-key": process.env.HOTELBEDS_API_KEY,
      "X-Signature": signature,
      "Accept": "application/json",
      "Content-Type": "application/json", // REQUIRED
      "X-Timestamp": timestamp
    },
  });
}


// ================= PEXELS =================

export function pexelsGet(path, params = {}) {
  return axios.get(`https://api.pexels.com/v1${path}`, {
    params,
    headers: {
      Authorization: process.env.PEXELS_API_KEY,
    },
  });
}
