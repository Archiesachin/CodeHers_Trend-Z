import { View, Text, TouchableOpacity, Image} from 'react-native'

import React from 'react'
import {icons} from '../constants'

const BottomRowTools = ({cameraMode, setCameraMode}) => {
  return (
    <View className="flex-row justify-center gap-4 ml-[-35px] items-center p-4">
    <TouchableOpacity onPress={() => setCameraMode('picture')} >
      <Text style={{fontWeight: cameraMode === 'picture' ? "bold" : "200"}} className="text-xl ml-4 text-white">Snap</Text>
    </TouchableOpacity>
 
    </View>
  )
}

export default BottomRowTools