import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { Entypo, FontAwesome, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { firestoreDB } from "../../config/firebase.config";
import { useSelector } from "react-redux";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const user = useSelector((state) => state.user.user);
  const textInputRef = useRef(null);
  const { room, image } = route.params;

  const storage = getStorage();

  useLayoutEffect(() => {
    if (!room || !room._id) {
      console.error("No room data found", room);
      return;
    }

    const msgQuery = query(
      collection(firestoreDB, "chats", room._id, "messages"),
      orderBy("timeStamp", "asc")
    );

    const unsubscribe = onSnapshot(msgQuery, (querySnapshot) => {
      const upMsg = querySnapshot.docs.map((doc) => doc.data());
      setMessages(upMsg);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [room?._id]);

  const uploadImageAndSendMessage = async (image) => {
    const response = await fetch(image);
    const blob = await response.blob();
    const imageRef = ref(storage, `chats/${room._id}/images/${Date.now()}`);

    await uploadBytes(imageRef, blob);
    const imageUrl = await getDownloadURL(imageRef);

    // Send message with image URL
    sendMessage(imageUrl);
  };

  const sendMessage = async (imageUrl = null) => {
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      roomId: room._id,
      timeStamp: timeStamp,
      message: message,
      user: user,
      image: imageUrl || image, // Include image if available
    };

    setMessage("");
    await addDoc(
      collection(doc(firestoreDB, "chats", room._id), "messages"),
      _doc
    ).catch((err) => alert(err));
  };

  const handleSendImage = () => {
    if (image) {
      uploadImageAndSendMessage(image);
    } else {
      sendMessage();
    }
  };

  return (
    <View className="flex-1">
      <View className="w-full h-full bg-secondary-100 px-4 py-6 flex-[0.2] -mt-2 flex-row">
      <View className="flex-row mt-8">
      <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color={"#fff"} />
          </TouchableOpacity>
          <View className="pl-4">
          <View className="w-12 h-12 rounded-full border border-white flex items-center justify-center">
              <FontAwesome5 name="users" size={24} color="#fbfbfb" />
            </View>
        <Text className="text-lg font-bold text-white">{room.chatName}</Text>
        </View>
        </View>
      </View>

      <View className="w-full bg-white px-4 py-6 flex-1 -mt-2">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={160}
        >
          <>
            <ScrollView>
              {isLoading ? (
                <View className="w-full flex items-center justify-center">
                  <ActivityIndicator size={"large"} color={"#43C651"} />
                </View>
              ) : (
                <>
                  {messages?.map((msg, i) => (
                    <View key={i} className="m-1">
                      <View
                        style={{
                          alignSelf:
                            msg.user.providerData.email === user.providerData.email
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                        <View
                          className={`px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl ${
                            msg.user.providerData.email === user.providerData.email
                              ? "bg-primary"
                              : "bg-gray-200"
                          } w-auto relative`}
                        >
                          {msg.message && (
                            <Text className="text-base font-semibold text-white">
                              {msg.message}
                            </Text>
                          )}
                          {msg.image && (
                            <Image
                              source={{ uri: msg.image }}
                              style={{ width: 150, height: 150, borderRadius: 10, marginTop: 5 }}
                            />
                          )}
                        </View>
                        <View style={{ alignSelf: "flex-end" }}>
                          {msg?.timeStamp?.seconds && (
                            <Text className="text-[12px] text-black font-semibold">
                              {new Date(
                                parseInt(msg?.timeStamp?.seconds) * 1000
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  ))}
                </>
              )}
            </ScrollView>

            <View className="w-full flex-row items-center justify-center px-8">
              <View className="bg-gray-200 rounded-2xl px-4 space-x-4 py-2 flex-row items-center justify-center">
                <TouchableOpacity>
                  <Entypo name="emoji-happy" size={24} color="#555" />
                </TouchableOpacity>

                <TextInput
                  ref={textInputRef}
                  className="flex-1 h-8 text-base text-primaryText font-semibold"
                  placeholder="Type here..."
                  placeholderTextColor={"#999"}
                  value={message}
                  onChangeText={(text) => setMessage(text)}
                />

                <TouchableOpacity>
                  <Entypo name="mic" size={24} color="#43C651" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity className="pl-4" onPress={handleSendImage}>
                <FontAwesome name="send" size={24} color="#555" />
              </TouchableOpacity>
            </View>
          </>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ChatScreen;
