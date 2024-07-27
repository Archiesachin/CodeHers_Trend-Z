import React, { useState, useEffect } from "react";
import { View, Image, ActivityIndicator, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getTryOnImage } from "../../api";

const TryOn = () => {
  const { garm_img_url } = useLocalSearchParams();
  const [tryOnImage, setTryOnImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTryOnImage = async () => {
      try {
        const imageUrl = await getTryOnImage(garm_img_url);
        setTryOnImage(imageUrl);
      } catch (err) {
        console.error("Error fetching try-on image:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTryOnImage();
  }, [garm_img_url]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {tryOnImage && (
        <Image
          source={{ uri: tryOnImage }}
          style={{ width: 300, height: 300, resizeMode: "contain" }}
        />
      )}
    </View>
  );
};

export default TryOn;
