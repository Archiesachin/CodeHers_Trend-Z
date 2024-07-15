import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Linking,
  ScrollView,
} from "react-native";
import { getHashtags, scrapeProducts } from "../../api";

export default function Trends() {
  const [hashtags, setHashtags] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHashtags = async () => {
    try {
      setLoading(true);
      const fetchedHashtags = await getHashtags();
      setHashtags(fetchedHashtags);
      return fetchedHashtags;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async (tags) => {
    setLoading(true);
    setError(null);
    try {
      const scrapedProducts = await scrapeProducts(tags);
      setProducts(scrapedProducts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      const fetchedHashtags = await fetchHashtags();
      if (fetchedHashtags && fetchedHashtags.length > 0) {
        await handleScrape(fetchedHashtags);
      }
    };

    initializePage();
  }, []);
  const renderHashtag = ({ item }) => (
    <Text style={styles.hashtag}>#{item}</Text>
  );

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      {item["Image URL"] && (
        <Image
          source={{ uri: item["Image URL"] }}
          style={styles.productImage}
        />
      )}
      <Text style={styles.productName}>{item["Product Name"]}</Text>
      <Text style={styles.productPrice}>{item["Price"]}</Text>
      <TouchableOpacity
        style={styles.viewProductButton}
        onPress={() => Linking.openURL(item["URL"])}
      >
        <Text style={styles.viewProductButtonText}>View Product</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Shop based on Instagram Trends!</Text>
      <TouchableOpacity style={styles.button} onPress={fetchHashtags}>
        <Text style={styles.buttonText}>Get today's TrendZ</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, hashtags.length === 0 && styles.disabledButton]}
        onPress={handleScrape}
        disabled={hashtags.length === 0}
      >
        <Text style={styles.buttonText}>
          {loading ? "Finding the newest fits..." : "Find Products"}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.sectionTitle}>Today's Trends</Text>
      <FlatList
        data={hashtags}
        renderItem={renderHashtag}
        keyExtractor={(item) => item}
        vertical
        showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.sectionTitle}>Get the Products:</Text>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#f13ab1",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  hashtag: {
    marginRight: 10,
    fontSize: 16,
  },
  productCard: {
    flex: 1,
    margin: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
  },
  productImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    marginBottom: 10,
  },
  productName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  productPrice: {
    marginBottom: 10,
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
