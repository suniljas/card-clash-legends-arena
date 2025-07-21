import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Star, Sword, Shield, Zap, Heart } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { HERO_DATABASE } from '@/data/heroes';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  isComplete: boolean;
}

interface Faction {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: React.ComponentType<any>;
  playstyle: string;
  champion: any;
}

const FACTIONS: Faction[] = [
  {
    id: 'fire',
    name: 'Order of Flames',
    description: 'Aggressive warriors who overwhelm enemies with raw power',
    color: 'text-red-500',
    icon: Sword,
    playstyle: 'Aggressive • High Damage • Fast Pace',
    champion: HERO_DATABASE.find(h => h.name.includes('Fire') || h.name.includes('Dragon')) || HERO_DATABASE[0]
  },
  {
    id: 'water',
    name: 'Mystic Depths',
    description: 'Strategic mages who control the battlefield with spells',
    color: 'text-blue-500',
    icon: Zap,
    playstyle: 'Strategic • Control • Spell-based',
    champion: HERO_DATABASE.find(h => h.name.includes('Wizard') || h.name.includes('Mage')) || HERO_DATABASE[2]
  },
  {
    id: 'earth',
    name: 'Stone Guardians',
    description: 'Defensive forces that protect and endure',
    color: 'text-green-500',
    icon: Shield,
    playstyle: 'Defensive • High Health • Protection',
    champion: HERO_DATABASE.find(h => h.name.includes('Knight') || h.name.includes('Guard')) || HERO_DATABASE[3]
  },
  {
    id: 'shadow',
    name: 'Void Seekers',
    description: 'Cunning assassins who strike from the shadows',
    color: 'text-purple-500',
    icon: Star,
    playstyle: 'Stealth • Quick Strikes • Disruption',
    champion: HERO_DATABASE.find(h => h.name.includes('Shadow') || h.name.includes('Assassin')) || HERO_DATABASE[6]
  }
];

