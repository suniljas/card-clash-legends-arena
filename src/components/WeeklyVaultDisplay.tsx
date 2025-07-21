import React from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { WeeklyVault, ProgressionSystem } from '../engine/ProgressionSystem';
import { Gift, Star, Gem, Package } from 'lucide-react';

interface WeeklyVaultDisplayProps {
  progressionSystem: ProgressionSystem;
  onOpenVault: () => void;
}

export const WeeklyVaultDisplay: React.FC<WeeklyVaultDisplayProps> = ({
  progressionSystem,
  onOpenVault
}) => {
  const vault = progressionSystem.getWeeklyVault();

  const getChestIcon = (type: string) => {
    switch (type) {
      case 'champion': return <Star className="w-6 h-6 text-yellow-500" />;
      case 'epic': return <Gem className="w-6 h-6 text-purple-500" />;
      case 'rare': return <Gift className="w-6 h-6 text-blue-500" />;
      default: return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getChestColor = (type: string) => {
    switch (type) {
      case 'champion': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-indigo-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const daysUntilReset = 7 - new Date().getDay(); // Days until next Tuesday

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Weekly Vault</h2>
        <p className="text-muted-foreground">
          Earn XP through quests and gameplay to level up your vault. 
          Opens every Tuesday with guaranteed rewards!
        </p>
      </div>

      {/* Vault Progress */}
      <Card className="p-6 mb-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold mb-1">Vault Level {vault.level}</h3>
            <p className="text-sm text-muted-foreground">
              {vault.experience} / {vault.experienceToNext} XP to next level
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Resets in</div>
            <div className="text-lg font-bold">{daysUntilReset} days</div>
          </div>
        </div>
        
        <Progress 
          value={(vault.experience / vault.experienceToNext) * 100}
          className="h-4 mb-4"
        />

        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="font-semibold">{vault.chests.length}</span> chests earned
          </div>
          <Button onClick={onOpenVault} disabled={vault.chests.length === 0}>
            Open Vault
          </Button>
        </div>
      </Card>

      {/* Current Chests */}
      {vault.chests.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Current Chests</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {vault.chests.map((chest, index) => (
              <Card 
                key={index}
                className={`p-4 text-center bg-gradient-to-b ${getChestColor(chest.type)} text-white relative overflow-hidden`}
              >
                {chest.guaranteed && (
                  <Badge className="absolute top-1 right-1 text-xs">
                    Guaranteed
                  </Badge>
                )}
                
                <div className="mb-2">
                  {getChestIcon(chest.type)}
                </div>
                
                <div className="text-xs font-semibold capitalize">
                  {chest.type} Chest
                </div>
                
                {/* Sparkle effect for higher tier chests */}
                {(chest.type === 'epic' || chest.type === 'champion') && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Bonus Chests */}
      {vault.bonusChests.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Bonus Chests</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {vault.bonusChests.map((chest, index) => (
              <Card 
                key={index}
                className={`p-4 text-center bg-gradient-to-b ${getChestColor(chest.type)} text-white border-2 border-gold-400`}
              >
                <div className="mb-2">
                  {getChestIcon(chest.type)}
                </div>
                <div className="text-xs font-semibold capitalize">
                  Bonus {chest.type}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Vault Milestones */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-3">Upcoming Milestones</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 rounded bg-muted/50">
            <span className="text-sm">Level {vault.level + 1}</span>
            <div className="flex items-center gap-2">
              {getChestIcon('common')}
              <span className="text-sm">Common Chest</span>
            </div>
          </div>
          
          {(vault.level + 2) % 3 === 0 && (
            <div className="flex justify-between items-center p-2 rounded bg-muted/50">
              <span className="text-sm">Level {vault.level + 2}</span>
              <div className="flex items-center gap-2">
                {getChestIcon('rare')}
                <span className="text-sm">Rare Chest</span>
              </div>
            </div>
          )}
          
          {(vault.level + 5) % 5 === 0 && (
            <div className="flex justify-between items-center p-2 rounded bg-muted/50">
              <span className="text-sm">Level {vault.level + 5}</span>
              <div className="flex items-center gap-2">
                {getChestIcon('epic')}
                <span className="text-sm">Epic Chest</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};