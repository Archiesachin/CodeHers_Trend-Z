import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import UserTextInput from '../../components/UserTextInput';
import FormField from '../../components/FormField'
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth, firestoreDB } from '../../config/firebase.config';
import { doc, setDoc } from 'firebase/firestore';

const SignUp = () => {
  const router = useRouter();

  const [form, setForm] = useState({ show: '' });
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [getEmailValidationStatus, setGetEmailValidationStatus] = useState(false);

  useEffect(() => {
    const storeShowInAsyncStorage = async () => {
      try {
        if (form.show) {
          await AsyncStorage.setItem('favoriteShow', form.show);
          console.log('Favorite show stored in AsyncStorage');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to store favorite show in AsyncStorage.');
      }
    };

    storeShowInAsyncStorage();
  }, [form.show]);

  const handleSignUp = async()=>{
    if(getEmailValidationStatus && email !== ""){
      await createUserWithEmailAndPassword(firebaseAuth, email, password).then((userCred) =>{
        const data = {
          _id : userCred?.user.uid,
          fullName : name,
          providerData : userCred.user.providerData[0]
          
        }  
        setDoc(doc(firestoreDB, 'users', userCred?.user.uid), data).then(() =>{
          router.push('/sign-in')
        })
      }
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, marginTop: 40, marginBottom: 20 }}>
          <Image
            source={images.logo}
            resizeMode='contain'
            style={{ width: 140, height: 100 }}
          />
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FF1493', textAlign: 'center', marginBottom: 20 }}>
            Exploring Trends with Trend-Z
          </Text>

          <UserTextInput
            placeholder="Full Name"
            isPass={false}
            setStatValue={setName}
          />

          <UserTextInput
            placeholder="Email"
            isPass={false}
            setStatValue={setEmail}
            setGetEmailValidationStatus={setGetEmailValidationStatus}
          />

          <UserTextInput
            placeholder="Password"
            isPass={true}
            setStatValue={setPassword}
          />

          <FormField
            value={form.show}
            placeholder="What is your fashion interest?"
            handleChangeText={(e) => setForm({ ...form, show: e })}
            otherStyles="mt-2"
          />

          <TouchableOpacity
            onPress={handleSignUp}
            className="w-full px-4 py-2 rounded-xl bg-secondary my-6 flex items-center justify-center"
          >
            <Text className="py-2 text-white text-xl font-bold">
              Sign Up
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>Already have an account?</Text>
            <Link
              href="/sign-in"
              className="text-lg font-bold text-secondary-100"
              style={{ fontSize: 16, color: '#FF1493', marginLeft: 5, marginTop: 3 }}
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
