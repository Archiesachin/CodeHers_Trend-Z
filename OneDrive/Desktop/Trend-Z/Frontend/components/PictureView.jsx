import { View, Image, TouchableOpacity, Text, Alert } from 'react-native'
import React from 'react'
import { icons } from '../constants'
import { saveToLibraryAsync } from 'expo-media-library'

const PictureView = ({ picture, setPicture,  handleShare }) => {
  return (
    <View className="flex-1 justify-center items-center">
      <Image
        source={{ uri: picture }}
        className="w-full h-full"
      />
      <View className="flex-row mt-[-100px]">
        <TouchableOpacity 
          onPress={async() => {
            await saveToLibraryAsync(picture)
            Alert.alert("Picture saved")
            }} 
          className="bg-secondary-100 p-2 mx-1 rounded-3xl"
        >
          <Image
            source={icons.save}
            className="w-[25px] h-[25px]"
          />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleShare} 
          className="bg-secondary-100 p-2 mx-1 rounded-3xl"
        >
          <Image
            source={icons.share}
            className="w-[25px] h-[25px]"
          />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setPicture('')} 
          className="bg-secondary-100 p-2 mx-1 rounded-3xl"
        >
          <Image
            source={icons.close}
            className="w-[25px] h-[25px]"
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default PictureView