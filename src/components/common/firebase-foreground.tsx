"use client";

import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { toast } from "sonner";
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

        // Show an in-app alert-style toast for active users.
        // This works even if browser notification permission is denied.
        if (typeof document !== "undefined" && document.visibilityState === "visible") {
          toast(title, {
            description: body,
            action: payload.data?.click_action
              ? {
                label: "Open",
                onClick: () => {
                  window.open(payload.data?.click_action, "_blank");
                },
              }
              : undefined,
          });
        }

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
