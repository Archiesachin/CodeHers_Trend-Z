import React, { useState, useEffect } from 'react';
import { View, FlatList, Modal, TouchableOpacity, Image, Text, Alert } from 'react-native';
import { ref, getDownloadURL, listAll, getMetadata } from 'firebase/storage';
import { storage } from '../config/firebase.config';
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { icons } from '../constants';

const SnapStory = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const storageRef = ref(storage, 'images/');
        const imagesList = await listAll(storageRef);
        const imagePromises = imagesList.items.map(async (imageRef) => {
          const url = await getDownloadURL(imageRef);
          const metadata = await getMetadata(imageRef);
          return {
            id: imageRef.name,
            pictureUri: url,
            accountName: metadata.customMetadata?.accountName || "Default User", // Retrieve account name from metadata
          };
        });

        const imageData = await Promise.all(imagePromises);
        setData(imageData);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const [selectedItem, setSelectedItem] = useState(null);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedItem(item)}>
      <View style={{ position: 'relative', width: 150, height: 250, borderRadius: 8, marginBottom: 20, marginRight: 8 }}>
        <Image
          source={{ uri: item.pictureUri }}
          style={{ width: '100%', height: '100%', borderRadius: 8 }}
          onLoad={() => console.log("Image loaded:", item.pictureUri)}
          onError={(error) => {
            console.log("Image load error:", error.nativeEvent.error);
            Alert.alert("Image Load Error", "Unable to load image.");
          }}
        />
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>{item.accountName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <View style={{ flex: 1, padding: 4, marginTop: 40 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 8, marginBottom: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={32} color={"#000"} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>Fashion Snap</Text>
        <View>
          <Image
            source={icons.profile}
            style={{ width: 35, height: 35, borderRadius: 17.5 }}
            resizeMode='contain'
          />
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={renderItem}
        columnWrapperStyle={{ justifyContent: 'space-around' }}
      />
      <Modal visible={!!selectedItem} transparent={true} animationType="slide">
        <TouchableOpacity style={{ flex: 1 }} onPress={handleCloseModal}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
            <View style={{ width: '80%', height: '80%', backgroundColor: '#333333', borderRadius: 8 }}>
              <Image
                source={{ uri: selectedItem?.pictureUri }}
                style={{ width: '100%', height: '100%', borderRadius: 8 }}
                onLoad={() => console.log("Selected image loaded:", selectedItem?.pictureUri)}
                onError={(error) => {
                  console.log("Selected image load error:", error.nativeEvent.error);
                  Alert.alert("Image Load Error", "Unable to load selected image.");
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default SnapStory;
