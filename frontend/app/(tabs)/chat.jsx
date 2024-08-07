import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestoreDB } from "../../config/firebase.config";
import { useRouter } from "expo-router/build/hooks";

const HomeScreen = () => {
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState(null);

  const navigation = useNavigation();
  const router = useRouter()

  useLayoutEffect(() => {
    const chatQuery = query(
      collection(firestoreDB, "chats"),
      orderBy("_id", "desc")
    );

    const unsubscribe = onSnapshot(chatQuery, (querySnapShot) => {
      const chatRooms = querySnapShot.docs.map((doc) => doc.data());
      setChats(chatRooms);
      setIsLoading(false);
    });

    //  Return the unsubscribe funciton to stop listening to the updates
    return unsubscribe;
  }, []);

  return (
    <View className="flex-1 mt-14">
      <SafeAreaView>
        <View className="w-full flex-row items-center justify-between px-4 py-2">
          <Text className="text-secondary-100 font-bold text-3xl">TREND-Z</Text>

        </View>

        {/* scrolling area */}
        <ScrollView className="w-full px-4 pt-4">
          <View className="w-full">
            {/* meesages title */}
            <View className="w-full flex-row items-center justify-between px-2">
              <Text className="text-primaryText text-base font-extrabold pb-2">
                Messages
              </Text>

              <TouchableOpacity
                onPress={() => router.push('/AddToChat')}
              >
                <Ionicons name="chatbox" size={28} color="#555" />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <>
                <View className="w-full flex items-center justify-center">
                  <ActivityIndicator size={"large"} color={"#F13AB1"} />
                </View>
              </>
            ) : (
              <>
                {chats && chats?.length > 0 ? (
                  <>
                    {chats?.map((room) => (
                      <MessageCard key={room._id} room={room} />
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const MessageCard = ({ room }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
  onPress={() => navigation.navigate("ChatScreen", { room: room })}
  className="w-full flex-row items-center justify-start py-2 border-t  border-gray-100"
>
      {/* images */}
      <View className="w-16 h-16 rounded-full flex items-center border-2 border-secondary-100 p-1 justify-center ">
        <FontAwesome5 name="users" size={24} color="#555" />
      </View>
      {/* content */}
      <View className="flex-1 flex items-start justify-center ml-4">
        <Text className="text-[#333] text-base font-semibold capitalize">
          {room.chatName}
        </Text>

        <Text className="text-gray-500 text-sm">
          Click to join chat
        </Text>
      </View>

      {/* time text */}
      <Text className="text-primary px-4 text-base font-semibold"></Text>
    </TouchableOpacity>
  );
};


export default HomeScreen;