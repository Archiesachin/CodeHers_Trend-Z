import React, { useState, useRef, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook

// Import images directly
import homequizImage from "../assets/homequiz.png";
import snapImage from "../assets/snap.png";
import trendsImage from "../assets/trends.png";

const images = [
  { id: "1", source: homequizImage, route: "QuizComponent" },
  { id: "2", source: snapImage, route: "snapStory" },
  { id: "3", source: trendsImage, route: "trends" }, // Define routes
];

const { width } = Dimensions.get("window");

const ImageSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation(); // Access navigation object

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handlePress = (route) => {
    navigation.navigate(route); // Navigate to the specified route
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item.route)}>
      <View style={styles.imageContainer}>
        <Image source={item.source} style={styles.image} resizeMode="contain" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        ref={flatListRef}
        showsHorizontalScrollIndicator={false}
        bounces={false}
      />
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <Text
            key={index}
            style={[
              styles.paginationDot,
              currentIndex === index && styles.activeDot,
            ]}
          >
            ●
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 210,
  },
  imageContainer: {
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  paginationDot: {
    fontSize: 24,
    color: "#888",
    marginHorizontal: 3,
  },
  activeDot: {
    color: "#fff",
  },
});

export default ImageSlideshow;
