import { Text, View } from "react-native";
import React from "react";
import { SplashScreen, Stack } from "expo-router";
import { Provider } from "react-redux";
import Store from "../context/store";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  React.useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Provider store={Store}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="AddToChat" options={{ headerShown: false }} />
        <Stack.Screen name="snapStory" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
};

export default RootLayout;
