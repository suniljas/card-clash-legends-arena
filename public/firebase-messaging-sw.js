// Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
  apiKey: "your-api-key", // This will be replaced with actual config
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification?.title || 'Card Clash';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/app-icon.png',
    badge: '/app-icon.png',
    data: payload.data || {},
    requireInteraction: false,
    actions: []
  };

  // Add action buttons based on notification type
  if (payload.data?.type === 'daily_reward') {
    notificationOptions.actions.push({
      action: 'claim',
      title: 'Claim Reward'
    });
  } else if (payload.data?.type === 'pvp_challenge') {
    notificationOptions.actions.push({
      action: 'accept',
      title: 'Accept Challenge'
    });
  }

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('Notification click received:', event);
  
  event.notification.close();
  
  // Handle different actions
  if (event.action === 'claim') {
    event.waitUntil(
      clients.openWindow('/?action=claim_reward')
    );
  } else if (event.action === 'accept') {
    event.waitUntil(
      clients.openWindow('/?action=accept_challenge')
    );
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});