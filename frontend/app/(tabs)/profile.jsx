import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { icons } from '../../constants';
import { useNavigation } from "@react-navigation/native";
import { doc, onSnapshot } from 'firebase/firestore'; // Use onSnapshot for real-time updates
import { firebaseAuth, firestoreDB } from '../../config/firebase.config';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [snapScore, setSnapScore] = useState(0); // Initialize snapScore state

  useEffect(() => {
    const fetchUserData = () => {
      const user = firebaseAuth.currentUser;
      if (user) {
        const userDocRef = doc(firestoreDB, 'users', user.uid);
        const unsubscribe = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setName(userData.fullName || '');
            setEmail(user.email || ''); // Set email from the authenticated user
            setPhoneNumber(userData.phoneNumber || ''); // Set phone number if it exists
            setSnapScore(userData.snapScore || 0); // Set snapScore
          } else {
            console.log('No such document!');
          }
        });

        // Clean up the listener on component unmount
        return () => unsubscribe();
      }
    };

    fetchUserData();
  }, []);

  const navigation = useNavigation();

  return (
    <View>
      <View className="bg-secondary-100 h-[250px] py-12 px-2">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={32} color={"#fbfbfb"} />
        </TouchableOpacity>
        <View className="flex justify-center items-center">
          <View className="w-[100px] h-[100px] rounded-full flex items-center border-4 border-white mb-4">
            <Image
              source={icons.profile}
              resizeMode="contain"
              className="w-[85px] h-[85px] rounded-full mt-1"
            />
          </View>
          <Text className="text-3xl font-bold text-white uppercase ">
            {name}
          </Text>
        </View>
      </View>
      <View className="w-full px-4 py-6">
        <View className="flex text-left px-4 py-2 border-b-gray-100 border-b">
          <Text className="text-black font-bold text-xl">Account Details</Text>
        </View>
        <View className="flex-row justify-between text-left px-4 py-4 border-b-gray-100 border-b">
          <Text className="text-black font-bold text-md">Email</Text>
          <Text className="text-secondary text-md">{email}</Text>
        </View>
        <View className="flex-row justify-between text-left px-4 py-4 border-b-gray-100 border-b">
          <Text className="text-black font-bold text-md">Phone Number</Text>
          <Text className="text-secondary text-md">{phoneNumber}</Text>
        </View>
        <View className="flex-row justify-between text-left px-4 py-4 border-b-gray-100 border-b">
          <Text className="text-black font-bold text-md">
            Fashion Snap Score
          </Text>
          <View className="flex-row gap-2">
            <Text className="text-black text-md mt-2">{snapScore}</Text>
            <FontAwesome5 name="fire" size={24} color="#555" />
          </View>
        </View>
      </View>

      <View className="justify-between items-start flex-row px-6 mt-4">
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <View className="w-[150px] h-[50px] border-2 border-gray-100 rounded-xl items-center justify-center">
            <Text className="font-bold text-center text-secondary-100">
              Cart
            </Text>
          </View>
        </TouchableOpacity>
        <View className="w-[150px] h-[50px] border-2 border-gray-100 rounded-xl items-center justify-center">
          <Text className="font-bold text-center text-secondary-100">
            Orders
          </Text>
        </View>
      </View>

      <View className="justify-between items-start flex-row px-6 mt-4">
        <View className="w-[150px] h-[50px] border-2 border-gray-100 rounded-xl items-center justify-center">
          <Text className="font-bold text-center text-secondary-100">
            Offers
          </Text>
        </View>
        <View className="w-[150px] h-[50px] border-2 border-gray-100 rounded-xl items-center justify-center">
          <Text className="font-bold text-center text-secondary-100">
            Collect and redeem
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Profile;
