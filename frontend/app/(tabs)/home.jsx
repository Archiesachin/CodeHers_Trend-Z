import React, {useState, useEffect} from 'react';
import { Text, View, FlatList, Image, ScrollView , TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons, images } from '../../constants';
import Searchinput from '../../components/Searchinput';
import ProductList from '../../components/ProductList'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useRouter } from 'expo-router';


const Home = () => {
  const router = useRouter()
  const [tags, setTags] = useState(["Y2K"]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const storedTags = await AsyncStorage.getItem("favoriteShow");
        if (storedTags) {
          setTags(storedTags.split(",").map((tag) => tag.trim()));
        }
      } catch (error) {
        console.error("Failed to load tags from AsyncStorage:", error);
      }
    };

    fetchTags();
  }, []);

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
            <TouchableOpacity className="mt-1.5" onPress={() => router.push('/WishList')}>
              <Image
                source={icons.heart}
                resizeMode="contain"
                className="w-[20px] h-[23px]"
              />
            </TouchableOpacity>
            <TouchableOpacity className="mt-1.5" onPress={() => router.push('/Cart')}>
              <Image
                source={icons.bag}
                resizeMode="contain"
                className="w-[20px] h-[23px]"
              />
            </TouchableOpacity>
          </View>

          <View className="px-6">
            <Searchinput />
          </View>

          <View className="justify-between items-start flex-row px-6 ">
            <TouchableOpacity className="w-[150px] h-[30px] border-2 border-gray-100 rounded-2xl items-center justify-center">
              <Text className="font-bold text-center text-secondary-100">
                Men
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-[150px] h-[30px] border-2 border-gray-100 rounded-2xl items-center justify-center bg-gray-100">
              <Text className="font-bold text-center text-secondary-100">
                Women
              </Text>
            </TouchableOpacity>
          </View>

          <View className="px-4 py-4 flex-row justify-center ">
        <TouchableOpacity className="pr-4 justify-center flex items-center">
          <Image
            source={images.bottom}
            resizeMode='contain'
            className="w-[70px] h-[70px] rounded-full border-2 border-secondary-100"
          />
          <Text className="text-secondary-100 font-bold text-md">Pants</Text>
        </TouchableOpacity>
        <TouchableOpacity className="pr-4 justify-center flex items-center">
          <Image
            source={images.top}
            resizeMode='contain'
            className="w-[70px] h-[70px] rounded-full border-2 border-secondary-100"
          />
          <Text className="text-secondary-100 font-bold text-md">Tops</Text>
        </TouchableOpacity>
        <TouchableOpacity className="pr-4 justify-center flex items-center">
          <Image
            source={images.jacket}
            resizeMode='contain'
            className="w-[70px] h-[70px] rounded-full border-2 border-secondary-100"
          />
          <Text className="text-secondary-100 font-bold text-md">Jackets</Text>
        </TouchableOpacity>
        <TouchableOpacity className="pr-4 justify-center flex items-center">
          <Image
            source={images.sandals}
            resizeMode='contain'
            className="w-[70px] h-[70px] rounded-full border-2 border-secondary-100"
          />
          <Text className="text-secondary-100 font-bold text-md">Shoes</Text>
        </TouchableOpacity>
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

        <View className="justify-start gap-2 items-start flex-row px-2 mb-4">
            <View className=" h-[30px] border-2 border-gray-100 rounded-2xl items-center justify-center">
              <Text className="font-bold text-center text-secondary-100 px-4">
                Recommended For You
              </Text>
           </View>
          </View>

        <ProductList tags={tags}/>

        
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
