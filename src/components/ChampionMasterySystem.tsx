import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Crown, Star, Trophy, Target, Zap, Award, Lock, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChampionMastery {
  championId: string;
  level: number;
  experience: number;
  experienceToNext: number;
  gamesPlayed: number;
  victories: number;
  damageDealt: number;
  unitsKilled: number;
  specialAchievements: string[];
  unlockedCosmetics: string[];
  title?: string;
}

interface MasteryMilestone {
  level: number;
  title: string;
  requirement: string;
  rewards: {
    type: 'cosmetic' | 'title' | 'emote' | 'lore';
    id: string;
    name: string;
    description: string;
  }[];
}

interface ChampionMasterySystemProps {
  onBack: () => void;
  playerMasteries: ChampionMastery[];
  onEquipCosmetic: (championId: string, cosmeticId: string) => void;
}

const MASTERY_MILESTONES: MasteryMilestone[] = [
  {
    level: 1,
    title: 'Novice',
    requirement: 'Play 5 games with this champion',
    rewards: [
      {
        type: 'title',
        id: 'novice_title',
        name: 'Novice',
        description: 'A basic title showing your first steps with this champion'
      }
    ]
  },
  {
    level: 3,
    title: 'Apprentice',
    requirement: 'Win 10 games with this champion',
    rewards: [
      {
        type: 'cosmetic',
        id: 'silver_border',
        name: 'Silver Card Border',
        description: 'A refined silver border for your champion card'
      }
    ]
  },
  {
    level: 5,
    title: 'Adept',
    requirement: 'Deal 5000 damage with this champion',
    rewards: [
      {
        type: 'emote',
        id: 'champion_emote_1',
        name: 'Victory Pose',
        description: 'A unique emote showcasing your champion\'s personality'
      },
      {
        type: 'lore',
        id: 'champion_backstory',
        name: 'Champion Origins',
        description: 'Unlock the full backstory of your champion'
      }
    ]
  },
  {
    level: 7,
    title: 'Expert',
    requirement: 'Eliminate 50 enemy units with this champion',
    rewards: [
      {
        type: 'cosmetic',
        id: 'golden_border',
        name: 'Golden Card Border',
        description: 'A prestigious golden border showing your expertise'
      },
      {
        type: 'title',
        id: 'expert_title',
        name: 'Expert',
        description: 'A title that commands respect on the battlefield'
      }
    ]
  },
  {
    level: 10,
    title: 'Master',
    requirement: 'Achieve mastery through dedicated play',
    rewards: [
      {
        type: 'cosmetic',
        id: 'mastery_animation',
        name: 'Mastery Animation',
        description: 'Special play animation when this champion enters battle'
      },
      {
        type: 'emote',
        id: 'mastery_emote',
        name: 'Mastery Flex',
        description: 'Show off your mastery with this exclusive emote'
      },
      {
        type: 'title',
        id: 'master_title',
        name: 'Master',
        description: 'The ultimate title for true champions'
      }
    ]
  }
];

const CHAMPION_DATABASE = {
  'flame_mage_champion': {
    name: 'Flame Mage',
    faction: 'Mystic',
    rarity: 'Champion',
    description: 'Master of elemental fire magic'
  },
  'shadow_assassin_champion': {
    name: 'Shadow Assassin', 
    faction: 'Shadow',
    rarity: 'Champion',
    description: 'Silent death from the shadows'
  },
  'ancient_guardian_champion': {
    name: 'Ancient Guardian',
    faction: 'Nature',
    rarity: 'Legendary',
    description: 'Eternal protector of the forest'
  }
};

