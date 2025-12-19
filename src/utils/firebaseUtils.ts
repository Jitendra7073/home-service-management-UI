import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB1mPv85PzhOMXsp-JoAgrUF426XcR8r34",
  authDomain: "global-hsm.firebaseapp.com",
  projectId: "global-hsm",
  storageBucket: "global-hsm.firebasestorage.app",
  messagingSenderId: "906297527688",
  appId: "1:906297527688:web:9ac40d002c19e513babe3d",
  measurementId: "G-3MEKHX6VQ6"
};

const vapidKey = "BNQF_YZYWxHxRNNgOEZy32Fsfvr6eLheZ5MmZF8bqk1rEmAfRvFDWxar7Tc6WOZqmvjfev2fKc0RniswR7-HJxk"

const app = initializeApp(firebaseConfig)

const messaging = getMessaging(app)

export const RequestFCMToken = async () =>{
  return Notification.requestPermission()
  .then((premission) =>{
    if(premission === "granted"){
      return getToken(messaging,{ vapidKey })
    }else{
      throw new Error("Notification not granted!")
    }
  })
  .catch((error)=>{
    console.error("Error getting FCM Token:",error)
    throw error;
  })
}