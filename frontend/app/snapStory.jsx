import React, { useState, useEffect } from 'react';
import { View, FlatList, Modal, TouchableOpacity, Image, Text, Alert, Button } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { icons } from '../constants'; // Ensure you import your icons correctly

const SnapStory = () => {
  const { pictureUri } = useLocalSearchParams();
  const [accountName, setAccountName] = useState('');
  const [data, setData] = useState([
    { id: '1', pictureUri: 'https://cdn.pixabay.com/photo/2018/06/25/17/02/fashion-3497410_1280.jpg', accountName: "Default User 1" },
    { id: '2', pictureUri: 'https://cdn.pixabay.com/photo/2018/06/25/17/02/fashion-3497410_1280.jpg', accountName: "Default User 2" },
    { id: '3', pictureUri: 'https://cdn.pixabay.com/photo/2018/06/25/17/02/fashion-3497410_1280.jpg', accountName: "Default User 3" },
    { id: '4', pictureUri: 'https://cdn.pixabay.com/photo/2018/06/25/17/02/fashion-3497410_1280.jpg', accountName: "Default User 4" },
  ]);

  useEffect(() => {
    const fetchAccountNames = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setAccountName(userData.name); // Set the account name from user data
          
          // Add the retrieved account name as a new entry in the data array
          const newEntry = {
            id: (data.length + 1).toString(),
            pictureUri: '', 
            accountName: userData.name,
          };
          setData((prevData) => [...prevData, newEntry]);
        }
      } catch (error) {
        console.error("Error retrieving account name:", error);
      }
    };

    fetchAccountNames();
    
    // Validate pictureUri if it exists
    if (pictureUri) {
      console.log("Received picture URI:", pictureUri); // Debug log
      addPictureToStory(pictureUri);
    }
  }, [pictureUri]);

  const addPictureToStory = async (newPictureUri) => {
    if (newPictureUri) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(newPictureUri);
        if (fileInfo.exists) {
          // Use Sharing to validate the URI
          await Sharing.shareAsync(newPictureUri);
          
          const newId = (data.length + 1).toString();
          const newData = [...data, { id: newId, pictureUri: newPictureUri, accountName }];
          setData(newData);
        } else {
          Alert.alert("Error", "Image file does not exist.");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to check image file existence.");
      }
    } else {
      Alert.alert("Error", "Invalid picture URI.");
    }
  };

  const [selectedItem, setSelectedItem] = useState(null);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedItem(item)}>
      <View style={{ position: 'relative', width: 150, height: 250, borderRadius: 8, marginBottom: 20, marginRight: 8 }}>
        <Image
          source={{ uri: item.pictureUri }}
          style={{ width: '100%', height: '100%', borderRadius: 8 }}
          onLoad={() => console.log("Image loaded:", item.pictureUri)} // Debug log
          onError={(error) => {
            console.log("Image load error:", error.nativeEvent.error); // Debug log for error
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
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
          padding: 10,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}>
          <Image
            source={icons.profile} // Make sure to use the correct profile icon path
            style={{ width: 20, height: 20, borderRadius: 10, marginRight: 5 }}
          />
          <Text style={{ color: '#fff' }}>{item.accountName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <View style={{ flex: 1, padding: 4, marginTop: 20 }}>
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
              <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>Full Screen View</Text>
              <Image
                source={{ uri: selectedItem?.pictureUri }}
                style={{ width: '100%', height: '100%', borderRadius: 8 }}
                onLoad={() => console.log("Selected image loaded:", selectedItem?.pictureUri)} // Debug log
                onError={(error) => {
                  console.log("Selected image load error:", error.nativeEvent.error); // Debug log for error
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
