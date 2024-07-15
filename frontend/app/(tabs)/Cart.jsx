import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseAuth, firestoreDB } from '../../config/firebase.config';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { icons } from '../../constants';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [name, setName] = useState('');
  const navigation = useNavigation();

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

    fetchCartItems();

    const fetchUserData = async () => {
      try {
        const user = firebaseAuth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(firestoreDB, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setName(userData.fullName);
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

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

  const renderItem = ({ item, index }) => (
    <View className="flex-row items-center bg-gray-100 p-4 rounded-lg shadow-md mb-4 mx-4">
      <Image
        source={{ uri: item.image }}
        className="w-20 h-20 mr-4"
        style={styles.image}
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold">{item.name}</Text>
        <Text className="text-blue-500 mt-2">{item.price}</Text>
      </View>
      <View className="flex-row items-center justify-between bg-gray-200 p-2 rounded-lg">
        <TouchableOpacity onPress={() => decreaseQuantity(index)}>
          <AntDesign name="minuscircleo" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold mx-2">{item.quantity || 1}</Text>
        <TouchableOpacity onPress={() => increaseQuantity(index)}>
          <AntDesign name="pluscircleo" size={24} color="#000" />
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
        <Text className="text-3xl font-bold text-white">Cart</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
});

export default Cart;
