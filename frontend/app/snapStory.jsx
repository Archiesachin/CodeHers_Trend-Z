import React, { useState, useEffect } from 'react';
import { View, FlatList, Modal, TouchableOpacity, Image, Text, Alert } from 'react-native';
import { getDoc, doc } from 'firebase/firestore';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { firestoreDB, storage } from '../config/firebase.config'; 
import { firebaseAuth } from '../config/firebase.config'; 
import {icons} from '../constants'
import {MaterialIcons} from "@expo/vector-icons";
import { useNavigation} from "@react-navigation/native";

const SnapStory = () => {
  const [accountName, setAccountName] = useState('');
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = firebaseAuth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(firestoreDB, 'users', user.uid));
          if (userDoc.exists()) {
            setAccountName(userDoc.data().fullName);
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

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const storageRef = ref(storage, 'images/');
        const imagesList = await listAll(storageRef);
        const imagePromises = imagesList.items.map((imageRef) => getDownloadURL(imageRef));

        const imageUrls = await Promise.all(imagePromises);

        const imageData = imageUrls.map((url, index) => ({
          id: (index + 1).toString(),
          pictureUri: url,
          accountName: accountName || "Default User", // Use default if account name not fetched yet
        }));

        setData(imageData);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [accountName]);

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
          <Text className="text-xl font-bold text-white">{item.accountName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <View style={{ flex: 1, padding: 4, marginTop: 40 }}>
    <View className="flex-row items-center justify-between p-2 mb-4">
    <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color={"#000"} />
          </TouchableOpacity>
          <Text className="font-bold text-2xl uppercase text-secondary-100">Fashion Snap</Text>
      <View>
      <Image
        source={icons.profile}
        className="rounded-3xl w-[35px] h-[35px] mt-2"
        resizeMode='contain'
      />
      <Text className="font-bold text-secondary-100 text-[15px]">{accountName}</Text>
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
