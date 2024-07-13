import React, { useEffect, useState } from 'react';
import { View, Text, Image, Alert, TouchableWithoutFeedback } from 'react-native';
import { Tabs, useRouter , Redirect} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { usePermissions } from 'expo-media-library';
import { icons } from '../../constants';



const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={{ width: 20, height: 20 }}
      />
      <Text style={{ fontFamily: focused ? 'font-psemibold' : 'font-pregular', fontSize: 12 }}>
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
      router.replace("/snapchat")
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

  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData !== null) {
          const { name } = JSON.parse(userData);
          setUserName(name);
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
          title: "Snapchat",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.snapchat} name="SnapChat" focused={focused} />
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
          title: "chat",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.plus}
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
          title: "interest",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.play}
              color={color}
              name="Interest"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trends"
        options={{
          title: "trends",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.plus}
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
          title: userName ? userName : "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.profile}
              color={color}
              name={userName ? userName : "Profile"}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
