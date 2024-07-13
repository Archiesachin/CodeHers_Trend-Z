import { View } from 'react-native'
import React, { useRef, useState } from 'react'
import { CameraView } from 'expo-camera'
import BottomRowTools from '../../components/BottomRowTools'
import MainRowActions from '../../components/MainRowActions'
import PictureView from '../../components/PictureView'
import { Link, useRouter } from 'expo-router'
import { TouchableOpacity, Image } from 'react-native'
import { icons } from '../../constants'
import * as Sharing from 'expo-sharing';

const Snapchat = () => {
  const router = useRouter()
  const cameraRef = useRef(null)
  const [cameraMode, setCameraMode] = useState('picture')
  const [picture, setPicture] = useState("")

  async function handleTakePicture() {
    const response = await cameraRef.current?.takePictureAsync({})
    console.log(response.uri)
    setPicture(response.uri)
  }

  async function handleShare() {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(picture);
      router.push({
        pathname: '/snapStory',
        params: { pictureUri: picture }
      });
    } else {
      alert("Sharing is not available on this device");
    }
  }

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
