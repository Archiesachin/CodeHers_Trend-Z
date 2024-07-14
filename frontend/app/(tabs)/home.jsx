import React from 'react';
import { Text, View, FlatList, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons, images } from '../../constants';
import Searchinput from '../../components/Searchinput';

const Home = () => {
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="my-6 space-y-6">
          <View className="justify-between items-start flex-row px-6 mb-2">
            <View>
              <Text className="font-bold text-md text-secondary-100">
                Welcome Back
              </Text>
              <Text className=" text-2xl font-bold text-secondary-100">
                Trend-Z
              </Text>
            </View>
            <View className="mt-1.5 ml-[100px]">
              <Image
                source={icons.bell}
                resizeMode="contain"
                className="w-[20px] h-[23px]"
              />
            </View>
            <View className="mt-1.5">
              <Image
                source={icons.heart}
                resizeMode="contain"
                className="w-[20px] h-[23px]"
              />
            </View>
            <View className="mt-1.5">
              <Image
                source={icons.bag}
                resizeMode="contain"
                className="w-[20px] h-[23px]"
              />
            </View>
          </View>

          <View className="px-6">
            <Searchinput />
          </View>

          <View className="justify-between items-start flex-row px-6 ">
            <View className="w-[150px] h-[30px] border-2 border-gray-100 rounded-2xl items-center justify-center">
              <Text className="font-bold text-center text-secondary-100">
                Men
              </Text>
            </View>
            <View className="w-[150px] h-[30px] border-2 border-gray-100 rounded-2xl items-center justify-center">
              <Text className="font-bold text-center text-secondary-100">
                Women
              </Text>
            </View>
          </View>

          <View className="">
            <Image
              source={images.header}
              className="w-full h-[210px]"
              resizeMode="contain"
            />
            <Text className="text-center font-bold text-3xl text-secondary-100">
              NEW & TRENDING
            </Text>
            <Text className="text-center text-sm text-primary">
              Shop Now
            </Text>
            <Image
              source={icons.rightArrow}
              className="w-[15px] h-[15px] mt-[-18px] ml-[220px]"
              resizeMode="contain"
            />
          </View>
        </View>

        <View className="justify-start gap-2 items-start flex-row px-2 ">
            <View className=" h-[30px] border-2 border-gray-100 rounded-2xl items-center justify-center">
              <Text className="font-bold text-center text-secondary-100 px-4">
                Recommended For You
              </Text>
           </View>
          </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: 1 }, { id: 2 }, { id: 3 }]}
          keyExtractor={(item) => item.id.toString()} 
          renderItem={({ item }) => (
            <View className="px-2 my-4 justify-between items-start flex-1">
              <View className="w-[150px] h-[200px] bg-black-100">
                <Text>{item.id}</Text>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
