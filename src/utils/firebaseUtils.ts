import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { toast } from "sonner";

/* ---------------- FIREBASE CONFIG ---------------- */

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

/* ---------------- INIT APP (SAFE) ---------------- */

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/* ---------------- GET MESSAGING (SSR SAFE) ---------------- */

export const getFirebaseMessaging = async () => {
  if (typeof window === "undefined") return null;

  const supported = await isSupported();
  if (!supported) {
    console.warn("FCM is not supported in this browser");
    return null;
  }

  return getMessaging(app);
};

/* ---------------- REQUEST TOKEN ---------------- */

export const RequestFCMToken = async () => {
  try {
    if (typeof window === "undefined") return null;

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      toast.warning("Notification permission not granted");
      return null;
    }

    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    const token = await getToken(messaging, { vapidKey });

    if (!token) {
      toast.error("Failed to generate FCM token");
      return null;
    }

    return token;
  } catch (error) {
    return null;
  }
};
