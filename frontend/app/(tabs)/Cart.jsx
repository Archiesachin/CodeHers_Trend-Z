import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { firebaseAuth, firestoreDB, storage } from '../../config/firebase.config';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { icons } from '../../constants';
import { useLocalSearchParams } from "expo-router";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [name, setName] = useState('');
  const navigation = useNavigation();
  const { newProduct } = useLocalSearchParams();

  useEffect(() => {
    const fetchCartItems = async () => {
      const user = firebaseAuth.currentUser;
      if (user) {
        const userCartRef = doc(firestoreDB, 'carts', user.uid);
        const userCartDoc = await getDoc(userCartRef);
        if (userCartDoc.exists()) {
          setCartItems(userCartDoc.data().products);
        } else {
          console.log('No cart found for this user!');
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
    fetchCartItems();
    fetchUserData();
    if (newProduct) {
      try {
        const parsedProduct =
          typeof newProduct === "string" ? JSON.parse(newProduct) : newProduct;
        console.log("Parsed product:", parsedProduct);
        setCartItems((prevItems) => {
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
    const updateFirebaseCart = async () => {
      const user = firebaseAuth.currentUser;
      if (user) {
        const userCartRef = doc(firestoreDB, "carts", user.uid);
        await setDoc(userCartRef, { products: cartItems }, { merge: true });
      }
    };

    updateFirebaseCart();
  }, [cartItems]);

  const increaseQuantity = (index) => {
    const newCartItems = [...cartItems];
    newCartItems[index].quantity = (newCartItems[index].quantity || 1) + 1;
    setCartItems(newCartItems);
  };

  const decreaseQuantity = (index) => {
    const newCartItems = [...cartItems];
    newCartItems[index].quantity = (newCartItems[index].quantity || 1) - 1;
    if (newCartItems[index].quantity < 1) newCartItems[index].quantity = 1;
    setCartItems(newCartItems);
  };

  const removeItem = (index) => {
    setCartItems((prevItems) => {
      const newItems = [...prevItems];
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const handleShare = async (picture, productName, price, imageURL) => {
    if (picture) {
      try {
        const response = await fetch(picture);
        const blob = await response.blob();
        const storageRef = ref(storage, `images/${Date.now()}.jpg`);
  
        await uploadBytes(storageRef, blob, {
          customMetadata: {
            accountName: name,
            text: productName,
            price: price,
            imageURL: imageURL,
          },
        });
  
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Image uploaded successfully:", downloadURL);
  
        const user = firebaseAuth.currentUser;
        if (user) {
          const userRef = doc(firestoreDB, 'users', user.uid);
          await updateDoc(userRef, {
            snapScore: increment(1),
          });
        }
  
        navigation.navigate('snapStory', { pictureUri: downloadURL });
      } catch (error) {
        console.error('Error uploading image:', error);
        alert("Failed to upload and share the image.");
      }
    } else {
      alert("No picture to share.");
    }
  };
  
  
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0).toFixed(2);
  };

  const handleBuyNow = () => {
    // Handle the buy now action, e.g., redirect to a checkout screen or show an alert
    Alert.alert("Purchase", "Proceed to checkout?");
  };

  const renderItem = ({ item, index }) => (
    <View className="items-center bg-gray-100 p-4 rounded-lg shadow-md mb-4 mx-4 h-72">
      <View className="flex-row ">
        <Image
          source={{ uri: item.image || item["Image URL"] || item.image_url }}
          className="w-[120px] h-64 mr-4"
          style={styles.image}
        />
        <View className="flex-1">
          <Text className="text-lg font-semibold">
            {item.name || item["Product Name"] || item.product_name}
          </Text>
          <Text className="text-blue-500 mt-2 font-md">
            Rs.{item.price || item["Price"]}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between p-2 rounded-lg ml-20 mt-[-130px]">
        <TouchableOpacity onPress={() => decreaseQuantity(index)}>
          <AntDesign name="minuscircleo" size={20} color="#000" />
        </TouchableOpacity>
        <Text className="text-md font-bold mx-2">{item.quantity || 1}</Text>
        <TouchableOpacity onPress={() => increaseQuantity(index)}>
          <AntDesign name="pluscircleo" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeItem(index)} className="ml-2">
          <AntDesign name="delete" size={20} color="red" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() =>
          handleShare(
            item.image || item["Image URL"],
            item.name || item["Product Name"],
            item.price || item["Price"],
            item.image || item["Image URL"]
          )
        }
        className="ml-28 mt-2 bg-secondary p-2 rounded-lg"
      >
        <Text className="text-white font-semibold text-md">
          Share to Fwd Snap
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center mb-4 bg-secondary-100 pt-14 pb-4 px-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={32} color="#fff" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-white">Cart</Text>
        <View className="flex justify-center items-center">
          <Image
            source={icons.profile}
            resizeMode="contain"
            className="w-8 h-8 rounded-full"
          />
          <Text className="text-xl font-bold text-white">{name}</Text>
        </View>
      </View>
      {cartItems.length === 0 ? (
        <Text className="text-center text-lg mt-4">Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalPrice}>Total: Rs.{calculateTotalPrice()}</Text>
          <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  footer: {
    display:"flex",
    flexDirection:"column",
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    justifyContent: 'space between',
    alignItems: 'center',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buyNowButton: {
    backgroundColor: '#FF9C01',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buyNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Cart;
