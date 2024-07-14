import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const RoomSelectionModal = ({ visible, rooms, picture, onClose }) => {
  const navigation = useNavigation();

  const handleSelectRoom = (room) => {
    onClose();
    navigation.navigate("ChatScreen", {
      room: room,
      image: picture,
    });
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white rounded-lg p-4 w-80">
          <Text className="text-lg font-bold text-center mb-4">Select Room</Text>
          <FlatList
            data={rooms}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectRoom(item)}
                className="bg-secondary-100 p-2 rounded-lg mb-2"
              >
                <Text className="text-white text-center">{item.chatName}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={onClose} className="mt-4">
            <Text className="text-red-500 text-center">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RoomSelectionModal;
