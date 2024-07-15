import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { firebaseAuth, firestoreDB } from '../../config/firebase.config';
import { icons } from '../../constants';
import { AntDesign, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const ProductPage = () => {
  const product = {
    id: 'sample-product-1',
    name: 'Ketch Women Red Self Design Tube Tops',
    price: 'Rs. 159',
    image: 'https://getketchadmin.getketch.com/product/8905745950356/660/KHTP000329_1.jpg',
    description: 'Dazzle and shine in Ketchs Red & Gold Spangled Tube Top. This stunning piece is a celebration of elegance and glamour, adorned with a mesmerizing blend of red and gold spangles.',
  };

  const navigation = useNavigation();
  const [name, setName] = useState('');

  useEffect(() => {
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

  const addToCart = async () => {
    const user = firebaseAuth.currentUser;
    if (user) {
      const cartRef = doc(firestoreDB, 'carts', user.uid);
      await setDoc(cartRef, { products: arrayUnion({ ...product, quantity: 1 }) }, { merge: true });
      alert('Product Added to Cart');
      navigation.navigate('Cart');
    }
  };

  return (
    <ScrollView>
    <View className="flex-1 mb-10">
      <View className="flex-row justify-between items-center mb-4 bg-secondary-100 pt-12 pb-4 px-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
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
          source={{ uri: product.image }}
          className="w-[300px] h-64 bg-gray-200 mb-4 rounded-lg"
        />
      </View>
      <View className="px-8">
        <Text className="text-2xl font-bold mb-2">{product.name}</Text>
        <Text className="text-sm text-gray-700 mb-4">{product.description}</Text>
      </View>
      <View className="flex-row justify-between mt-4 px-2">
        <TouchableOpacity
          onPress={addToCart}
          className="bg-gray-100 p-4 rounded-lg flex-1 mr-2"
        >
          <Text className="text-secondary-100 font-bold text-center">Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => alert('Added to Wishlist')}
          className="bg-gray-100 p-4 rounded-lg flex-1 mx-2"
        >
          <Text className="text-secondary-100 text-center font-bold">Wishlist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => alert('Try On Feature Coming Soon')}
          className="bg-gray-100 p-4 rounded-lg flex-1 ml-2"
        >
          <Text className="text-secondary-100 text-center font-bold">Try On</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  );
};

export default ProductPage;
