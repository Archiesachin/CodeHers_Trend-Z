import { View } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { CameraView } from 'expo-camera';
import BottomRowTools from '../../components/BottomRowTools';
import MainRowActions from '../../components/MainRowActions';
import PictureView from '../../components/PictureView';
import { useRouter } from 'expo-router';
import { TouchableOpacity, Image } from 'react-native';
import { icons } from '../../constants';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, firebaseAuth, firestoreDB } from '../../config/firebase.config';
import { doc, updateDoc, increment , getDoc} from 'firebase/firestore';




const Snapchat = () => {
  const router = useRouter();
  const cameraRef = useRef(null);
  const [cameraMode, setCameraMode] = useState('picture');
  const [picture, setPicture] = useState("");
  const [accountName, setAccountName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = firebaseAuth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(firestoreDB, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setAccountName(userData.fullName || "Default User");
          } else {
            console.log("No such user document!");
            setAccountName("Default User");
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
  
    fetchUserData();
  }, []);

  async function handleTakePicture() {
    if (cameraRef.current) {
      const response = await cameraRef.current.takePictureAsync({});
      console.log(response.uri);
      setPicture(response.uri);
    }
  }

  const handleShare = async (picture, text) => {
    if (picture) {
      try {
        // Fetch the image from the URI and convert it to a blob
        const response = await fetch(picture);
        const blob = await response.blob();
        
        // Create a reference for the new image in Firebase Storage
        const storageRef = ref(storage, `images/${Date.now()}.jpg`);
        
        // Upload the image blob to Firebase Storage with metadata
        await uploadBytes(storageRef, blob, {
          customMetadata: { 
            accountName: name, // Metadata with the user's full name
            text: text || '' // Adding text to metadata
          },
        });
        
        // Get the download URL for the uploaded image
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Image uploaded successfully:", downloadURL);
        
        // Update the user's SnapScore
        const user = firebaseAuth.currentUser;
        if (user) {
          const userRef = doc(firestoreDB, 'users', user.uid);
          await updateDoc(userRef, {
            snapScore: increment(1) // Increment SnapScore by 1
          });
        }
        
        // Redirect to SnapStory with the image URL and text as parameters
        navigation.navigate('snapStory', { pictureUri: downloadURL, text });
      } catch (error) {
        console.error('Error uploading image:', error);
        alert("Failed to upload and share the image. Please check the console for more details.");
      }
    } else {
      alert("No picture to share.");
    }
  };
  
  
  if (picture) return <PictureView picture={picture} setPicture={setPicture} handleShare={handleShare}/>

  return (
    <CameraView mode={cameraMode} ref={cameraRef} className="flex-1">
      <MainRowActions cameraMode={cameraMode} handleTakePictures={handleTakePicture} isRecording={false} />
      <TouchableOpacity onPress={() => router.push('/snapStory')} className="ml-[220px] mt-[-70px] mb-[10px]">
        <Image
          source={icons.user}
          style={{ width: 40, height: 40, marginTop: 15, marginLeft: 10 }}
          resizeMode='contain'
        />
      </TouchableOpacity>
      <BottomRowTools setCameraMode={setCameraMode} cameraMode={cameraMode} />
    </CameraView>
  )
}

export default Snapchat;
