import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Beaker, Clock, Trophy, Users, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExperimentalMode {
  id: string;
  name: string;
  description: string;
  rules: string[];
  duration: string;
  timeLeft: number; // in hours
  isActive: boolean;
  rewards: string[];
  participantCount: number;
  icon: string;
}

interface LegendsLabProps {
  onBack: () => void;
  onPlayMode: (modeId: string) => void;
}

export const LegendsLab: React.FC<LegendsLabProps> = ({ onBack, onPlayMode }) => {
  const [modes, setModes] = useState<ExperimentalMode[]>([
    {
      id: 'mana-storm',
      name: 'Mana Storm',
      description: 'All cards cost 1 less mana, but you take 1 damage when playing spells.',
      rules: [
        'All cards cost 1 less mana (minimum 0)',
        'Playing spells deals 1 damage to you',
        'Starting health: 25 (instead of 20)'
      ],
      duration: '5 days',
      timeLeft: 89,
      isActive: true,
      rewards: ['Unique Card Back: Storm Caller', 'XP Boost: +50%'],
      participantCount: 12847,
      icon: 'zap'
    },
    {
      id: 'giant-wars',
      name: 'Giant Wars',
      description: 'All units enter the battlefield with +2/+2 and Overwhelm.',
      rules: [
        'All units gain +2/+2 when played',
        'All units gain Overwhelm',
        'Maximum hand size: 12 (instead of 10)'
      ],
      duration: '3 days',
      timeLeft: 51,
      isActive: true,
      rewards: ['Avatar: Giant Slayer', 'Gems: 200'],
      participantCount: 8934,
      icon: 'users'
    },
    {
      id: 'spell-mastery',
      name: 'Spell Mastery',
      description: 'You can play any number of spells per turn, but units cost +1 mana.',
      rules: [
        'No limit on spells per turn',
        'All units cost +1 mana',
        'Start with 3 Spell Mana'
      ],
      duration: '7 days',
      timeLeft: 142,
      isActive: true,
      rewards: ['Emote: Spell Weaver', 'Card Upgrade Tokens: 3'],
      participantCount: 15623,
      icon: 'sparkles'
    }
  ]);

  const [upcomingModes] = useState<ExperimentalMode[]>([
    {
      id: 'speed-duel',
      name: 'Speed Duel',
      description: 'Each turn has a 30-second timer. Think fast!',
      rules: [
        'Turn timer: 30 seconds',
        'Starting mana: 3',
        'Draw 2 cards per turn'
      ],
      duration: '4 days',
      timeLeft: 0,
      isActive: false,
      rewards: ['Title: Speed Demon', 'XP Boost: +25%'],
      participantCount: 0,
      icon: 'clock'
    }
  ]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'zap': return <Zap className="w-8 h-8" />;
      case 'users': return <Users className="w-8 h-8" />;
      case 'sparkles': return <Sparkles className="w-8 h-8" />;
      case 'clock': return <Clock className="w-8 h-8" />;
      default: return <Beaker className="w-8 h-8" />;
    }
  };

  const formatTimeLeft = (hours: number) => {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (days > 0) {
      return `${days}d ${remainingHours}h`;
    }
    return `${remainingHours}h`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setModes(prev => prev.map(mode => ({
        ...mode,
        timeLeft: Math.max(0, mode.timeLeft - 1)
      })));
    }, 3600000); // Update every hour

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-3">
              <Beaker className="w-10 h-10 text-primary" />
              The Legends' Lab
            </h1>
            <p className="text-muted-foreground mt-2">
              Experimental game modes with unique rules and exclusive rewards
            </p>
          </div>
          <Button variant="outline" onClick={onBack}>
            Back to Main Menu
          </Button>
        </div>

        {/* Active Modes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Active Experiments
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {modes.filter(mode => mode.isActive).map((mode) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="p-6 h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {getIcon(mode.icon)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{mode.name}</h3>
                          <Badge variant="secondary" className="mt-1">
                            {formatTimeLeft(mode.timeLeft)} left
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm">
                      {mode.description}
                    </p>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Special Rules:</h4>
                      <ul className="space-y-1">
                        {mode.rules.map((rule, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Rewards:</h4>
                      <div className="space-y-1">
                        {mode.rewards.map((reward, index) => (
                          <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                            {reward}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-muted-foreground">Participants</span>
                        <span className="text-xs font-semibold">{mode.participantCount.toLocaleString()}</span>
                      </div>
                      <Progress value={Math.min(100, (mode.participantCount / 20000) * 100)} className="h-1" />
                    </div>

                    <Button 
                      onClick={() => onPlayMode(mode.id)}
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                      size="lg"
                    >
                      Enter Experiment
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Modes */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-muted-foreground" />
            Coming Soon
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {upcomingModes.map((mode) => (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 h-full border-2 border-dashed opacity-75">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                          {getIcon(mode.icon)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{mode.name}</h3>
                          <Badge variant="outline" className="mt-1">
                            Coming Soon
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm">
                      {mode.description}
                    </p>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Special Rules:</h4>
                      <ul className="space-y-1">
                        {mode.rules.map((rule, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Rewards:</h4>
                      <div className="space-y-1">
                        {mode.rewards.map((reward, index) => (
                          <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                            {reward}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      disabled
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      Not Available Yet
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12">
          <Card className="p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <h2 className="text-2xl font-bold mb-4 text-center">About The Legends' Lab</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold mb-2">Experimental Gameplay</h3>
                <p className="text-sm text-muted-foreground">
                  Experience unique rule sets that change the way you play. Each mode offers 
                  fresh strategic challenges and keeps the meta exciting.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Exclusive Rewards</h3>
                <p className="text-sm text-muted-foreground">
                  Earn cosmetics, titles, and bonuses that are only available through 
                  participating in experimental modes.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};