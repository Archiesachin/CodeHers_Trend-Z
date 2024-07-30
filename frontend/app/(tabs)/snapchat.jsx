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

  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = firebaseAuth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(firestoreDB, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("Fetched user data:", userData); // Debugging
            setAccountName(userData.fullName || "Default User");
          } else {
            console.log("No such user document!");
            setAccountName("Default User");
          }
        } else {
          setAccountName("Default User");
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setAccountName("Default User"); // Ensure fallback value
      } finally {
        setIsUserDataLoaded(true);
      }
    };
  
    fetchUserData();
  }, []);
  
  
  const handleShare = async (type, text, picture, room = null) => {
    if (!isUserDataLoaded) {
      alert("User data is still loading. Please try again.");
      return;
    }
  
    if (picture) {
      try {
        // Fetch the image as a blob
        const response = await fetch(picture);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();
        
        // Create a reference for the image in Firebase Storage
        const storageRef = ref(storage, `images/${Date.now()}.jpg`);
        
        // Check if accountName is set
        console.log("Account Name before upload:", accountName); // Debugging
  
        // Upload the image to Firebase Storage with metadata
        await uploadBytes(storageRef, blob, {
          customMetadata: {
            accountName,
            text: text || "",
          },
        });
  
        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Image uploaded successfully:", downloadURL);
  
        // Update the snapScore if sharing on story
        if (type === 'story') {
          const user = firebaseAuth.currentUser;
          if (user) {
            const userRef = doc(firestoreDB, 'users', user.uid);
            await updateDoc(userRef, {
              snapScore: increment(1), // Increment snapScore by 1
            });
          }
          
          // Redirect to snapStory page with the image URL
          router.push({
            pathname: '/snapStory',
            query: { pictureUri: downloadURL }, // Use query instead of params
          });
  
        } else if (type === 'chat' && room) {
          // Add the image to the selected chat room
          const chatRef = doc(firestoreDB, 'chats', room._id);
          await updateDoc(chatRef, {
            messages: arrayUnion({
              text,
              image: downloadURL,
              sender: firebaseAuth.currentUser?.uid || "unknown",
              timestamp: serverTimestamp(),
            }),
          });
  
          // Redirect to the chat room
          router.push({
            pathname: `/chat/${room._id}`,
            query: { pictureUri: downloadURL }, // Use query instead of params
          });
        }
        
        alert('Image shared successfully.');
  
      } catch (error) {
        console.error('Error uploading image:', error);
        alert(`Failed to upload and share the image: ${error.message}`);
      }
    } else {
      alert("No picture to share.");
    }
  };
  

async function handleTakePicture() {
  if (cameraRef.current) {
    try {
      const response = await cameraRef.current.takePictureAsync({});
      console.log("Captured image URI:", response.uri);
      setPicture(response.uri);
    } catch (error) {
      console.error("Error taking picture:", error);
    }
  }
}

// const handleShare = async (type, text, picture, room = null) => {
//   if (picture) {
//     try {
//       // Fetch the image as a blob
//       const response = await fetch(picture);
//       if (!response.ok) {
//         throw new Error(`Failed to fetch image: ${response.statusText}`);
//       }
//       const blob = await response.blob();
      
//       // Create a reference for the image in Firebase Storage
//       const storageRef = ref(storage, `images/${Date.now()}.jpg`);
      
//       // Get current user and their name
//       const user = firebaseAuth.currentUser;
//       const accountName = user ? user.fullName || "Default User" : "Default User";
      
//       // Upload the image to Firebase Storage with metadata
//       await uploadBytes(storageRef, blob, {
//         customMetadata: {
//           accountName,
//           text: text || "",
//         },
//       });
      
//       // Get the download URL of the uploaded image
//       const downloadURL = await getDownloadURL(storageRef);
//       console.log("Image uploaded successfully:", downloadURL);
      
//       // Update the snapScore if sharing on story
//       if (type === 'story') {
//         if (user) {
//           const userRef = doc(firestoreDB, 'users', user.uid);
//           await updateDoc(userRef, {
//             snapScore: increment(1), // Increment snapScore by 1
//           });
//         }
        
//         // Redirect to snapStory page with the image URL
//         router.push({
//           pathname: '/snapStory',
//           params: { pictureUri: downloadURL },
//         });

//       } else if (type === 'chat' && room) {
//         // Add the image to the selected chat room
//         const chatRef = doc(firestoreDB, 'chats', room._id);
//         await updateDoc(chatRef, {
//           messages: arrayUnion({
//             text,
//             image: downloadURL,
//             sender: user?.uid || "unknown",
//             timestamp: serverTimestamp(),
//           }),
//         });

//         // Redirect to the chat room
//         router.push({
//           pathname: `/chat/${room._id}`,
//           params: { pictureUri: downloadURL },
//         });
//       }
      
//       alert('Image shared successfully.');

//     } catch (error) {
//       console.error('Error uploading image:', error);
//       alert(`Failed to upload and share the image: ${error.message}`);
//     }
//   } else {
//     alert("No picture to share.");
//   }
// };


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