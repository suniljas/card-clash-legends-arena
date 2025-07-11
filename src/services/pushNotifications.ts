import { messaging } from '@/config/firebase';
import { getToken, onMessage } from 'firebase/messaging';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

class PushNotificationService {
  private token: string | null = null;
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
  }

  async initialize() {
    if (!this.isSupported || !messaging) {
      console.warn('Push notifications not supported or Firebase messaging not initialized');
      return false;
    }

    try {
      // Register service worker
      await this.registerServiceWorker();
      
      // Request permission
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return false;
      }

      // Get FCM token
      this.token = await this.getFCMToken();
      
      // Set up foreground message listener
      this.setupForegroundListener();

      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  private async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  private async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    return await Notification.requestPermission();
  }

  private async getFCMToken(): Promise<string | null> {
    try {
      const token = await getToken(messaging!, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
      
      if (token) {
        console.log('FCM Token received:', token);
        return token;
      } else {
        console.warn('No FCM token available');
        return null;
      }
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  }

  private setupForegroundListener() {
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      
      // Show notification if app is in foreground
      if (payload.notification) {
        this.showLocalNotification(
          payload.notification.title || 'Card Clash',
          payload.notification.body || 'You have a new notification',
          payload.data
        );
      }
    });
  }

  private showLocalNotification(title: string, body: string, data?: Record<string, string>) {
    if (!this.isSupported || Notification.permission !== 'granted') {
      return;
    }

    const notification = new Notification(title, {
      body,
      icon: '/app-icon.png',
      badge: '/app-icon.png',
      data,
      requireInteraction: false,
      silent: false
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      
      // Handle notification click based on data
      if (data?.action) {
        this.handleNotificationAction(data.action, data);
      }
    };

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);
  }

  private handleNotificationAction(action: string, data: Record<string, string>) {
    switch (action) {
      case 'open_shop':
        window.location.hash = '#shop';
        break;
      case 'open_arena':
        window.location.hash = '#arena';
        break;
      case 'open_rewards':
        window.location.hash = '#rewards';
        break;
      default:
        console.log('Unknown notification action:', action);
    }
  }

  // Public methods
  async subscribe(userId: string): Promise<boolean> {
    const initialized = await this.initialize();
    if (!initialized || !this.token) {
      return false;
    }

    try {
      // Send token to your backend to associate with user
      // await fetch('/api/notifications/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId,
      //     token: this.token,
      //     platform: 'web'
      //   })
      // });

      console.log('Push notification subscription successful for user:', userId);
      return true;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    }
  }

  async unsubscribe(userId: string): Promise<boolean> {
    if (!this.token) return false;

    try {
      // Remove token from your backend
      // await fetch('/api/notifications/unsubscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId,
      //     token: this.token
      //   })
      // });

      console.log('Push notification unsubscription successful for user:', userId);
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isInitialized(): boolean {
    return this.token !== null;
  }

  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }
}

export const pushNotificationService = new PushNotificationService();