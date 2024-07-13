import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUp = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    show: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.name || !form.email || !form.password || !form.show) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      // Simulating storing user data in AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(form));
      Alert.alert('Success', 'Account created successfully!');
      router.push('/sign-in'); // Navigate to sign-in screen after successful sign-up
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, marginTop: 40, marginBottom:20 }}>
          <Image
            source={images.logo}
            resizeMode='contain'
            style={{ width: 140, height: 100 }}
          />
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FF1493', textAlign: 'center', marginTop: 20 }}>Exploring Trends with Trend-Z</Text>

          <FormField
            title="Name"
            value={form.name}
            handleChangeText={(e) => setForm({ ...form, name: e })}
            otherStyles="mt-7"
          />
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
          <FormField
            title="What is your favourite show?"
            value={form.show}
            handleChangeText={(e) => setForm({ ...form, show: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7 w-[300px]"
            isLoading={isSubmitting}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>Already have an account?</Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary-100"
              style={{ fontSize: 16, color: '#FF1493', marginLeft: 5, marginTop:3 }}
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SignUp;
