import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatedButton, ParticleSystem } from './PremiumAnimations';
import { 
  Gift, 
  Trophy, 
  Coins, 
  Gem, 
  Star, 
  X, 
  Bell,
  Sparkles,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'reward' | 'achievement' | 'event' | 'milestone' | 'appreciation';
  title: string;
  description: string;
  rewards?: {
    coins?: number;
    gems?: number;
    cards?: number;
  };
  icon: React.ReactNode;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  claimed?: boolean;
  autoShow?: boolean;
}

interface EnhancedNotificationSystemProps {
  notifications: Notification[];
  onClaimReward: (notificationId: string) => void;
  onDismiss: (notificationId: string) => void;
}

export function EnhancedNotificationSystem({ 
  notifications, 
  onClaimReward, 
  onDismiss 
}: EnhancedNotificationSystemProps) {
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Auto-show high priority notifications
  useEffect(() => {
    const highPriorityNotifications = notifications.filter(
      n => (n.priority === 'high' || n.priority === 'critical') && n.autoShow && !n.claimed
    );

    if (highPriorityNotifications.length > 0 && !activeNotification) {
      setActiveNotification(highPriorityNotifications[0]);
    }
  }, [notifications, activeNotification]);

  // Update unread count
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.claimed).length);
  }, [notifications]);

  const getPriorityStyles = (priority: Notification['priority']) => {
    switch (priority) {
      case 'critical':
        return 'border-red-500 bg-gradient-to-r from-red-500/20 to-pink-500/20';
      case 'high':
        return 'border-accent bg-gradient-to-r from-accent/20 to-yellow-500/20';
      case 'medium':
        return 'border-primary bg-gradient-to-r from-primary/20 to-secondary/20';
      default:
        return 'border-muted bg-gradient-to-r from-muted/20 to-card/20';
    }
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'reward':
        return <Gift className="w-6 h-6 text-accent" />;
      case 'achievement':
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 'event':
        return <Sparkles className="w-6 h-6 text-purple-500" />;
      case 'milestone':
        return <Crown className="w-6 h-6 text-amber-500" />;
      case 'appreciation':
        return <Star className="w-6 h-6 text-pink-500" />;
      default:
        return <Bell className="w-6 h-6" />;
    }
  };

  // Notification Bell Component
  const NotificationBell = () => (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowNotificationCenter(!showNotificationCenter)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  );

  // Active Notification Modal
  const ActiveNotificationModal = ({ notification }: { notification: Notification }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={cn(
        'max-w-md w-full p-6 border-2 relative overflow-hidden',
        getPriorityStyles(notification.priority)
      )}>
        {/* Particle Effects for High Priority */}
        {notification.priority === 'critical' && (
          <ParticleSystem type="sparkles" intensity="high" className="opacity-60" />
        )}
        {notification.priority === 'high' && (
          <ParticleSystem type="magic" intensity="medium" className="opacity-40" />
        )}

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-background/20 backdrop-blur-sm">
                {notification.icon || getTypeIcon(notification.type)}
              </div>
              <div>
                <h3 className="font-bold text-lg">{notification.title}</h3>
                <Badge 
                  variant="outline" 
                  className={cn(
                    'capitalize text-xs',
                    notification.priority === 'critical' && 'border-red-500 text-red-500',
                    notification.priority === 'high' && 'border-accent text-accent'
                  )}
                >
                  {notification.type}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveNotification(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <p className="text-muted-foreground mb-4">{notification.description}</p>

          {/* Rewards */}
          {notification.rewards && (
            <div className="mb-6 p-4 bg-background/20 rounded-lg backdrop-blur-sm">
              <h4 className="font-semibold mb-2 text-accent">🎁 Rewards</h4>
              <div className="grid grid-cols-3 gap-2">
                {notification.rewards.coins && (
                  <div className="text-center">
                    <Coins className="w-5 h-5 text-accent mx-auto mb-1" />
                    <div className="text-sm font-bold">{notification.rewards.coins.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Coins</div>
                  </div>
                )}
                {notification.rewards.gems && (
                  <div className="text-center">
                    <Gem className="w-5 h-5 text-primary mx-auto mb-1" />
                    <div className="text-sm font-bold">{notification.rewards.gems}</div>
                    <div className="text-xs text-muted-foreground">Gems</div>
                  </div>
                )}
                {notification.rewards.cards && (
                  <div className="text-center">
                    <Star className="w-5 h-5 text-secondary mx-auto mb-1" />
                    <div className="text-sm font-bold">{notification.rewards.cards}</div>
                    <div className="text-xs text-muted-foreground">Cards</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <AnimatedButton
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => {
                onDismiss(notification.id);
                setActiveNotification(null);
              }}
            >
              Dismiss
            </AnimatedButton>
            {notification.rewards && (
              <AnimatedButton
                variant="premium"
                size="sm"
                className="flex-1"
                onClick={() => {
                  onClaimReward(notification.id);
                  setActiveNotification(null);
                }}
              >
                <Gift className="w-4 h-4 mr-2" />
                Claim
              </AnimatedButton>
            )}
          </div>
        </div>
      </Card>
    </div>
  );

  // Notification Center Panel
  const NotificationCenter = () => (
    <div className="fixed top-16 right-4 w-80 max-h-96 z-40">
      <Card className="p-4 bg-card/95 backdrop-blur-sm border-primary/20 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Notifications</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotificationCenter(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {notifications.slice(0, 10).map((notification) => (
            <div
              key={notification.id}
              className={cn(
                'p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-102',
                notification.claimed ? 'opacity-60' : 'hover:shadow-md',
                getPriorityStyles(notification.priority)
              )}
              onClick={() => {
                setActiveNotification(notification);
                setShowNotificationCenter(false);
              }}
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0">
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{notification.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notification.description}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {notification.timestamp.toLocaleDateString()}
                    </span>
                    {!notification.claimed && notification.rewards && (
                      <Badge variant="outline" className="text-xs">
                        Reward
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications</p>
          </div>
        )}
      </Card>
    </div>
  );

  return (
    <>
      {/* Notification Bell */}
      <NotificationBell />

      {/* Notification Center */}
      {showNotificationCenter && <NotificationCenter />}

      {/* Active Notification Modal */}
      {activeNotification && <ActiveNotificationModal notification={activeNotification} />}
    </>
  );
}

// Sample notifications for demonstration
export const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: 'daily-reward',
    type: 'reward',
    title: 'Daily Login Bonus!',
    description: 'Welcome back, Champion! Here\'s your daily reward for your dedication.',
    rewards: { coins: 500, gems: 10 },
    icon: <Gift className="w-6 h-6 text-accent" />,
    priority: 'high',
    timestamp: new Date(),
    autoShow: true
  },
  {
    id: 'milestone-100-cards',
    type: 'milestone',
    title: 'Collection Milestone!',
    description: 'Congratulations! You\'ve collected 100 unique heroes.',
    rewards: { gems: 50, cards: 3 },
    icon: <Crown className="w-6 h-6 text-amber-500" />,
    priority: 'high',
    timestamp: new Date(Date.now() - 3600000),
    autoShow: true
  },
  {
    id: 'appreciation-event',
    type: 'appreciation',
    title: 'Community Appreciation',
    description: 'Thank you for being an amazing part of our community! Enjoy these bonus rewards.',
    rewards: { coins: 1000, gems: 25 },
    icon: <Star className="w-6 h-6 text-pink-500" />,
    priority: 'critical',
    timestamp: new Date(Date.now() - 7200000),
    autoShow: true
  }
];