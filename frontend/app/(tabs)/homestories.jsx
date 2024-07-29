import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage'; // Import Firebase functions
import { storage } from '../../config/firebase.config'; // Ensure you have initialized Firebase and exported storage
import {icons} from '../../constants'

const HomeStories = () => {
  const router = useRouter();
  const [stories, setStories] = useState([]);

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
        setStories(imageData);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <View className="px-6 mt-4">
      <Text className="text-3xl font-bold text-secondary-100 ">Recent Stories</Text>
      <Text className="pb-4">Maintain a Fwd Snap Score and get discounts</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row">
          {stories.slice(0, 4).map((story) => (
            <View key={story.id} className="mr-2">
              <Image
                source={{ uri: story.pictureUri }}
                className="w-40 h-60 rounded-xl"
                resizeMode="cover"
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
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>{story.accountName}</Text>
        </View>
            </View>
          ))}
        </View>
        <TouchableOpacity onPress={() => router.push('/snapStory')} className=" flex justify-center items-center ml-2">
        <Image
          source ={icons.rightArrow}
          className="h-10 w-10"
          resizeMode='contain'
        />

        <Text className="text-secondary text-right font-bold">View More</Text>
      </TouchableOpacity>
      </ScrollView>
      
    </View>
  );
};

export default HomeStories;
