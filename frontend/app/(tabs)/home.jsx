import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { icons } from "../../constants";
import Searchinput from "../../components/Searchinput";
import ProductList from "../../components/ProductList";
import QuizComponent from "../../components/QuizComponent";
import HomeStories from "./homestories";
import ImageSlideshow from "./ImageSlide";

// Set up the notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Home = () => {
  const router = useRouter();
  const [tags, setTags] = useState(["Y2K"]);
  const [selected, setSelected] = useState("");
  const timerRef = useRef(null); // Ref to store the timer

  const handlePress = (category) => {
    setSelected(category);
    if (category === "Men") {
      router.push("/Men");
    } else {
      router.push("/Women");
    }
  };

  const requestPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      await Notifications.requestPermissionsAsync();
    }
  };

  const scheduleNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Share your #ootd!",
          body: "Your friends are waiting for your outfit!",
          data: { screen: "snapchat" },
        },
        trigger: {
          seconds: 10, 
        },
      });
      console.log("Notification scheduled");
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  };

  useEffect(() => {
    requestPermissions();

    const fetchTags = async () => {
      try {
        const storedTags = await AsyncStorage.getItem("favoriteShow");
        if (storedTags) {
          setTags(storedTags.split(",").map((tag) => tag.trim()));
        }
      } catch (error) {
        console.error("Failed to load tags from AsyncStorage:", error);
      }
    };

    fetchTags();

    // Add a listener for notification responses
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const screen = response.notification.request.content.data.screen;
        if (screen) {
          router.push(`/${screen}`);
        }
      }
    );

    // Set up a timer to schedule the notification after 2 seconds
    timerRef.current = setTimeout(() => {
      scheduleNotification();
    }, 2000);

    // Cleanup
    return () => {
      clearTimeout(timerRef.current); // Clear the timer if the component is unmounted
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="my-10 space-y-6">
          <View className="justify-between items-start flex-row px-6 mb-2">
            <View>
              <Text className="font-bold text-md text-secondary-100">
                Welcome Back
              </Text>
              <Text className="text-2xl font-bold text-secondary-100">
                Trend-Z
              </Text>
            </View>
            <View className="mt-1.5 ml-[100px]">
              <Image
                source={icons.bell}
                resizeMode="contain"
                className="w-[20px] h-[23px]"
              />
            </View>
            <TouchableOpacity
              className="mt-1.5"
              onPress={() => router.push("/WishList")}
            >
              <Image
                source={icons.heart}
                resizeMode="contain"
                className="w-[20px] h-[23px]"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="mt-1.5"
              onPress={() => router.push("/Cart")}
            >
              <Image
                source={icons.bag}
                resizeMode="contain"
                className="w-[20px] h-[23px]"
              />
            </TouchableOpacity>
          </View>

          <View className="px-6">
            <Searchinput />
          </View>

          <View className="justify-between items-start flex-row px-6">
            <TouchableOpacity
              className={`w-[150px] h-[30px] border-2 border-gray-100 rounded-2xl items-center justify-center`}
              onPress={() => handlePress("Men")}
            >
              <Text className="font-bold text-center text-secondary-100">
                Men
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`w-[150px] h-[30px] border-2 border-gray-100 rounded-2xl items-center justify-center `}
              onPress={() => handlePress("Women")}
            >
              <Text className="font-bold text-center text-secondary-100">
                Women
              </Text>
            </TouchableOpacity>
          </View>
          <ImageSlideshow />
          <TouchableOpacity
            className={`w-[180px] h-[30px] border-2 border-gray-100 rounded-2xl items-center justify-center ml-4 px-2 `}
            onPress={scheduleNotification}
          >
            <Text className="font-bold text-center text-secondary-100">
              Recommended for you
            </Text>
          </TouchableOpacity>

          <View>
            <ProductList selected={selected} tags={tags} />
          </View>

          <View>
            <HomeStories />
          </View>

          <View>
            <QuizComponent />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
