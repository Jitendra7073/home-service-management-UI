importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyB1mPv85PzhOMXsp-JoAgrUF426XcR8r34",
  authDomain: "global-hsm.firebaseapp.com",
  projectId: "global-hsm",
  storageBucket: "global-hsm.firebasestorage.app",
  messagingSenderId: "906297527688",
  appId: "1:906297527688:web:9ac40d002c19e513babe3d",
  measurementId: "G-3MEKHX6VQ6"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {

  const title =
    payload.notification?.title ||
    payload.data?.title ||
    "New Notification";

  const options = {
    body:
      payload.notification?.body ||
      payload.data?.body ||
      "",
    icon: "/firebase-logo.png",
    data: payload.data || {},
  };

  self.registration.showNotification(title, options);
});
