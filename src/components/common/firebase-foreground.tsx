"use client";

import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";

export default function FirebaseForegroundListener() {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      unsubscribe = onMessage(messaging, (payload) => {

        const title =
          payload.notification?.title ||
          payload.data?.title ||
          "New Notification";

        const body =
          payload.notification?.body ||
          payload.data?.body ||
          "";

        if (Notification.permission === "granted") {
          new Notification(title, { body });
        }
      });
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return null;
}
