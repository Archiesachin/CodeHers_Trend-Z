import { View, Text, TouchableOpacity, Image} from 'react-native'
import {Link} from 'expo-router'
import React from 'react'
import {icons} from '../constants'

const BottomRowTools = ({cameraMode, setCameraMode}) => {
  return (
    <View className="flex-row justify-center gap-4 ml-[-35px] items-center p-4">
    {/* <Link href={"/media-library"}>
    <Image
      source={icons.photo}
      resizeMode='contain'
      className="w-[20px] h-[20px]"
    />
    </Link> */}
    <TouchableOpacity onPress={() => setCameraMode('picture')} >
      <Text style={{fontWeight: cameraMode === 'picture' ? "bold" : "200"}} className="text-xl ml-8 text-white">Snap</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setCameraMode('video')}>
      <Text style={{fontWeight: cameraMode === 'video' ? "bold" : "200"}} className="text-xl text-white" >Video</Text>
    </TouchableOpacity>
    </View>
  )
}

export default BottomRowTools