import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import { firebaseAuth, firestoreDB } from "../../config/firebase.config";
import { icons } from "../../constants";

const ProductDetailScreen = () => {
  const router = useRouter();
  const { product } = useLocalSearchParams();
  const productData = JSON.parse(product);
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = firebaseAuth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(firestoreDB, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setName(userData.fullName);
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const addToCart = async () => {
    try{
    const user = firebaseAuth.currentUser;
    if (user) {
      const cartRef = doc(firestoreDB, "carts", user.uid);
      await setDoc(
        cartRef,
        { products: arrayUnion({ ...product, quantity: 1 }) },
        { merge: true }
      );
      alert("Product Added to Cart");
      router.push({
        pathname: "/Cart",
        params: { newProduct: JSON.stringify(productData) },
      });
    }
  }
    catch (error) {
      console.error("Failed to add to cart:", error);
      Alert.alert("Error", "Failed to add product to cart");
    }
  };

  const addToWishlist = async () => {
    try{
    const user = firebaseAuth.currentUser;
    if (user) {
      const cartRef = doc(firestoreDB, "Wishlists", user.uid);
      await setDoc(
        cartRef,
        { products: arrayUnion({ ...product, quantity: 1 }) },
        { merge: true }
      );
      alert("Product Added to Wishlist");
      router.push({
        pathname: "/WishList",
        params: { newProduct: JSON.stringify(productData) },
      });
    }
  }
    catch (error) {
      console.error("Failed to add to cart:", error);
      Alert.alert("Error", "Failed to add product to cart");
    }
  };

  return (
    <ScrollView>
      <View className="flex-1 mb-10">
        <View className="flex-row justify-between items-center mb-4 bg-secondary-100 pt-12 pb-4 px-4">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="chevron-left" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
          <View className="flex justify-center items-center">
          <Image
            source={icons.profile}
            resizeMode="contain"
            className="w-8 h-8 rounded-full"
          />
          <Text className="text-xl font-bold text-white">{name}</Text>
        </View>
        </View>
        
        <View className="flex justify-center items-center">
          <Image
            source={{ uri: productData.image }}
            className="w-[300px] h-64 bg-gray-200 mb-4 rounded-lg"
          />
        </View>
        <View className="px-8">
          <Text className="text-2xl font-bold mb-2">{productData.name}</Text>
          <Text className="text-sm text-gray-700 mb-4">
            Price: {productData.price}
          </Text>
          <Text className="text-sm text-gray-700 mb-4">
            {productData.description || "No description available."}
          </Text>
          <View className="flex-row justify-between mt-4 px-2">
            <TouchableOpacity
              className="bg-gray-100 px-4 rounded-lg flex-1 mr-2 justify-center items-center w-[150px]"
              onPress={addToCart}
            >
              <Text className="text-secondary-100 font-bold text-center">Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={addToWishlist}
              className="bg-gray-100 px-4 rounded-lg flex mx-2 justify-center items-center text-center"
            >
              <Text className="text-secondary-100 font-bold">
                Wishlist
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => alert("Try On Feature Coming Soon")}
              className="bg-gray-100 p-4 rounded-lg flex-1 ml-2"
            >
              <Text className="text-secondary-100 text-center font-bold">
                Try On
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
export default ProductDetailScreen;
