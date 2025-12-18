"use client";
import { RequestFCMToken } from "@/utils/firebaseUtils";
import { useEffect, useState } from "react";

const GetFcmToken = () => {
  const [fcmtoken, setFcmToken] = useState<string | null>(null);
  const [stored, setStored] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await RequestFCMToken();
        if (token) setFcmToken(token);
      } catch (error) {
        console.error("Error getting token:", error);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    if (!fcmtoken || stored) return;

    const storeToken = async () => {
      const res = await fetch("/api/notification/store-fcm-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: fcmtoken }),
      });

      await res.json();
      setStored(true);
    };

    storeToken();
  }, [fcmtoken, stored]);

  return null;
};

export default GetFcmToken;
