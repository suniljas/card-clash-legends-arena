import React from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Faction, FactionRoad, ProgressionSystem } from '../engine/ProgressionSystem';
import { Flame, Eye, Leaf, Sun, Zap, Gift, Star } from 'lucide-react';

interface FactionRoadProgressProps {
  progressionSystem: ProgressionSystem;
  onClaimReward: (faction: Faction, level: number) => void;
}

export const FactionRoadProgress: React.FC<FactionRoadProgressProps> = ({
  progressionSystem,
  onClaimReward
}) => {
  const factionIcons = {
    [Faction.FIRE]: Flame,
    [Faction.SHADOW]: Eye,
    [Faction.NATURE]: Leaf,
    [Faction.LIGHT]: Sun,
    [Faction.VOID]: Zap
  };

  const factionColors = {
    [Faction.FIRE]: 'from-red-500 to-orange-500',
    [Faction.SHADOW]: 'from-purple-500 to-indigo-500',
    [Faction.NATURE]: 'from-green-500 to-emerald-500',
    [Faction.LIGHT]: 'from-yellow-500 to-amber-500',
    [Faction.VOID]: 'from-violet-500 to-purple-500'
  };

  const renderFactionRoad = (faction: Faction) => {
    const road = progressionSystem.getFactionRoad(faction);
    if (!road) return null;

    const Icon = factionIcons[faction];
    const colorClass = factionColors[faction];

    return (
      <div className="space-y-4">
        {/* Faction Header */}
        <div className={`p-4 rounded-lg bg-gradient-to-r ${colorClass} text-white`}>
          <div className="flex items-center gap-3 mb-2">
            <Icon className="w-6 h-6" />
            <h3 className="text-xl font-bold capitalize">{faction} Road</h3>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <div className="text-2xl font-bold">Level {road.level}</div>
              <div className="text-sm opacity-80">
                {road.experience} / {road.experienceToNext} XP
              </div>
            </div>
            <div className="flex-1">
              <Progress 
                value={(road.experience / road.experienceToNext) * 100}
                className="h-3"
              />
            </div>
          </div>
        </div>

        {/* Rewards Track */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {road.rewards.slice(0, 12).map((reward) => (
            <Card 
              key={reward.level}
              className={`p-3 relative ${
                reward.level <= road.level 
                  ? reward.claimed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              {/* Level Badge */}
              <Badge 
                variant={reward.level <= road.level ? 'default' : 'secondary'}
                className="absolute -top-2 -right-2"
              >
                {reward.level}
              </Badge>

              <div className="text-center">
                {/* Reward Icon */}
                <div className="mb-2">
                  {reward.type === 'champion' && <Star className="w-8 h-8 mx-auto text-yellow-500" />}
                  {reward.type === 'capsule' && <Gift className="w-8 h-8 mx-auto text-purple-500" />}
                  {reward.type === 'card' && <div className="w-8 h-8 mx-auto bg-blue-500 rounded" />}
                  {reward.type === 'shards' && <Zap className="w-8 h-8 mx-auto text-green-500" />}
                </div>

                {/* Reward Details */}
                <div className="text-sm font-semibold mb-1">
                  {reward.type === 'champion' && 'Champion Card'}
                  {reward.type === 'capsule' && 'Rare Capsule'}
                  {reward.type === 'card' && 'Faction Card'}
                  {reward.type === 'shards' && `${reward.quantity} Shards`}
                </div>

                {/* Claim Button */}
                {reward.level <= road.level && !reward.claimed && (
                  <Button 
                    size="sm"
                    onClick={() => onClaimReward(faction, reward.level)}
                    className="w-full"
                  >
                    Claim
                  </Button>
                )}

                {reward.claimed && (
                  <Badge variant="outline" className="text-xs">
                    Claimed
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Faction Roads</h2>
        <p className="text-muted-foreground">
          Choose your path and unlock powerful cards and rewards. 
          Each faction offers unique playstyles and champions.
        </p>
      </div>

      <Tabs defaultValue={Faction.FIRE} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          {Object.values(Faction).map((faction) => {
            const Icon = factionIcons[faction];
            return (
              <TabsTrigger key={faction} value={faction} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span className="capitalize hidden sm:inline">{faction}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.values(Faction).map((faction) => (
          <TabsContent key={faction} value={faction}>
            {renderFactionRoad(faction)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};