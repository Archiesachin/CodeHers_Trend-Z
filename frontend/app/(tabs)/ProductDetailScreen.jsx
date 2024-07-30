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
import { doc, getDoc, setDoc, arrayUnion , onSnapshot} from "firebase/firestore";
import { firebaseAuth, firestoreDB } from "../../config/firebase.config";
import { icons } from "../../constants";
import { sendImageUrlToServer, API_URL } from "../../api";

const ProductDetailScreen = () => {
  const router = useRouter();
  const { product } = useLocalSearchParams();
  const productData = JSON.parse(product);
  const [name, setName] = useState("");
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  useEffect(() => {
    const fetchUserData = () => {
      const user = firebaseAuth.currentUser;
      if (user) {
        const userDocRef = doc(firestoreDB, 'users', user.uid);
        const unsubscribe = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setName(userData.fullName || 'No');
          } else {
            console.log('No such document!');
          }
        }, (error) => {
          console.error("Error fetching user data:", error);
        });
  
        // Clean up the listener on component unmount
        return () => unsubscribe();
      }
    };
  
    fetchUserData();
  }, []);
  

  const addToCart = async () => {
    try {
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
    } catch (error) {
      console.error("Failed to add to cart:", error);
      Alert.alert("Error", "Failed to add product to cart");
    }
  };

  const addToWishlist = async () => {
    try {
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
    } catch (error) {
      console.error("Failed to add to cart:", error);
      Alert.alert("Error", "Failed to add product to cart");
    }
  };
  const handleTryOn = async () => {
    setIsLoading(true);
    const imageUrl = await sendImageUrlToServer(productData.image);
    setIsLoading(false);
    if (imageUrl) {
      setProcessedImageUrl(imageUrl);
      setImageKey(imageKey + 1);
      console.log(`${imageUrl}`);
      console.log(`${API_URL}${imageUrl}`);
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
            source={{ uri: productData.image || productData.image_url }}
            className="w-[300px] h-64 bg-gray-200 mb-4 rounded-lg"
          />
        </View>
        <View className="px-8">
          <Text className="text-2xl font-bold mb-2">
            {productData.name || productData.product_name}
          </Text>
          <Text className="text-md text-gray-700 mb-4 font-bold">
            Price:{productData.price}
          </Text>

          <View className="flex-row justify-between mt-4 px-2">
            <TouchableOpacity
              className="bg-gray-100 px-4 rounded-lg flex-1 mr-2 justify-center items-center w-[150px] py-4"
              onPress={addToCart}
            >
              <Text className="text-secondary-100 font-bold text-center">
                Add to Cart
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={addToWishlist}
              className="bg-gray-100 px-4 rounded-lg flex mx-2 justify-center items-center text-center"
            >
              <Text className="text-secondary-100 font-bold">Wishlist</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log("Full productData:", productData);
                const imageUrl =
                  productData?.image ?? productData?.image_url ?? null;
                console.log("Determined imageUrl:", imageUrl);
                if (imageUrl) {
                  console.log(
                    "Navigating to TakePhotoScreen with imageUrl:",
                    imageUrl
                  );
                  router.push({
                    pathname: "/TakePhotoScreen",
                    params: {
                      productImageUrl: encodeURIComponent(imageUrl),
                    },
                  });
                } else {
                  console.log("No image URL available");
                  Alert.alert(
                    "Error",
                    "No image URL available for this product"
                  );
                }
              }}
              className="bg-gray-100 px-4 rounded-lg flex-1  justify-center items-center w-[150px] py-4 ml-2"
            >
              <Text className="text-secondary-100 font-semibold">Try On</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={handleTryOn}
              className="bg-gray-100 p-4 rounded-lg flex-1 ml-2"
              disabled={isLoading}
            >
              <Text className="text-secondary-100 text-center font-bold">
                {isLoading ? "Processing..." : "Try On"}
              </Text>
            </TouchableOpacity> */}
          </View>
          {processedImageUrl && (
            <Image
              source={{ uri: `${processedImageUrl}?t=${new Date().getTime()}` }}
              style={{
                width: 300,
                height: 300,
                borderRadius: 10,
                marginTop: 20,
              }}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};
export default ProductDetailScreen;
