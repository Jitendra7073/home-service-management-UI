"use client";

import { RequestFCMToken } from "@/utils/firebaseUtils";
import { useEffect, useRef } from "react";

const GetFcmToken = () => {
  const isStoredRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const initFCM = async () => {
      try {
        // Request token safely
        const token = await RequestFCMToken();

        // Permission denied / unsupported / SSR
        if (!token || !isMounted) return;

        // Prevent duplicate store (StrictMode / re-renders)
        if (isStoredRef.current) return;
        isStoredRef.current = true;

        // Store token in backend
        const res = await fetch("/api/notification/store-fcm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          console.warn("FCM token store failed");
          isStoredRef.current = false; // allow retry later
          return;
        }

        // Optional: read response if needed
        await res.json();
      } catch {
        // 🔕 Silent fail (expected in many browsers)
      }
    };

    initFCM();

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
};

export default GetFcmToken;
