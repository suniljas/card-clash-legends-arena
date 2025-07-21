import { analytics } from '@/config/firebase';
import { logEvent, setUserProperties, setUserId } from 'firebase/analytics';

export interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, any>;
}

export interface UserProperties {
  [key: string]: string | number | boolean | undefined;
  level?: number;
  vip_status?: boolean;
  total_cards?: number;
  preferred_language?: string;
}

class AnalyticsService {
  // Track user events
  track(eventName: string, parameters?: Record<string, any>) {
    try {
      if (analytics) {
        logEvent(analytics, eventName, parameters);
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }

  // Set user properties
  setUserProperties(properties: UserProperties) {
    try {
      if (analytics) {
        setUserProperties(analytics, properties);
      }
    } catch (error) {
      console.warn('Setting user properties failed:', error);
    }
  }

  // Set user ID for tracking
  setUserId(userId: string) {
    try {
      if (analytics && typeof analytics === 'object') {
        setUserId(analytics, userId);
      }
    } catch (error) {
      console.warn('Setting user ID failed:', error);
    }
  }

  // Game-specific tracking methods
  trackCardPurchase(cardType: string, cost: number, currency: string) {
    this.track('card_purchase', {
      card_type: cardType,
      cost,
      currency,
      timestamp: Date.now()
    });
  }

  trackBattleComplete(result: 'win' | 'lose', duration: number, opponentType: string) {
    this.track('battle_complete', {
      result,
      duration,
      opponent_type: opponentType,
      timestamp: Date.now()
    });
  }

  trackLevelUp(newLevel: number, experience: number) {
    this.track('level_up', {
      level: newLevel,
      experience,
      timestamp: Date.now()
    });
  }

  trackAchievementUnlocked(achievementId: string, achievementName: string) {
    this.track('achievement_unlock', {
      achievement_id: achievementId,
      achievement_name: achievementName,
      timestamp: Date.now()
    });
  }

  trackTutorialStep(stepNumber: number, stepName: string) {
    this.track('tutorial_step', {
      step_number: stepNumber,
      step_name: stepName,
      timestamp: Date.now()
    });
  }

  trackIAPPurchase(productId: string, price: number, currency: string) {
    this.track('purchase', {
      product_id: productId,
      price,
      currency,
      timestamp: Date.now()
    });
  }

  trackRetention(sessionCount: number, daysSinceFirstPlay: number) {
    this.track('user_retention', {
      session_count: sessionCount,
      days_since_first_play: daysSinceFirstPlay,
      timestamp: Date.now()
    });
  }
}

export const analyticsService = new AnalyticsService();