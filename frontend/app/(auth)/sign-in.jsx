import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        if (userData.email === form.email && userData.password === form.password) {
          Alert.alert('Success', 'Signed in successfully!');
          // Navigate to home or other authenticated screen
          router.push('/home');
        } else {
          Alert.alert('Error', 'Invalid email or password.');
        }
      } else {
        Alert.alert('Error', 'User data not found. Please sign up.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, marginTop: 40 }}>
          <Image
            source={images.logo}
            resizeMode='contain'
            style={{ width: 140, height: 100 }}
          />
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FF1493', textAlign: 'center', marginTop: 20 }}>Exploring Trends with Trend-Z</Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            secureTextEntry={true}
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7 w-[300px]"
            isLoading={isSubmitting}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>Don't have an account?</Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary-100"
              style={{ fontSize: 16, color: '#FF1493', marginLeft: 5 }}
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SignIn;
