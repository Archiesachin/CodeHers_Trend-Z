import React, { useState,useEffect } from 'react';
import { View, Text, Button, Image, Alert, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase.config'; // Adjust import path
import { firebaseAuth, firestoreDB } from '../../config/firebase.config'; // Adjust import path
import { doc, updateDoc, increment } from 'firebase/firestore';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import {icons, images} from '../../constants'
import { useLocalSearchParams } from 'expo-router';
import { sendImageUrlToServer } from '../../api';

const TakePhotoScreen = ({ navigation }) => {
  const params = useLocalSearchParams();
  console.log("All received params:", params);
  const { productImageUrl } = params;
  console.log("Extracted productImageUrl:", productImageUrl);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  const takePhoto = async () => {
    // Request camera permissions if not granted
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera permissions are required to take a photo.');
      return;
    }
  

    // Launch camera to take a photo
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 6],
      quality: 1,
    });

    console.log('Image Picker Result:', result); // Debugging line

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
      console.log('Image URI:', imageUri); // Debugging line
      await handleShare(imageUri, 'Your optional text here');
    } else {
      Alert.alert('No photo', 'No photo was taken.');
    }
  };

  const handleShare = async (picture, text) => {
    if (picture) {
      setUploading(true);
      try {
        // Fetch the image from the URI and convert it to a blob
        const response = await fetch(picture);
        const blob = await response.blob();
        
        // Create a reference for the new image in Firebase Storage
        const storageRef = ref(storage, `tryon/${Date.now()}.jpg`);
        
        // Upload the image blob to Firebase Storage with metadata
        await uploadBytes(storageRef, blob, {
          customMetadata: {
            accountName: firebaseAuth.currentUser?.displayName || '', // Use displayName from Firebase Auth
            text: text || '' // Adding text to metadata
          },
        });
        
        // Get the download URL for the uploaded image
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Image uploaded successfully:', downloadURL);

        Alert.alert('Upload successful', 'Your image has been uploaded successfully!');

        // Optionally update the user's SnapScore
        const user = firebaseAuth.currentUser;
        if (user) {
          const userRef = doc(firestoreDB, 'users', user.uid);
          await updateDoc(userRef, {
            snapScore: increment(1) // Increment SnapScore by 1
          });
        }
        await handleTryOn(downloadURL, productImageUrl);
        // Redirect to SnapStory with the image URL and text as parameters
        // navigation.navigate('snapStory', { pictureUri: downloadURL, text });
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Upload failed', 'Failed to upload the image. Please try again.');
      } finally {
        setUploading(false);
      }
    } else {
      Alert.alert('No picture to share', 'Please take a photo first.');
    }
  };

  const handleTryOn = async (uploadedImageUrl, productImageUrl) => {
    setIsLoading(true);
    try {
      const imageUrl = await sendImageUrlToServer(
        productImageUrl,
        uploadedImageUrl
      );
      setIsLoading(false);
      if (imageUrl) {
        setProcessedImageUrl(imageUrl);
        setImageKey(imageKey + 1);
        console.log(`${imageUrl}`);
        console.log(`${API_URL}${imageUrl}`);
      }
    } catch (error) {
      console.error("Error during try-on process:", error);
      setIsLoading(false);
    }
  };
  return (
    <ScrollView>
      <View className="flex-row justify-between items-center mb-4 bg-secondary-100 pt-14 pb-4 px-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={32} color="#fff" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-white">Try On</Text>
        <View className="flex justify-center items-center">
          <Image
            source={icons.profile}
            resizeMode="contain"
            className="w-8 h-8 rounded-full"
          />
        </View>
      </View>

      <View className="flex justify-center items-center pb-6 border-b-gray-100 border-b-2">
        <View className="flex-row mt-2 w-full px-4">
          <View className="flex-1 mr-2 w-[100px]">
            <Text className="font-semibold text-lg mb-2">Dos</Text>
            <Text className="text-sm">
              • Ensure good lighting for a clear image{"\n"}• Position yourself
              in a well-lit area{"\n"}• Stand in a straight pose for better
              results
            </Text>
          </View>
          <View className="flex-1 ml-2">
            <Text className="font-semibold text-lg mb-2">Don'ts</Text>
            <Text className="text-sm">
              • Avoid taking photos in low light{"\n"}• Don’t use flash as it
              can cause glare{"\n"}• Avoid wearing overly busy patterns
            </Text>
          </View>
        </View>
        <Image source={images.model} className="w-40 h-60 rounded-lg mt-4" />
        <Text>Reference Image</Text>
      </View>

      <View className="flex justify-center items-center mt-10 mb-10">
        <Text style={{ fontSize: 24, marginBottom: 10 }}>Take a Photo</Text>
        <Button
          title={uploading ? "Uploading..." : "Take Photo"}
          onPress={takePhoto}
          disabled={uploading}
        />
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 400, marginTop: 20, borderRadius: 8 }}
          />
        )}
        {isLoading && <Text>Loading...</Text>}
        {processedImageUrl && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              Processed Image
            </Text>
            <Image
              key={imageKey} // Force re-render if imageKey changes
              source={{ uri: `${processedImageUrl}` }}
              style={{ width: 200, height: 400, borderRadius: 8 }}
            />
          </View>
        )}
        
      </View>
    </ScrollView>
  );
};

export default TakePhotoScreen;
