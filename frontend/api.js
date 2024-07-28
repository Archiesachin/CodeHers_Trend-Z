// src/api.js
const API_URL = "https://049b-150-242-207-136.ngrok-free.app"; // Adjust this if your Flask app runs on a different port

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

export const getInterestProducts = async (tags) => {
  const response = await fetch(`${API_URL}/interest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tags }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};

export const sendImageUrlToServer = async (garm_img_url) => {
  try {
    console.log("Sending image URL:", garm_img_url);
    const response = await fetch(`${API_URL}/try-on`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ garm_img_url }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Received data:", data);

      if (data.success) {
        // Construct the full URL to the image
        const imageUrl = `${API_URL}${data.image_url}`;
        return imageUrl;
      } else {
        console.error("Processing failed:", data.error);
        return null;
      }
    } else {
      console.error(
        "Failed to send image URL:",
        response.status,
        response.statusText
      );
      return null;
    }
  } catch (error) {
    console.error("Error sending image URL:", error);
    return null;
  }
};