import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { getInterestProducts } from "../api";

const ProductList = ({ tags }) => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const data = await getInterestProducts(tags);
      setProducts(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

    fetchProducts();
  }, [tags]);

  if (loading) return <Text>Loading products based on your interest!</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const handleProductPress = (item) => {
    router.push({
      pathname: "/ProductDetailScreen",
      params: { product: JSON.stringify(item) },
    });
  };

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
            <Text style={styles.link} onPress={() => handleProductPress(item)}>
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
    color: "#ff9c01",
    marginTop: 10,
  },
});

export default ProductList;
