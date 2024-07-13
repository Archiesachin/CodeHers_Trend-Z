import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Linking,
} from "react-native";

const ProductList = ({ tags }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://7bba-103-115-21-184.ngrok-free.app/scrape",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tags }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [tags]);

  if (loading) return <Text>LOADING....</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.url}
      renderItem={({ item }) => (
        <View style={styles.productCard}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>Price: {item.price}</Text>
          <Text style={styles.link} onPress={() => Linking.openURL(item.url)}>
            View Product
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    margin: 8,
    elevation: 2,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
  },
  productPrice: {
    color: "#777",
  },
  link: {
    color: "#007BFF",
    marginTop: 10,
  },
});

export default ProductList;
