import axios from "axios";
import crypto from "crypto";
import NodeCache from "node-cache";

export const cache = new NodeCache({ stdTTL: 60 * 15 }); // 15 min

// Amadeus
export async function amadeusToken() {
  const cached = cache.get("amadeus_token");
  if (cached) return cached;
  const res = await axios.post("https://test.api.amadeus.com/v1/security/oauth2/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_CLIENT_ID,
client_secret: process.env.AMADEUS_CLIENT_SECRET

    }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
  cache.set("amadeus_token", res.data.access_token, res.data.expires_in - 60);
  return res.data.access_token;
}

// Hotelbeds signature
export function hotelbedsSignature() {
  const ts = Math.floor(Date.now() / 1000);
  const sig = crypto.createHash("sha256")
    .update(process.env.HOTELBEDS_API_KEY + process.env.HOTELBEDS_API_SECRET + ts)
    .digest("hex");
  return { ts, sig };
}

// Axios helpers
export async function amadeusGet(url, params={}) {
  const token = await amadeusToken();
  return axios.get(url, { params, headers: { Authorization: `Bearer ${token}` } });
}

export function hotelbedsGet(path, params={}) {
  const { ts, sig } = hotelbedsSignature();
  return axios.get(`https://api.test.hotelbeds.com${path}`, {
    params,
    headers: {
      "Api-key": process.env.HOTELBEDS_API_KEY,
      "X-Signature": sig,
      "Accept": "application/json"
    }
  });
}

export function pexelsGet(path, params={}) {
  return axios.get(`https://api.pexels.com/v1${path}`, {
    params,
    headers: { Authorization: process.env.PEXELS_API_KEY }
  });
}
