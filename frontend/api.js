// src/api.js
const API_URL =
  "https://4887-2401-4900-57dc-3f8c-8d83-196a-b86b-d881.ngrok-free.app"; // Adjust this if your Flask app runs on a different port

export const getHashtags = async () => {
  const response = await fetch(`${API_URL}/get-suggested-hashtags`, {
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


export const scrapeProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/get-trends-data`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Received data:", data); // For debugging
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
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

export const sendImageUrlToServer = async (garm_img_url, uploaded_img_url) => {
  try {
    console.log("Sending image URL:", garm_img_url);
    console.log("Sending image URL:", uploaded_img_url);
    const response = await fetch(`${API_URL}/try-on`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ garm_img_url, uploaded_img_url }),
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