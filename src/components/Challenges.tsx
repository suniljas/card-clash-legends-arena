import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Lock, CheckCircle, Play, BookOpen, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'basic' | 'keyword' | 'advanced';
  difficulty: 1 | 2 | 3 | 4 | 5;
  completed: boolean;
  locked: boolean;
  rewards: string[];
  objective: string;
  tips: string[];
}

interface ChallengesProps {
  onBack: () => void;
  onStartChallenge: (challengeId: string) => void;
}

export const Challenges: React.FC<ChallengesProps> = ({ onBack, onStartChallenge }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'basic' | 'keyword' | 'advanced'>('all');

  const challenges: Challenge[] = [
    // Basic Challenges
    {
      id: 'attacking-blocking',
      title: 'Combat Basics',
      description: 'Learn the fundamentals of attacking and blocking in Card Clash.',
      category: 'basic',
      difficulty: 1,
      completed: true,
      locked: false,
      rewards: ['XP: 50', 'Common Card Pack'],
      objective: 'Win by attacking with your units while defending effectively.',
      tips: [
        'Attacking units deal damage to the defender',
        'Blocking prevents damage but may destroy your unit',
        'Unblocked attackers hit the enemy directly'
      ]
    },
    {
      id: 'playing-spells',
      title: 'Spell Casting',
      description: 'Master the art of casting spells at the right moment.',
      category: 'basic',
      difficulty: 1,
      completed: true,
      locked: false,
      rewards: ['XP: 50', 'Spell Mana Boost'],
      objective: 'Use spells to gain advantage and win the match.',
      tips: [
        'Spells can be played during your turn or as reactions',
        'Some spells require specific targets',
        'Timing is crucial for maximum impact'
      ]
    },
    {
      id: 'mana-management',
      title: 'Resource Management',
      description: 'Learn to efficiently manage your mana and spell mana.',
      category: 'basic',
      difficulty: 2,
      completed: false,
      locked: false,
      rewards: ['XP: 75', 'Mana Crystal Cosmetic'],
      objective: 'Win while efficiently using all available mana each turn.',
      tips: [
        'Unspent mana converts to spell mana (max 3)',
        'Plan your turns to avoid wasting resources',
        'Sometimes saving mana for reactions is optimal'
      ]
    },

    // Keyword Challenges
    {
      id: 'overwhelm-mastery',
      title: 'Overwhelm Mastery',
      description: 'Master units with the Overwhelm keyword.',
      category: 'keyword',
      difficulty: 2,
      completed: false,
      locked: false,
      rewards: ['XP: 100', 'Overwhelm Unit Card'],
      objective: 'Win a match using primarily Overwhelm units.',
      tips: [
        'Overwhelm units deal excess damage to the enemy',
        'Even if blocked, they can still deal damage',
        'Great for finishing off low-health enemies'
      ]
    },
    {
      id: 'spell-shield-defense',
      title: 'Spell Shield Defense',
      description: 'Learn to play around and with Spell Shield units.',
      category: 'keyword',
      difficulty: 3,
      completed: false,
      locked: false,
      rewards: ['XP: 125', 'Spell Shield Champion'],
      objective: 'Protect your Spell Shield units and break enemy shields.',
      tips: [
        'Spell Shield blocks the first spell that targets the unit',
        'Use cheap spells to break enemy shields',
        'Protect your shielded units for maximum value'
      ]
    },
    {
      id: 'elusive-strikes',
      title: 'Elusive Strikes',
      description: 'Master the Elusive keyword for unblockable damage.',
      category: 'keyword',
      difficulty: 3,
      completed: false,
      locked: true,
      rewards: ['XP: 150', 'Elusive Assassin Card'],
      objective: 'Win using Elusive units to deal unblockable damage.',
      tips: [
        'Elusive units can only be blocked by other Elusive units',
        'Perfect for consistent damage pressure',
        'Combine with attack buffs for maximum impact'
      ]
    },

    // Advanced Challenges
    {
      id: 'spell-stack-mastery',
      title: 'The Spell Stack',
      description: 'Master the complex spell stack and priority system.',
      category: 'advanced',
      difficulty: 4,
      completed: false,
      locked: true,
      rewards: ['XP: 200', 'Stack Master Title', 'Premium Card Back'],
      objective: 'Win by expertly managing the spell stack and reactions.',
      tips: [
        'Spells resolve in reverse order (last in, first out)',
        'You can respond to enemy spells with your own',
        'Sometimes passing priority is the best play'
      ]
    },
    {
      id: 'champion-levelup',
      title: 'Champion Evolution',
      description: 'Level up a Champion and win with its enhanced form.',
      category: 'advanced',
      difficulty: 4,
      completed: false,
      locked: true,
      rewards: ['XP: 250', 'Champion Upgrade Token', 'Legendary Card'],
      objective: 'Level up any Champion and win the match.',
      tips: [
        'Champions level up when meeting specific conditions',
        'Leveled Champions gain powerful new abilities',
        'Build your deck around Champion synergies'
      ]
    },
    {
      id: 'perfect-game',
      title: 'Flawless Victory',
      description: 'Win a match without losing any health.',
      category: 'advanced',
      difficulty: 5,
      completed: false,
      locked: true,
      rewards: ['XP: 300', 'Perfectionist Title', 'Golden Card Frame'],
      objective: 'Win a ranked match while taking 0 damage.',
      tips: [
        'Control the board from the early game',
        'Use defensive spells and units effectively',
        'Plan several turns ahead to avoid damage'
      ]
    }
  ];

  const categories = [
    { id: 'all', label: 'All Challenges', icon: BookOpen },
    { id: 'basic', label: 'Basic', icon: Play },
    { id: 'keyword', label: 'Keywords', icon: Zap },
    { id: 'advanced', label: 'Advanced', icon: Shield }
  ];

  const filteredChallenges = selectedCategory === 'all' 
    ? challenges 
    : challenges.filter(c => c.category === selectedCategory);

  const getProgressStats = () => {
    const completed = challenges.filter(c => c.completed).length;
    const total = challenges.length;
    const percentage = (completed / total) * 100;
    return { completed, total, percentage };
  };

  const { completed, total, percentage } = getProgressStats();

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-green-500';
      case 2: return 'text-blue-500';
      case 3: return 'text-yellow-500';
      case 4: return 'text-orange-500';
      case 5: return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const renderDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < difficulty 
            ? `fill-current ${getDifficultyColor(difficulty)}`
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Challenges
            </h1>
            <p className="text-muted-foreground mt-2">
              Master the game mechanics through focused training scenarios
            </p>
          </div>
          <Button variant="outline" onClick={onBack}>
            Back to Main Menu
          </Button>
        </div>

        {/* Progress Overview */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Overall Progress</h2>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="font-semibold">{completed}/{total}</span>
            </div>
          </div>
          <Progress value={percentage} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">
            {completed} challenges completed • {percentage.toFixed(0)}% mastery
          </p>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id as any)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-6 h-full transition-all duration-300 ${
                challenge.locked 
                  ? 'opacity-50 cursor-not-allowed' 
                  : challenge.completed
                    ? 'border-green-500 bg-green-500/5'
                    : 'hover:shadow-lg hover:border-primary/50 cursor-pointer'
              }`}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {challenge.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : challenge.locked ? (
                        <Lock className="w-6 h-6 text-gray-400" />
                      ) : (
                        <div className="w-6 h-6 rounded border-2 border-gray-300" />
                      )}
                      <Badge variant={
                        challenge.category === 'basic' ? 'secondary' :
                        challenge.category === 'keyword' ? 'default' : 'destructive'
                      }>
                        {challenge.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderDifficultyStars(challenge.difficulty)}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-2">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {challenge.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Objective:</h4>
                    <p className="text-xs text-muted-foreground">
                      {challenge.objective}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Tips:</h4>
                    <ul className="space-y-1">
                      {challenge.tips.slice(0, 2).map((tip, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Rewards:</h4>
                    <div className="flex flex-wrap gap-1">
                      {challenge.rewards.map((reward, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {reward}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => !challenge.locked && onStartChallenge(challenge.id)}
                    disabled={challenge.locked}
                    variant={challenge.completed ? "outline" : "default"}
                    className="w-full"
                    size="sm"
                  >
                    {challenge.completed ? 'Replay' : challenge.locked ? 'Locked' : 'Start Challenge'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};