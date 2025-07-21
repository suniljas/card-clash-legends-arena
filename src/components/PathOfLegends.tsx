import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sword, Shield, Star, Zap, Map, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

interface PathNode {
  id: string;
  type: 'combat' | 'elite' | 'boss' | 'treasure' | 'heal';
  completed: boolean;
  available: boolean;
  rewards: string[];
}

interface ChampionProgress {
  id: string;
  name: string;
  level: number;
  experience: number;
  relics: string[];
  powers: string[];
}

interface PathOfLegendsProps {
  onBack: () => void;
}

export const PathOfLegends: React.FC<PathOfLegendsProps> = ({ onBack }) => {
  const [selectedChampion, setSelectedChampion] = useState<ChampionProgress | null>(null);
  const [currentPath, setCurrentPath] = useState<PathNode[]>([]);
  const [inRun, setInRun] = useState(false);

  const champions: ChampionProgress[] = [
    {
      id: 'flame-mage',
      name: 'Flame Mage',
      level: 3,
      experience: 1250,
      relics: ['Infernal Codex', 'Ember Crown'],
      powers: ['Spell Power +1', 'Burn Mastery']
    },
    {
      id: 'shadow-assassin',
      name: 'Shadow Assassin',
      level: 1,
      experience: 200,
      relics: ['Shadow Cloak'],
      powers: ['Stealth Strike']
    },
    {
      id: 'tree-guardian',
      name: 'Tree Guardian',
      level: 5,
      experience: 2800,
      relics: ['Ancient Bark', 'Growth Catalyst', 'Nature\'s Blessing'],
      powers: ['Regeneration', 'Forest Bond', 'Guardian\'s Might']
    }
  ];

  const generatePath = () => {
    const nodes: PathNode[] = [];
    for (let i = 0; i < 15; i++) {
      let type: PathNode['type'] = 'combat';
      
      if (i % 5 === 4) type = 'boss';
      else if (i % 3 === 2) type = 'elite';
      else if (Math.random() < 0.2) type = 'treasure';
      else if (Math.random() < 0.1) type = 'heal';

      nodes.push({
        id: `node-${i}`,
        type,
        completed: false,
        available: i === 0,
        rewards: getNodeRewards(type)
      });
    }
    return nodes;
  };

  const getNodeRewards = (type: PathNode['type']): string[] => {
    switch (type) {
      case 'boss':
        return ['Champion XP +100', 'Rare Relic', 'Card Upgrade'];
      case 'elite':
        return ['Champion XP +50', 'Uncommon Relic', 'Card Choice'];
      case 'treasure':
        return ['Common Relic', 'Card Upgrade'];
      case 'heal':
        return ['Heal 50 HP', 'Remove Card'];
      default:
        return ['Champion XP +25', 'Card Choice'];
    }
  };

  const getNodeIcon = (type: PathNode['type']) => {
    switch (type) {
      case 'boss': return <Star className="w-6 h-6 text-legendary" />;
      case 'elite': return <Sword className="w-6 h-6 text-epic" />;
      case 'treasure': return <Gift className="w-6 h-6 text-rare" />;
      case 'heal': return <Shield className="w-6 h-6 text-common" />;
      default: return <Zap className="w-6 h-6 text-uncommon" />;
    }
  };

  const startRun = (champion: ChampionProgress) => {
    setSelectedChampion(champion);
    setCurrentPath(generatePath());
    setInRun(true);
  };

  const handleNodeClick = (node: PathNode) => {
    if (!node.available || node.completed) return;
    
    // Simulate battle/encounter
    setTimeout(() => {
      setCurrentPath(prev => 
        prev.map((n, index) => {
          if (n.id === node.id) {
            return { ...n, completed: true };
          }
          if (index === prev.findIndex(p => p.id === node.id) + 1) {
            return { ...n, available: true };
          }
          return n;
        })
      );
    }, 1000);
  };

  if (!inRun) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                The Path of Legends
              </h1>
              <p className="text-muted-foreground mt-2">
                Choose your champion and embark on a legendary journey
              </p>
            </div>
            <Button variant="outline" onClick={onBack}>
              <Map className="w-4 h-4 mr-2" />
              Back to Main Menu
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {champions.map((champion) => (
              <motion.div
                key={champion.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">{champion.name}</h3>
                      <Badge variant="secondary">Level {champion.level}</Badge>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Experience</span>
                        <span>{champion.experience}/1000</span>
                      </div>
                      <Progress value={(champion.experience % 1000) / 10} className="h-2" />
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Relics ({champion.relics.length})</h4>
                      <div className="space-y-1">
                        {champion.relics.slice(0, 3).map((relic, index) => (
                          <Badge key={index} variant="outline" className="text-xs mr-1">
                            {relic}
                          </Badge>
                        ))}
                        {champion.relics.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{champion.relics.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Powers ({champion.powers.length})</h4>
                      <div className="space-y-1">
                        {champion.powers.slice(0, 2).map((power, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            • {power}
                          </div>
                        ))}
                        {champion.powers.length > 2 && (
                          <div className="text-sm text-muted-foreground">
                            • +{champion.powers.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>

                    <Button 
                      onClick={() => startRun(champion)}
                      className="w-full"
                      size="lg"
                    >
                      Begin Adventure
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <h2 className="text-2xl font-bold mb-4">About Path of Legends</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div>
                  <h3 className="font-semibold mb-2">Roguelike Adventures</h3>
                  <p className="text-sm text-muted-foreground">
                    Every run is unique with randomized encounters, powers, and rewards.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Persistent Progression</h3>
                  <p className="text-sm text-muted-foreground">
                    Champions gain permanent levels and unlock powerful relics between runs.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Strategic Depth</h3>
                  <p className="text-sm text-muted-foreground">
                    Draft new cards and powers to create synergistic combinations.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">{selectedChampion?.name}'s Journey</h1>
            <p className="text-muted-foreground">Level {selectedChampion?.level} Champion</p>
          </div>
          <Button variant="outline" onClick={() => setInRun(false)}>
            Abandon Run
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {currentPath.map((node, index) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`p-4 text-center cursor-pointer transition-all duration-300 ${
                  node.completed 
                    ? 'bg-green-500/20 border-green-500' 
                    : node.available 
                      ? 'hover:shadow-lg border-primary/50 hover:border-primary' 
                      : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => handleNodeClick(node)}
              >
                <div className="space-y-3">
                  <div className="flex justify-center">
                    {getNodeIcon(node.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold capitalize">{node.type}</h3>
                    <div className="text-xs text-muted-foreground mt-2">
                      {node.rewards.map((reward, i) => (
                        <div key={i}>• {reward}</div>
                      ))}
                    </div>
                  </div>
                  {node.completed && (
                    <Badge variant="secondary" className="text-xs">
                      Completed
                    </Badge>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};