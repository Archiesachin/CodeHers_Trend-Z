import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import UserTextInput from '../../components/UserTextInput';
import { Link, useRouter } from 'expo-router';
import {signInWithEmailAndPassword} from 'firebase/auth'
import { firebaseAuth, firestoreDB } from '../../config/firebase.config';
import { useDispatch } from 'react-redux';
import { SET_USER } from '../../context/action/userAction';
import { doc, getDoc } from 'firebase/firestore';


const SignIn = () => {
  const router = useRouter();
  const dispatch = useDispatch()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);

  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);


  const handleLogin = async () => {
    if (getEmailValidationStatus && email !== "") {
      await signInWithEmailAndPassword(firebaseAuth, email, password)
        .then((userCred) => {
          if (userCred) {
            console.log("User Id:", userCred?.user.uid);
            getDoc(doc(firestoreDB, "users", userCred?.user.uid)).then(
              (docSnap) => {
                if (docSnap.exists()) {
                  console.log("User Data : ", docSnap.data());
                  dispatch(SET_USER(docSnap.data()));
                  router.push("/home")
                }
              }
            );
          }
        })
        .catch((err) => {
          console.log("Error : ", err.message);
          if (err.message.includes("wrong-password")) {
            setAlert(true);
            setAlertMessage("Password Mismatch");
          } else if (err.message.includes("user-not-found")) {
            setAlert(true);
            setAlertMessage("User Not Found");
          } else {
            setAlert(true);
            setAlertMessage("Invalid Email Address");
          }
          setInterval(() => {
            setAlert(false);
          }, 2000);
        });
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
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FF1493', textAlign: 'center', marginTop: 20, marginBottom:20 }}>Exploring Trends with Trend-Z</Text>


          {alert && (
            <Text className="text-base text-red-600">{alertMessage}</Text>
          )}


          <UserTextInput
            placeholder="Email"
            isPass={false}
            setStatValue={setEmail}
            setGetEmailValidationStatus={setGetEmailValidationStatus}
          />

          {/* password */}

          <UserTextInput
            placeholder="Password"
            isPass={true}
            setStatValue={setPassword}
          />

          {/* login button */}

          <TouchableOpacity
            onPress={handleLogin}
            className="w-full px-4 py-2 rounded-xl bg-secondary my-3 flex items-center justify-center"
          >
            <Text className="py-2 text-white text-xl font-bold">
              Sign In
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>Don't have an account?</Text>
            <Link
              href="/sign-up"
              className="text-lg font-bold text-secondary-100"
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
