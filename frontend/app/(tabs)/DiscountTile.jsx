// DiscountTile.js
import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const DiscountTile = ({ image, discount }) => {
  const [showDiscount, setShowDiscount] = useState(false);

  const handlePress = () => {
    setShowDiscount(!showDiscount);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.discountTile}>
      <Image source={{ uri: image }} style={styles.tileImage} />
      {showDiscount && (
        <View style={styles.discountTextContainer}>
          <Text style={styles.discountText}>{discount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  discountTile: {
    position: "relative",
    width: 150,
    height: 150,
    borderRadius: 8,
    overflow: "hidden",
    margin: 8,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  tileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  discountTextContainer: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 8,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  discountText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DiscountTile;
