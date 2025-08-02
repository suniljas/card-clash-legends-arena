import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Sword, Trophy, Crown, Star, Lock, Play } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { BattleAI } from '@/services/battleAI';
import { HeroCard } from '@/types/game';

interface EnhancedPathOfLegendsProps {
  onBack: () => void;
  playerDeck: HeroCard[];
  userProfile: any;
  onStartBattle: (playerDeck: HeroCard[], enemyDeck: HeroCard[]) => void;
  onRewardClaimed: (reward: any) => void;
}

interface Adventure {
  id: string;
  name: string;
  description: string;
  totalStages: number;
  baseDifficulty: number;
  rewards: {
    stage: number;
    type: 'gems' | 'cards' | 'coins';
    amount: number;
    item?: string;
  }[];
}

interface UserProgress {
  adventure_id: string;
  current_stage: number;
  max_stage_reached: number;
  total_wins: number;
  total_losses: number;
}

const ADVENTURES: Adventure[] = [
  {
    id: 'mystic_forest',
    name: 'Mystic Forest',
    description: 'Journey through the enchanted forest and face its guardians',
    totalStages: 10,
    baseDifficulty: 1.0,
    rewards: [
      { stage: 3, type: 'gems', amount: 50 },
      { stage: 5, type: 'cards', amount: 1, item: 'rare' },
      { stage: 7, type: 'gems', amount: 100 },
      { stage: 10, type: 'cards', amount: 1, item: 'epic' }
    ]
  },
  {
    id: 'crystal_caverns',
    name: 'Crystal Caverns',
    description: 'Explore the dangerous crystal mines and defeat the crystalline beasts',
    totalStages: 15,
    baseDifficulty: 1.3,
    rewards: [
      { stage: 5, type: 'gems', amount: 75 },
      { stage: 8, type: 'cards', amount: 1, item: 'rare' },
      { stage: 12, type: 'gems', amount: 150 },
      { stage: 15, type: 'cards', amount: 1, item: 'legendary' }
    ]
  },
  {
    id: 'shadow_realm',
    name: 'Shadow Realm',
    description: 'Enter the dark dimension and challenge the shadow lords',
    totalStages: 20,
    baseDifficulty: 1.8,
    rewards: [
      { stage: 5, type: 'gems', amount: 100 },
      { stage: 10, type: 'cards', amount: 2, item: 'epic' },
      { stage: 15, type: 'gems', amount: 200 },
      { stage: 20, type: 'cards', amount: 1, item: 'ultra-legendary' }
    ]
  }
];

