import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  X, 
  Info, 
  Star, 
  Crown, 
  Gem, 
  Clock,
  Gift,
  Zap,
  CheckCircle,
  AlertCircle,
  Timer,
  Trophy
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'reward' | 'achievement' | 'event' | 'balance' | 'milestone' | 'appreciation' | 'system';
  title: string;
  message: string;
  icon?: React.ReactNode;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  duration?: number; // Auto-dismiss time in ms
  actions?: {
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
  }[];
  rewards?: {
    type: 'coins' | 'gems' | 'cards' | 'wildcards';
    amount: number;
    icon: string;
  }[];
  progress?: {
    current: number;
    max: number;
    label: string;
  };
  timestamp: Date;
  persistent?: boolean;
}

interface InGameNotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onAction: (notificationId: string, actionIndex: number) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  maxVisible?: number;
}

export const InGameNotificationSystem: React.FC<InGameNotificationSystemProps> = ({
  notifications,
  onDismiss,
  onAction,
  position = 'top-right',
  maxVisible = 5
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  // Auto-dismiss notifications
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration && !notification.persistent) {
        const timer = setTimeout(() => {
          onDismiss(notification.id);
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, onDismiss]);

  // Update visible notifications
  useEffect(() => {
    setVisibleNotifications(
      notifications
        .sort((a, b) => {
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        })
        .slice(0, maxVisible)
    );
  }, [notifications, maxVisible]);

  const getPositionClasses = () => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
    };
    return positions[position];
  };

  const getNotificationIcon = (notification: Notification) => {
    if (notification.icon) return notification.icon;

    const typeIcons = {
      reward: <Gift className="w-5 h-5 text-yellow-400" />,
      achievement: <Trophy className="w-5 h-5 text-purple-400" />,
      event: <Star className="w-5 h-5 text-blue-400" />,
      balance: <Zap className="w-5 h-5 text-green-400" />,
      milestone: <Crown className="w-5 h-5 text-amber-400" />,
      appreciation: <Gift className="w-5 h-5 text-pink-400" />,
      system: <Info className="w-5 h-5 text-gray-400" />
    };

    return typeIcons[notification.type];
  };

  const getPriorityStyles = (priority: Notification['priority']) => {
    const styles = {
      low: 'border-gray-400/30 bg-gray-900/90',
      medium: 'border-blue-400/30 bg-blue-900/90',
      high: 'border-yellow-400/30 bg-yellow-900/90',
      urgent: 'border-red-400/30 bg-red-900/90 animate-pulse'
    };
    return styles[priority];
  };

  const renderNotification = (notification: Notification) => (
    <motion.div
      key={notification.id}
      initial={{ opacity: 0, scale: 0.8, x: position.includes('right') ? 100 : -100 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: position.includes('right') ? 100 : -100 }}
      transition={{ duration: 0.3, type: "spring" }}
      layout
    >
      <Card className={`
        w-80 p-4 shadow-2xl backdrop-blur border-2 transition-all duration-300
        hover:scale-105 hover:shadow-3xl cursor-pointer
        ${getPriorityStyles(notification.priority)}
      `}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {getNotificationIcon(notification)}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white text-sm">{notification.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="outline" 
                  className={`text-xs capitalize ${
                    notification.priority === 'urgent' ? 'border-red-400 text-red-300' :
                    notification.priority === 'high' ? 'border-yellow-400 text-yellow-300' :
                    notification.priority === 'medium' ? 'border-blue-400 text-blue-300' :
                    'border-gray-400 text-gray-300'
                  }`}
                >
                  {notification.type}
                </Badge>
                <span className="text-xs text-gray-400">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDismiss(notification.id)}
            className="text-gray-400 hover:text-white h-auto p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-gray-300 text-sm leading-relaxed">{notification.message}</p>

          {/* Rewards Display */}
          {notification.rewards && notification.rewards.length > 0 && (
            <div className="mt-3 p-3 bg-black/30 rounded-lg border border-white/10">
              <h5 className="text-xs font-semibold text-yellow-300 mb-2">Rewards:</h5>
              <div className="flex flex-wrap gap-2">
                {notification.rewards.map((reward, index) => (
                  <div key={index} className="flex items-center gap-1 bg-yellow-900/30 px-2 py-1 rounded">
                    <span className="text-sm">{reward.icon}</span>
                    <span className="text-xs font-semibold text-yellow-300">
                      +{reward.amount} {reward.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Display */}
          {notification.progress && (
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">{notification.progress.label}</span>
                <span className="text-xs text-gray-300">
                  {notification.progress.current}/{notification.progress.max}
                </span>
              </div>
              <Progress 
                value={(notification.progress.current / notification.progress.max) * 100} 
                className="h-2"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        {notification.actions && notification.actions.length > 0 && (
          <div className="flex gap-2">
            {notification.actions.map((action, index) => (
              <Button
                key={index}
                size="sm"
                variant={action.variant === 'primary' ? 'default' : 'outline'}
                onClick={() => onAction(notification.id, index)}
                className="flex-1 text-xs"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}

        {/* Auto-dismiss indicator */}
        {notification.duration && !notification.persistent && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <Timer className="w-3 h-3" />
            <span>Auto-dismiss in {Math.ceil(notification.duration / 1000)}s</span>
          </div>
        )}
      </Card>
    </motion.div>
  );

  return (
    <div className={`fixed ${getPositionClasses()} z-50 pointer-events-none`}>
      <div className="space-y-3 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {visibleNotifications.map(renderNotification)}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Notification Builder Helper
export class NotificationBuilder {
  private notification: Partial<Notification> = {
    id: '',
    type: 'system',
    title: '',
    message: '',
    priority: 'medium',
    timestamp: new Date()
  };

  static create() {
    return new NotificationBuilder();
  }

  id(id: string) {
    this.notification.id = id;
    return this;
  }

  type(type: Notification['type']) {
    this.notification.type = type;
    return this;
  }

  title(title: string) {
    this.notification.title = title;
    return this;
  }

  message(message: string) {
    this.notification.message = message;
    return this;
  }

  priority(priority: Notification['priority']) {
    this.notification.priority = priority;
    return this;
  }

  icon(icon: React.ReactNode) {
    this.notification.icon = icon;
    return this;
  }

  duration(duration: number) {
    this.notification.duration = duration;
    return this;
  }

  persistent() {
    this.notification.persistent = true;
    return this;
  }

  addReward(type: 'coins' | 'gems' | 'cards' | 'wildcards', amount: number, icon: string) {
    if (!this.notification.rewards) this.notification.rewards = [];
    this.notification.rewards.push({ type, amount, icon });
    return this;
  }

  addProgress(current: number, max: number, label: string) {
    this.notification.progress = { current, max, label };
    return this;
  }

  addAction(label: string, action: () => void, variant?: 'primary' | 'secondary' | 'success' | 'danger') {
    if (!this.notification.actions) this.notification.actions = [];
    this.notification.actions.push({ label, action, variant });
    return this;
  }

  build(): Notification {
    if (!this.notification.id) {
      this.notification.id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    return this.notification as Notification;
  }
}

// Predefined notification templates
export const NotificationTemplates = {
  unexpectedReward: (coins: number, gems: number) =>
    NotificationBuilder.create()
      .type('appreciation')
      .title('🎁 Unexpected Reward!')
      .message('The realm appreciates your dedication! Here\'s a little something extra.')
      .priority('high')
      .duration(8000)
      .addReward('coins', coins, '🪙')
      .addReward('gems', gems, '💎')
      .addAction('Claim', () => {}, 'primary')
      .build(),

  championMastery: (championName: string, level: number) =>
    NotificationBuilder.create()
      .type('milestone')
      .title('🏆 Champion Mastery!')
      .message(`${championName} has reached Mastery Level ${level}! New rewards unlocked.`)
      .priority('high')
      .duration(10000)
      .addAction('View Rewards', () => {}, 'primary')
      .build(),

  balanceUpdate: (cardName: string, change: string) =>
    NotificationBuilder.create()
      .type('balance')
      .title('⚖️ Balance Update')
      .message(`${cardName} has been ${change}. Check the full patch notes for details.`)
      .priority('medium')
      .duration(12000)
      .addAction('View Notes', () => {}, 'secondary')
      .build(),

  communityEvent: (eventName: string, timeLeft: string) =>
    NotificationBuilder.create()
      .type('event')
      .title('🌟 Community Event')
      .message(`${eventName} is now live! Join before it ends in ${timeLeft}.`)
      .priority('high')
      .persistent()
      .addAction('Join Event', () => {}, 'primary')
      .addAction('Remind Later', () => {}, 'secondary')
      .build()
};