export const ChampionMasterySystem: React.FC<ChampionMasterySystemProps> = ({
  onBack,
  playerMasteries,
  onEquipCosmetic
}) => {
  const [selectedChampion, setSelectedChampion] = useState<string | null>(null);
  const [selectedMastery, setSelectedMastery] = useState<ChampionMastery | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [newRewards, setNewRewards] = useState<any[]>([]);

  // Calculate mastery progress
  const getMasteryProgress = (mastery: ChampionMastery) => {
    if (mastery.level >= 10) return 100;
    return (mastery.experience / mastery.experienceToNext) * 100;
  };

  // Get mastery color based on level
  const getMasteryColor = (level: number) => {
    if (level >= 10) return 'from-yellow-400 to-yellow-600';
    if (level >= 7) return 'from-purple-400 to-purple-600';
    if (level >= 5) return 'from-blue-400 to-blue-600';
    if (level >= 3) return 'from-green-400 to-green-600';
    return 'from-gray-400 to-gray-600';
  };

  // Get next milestone
  const getNextMilestone = (currentLevel: number) => {
    return MASTERY_MILESTONES.find(m => m.level > currentLevel);
  };

  const renderChampionCard = (mastery: ChampionMastery) => {
    const champion = CHAMPION_DATABASE[mastery.championId];
    if (!champion) return null;

    const progress = getMasteryProgress(mastery);
    const colorClass = getMasteryColor(mastery.level);
    const nextMilestone = getNextMilestone(mastery.level);

    return (
      <motion.div
        key={mastery.championId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setSelectedChampion(mastery.championId);
          setSelectedMastery(mastery);
        }}
      >
        <Card className="cursor-pointer transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-black/50 to-gray-900/50 border-purple-400">
          <CardContent className="p-6">
            {/* Champion Avatar */}
            <div className="relative mb-4">
              <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-2xl font-bold text-white`}>
                {champion.name.charAt(0)}
              </div>
              
              {/* Mastery Level Badge */}
              <div className="absolute -top-2 -right-2">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center border-2 border-white`}>
                  <span className="text-xs font-bold text-white">{mastery.level}</span>
                </div>
              </div>
              
              {/* Mastery Icon */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                {mastery.level >= 10 ? (
                  <Crown className="w-6 h-6 text-yellow-400" />
                ) : mastery.level >= 7 ? (
                  <Trophy className="w-6 h-6 text-purple-400" />
                ) : mastery.level >= 5 ? (
                  <Star className="w-6 h-6 text-blue-400" />
                ) : (
                  <Target className="w-6 h-6 text-green-400" />
                )}
              </div>
            </div>
            
            {/* Champion Info */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-white mb-1">{champion.name}</h3>
              <div className="flex justify-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {champion.faction}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {champion.rarity}
                </Badge>
              </div>
              <p className="text-sm text-gray-400">{champion.description}</p>
            </div>
            
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Progress</span>
                <span className="text-sm text-gray-300">{mastery.experience}/{mastery.experienceToNext}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-4">
              <div>Games: {mastery.gamesPlayed}</div>
              <div>Wins: {mastery.victories}</div>
              <div>Damage: {mastery.damageDealt.toLocaleString()}</div>
              <div>Kills: {mastery.unitsKilled}</div>
            </div>
            
            {/* Next Milestone */}
            {nextMilestone && (
              <div className="text-center">
                <p className="text-xs text-purple-300 mb-1">Next: {nextMilestone.title}</p>
                <p className="text-xs text-gray-500">{nextMilestone.requirement}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderDetailedView = () => {
    if (!selectedMastery || !selectedChampion) return null;
    
    const champion = CHAMPION_DATABASE[selectedChampion];
    const colorClass = getMasteryColor(selectedMastery.level);

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-xl font-bold text-white`}>
              {champion.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{champion.name}</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{champion.faction}</Badge>
                <Badge variant="secondary">{champion.rarity}</Badge>
                <Badge className={`bg-gradient-to-r ${colorClass}`}>
                  Level {selectedMastery.level}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={() => setSelectedChampion(null)}>
            ← Back
          </Button>
        </div>

        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="cosmetics">Cosmetics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress" className="space-y-4">
            {/* Current Progress */}
            <Card className="bg-black/50 border-purple-400">
              <CardHeader>
                <CardTitle className="text-purple-300">Current Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{selectedMastery.gamesPlayed}</div>
                    <div className="text-sm text-gray-400">Games Played</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{selectedMastery.victories}</div>
                    <div className="text-sm text-gray-400">Victories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{selectedMastery.damageDealt.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Damage Dealt</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{selectedMastery.unitsKilled}</div>
                    <div className="text-sm text-gray-400">Units Killed</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white">Experience</span>
                    <span className="text-gray-400">{selectedMastery.experience}/{selectedMastery.experienceToNext}</span>
                  </div>
                  <Progress value={getMasteryProgress(selectedMastery)} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="bg-black/50 border-purple-400">
              <CardHeader>
                <CardTitle className="text-purple-300">Mastery Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MASTERY_MILESTONES.map((milestone) => {
                    const isUnlocked = selectedMastery.level >= milestone.level;
                    const isCurrent = selectedMastery.level === milestone.level - 1;
                    
                    return (
                      <div
                        key={milestone.level}
                        className={`p-4 rounded-lg border transition-all ${
                          isUnlocked 
                            ? 'bg-green-900/20 border-green-400' 
                            : isCurrent
                            ? 'bg-yellow-900/20 border-yellow-400'
                            : 'bg-gray-900/20 border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {isUnlocked ? (
                              <Unlock className="w-5 h-5 text-green-400" />
                            ) : (
                              <Lock className="w-5 h-5 text-gray-500" />
                            )}
                            <h4 className={`font-bold ${isUnlocked ? 'text-green-300' : 'text-gray-400'}`}>
                              Level {milestone.level}: {milestone.title}
                            </h4>
                          </div>
                          {isUnlocked && <Award className="w-5 h-5 text-yellow-400" />}
                        </div>
                        
                        <p className={`text-sm mb-3 ${isUnlocked ? 'text-gray-300' : 'text-gray-500'}`}>
                          {milestone.requirement}
                        </p>
                        
                        <div className="space-y-2">
                          <h5 className="text-sm font-semibold text-purple-300">Rewards:</h5>
                          <div className="flex flex-wrap gap-2">
                            {milestone.rewards.map((reward) => (
                              <Badge
                                key={reward.id}
                                variant={isUnlocked ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {reward.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cosmetics" className="space-y-4">
            <Card className="bg-black/50 border-purple-400">
              <CardHeader>
                <CardTitle className="text-purple-300">Unlocked Cosmetics</CardTitle>
                <CardDescription>Customize your champion's appearance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedMastery.unlockedCosmetics.map((cosmeticId) => (
                    <div
                      key={cosmeticId}
                      className="p-4 border border-purple-400 rounded-lg bg-purple-900/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">Golden Border</h4>
                        <Button
                          size="sm"
                          onClick={() => onEquipCosmetic(selectedChampion, cosmeticId)}
                        >
                          Equip
                        </Button>
                      </div>
                      <p className="text-sm text-gray-400">A prestigious golden border for your champion card</p>
                    </div>
                  ))}
                  
                  {selectedMastery.unlockedCosmetics.length === 0 && (
                    <div className="col-span-2 text-center text-gray-500 py-8">
                      No cosmetics unlocked yet. Keep playing to earn rewards!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="achievements" className="space-y-4">
            <Card className="bg-black/50 border-purple-400">
              <CardHeader>
                <CardTitle className="text-purple-300">Special Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedMastery.specialAchievements.map((achievementId) => (
                    <div
                      key={achievementId}
                      className="flex items-center gap-3 p-3 bg-yellow-900/20 border border-yellow-400 rounded-lg"
                    >
                      <Trophy className="w-6 h-6 text-yellow-400" />
                      <div>
                        <h4 className="font-semibold text-white">Legendary Performance</h4>
                        <p className="text-sm text-gray-400">Won a game without taking any damage</p>
                      </div>
                    </div>
                  ))}
                  
                  {selectedMastery.specialAchievements.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No special achievements yet. Complete unique challenges to unlock them!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🏆 Champion Mastery</h1>
            <p className="text-purple-300">Master your champions and unlock exclusive rewards</p>
          </div>
          {!selectedChampion && (
            <Button 
              onClick={onBack}
              variant="outline"
              className="border-purple-400 text-purple-300 hover:bg-purple-900"
            >
              Back to Menu
            </Button>
          )}
        </div>

        {selectedChampion ? (
          renderDetailedView()
        ) : (
          /* Champion Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playerMasteries.map(mastery => renderChampionCard(mastery))}
          </div>
        )}
      </div>
    </div>
  );
};