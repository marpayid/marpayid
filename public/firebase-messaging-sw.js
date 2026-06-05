
// Service Worker untuk Firebase Cloud Messaging
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBNScUKAFe0CaG186OBzT6oKA2sfWGNHSE",
  authDomain: "studio-6822083807-2f53e.firebaseapp.com",
  projectId: "studio-6822083807-2f53e",
  storageBucket: "studio-6822083807-2f53e.firebasestorage.app",
  messagingSenderId: "802769196698",
  appId: "1:802769196698:web:f20b821341d1ac0c577123"
});

const messaging = firebase.messaging();

// Menangani notifikasi saat aplikasi di background
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title || 'MarPay Marketplace';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/profil1.png',
    badge: '/profil1.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
