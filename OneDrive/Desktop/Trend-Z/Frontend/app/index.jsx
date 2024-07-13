import { StatusBar } from 'expo-status-bar';
import {ScrollView, Text, View , Image} from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {images} from '../constants'
import CustomButton from '../components/CustomButton';




export default function App() {
  return (
    <SafeAreaView className = "h-full">
    <ScrollView contentContainerStyle ={{height: '100%'}}>
    <View className='w-full justify-center items-center min-h-[85vh] px-4'>
      <Image
        source={images.logo}
        className="w-[150px] h-[84px]"
        resizeMode='contain'
      />
      <View className="relative mt-5">
        <Text className="text-5xl font-bold text-center text-primary">Trend-Z</Text>
        <Text className="text-secondary-100 text-2xl">Keeping up with Trends</Text>
      </View>

      <CustomButton
        title = 'Sign Up'
        handlePress = {() => router.push('/sign-up')}
        containerStyles = "w-full mt-7"
      />
    </View>
    </ScrollView> 
    <StatusBar backgroundColor='#161622' style='light'/>  
    </SafeAreaView>
  );
}