export const EnhancedPathOfLegends: React.FC<EnhancedPathOfLegendsProps> = ({
  onBack,
  playerDeck,
  userProfile,
  onStartBattle,
  onRewardClaimed
}) => {
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(false);
  const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(null);

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('path_of_legends_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const progressMap: Record<string, UserProgress> = {};
      data?.forEach(progress => {
        progressMap[progress.adventure_id] = progress;
      });
      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const generateEnemyDeck = (adventure: Adventure, stage: number): HeroCard[] => {
    const difficultyMultiplier = adventure.baseDifficulty + (stage * 0.2);
    const baseStats = {
      attack: Math.floor(80 * difficultyMultiplier),
      hp: Math.floor(120 * difficultyMultiplier)
    };

    const enemyCards: HeroCard[] = [];
    const cardCount = Math.min(3 + Math.floor(stage / 3), 6); // Increase deck size with stage

    for (let i = 0; i < cardCount; i++) {
      const levelBonus = Math.floor(stage / 2);
      enemyCards.push({
        id: `enemy_${stage}_${i}`,
        name: `Shadow Warrior ${i + 1}`,
        rarity: (stage > 8 ? 'legendary' : stage > 5 ? 'epic' : 'rare') as any,
        edition: 'normal' as any,
        baseAttack: baseStats.attack + (levelBonus * 10),
        baseHP: baseStats.hp + (levelBonus * 15),
        level: 1 + levelBonus,
        experience: 0,
        experienceToNext: 100,
        unlocked: true
      });
    }

    return enemyCards;
  };

  const startStage = async (adventure: Adventure, stage: number) => {
    if (!userProfile || playerDeck.length === 0) {
      toast.error('Please select a deck first');
      return;
    }

    try {
      setLoading(true);
      
      // Generate intelligent enemy deck based on stage difficulty
      const enemyDeck = generateEnemyDeck(adventure, stage);
      
      // Start the battle
      onStartBattle(playerDeck, enemyDeck);
      
      toast.success(`Starting Stage ${stage} of ${adventure.name}!`);
    } catch (error) {
      console.error('Error starting stage:', error);
      toast.error('Failed to start battle');
    } finally {
      setLoading(false);
    }
  };

  const handleStageComplete = async (adventure: Adventure, stage: number, won: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const currentProgress = userProgress[adventure.id];
      const newProgress = {
        user_id: user.id,
        adventure_id: adventure.id,
        current_stage: won ? stage + 1 : stage,
        max_stage_reached: Math.max(currentProgress?.max_stage_reached || 0, won ? stage : stage - 1),
        total_wins: (currentProgress?.total_wins || 0) + (won ? 1 : 0),
        total_losses: (currentProgress?.total_losses || 0) + (won ? 0 : 1),
        last_battle_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('path_of_legends_progress')
        .upsert(newProgress, { onConflict: 'user_id,adventure_id' });

      if (error) throw error;

      // Check for stage rewards
      if (won) {
        const stageReward = adventure.rewards.find(r => r.stage === stage);
        if (stageReward) {
          onRewardClaimed(stageReward);
          toast.success(`Stage ${stage} completed! Reward: ${stageReward.amount} ${stageReward.type}`);
        }
      }

      await loadUserProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getStageStatus = (adventure: Adventure, stage: number) => {
    const progress = userProgress[adventure.id];
    if (!progress) return 'locked';
    
    if (stage <= progress.max_stage_reached) return 'completed';
    if (stage === progress.max_stage_reached + 1) return 'available';
    return 'locked';
  };

  const getProgressPercentage = (adventure: Adventure) => {
    const progress = userProgress[adventure.id];
    if (!progress) return 0;
    return (progress.max_stage_reached / adventure.totalStages) * 100;
  };

  if (selectedAdventure) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedAdventure(null)}
              className="text-white hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Adventures
            </Button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">{selectedAdventure.name}</h1>
              <p className="text-slate-400">{selectedAdventure.description}</p>
            </div>
            <div className="w-20" />
          </div>

          {/* Progress Overview */}
          <Card className="mb-6 bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Progress</p>
                  <Progress 
                    value={getProgressPercentage(selectedAdventure)} 
                    className="mt-2"
                  />
                  <p className="text-white text-sm mt-1">
                    {userProgress[selectedAdventure.id]?.max_stage_reached || 0} / {selectedAdventure.totalStages}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Wins</p>
                  <p className="text-white text-xl font-bold">
                    {userProgress[selectedAdventure.id]?.total_wins || 0}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Win Rate</p>
                  <p className="text-white text-xl font-bold">
                    {userProgress[selectedAdventure.id] ? 
                      Math.round((userProgress[selectedAdventure.id].total_wins / 
                        (userProgress[selectedAdventure.id].total_wins + userProgress[selectedAdventure.id].total_losses)) * 100) || 0
                      : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stages Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from({ length: selectedAdventure.totalStages }, (_, i) => {
              const stage = i + 1;
              const status = getStageStatus(selectedAdventure, stage);
              const reward = selectedAdventure.rewards.find(r => r.stage === stage);

              return (
                <Card 
                  key={stage}
                  className={`relative bg-slate-800/50 border-slate-700 ${
                    status === 'available' ? 'ring-2 ring-blue-400' : ''
                  }`}
                >
                  <CardContent className="p-4 text-center">
                    <div className="mb-3">
                      {status === 'completed' && (
                        <Trophy className="w-8 h-8 mx-auto text-yellow-400" />
                      )}
                      {status === 'available' && (
                        <Play className="w-8 h-8 mx-auto text-blue-400" />
                      )}
                      {status === 'locked' && (
                        <Lock className="w-8 h-8 mx-auto text-slate-500" />
                      )}
                    </div>
                    
                    <h3 className="text-white font-semibold mb-2">Stage {stage}</h3>
                    
                    {reward && (
                      <Badge variant="outline" className="text-xs mb-2 border-yellow-400 text-yellow-400">
                        Reward!
                      </Badge>
                    )}

                    <Button
                      size="sm"
                      variant={status === 'available' ? 'default' : 'secondary'}
                      disabled={status !== 'available' || loading}
                      onClick={() => startStage(selectedAdventure, stage)}
                      className={`w-full ${
                        status === 'available' 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-slate-600'
                      }`}
                    >
                      {status === 'completed' ? 'Replay' : 
                       status === 'available' ? 'Start' : 'Locked'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-slate-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">⚔️ Path of Legends</h1>
            <p className="text-slate-400">Challenge the greatest warriors across realms</p>
          </div>
          <div className="w-20" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {ADVENTURES.map((adventure) => {
            const progress = userProgress[adventure.id];
            const progressPercent = getProgressPercentage(adventure);

            return (
              <Card 
                key={adventure.id} 
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer"
                onClick={() => setSelectedAdventure(adventure)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{adventure.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      {[...Array(Math.floor(adventure.baseDifficulty))].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm mb-4">{adventure.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-white">
                          {progress?.max_stage_reached || 0} / {adventure.totalStages}
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-slate-400">Wins: </span>
                        <span className="text-white">{progress?.total_wins || 0}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Stages: </span>
                        <span className="text-white">{adventure.totalStages}</span>
                      </div>
                    </div>

                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Sword className="w-4 h-4 mr-2" />
                      Enter Adventure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};