import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { pushNotificationService } from '@/services/pushNotifications';
import { useTranslation } from 'react-i18next';

export function useNotifications() {
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    // Initialize push notifications when component mounts
    const initializeNotifications = async () => {
      try {
        const initialized = await pushNotificationService.initialize();
        if (initialized) {
          console.log('Push notifications initialized successfully');
        }
      } catch (error) {
        console.warn('Failed to initialize push notifications:', error);
      }
    };

    initializeNotifications();
  }, []);

  const scheduleLocalNotification = (title: string, body: string, delay: number = 0) => {
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/app-icon.png',
          badge: '/app-icon.png'
        });
      } else {
        // Fallback to toast notification
        toast({
          title,
          description: body
        });
      }
    }, delay);
  };

  const showDailyRewardNotification = () => {
    scheduleLocalNotification(
      t('game.title'),
      t('notifications.daily_reward'),
      0
    );
  };

  const showAchievementNotification = (achievementName: string) => {
    scheduleLocalNotification(
      t('notifications.achievement_unlocked'),
      achievementName,
      0
    );
  };

  const showEventNotification = (eventName: string) => {
    scheduleLocalNotification(
      t('game.title'),
      `${t('notifications.event_started')}: ${eventName}`,
      0
    );
  };

  return {
    scheduleLocalNotification,
    showDailyRewardNotification,
    showAchievementNotification,
    showEventNotification,
    isInitialized: pushNotificationService.isInitialized(),
    getPermissionStatus: pushNotificationService.getPermissionStatus()
  };
}