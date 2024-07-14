import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';

const FormField = ({ value, placeholder, handleChangeText, otherStyles, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <View className={` ${otherStyles}`}>
      <View className="border border-gray-200 rounded-2xl px-4 py-6 flex-row items-center justify-between space-x-4 w-[320px]">
        <TextInput
          className="flex-1 text-base text-primaryText font-semibold -mt-1"
          value={value}
          placeholder={placeholder}
          placeholderTextColor='#7b7b8b'
          onChangeText={handleChangeText}
          secureTextEntry={placeholder === 'Password' && !showPassword}
        />
        
        {placeholder === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image 
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode='contain'
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
