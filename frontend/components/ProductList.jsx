import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { getInterestProducts } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProductList = ({ tags }) => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const storedProducts = await AsyncStorage.getItem("products");
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts));
        } else {
          const data = await getInterestProducts(tags);
          await AsyncStorage.setItem("products", JSON.stringify(data));
          setProducts(data);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [tags]);

  const handleProductPress = (item) => {
    router.push({
      pathname: "/ProductDetailScreen",
      params: { product: JSON.stringify(item) },
    });
  };
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#f13ab1" />
        <Text style={styles.loaderText}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={products}
      keyExtractor={(item) => item.url}
      renderItem={({ item }) => (
        <View style={styles.productCard}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>Price: {item.price}</Text>
          <TouchableOpacity
            style={styles.viewProductButton}
            onPress={() => handleProductPress(item)}
          >
            <Text style={styles.viewProductButtonText}>View Product</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200, 
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    margin: 8,
    elevation: 2,
    alignItems: "center",
    width: 200, // Adjust width as needed
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
    color: "#ff9c01",
    marginTop: 10,
  },
  viewProductButton: {
    backgroundColor: "#ff9c01",
    padding: 5,
    borderRadius: 3,
  },
  viewProductButtonText: {
    color: "white",
    textAlign: "center",
  },
});

export default ProductList;
