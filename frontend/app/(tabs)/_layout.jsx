import React, { useEffect, useState } from 'react';
import { View, Text, Image, Alert, TouchableWithoutFeedback } from 'react-native';
import { Tabs, useRouter, Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { usePermissions } from 'expo-media-library';
import { icons } from '../../constants';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseAuth, firestoreDB } from '../../config/firebase.config';


const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={{ width: 20, height: 20 }}
      />
      <Text style={{ fontWeight: focused ? '600' : '400', fontSize: 12 }}>
        {name}
      </Text>
    </View>
  );
}

const TabsLayout = () => {
  const router = useRouter();

  const [cameraPermissions, requestCameraPermission] = useCameraPermissions();
  const [microphonePermissions, requestMicrophonePermission] = useMicrophonePermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = usePermissions();

  const handleContinue = async () => {
    const allPermissions = await requestAllPermission();
    if (allPermissions) {
      router.replace("/snapchat");
    } else {
      Alert.alert('Permissions Required', 'Please provide necessary permissions in settings');
    }
  };

  const requestAllPermission = async () => {
    try {
      const camera = await requestCameraPermission();
      if (!camera.granted) {
        Alert.alert('Error', 'Camera permission is required');
        return false;
      }

      const microphone = await requestMicrophonePermission();
      if (!microphone.granted) {
        Alert.alert('Error', 'Microphone permission is required');
        return false;
      }

      const mediaLibrary = await requestMediaLibraryPermission();
      if (!mediaLibrary.granted) {
        Alert.alert('Error', 'Media Library permission is required');
        return false;
      }

      await AsyncStorage.setItem('hasOpened', 'true');
      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const [name, setName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = firebaseAuth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(firestoreDB, 'users', user.uid));
          if (userDoc.exists()) {
            setName(userDoc.data().fullName);
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

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#F13AB1",
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarStyle: {
          borderTopWidth: 1,
          height: 84,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name="Home"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="snapchat"
        options={{
          title: "Fashion Snap",
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon={icons.camera} name="Fwd Snap" focused={focused} color={color}/>
          ),
          tabBarButton: (props) => (
            <TouchableWithoutFeedback onPress={() => handleContinue()}>
              <View {...props} />
            </TouchableWithoutFeedback>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.chat}
              color={color}
              name="Chat"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="interest"
        options={{
          headerShown: false,
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="trends"
        options={{
          title: "Trends",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.hashtag}
              color={color}
              name="Trends"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: name || "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.profile}
              color={color}
              name={name ? name : "Profile"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ChatScreen"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="RoomSelectionModal"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Cart"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="WishList"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="ProductDetailScreen"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="TryOn"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Women"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Men"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="homestories"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
