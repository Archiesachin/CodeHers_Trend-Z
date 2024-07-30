import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  TextInput,
} from "react-native";
import { icons } from "../constants";
import { saveToLibraryAsync } from "expo-media-library";
import RoomSelectionModal from "../app/(tabs)/RoomSelectionModal";
import { collection, onSnapshot } from "firebase/firestore";
import { firestoreDB } from "../config/firebase.config";

const PictureView = ({ picture, setPicture, handleShare }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [roomSelectionVisible, setRoomSelectionVisible] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestoreDB, "chats"),
      (querySnapshot) => {
        const chatRooms = querySnapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
        }));
        setRooms(chatRooms);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleShareOnStory = () => {
    handleShare("story", text, picture); // Pass the type, text, and picture to handleShare
    setModalVisible(false);
  };

  const handleShareOnChat = (room) => {
    handleShare("chat", text, picture, room); // Pass the type, text, picture, and room to handleShare
    setRoomSelectionVisible(false);
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Image source={{ uri: picture }} className="w-full h-full" />
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Add text to your story"
        className="absolute bottom-20 w-3/4 bg-white p-2 rounded-md"
        multiline
      />
      <View className="absolute bottom-40 w-full p-4 justify-center text-center flex items-center bg-gray-500 bg-opacity-1">
        <Text className="text-white text-2xl">{text}</Text>
      </View>
      <View className="flex-row mt-[-100px]">
        <TouchableOpacity
          onPress={async () => {
            try {
              await saveToLibraryAsync(picture);
              Alert.alert("Picture saved");
            } catch (error) {
              console.error("Error saving picture:", error);
              Alert.alert("Error", "Failed to save picture.");
            }
          }}
          className="bg-secondary-100 p-2 mx-1 rounded-3xl flex-row"
        >
          <Image source={icons.save} className="w-[25px] h-[25px]" />
          <Text className="text-white font-bold ml-1 mt-1">
            Save to Gallery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-secondary-100 p-2 mx-1 rounded-3xl flex-row"
        >
          <Image source={icons.share} className="w-[25px] h-[25px]" />
          <Text className="text-white font-bold ml-2 mt-[0.8]">Share</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => setPicture("")}
        className="bg-secondary-100 p-2 mx-1 rounded-3xl absolute right-0 top-12"
      >
        <Image source={icons.close} className="w-[23px] h-[23px]" />
      </TouchableOpacity>

      {/* Modal for sharing options */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-4 w-80">
            <Text className="text-lg font-bold text-center mb-4">
              Share Options
            </Text>
            <TouchableOpacity
              onPress={handleShareOnStory}
              className="bg-secondary-100 p-2 rounded-lg mb-2"
            >
              <Text className="text-white text-center">Share on Story</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setRoomSelectionVisible(true);
              }}
              className="bg-secondary-100 p-2 rounded-lg"
            >
              <Text className="text-white text-center">Share on Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-4"
            >
              <Text className="text-red-500 text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Room Selection Modal */}
      <RoomSelectionModal
        visible={roomSelectionVisible}
        rooms={rooms}
        picture={picture}
        text={text} // Pass the text to RoomSelectionModal
        onClose={() => setRoomSelectionVisible(false)}
        onSelectRoom={handleShareOnChat}
      />
    </View>
  );
};

export default PictureView;
