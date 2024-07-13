import { View, Text, TextInput, TouchableOpacity , Image} from 'react-native'
import React, { useState } from 'react'
import {icons} from '../constants'

const FormField = ({title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
  const [showPassword, setShowPassword ] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className=" text-base text-primary font-pmedium">{title}</Text>
      <View className=" w-[300px] h-16 px-4 bg-gray-100 rounded-2xl focus:border-secondary-100 items-center flex-row ">
      <TextInput className=" flex-1 text-primary font-psemibold text-base"
        value={value}
        placeholder={placeholder}
        placeholderTextColor='#7b7b8b'
        onChangeText={handleChangeText}
        secureTextEntry = {title === 'Password' && !showPassword}
      />

      {title === 'Password' && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image 
            source={!showPassword ? icons.eye : icons.eyeide}
            className="w-6 h-6"
            resizeMode='contain'
          />
        </TouchableOpacity>
      )}
      </View>
    </View>
  )
}

export default FormField