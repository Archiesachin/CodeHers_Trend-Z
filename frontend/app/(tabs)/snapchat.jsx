import { View } from 'react-native'
import React, { useRef, useState } from 'react'
import { CameraView } from 'expo-camera'
import BottomRowTools from '../../components/BottomRowTools'
import MainRowActions from '../../components/MainRowActions'
import PictureView from '../../components/PictureView'
import { useRouter } from 'expo-router'
import { TouchableOpacity, Image } from 'react-native'
import { icons } from '../../constants'
import {  ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase.config';

const Snapchat = () => {
  const router = useRouter()
  const cameraRef = useRef(null)
  const [cameraMode, setCameraMode] = useState('picture')
  const [picture, setPicture] = useState("")

  async function handleTakePicture() {
    const response = await cameraRef.current?.takePictureAsync({});
    console.log(response.uri);
    setPicture(response.uri);
  }
  

  
  const handleShare = async () => {
    if (picture) {
      try {
        const response = await fetch(picture);
        const blob = await response.blob();

        const storageRef = ref(storage, `images/${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);
        console.log("Image uploaded successfully:", downloadURL);

        router.push({
          pathname: '/snapStory',
          params: { pictureUri: downloadURL },
        });
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

export default Snapchat
