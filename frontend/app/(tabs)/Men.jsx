import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import menscloth from '../../data/menscloth';
import { icons, images } from "../../constants";
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const Men = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selected, setSelected] = useState('Women');

  const handlePress = (category) => {
    setSelected(category);
    if (category === 'Men') {
      router.push('/Men');
    } else {
      setSelectedCategory(null);
      router.push('/Women');
    }
  };

  const handleProductPress = (item) => {
    router.push({
      pathname: "/ProductDetailScreen",
      params: { product: JSON.stringify(item) },
    });
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts = selectedCategory
    ? menscloth.filter(item => item.product_category === selectedCategory)
    : menscloth;

  const truncateText = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleProductPress(item)} style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.productName}>{truncateText(item.name, 5)}</Text>
      <Text style={styles.productPrice}>Rs.{item.price}</Text>
      <TouchableOpacity onPress={() => handleProductPress(item)}>
        <Text className="bg-secondary px-4 py-2 mt-2 mb-2 rounded-md">View Product</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View className="justify-between items-start flex-row px-6 mb-2">
        <View>
          <Text className="font-bold text-md text-secondary-100">Welcome Back</Text>
          <Text className="text-2xl font-bold text-secondary-100">Trend-Z</Text>
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

      <View className="justify-between items-start flex-row px-6 mb-4">
        <TouchableOpacity
          className={`w-[150px] h-[30px] border-2 border-gray-100 rounded-2xl items-center justify-center bg-gray-100`}
          onPress={() => handlePress('Men')}
        >
          <Text className="font-bold text-center text-secondary-100">Men</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`w-[150px] h-[30px] border-2 border-gray-100 rounded-2xl items-center justify-center`}
          onPress={() => handlePress('Women')}
        >
          <Text className="font-bold text-center text-secondary-100">Women</Text>
        </TouchableOpacity>
      </View>

      <View className="px-4 py-4 flex-row justify-center">
        <TouchableOpacity className="pr-4 justify-center flex items-center" onPress={() => handleCategoryPress('trousers')}>
          <Image
            source={{uri: "https://stylecaster.com/wp-content/uploads/2023/10/ASOS-Pants.jpg?w=600"}}
            resizeMode="contain"
            className="w-[70px] h-[70px] rounded-full border-2 border-secondary-100"
          />
          <Text className="text-secondary-100 font-bold text-md">Trousers</Text>
        </TouchableOpacity>
        <TouchableOpacity className="pr-4 justify-center flex items-center" onPress={() => handleCategoryPress('shirts')}>
          <Image
            source={{ uri: "https://streetgenz.in/cdn/shop/files/background-editor_output_3bd9e22b-c0b4-41ff-ae1a-a8cb254c4be4.png?v=1719843239" }}
            resizeMode="contain"
            className="w-[70px] h-[70px] rounded-full border-2 border-secondary-100"
          />
          <Text className="text-secondary-100 font-bold text-md">Shirts</Text>
        </TouchableOpacity>
        <TouchableOpacity className="pr-4 justify-center flex items-center" onPress={() => handleCategoryPress('footwear')}>
          <Image
            source={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_JNa2FZ7QoOMyW-20CPlVHRQkDMkpvkyswRfOy_Wmck5zxSmbiICGNpPAVj9molAdHLc&usqp=CAU"}}
            resizeMode="contain"
            className="w-[70px] h-[70px] rounded-full border-2 border-secondary-100"
          />
          <Text className="text-secondary-100 font-bold text-md">Footwear</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 35,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  image: {
    width: (width / 2) - 40, // Adjust width for the margin
    height: 150,
    borderRadius: 5,
  },
  productName: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  productPrice: {
    marginTop: 5,
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
  },
});

export default Men;
