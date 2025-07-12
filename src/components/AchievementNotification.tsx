import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, X, Star } from 'lucide-react';
import { Achievement } from '@/types/achievements';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export function AchievementNotification({ achievement, onDismiss }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-orange-400 to-orange-600'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <Card className="w-80 bg-card/95 backdrop-blur-sm border-2 border-primary/50 shadow-2xl overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${rarityColors[achievement.rarity]}`} />
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary">Achievement Unlocked!</p>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  {achievement.title}
                  <span className="text-xl">{achievement.icon}</span>
                </h3>
              </div>
            </div>
            
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onDismiss, 300);
              }}
              className="p-1 rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground mb-3">
            {achievement.description}
          </p>

          <div className="flex items-center justify-between">
            <Badge className={`bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white`}>
              {achievement.rarity.toUpperCase()}
            </Badge>

            {achievement.reward && (
              <div className="flex gap-2 text-sm">
                {achievement.reward.coins && (
                  <div className="flex items-center gap-1 text-yellow-600">
                    🪙 +{achievement.reward.coins}
                  </div>
                )}
                {achievement.reward.gems && (
                  <div className="flex items-center gap-1 text-blue-600">
                    💎 +{achievement.reward.gems}
                  </div>
                )}
                {achievement.reward.cardPacks && (
                  <div className="flex items-center gap-1 text-purple-600">
                    📦 +{achievement.reward.cardPacks}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-4 left-4">
            <Star className="h-4 w-4 text-yellow-400 animate-pulse" />
          </div>
          <div className="absolute top-6 right-8">
            <Star className="h-3 w-3 text-yellow-400 animate-pulse animation-delay-200" />
          </div>
          <div className="absolute bottom-6 left-8">
            <Star className="h-2 w-2 text-yellow-400 animate-pulse animation-delay-500" />
          </div>
        </div>
      </Card>
    </div>
  );
}