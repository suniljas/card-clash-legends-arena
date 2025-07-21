import React from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { DailyQuest, ProgressionSystem, Faction } from '../engine/ProgressionSystem';
import { Target, Trophy, Flame, Eye, Leaf, CheckCircle } from 'lucide-react';

interface DailyQuestsPanelProps {
  progressionSystem: ProgressionSystem;
  onClaimQuest: (questId: string) => void;
}

export const DailyQuestsPanel: React.FC<DailyQuestsPanelProps> = ({
  progressionSystem,
  onClaimQuest
}) => {
  const quests = progressionSystem.getDailyQuests();
  
  const factionIcons = {
    [Faction.FIRE]: Flame,
    [Faction.SHADOW]: Eye,
    [Faction.NATURE]: Leaf,
  };

  const getQuestIcon = (quest: DailyQuest) => {
    if (quest.faction && factionIcons[quest.faction]) {
      const Icon = factionIcons[quest.faction];
      return <Icon className="w-5 h-5" />;
    }
    return <Target className="w-5 h-5" />;
  };

  const timeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Daily Quests</h2>
          <p className="text-muted-foreground">
            Complete quests to earn vault XP and progress toward weekly rewards
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Resets in</div>
          <div className="font-semibold">{timeUntilReset()}</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quests.map((quest) => (
          <Card 
            key={quest.id}
            className={`p-4 relative ${
              quest.completed 
                ? 'bg-green-50 border-green-200' 
                : 'hover:shadow-md transition-shadow'
            }`}
          >
            {/* Quest Status */}
            {quest.completed && (
              <div className="absolute top-2 right-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            )}

            <div className="flex items-start gap-3 mb-3">
              <div className={`p-2 rounded-full ${
                quest.faction 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {getQuestIcon(quest)}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{quest.description}</h3>
                
                {quest.faction && (
                  <Badge variant="outline" className="mb-2">
                    {quest.faction} faction
                  </Badge>
                )}
                
                <div className="text-sm text-muted-foreground mb-2">
                  Progress: {quest.progress} / {quest.target}
                </div>
                
                <Progress 
                  value={(quest.progress / quest.target) * 100}
                  className="h-2 mb-3"
                />
              </div>
            </div>

            {/* Reward */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-semibold">{quest.reward} XP</span>
              </div>
              
              {quest.completed && (
                <Button 
                  size="sm"
                  onClick={() => onClaimQuest(quest.id)}
                >
                  Claim
                </Button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{Math.round((quest.progress / quest.target) * 100)}% Complete</span>
                <span>{quest.target - quest.progress} remaining</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quest Tips */}
      <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Quest Tips
        </h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Win games in any mode to progress "Win" quests</p>
          <p>• Play cards of specific factions to complete faction quests</p>
          <p>• Level up champions by meeting their conditions during battles</p>
          <p>• New quests are available every day at midnight</p>
        </div>
      </Card>
    </div>
  );
};