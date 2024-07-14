import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import {icons} from '../../constants'
import { useNavigation } from "@react-navigation/native";



const profile = () => {
  const navigation = useNavigation();
  return (
    <View>
    <View className="bg-secondary-100 h-[300px] mt-10" >
    <View className="flex-row mt-10  justify-between items-center">
      <TouchableOpacity onPress={() => navigation.goBack()} >
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity >
        <AntDesign name="setting" size={35} color="white" />
      </TouchableOpacity>
      </View>
    </View>
    <View className="bg-white rounded-2xl">
    <Image
      source={icons.profile}
      resizeMode="contain"
      className="w[50px] h[50px] rounded-[50%]"
    />

    </View>
    </View>
  )
}


export default profile