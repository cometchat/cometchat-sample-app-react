importScripts("https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.1.1/firebase-messaging.js");


const notificationBroadCast = new BroadcastChannel('notification_broadcaster');

self.addEventListener('notificationclick', function (event) {
    console.log('SW notification click event', event.notification);
    event.notification.close();
    const url = 'http://localhost:3000/embedded-app';
    event.waitUntil(
        clients.matchAll({ includeUncontrolled: true }).then( windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    notificationBroadCast.postMessage({key: JSON.stringify(event.notification.data)});
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
      })
    );
})

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAcG7iLRqMENDD11Dr68ufKP0Hllns4hcw",
    authDomain: "push-notification-testin-b511f.firebaseapp.com",
    projectId: "push-notification-testin-b511f",
    storageBucket: "push-notification-testin-b511f.appspot.com",
    messagingSenderId: "891111922927",
    appId: "1:891111922927:web:230c60ebc6fde976b68f1a",
    measurementId: "G-W72N7QMQEM"
};

firebase.initializeApp(FIREBASE_CONFIG);

firebase.messaging();

firebase.messaging().setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload?.data?.title;
    const notificationOptions = {
      body: payload?.data?.alert,
      data: payload?.data?.message
    };
  
    return self.registration.showNotification(notificationTitle, notificationOptions);
})