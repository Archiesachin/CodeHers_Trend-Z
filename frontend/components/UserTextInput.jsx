import { View,TextInput, TouchableOpacity, Image } from "react-native";
import React, {  useState } from "react";
import {icons} from '../constants';

const UserTextInput = ({
  placeholder,
  isPass,
  setStatValue,
  setGetEmailValidationStatus,
}) => {
  const [value, setValue] = useState("");
  const [showPass, setShowPass] = useState(true);

  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleTextChanged = (text) => {
    setValue(text);
    setStatValue(value);

    if (placeholder === "Email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const status = emailRegex.test(value);
      setIsEmailValid(status);
      setGetEmailValidationStatus(status);
    }
  };

  

  return (
    <View
      className={`border rounded-2xl px-4 py-6 flex-row items-center justify-between space-x-4 my-2 ${
        !isEmailValid && placeholder == "Email" && value.length > 0
          ? "border-red-500"
          : "border-gray-200"
      }`}
    >

      <TextInput
        className="flex-1 text-base text-primaryText font-psemibold -mt-1"
        placeholder={placeholder}
        value={value}
        placeholderTextColor='#7b7b8b'
        onChangeText={handleTextChanged}
        secureTextEntry={isPass && showPass}
        autoCapitalize="none"
      />

      {isPass && (
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
        <Image
              source={!showPass ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode='contain'
            />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UserTextInput;