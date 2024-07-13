import { View, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAssetsAsync, requestPermissionsAsync } from 'expo-media-library'
import { Link } from 'expo-router'
import { icons } from '../constants'  // Ensure this path is correct

const MainRowActions = ({ cameraMode, handleTakePictures, isRecording }) => {
  const [assets, setAssets] = useState([])

  useEffect(() => {
    getAssets()
  }, [])

  async function getAssets() {
    const { status } = await requestPermissionsAsync()
    if (status !== 'granted') {
      console.log('Permission to access media library was denied')
      return
    }

    try {
      const albumsAssets = await getAssetsAsync({
        mediaType: 'photo',
        sortBy: 'creationTime',
        first: 4,
      })
      setAssets(albumsAssets.assets)
    } catch (error) {
      console.log('Error fetching assets:', error)
    }
  }

  return (
    <View className="flex-row mt-[150%] mr-[40%]">
      <FlatList
        inverted
        data={assets}
        renderItem={({ item }) => (
          <Image
            key={item.id}
            source={{ uri: item.uri }}
            style={{ width: 40, height: 40, borderRadius: 5, marginHorizontal: 6, marginTop: 15, marginRight: 10 }} 
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
      />
      <TouchableOpacity onPress={handleTakePictures}>
        <Image
          source={cameraMode === 'picture' ? icons.circle : isRecording ? icons.recordOn : icons.recording}
          style={{ width: 70, height: 70 }}
        />
      </TouchableOpacity>
      {/* <Link href="/snapchat/snapStory">
        <TouchableOpacity>
          <Image
            source={icons.user}
            style={{ width: 40, height: 40, marginTop: 15, marginLeft: 10 }}
            resizeMode='contain'
          />
        </TouchableOpacity>
      </Link> */}
    </View>
  )
}

export default MainRowActions