function PrologueBattle({ onComplete }: { onComplete: () => void }) {
  const [battleStep, setBattleStep] = useState(0);
  
  const battleSteps = [
    {
      title: "Welcome to Card Clash!",
      description: "You'll learn the basics of combat in this tutorial battle.",
      action: "Begin Tutorial"
    },
    {
      title: "Attack Phase",
      description: "Click your card to attack the enemy. Each card has attack and health values.",
      action: "Attack Enemy"
    },
    {
      title: "Mana System",
      description: "You gain mana each turn to play more powerful cards. Manage it wisely!",
      action: "Use Mana"
    },
    {
      title: "Victory!",
      description: "Excellent! You've mastered the basics. Ready for more challenges?",
      action: "Continue"
    }
  ];

  const currentStep = battleSteps[battleStep];

  const handleNext = () => {
    if (battleStep < battleSteps.length - 1) {
      setBattleStep(battleStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{currentStep.title}</h2>
        <p className="text-muted-foreground">{currentStep.description}</p>
      </div>

      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
        {battleStep < 3 ? (
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-20 h-28 bg-primary/20 rounded-lg flex items-center justify-center mb-2">
                <Sword className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-semibold">Your Hero</p>
              <p className="text-xs text-muted-foreground">5/5</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-28 bg-red-500/20 rounded-lg flex items-center justify-center mb-2">
                <Shield className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-sm font-semibold">Enemy</p>
              <p className="text-xs text-muted-foreground">3/3</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Star className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <p className="text-lg font-semibold">Victory Achieved!</p>
          </div>
        )}
      </div>

      <Button onClick={handleNext} className="w-full">
        {currentStep.action}
      </Button>
    </div>
  );
}

function BasicChallenges({ onComplete }: { onComplete: () => void }) {
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  
  const challenges = [
    { id: 'first-win', title: 'Win Your First Battle', description: 'Complete any battle successfully' },
    { id: 'play-cards', title: 'Play 5 Cards', description: 'Use 5 different cards in battles' },
    { id: 'use-mana', title: 'Spend 20 Mana', description: 'Use mana to play powerful cards' }
  ];

  const handleCompleteChallenge = (challengeId: string) => {
    if (!completedChallenges.includes(challengeId)) {
      setCompletedChallenges([...completedChallenges, challengeId]);
    }
  };

  const allChallengesComplete = challenges.every(c => completedChallenges.includes(c.id));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Basic Challenges</h2>
        <p className="text-muted-foreground">Complete these challenges to learn the fundamentals</p>
      </div>

      <div className="space-y-3">
        {challenges.map((challenge) => {
          const isComplete = completedChallenges.includes(challenge.id);
          return (
            <Card key={challenge.id} className={isComplete ? 'border-primary' : ''}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-semibold">{challenge.title}</h3>
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isComplete ? (
                    <Badge variant="default">Complete</Badge>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCompleteChallenge(challenge.id)}
                    >
                      Practice
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {allChallengesComplete && (
        <Button onClick={onComplete} className="w-full">
          Continue to Faction Selection
        </Button>
      )}
    </div>
  );
}

function FactionSelection({ onComplete }: { onComplete: (faction: string, champion: any) => void }) {
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);

  const handleSelectFaction = (faction: Faction) => {
    setSelectedFaction(faction.id);
    onComplete(faction.id, faction.champion);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Faction</h2>
        <p className="text-muted-foreground">
          Select a faction that matches your playstyle. You'll receive a starting deck and a powerful Champion!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FACTIONS.map((faction) => {
          const Icon = faction.icon;
          return (
            <Card 
              key={faction.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedFaction === faction.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleSelectFaction(faction)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Icon className={`h-6 w-6 ${faction.color}`} />
                  {faction.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{faction.description}</p>
                <Badge variant="outline" className="text-xs">
                  {faction.playstyle}
                </Badge>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-xs font-semibold mb-1">Starting Champion:</p>
                  <p className="text-sm">{faction.champion.name}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function OnboardingComplete({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="space-y-6 text-center">
      <div>
        <Star className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Welcome to Card Clash!</h2>
        <p className="text-muted-foreground">
          You're ready to begin your legendary journey. We recommend starting with the Path of Legends 
          to learn your new deck, then try PvP Arena when you're ready for real competition!
        </p>
      </div>

      <div className="space-y-3">
        <Button onClick={onComplete} className="w-full">
          Enter the Arena
        </Button>
        <p className="text-xs text-muted-foreground">
          Visit the Challenges section anytime to improve your skills
        </p>
      </div>
    </div>
  );
}

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const gameStore = useGameStore();

  const steps: OnboardingStep[] = [
    {
      id: 'prologue',
      title: 'Prologue Battle',
      description: 'Learn the basics of combat',
      component: PrologueBattle,
      isComplete: false
    },
    {
      id: 'challenges',
      title: 'Basic Challenges',
      description: 'Master fundamental skills',
      component: BasicChallenges,
      isComplete: false
    },
    {
      id: 'faction',
      title: 'Faction Selection',
      description: 'Choose your path',
      component: FactionSelection,
      isComplete: false
    },
    {
      id: 'complete',
      title: 'Ready to Play',
      description: 'Enter the main game',
      component: OnboardingComplete,
      isComplete: false
    }
  ];

  const currentStepData = steps[currentStep];
  const StepComponent = currentStepData.component;

  const handleStepComplete = (faction?: string, champion?: any) => {
    if (faction && champion) {
      setSelectedFaction(faction);
      // Add starting deck and champion to collection
      gameStore.addToCollection(champion);
      gameStore.updateFactionProgress(faction, 100);
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as complete
      localStorage.setItem('onboarding-completed', 'true');
      onComplete();
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold">Getting Started</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Card>
          <CardContent className="p-8">
            <StepComponent onComplete={handleStepComplete} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}