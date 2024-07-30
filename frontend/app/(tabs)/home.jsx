import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, Image,Dimensions, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { icons, images } from '../../constants';
import Searchinput from '../../components/Searchinput';
import ProductList from '../../components/ProductList';
import QuizComponent from '../../components/QuizComponent';

const imagesSlide = [
  { id: "1", uri: "https://via.placeholder.com/600x210?text=Image+1" },
  { id: "2", uri: "https://via.placeholder.com/600x210?text=Image+2" },
  { id: "3", uri: "https://via.placeholder.com/600x210?text=Image+3" },
];
const { width } = Dimensions.get("window");
const Home = () => {
  const router = useRouter();
  const [tags, setTags] = useState(["Y2K"]);
  const [selected, setSelected] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };
  const handlePress = (category) => {
    setSelected(category);
    if (category === 'Men') {
      router.push('/Men');
    } else {
      router.push('/Women');
    }
  };

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

   useEffect(() => {
     // Automatically advance the slideshow every 3 seconds
     const interval = setInterval(() => {
       setCurrentIndex((prevIndex) => {
         const nextIndex = (prevIndex + 1) % images.length;
         flatListRef.current.scrollToIndex({
           index: nextIndex,
           animated: true,
         });
         return nextIndex;
       });
     }, 3000);

     return () => clearInterval(interval); // Cleanup on component unmount
   }, []);
    const renderItem = ({ item }) => (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.uri }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    );
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="my-10 space-y-6">
          <View className="justify-between items-start flex-row px-6 mb-2">
            <View>
              <Text className="font-bold text-md text-secondary-100">
                Welcome Back
              </Text>
              <Text className="text-2xl font-bold text-secondary-100">
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
            <TouchableOpacity
              className="mt-1.5"
              onPress={() => router.push("/WishList")}
            >
              <Image
                source={icons.heart}
                resizeMode="contain"
                className="w-[20px] h-[23px]"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="mt-1.5"
              onPress={() => router.push("/Cart")}
            >
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

          <View className="justify-between items-start flex-row px-6">
            <TouchableOpacity
              className={`w-[150px] h-[30px] border-2 border-gray-100 rounded-2xl items-center justify-center`}
              onPress={() => handlePress("Men")}
            >
              <Text className="font-bold text-center text-secondary-100">
                Men
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`w-[150px] h-[30px] border-2 border-gray-100 rounded-2xl items-center justify-center `}
              onPress={() => handlePress("Women")}
            >
              <Text className="font-bold text-center text-secondary-100">
                Women
              </Text>
            </TouchableOpacity>
          </View>

          <View className="">
            <View style={styles.containerI}>
              <FlatList
                data={images}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                onScroll={handleScroll}
                ref={flatListRef}
                showsHorizontalScrollIndicator={false}
                bounces={false}
              />
              <View style={styles.pagination}>
                {images.map((_, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.paginationDot,
                      currentIndex === index && styles.activeDot,
                    ]}
                  >
                    ●
                  </Text>
                ))}
              </View>
            </View>
            <Text className="text-center font-bold text-3xl text-secondary-100">
              NEW & TRENDING
            </Text>
            <Text className="text-center text-sm font-bold text-primary">
              Shop Now
            </Text>
            <Image
              source={icons.rightArrow}
              className="w-[15px] h-[15px] mt-[-16px] ml-[215px]"
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity
            className={`w-[180px] h-[30px] border-2 border-gray-100 rounded-2xl items-center justify-center ml-4 px-2 `}
          >
            <Text className="font-bold text-center text-secondary-100">
              Recommended for you
            </Text>
          </TouchableOpacity>

          <View>
            <ProductList selected={selected} tags={tags} />
          </View>

          <View>
            <QuizComponent />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 210,
  },
  imageContainer: {
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  paginationDot: {
    fontSize: 24,
    color: "#888",
    marginHorizontal: 3,
  },
  activeDot: {
    color: "#fff",
  },
});
export default Home;
