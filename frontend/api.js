// src/api.js
const API_URL = "https://69a5-210-16-113-136.ngrok-free.app"; // Adjust this if your Flask app runs on a different port

export const getHashtags = async () => {
  const response = await fetch(`${API_URL}/hashtags`, {
    method: "GET",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data.suggested_hashtags;
};

export const scrapeProducts = async (hashtags) => {
  const response = await fetch(`${API_URL}/trends`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ hashtags }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data.products;
};
