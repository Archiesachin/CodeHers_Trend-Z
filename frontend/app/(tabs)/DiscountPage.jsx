// DiscountsPage.js
import React from "react";
import { View, StyleSheet, FlatList , TouchableOpacity, Text, Image} from "react-native";
import DiscountTile from "./DiscountTile";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { icons } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import DiscountImage from '../../assets/discounts.png'

const DiscountPage = () => {
  const discounts = [
    { id: "1", image: DiscountImage, discount: "20% Off" },
    { id: "2", image: DiscountImage, discount: "15% Off" },
    { id: "3", image: DiscountImage, discount: "10% Off" },
  ];

  const navigation = useNavigation();

  return (
    <View>
      <View className="flex-row justify-between items-center mb-4 bg-secondary-100 pt-14 pb-4 px-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={32} color="#fff" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-white">Discounts</Text>
        <View className="flex justify-center items-center">
          <Image
            source={icons.profile}
            resizeMode="contain"
            className="w-8 h-8 rounded-full"
          />
        </View>
      </View>
      <View className="justify-center flex items-center">
        <FlatList
          data={discounts}
          renderItem={({ item }) => (
            <DiscountTile
              key={item.id}
              image={item.image}
              discount={item.discount}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});

export default DiscountPage;
