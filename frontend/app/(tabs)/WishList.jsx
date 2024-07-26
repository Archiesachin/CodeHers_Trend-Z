import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { doc, getDoc,setDoc } from 'firebase/firestore';
import { firebaseAuth, firestoreDB } from '../../config/firebase.config';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { icons } from '../../constants';
import { useLocalSearchParams } from "expo-router";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [name, setName] = useState('');
  const navigation = useNavigation();
  const { newProduct } = useLocalSearchParams();

  useEffect(() => {
    const fetchwishlistItems = async () => {
      const user = firebaseAuth.currentUser;
      if (user) {
        const userWishlistRef = doc(firestoreDB, 'Wishlists', user.uid);
        const userWishlistDoc = await getDoc(userWishlistRef);
        if (userWishlistDoc.exists()) {
          setWishlistItems(userWishlistDoc.data().products);
        } else {
          console.log('No Wishlist found for this user!');
        }
      }
    };
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
    fetchwishlistItems();
    fetchUserData();
    if (newProduct) {
      try {
        const parsedProduct =
          typeof newProduct === "string" ? JSON.parse(newProduct) : newProduct;
        console.log("Parsed product:", parsedProduct);
        setWishlistItems((prevItems) => {
          const existingProductIndex = prevItems.findIndex(
            (item) => item.name === parsedProduct.name
          );
          if (existingProductIndex !== -1) {
            const updatedItems = [...prevItems];
            updatedItems[existingProductIndex].quantity =
              (updatedItems[existingProductIndex].quantity || 1) + 1;
            return updatedItems;
          } else {
            return [...prevItems, { ...parsedProduct, quantity: 1 }];
          }
        });
      } catch (error) {
        console.error("Error parsing new product:", error);
      }
    }
  }, [newProduct]);
  useEffect(() => {
    const updateFirebaseWishlist = async () => {
      const user = firebaseAuth.currentUser;
      if (user) {
        const userWishlistRef = doc(firestoreDB, "Wishlists", user.uid);
        await setDoc(userWishlistRef, { products: wishlistItems }, { merge: true });
      }
    };

    updateFirebaseWishlist();
  }, [wishlistItems]);

  const increaseQuantity = (index) => {
    const newWishlistItems = [...wishlistItems];
    newWishlistItems[index].quantity = (newWishlistItems[index].quantity || 1) + 1;
    setWishlistItems(newWishlistItems);
  };

  const decreaseQuantity = (index) => {
    const newWishlistItems = [...wishlistItems];
    newWishlistItems[index].quantity = (newWishlistItems[index].quantity || 1) - 1;
    if (newWishlistItems[index].quantity < 1) newWishlistItems[index].quantity = 1;
    setWishlistItems(newWishlistItems);
  };

  const removeItem = (index) => {
    setWishlistItems((prevItems) => {
      const newItems = [...prevItems];
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const renderItem = ({ item, index }) => (
    <View className="flex-row items-center bg-gray-100 p-4 rounded-lg shadow-md mb-4 mx-4">
      <Image
        source={{ uri: item.image || item["Image URL"] }}
        className="w-20 h-20 mr-4"
        style={styles.image}
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold">
          {item.name || item["Product Name"]}
        </Text>
        <Text className="text-blue-500 mt-2">
          {item.price || item["Price"]}
        </Text>
      </View>
      <View className="flex-row items-center justify-between bg-gray-200 p-2 rounded-lg">
        <TouchableOpacity onPress={() => decreaseQuantity(index)}>
          <AntDesign name="minuscircleo" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold mx-2">{item.quantity || 1}</Text>
        <TouchableOpacity onPress={() => increaseQuantity(index)}>
          <AntDesign name="pluscircleo" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeItem(index)} className="ml-2">
          <AntDesign name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center mb-4 bg-secondary-100 pt-14 pb-4 px-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={32} color="#fff" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-white">Wishlist</Text>
      </View>
      {wishlistItems.length === 0 ? (
        <Text className="text-center text-lg mt-4">Your Wishlist is empty.</Text>
      ) : (
        <FlatList
          data={wishlistItems}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
});

export default Wishlist;
