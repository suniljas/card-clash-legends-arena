import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, Swords, Users, Package } from 'lucide-react';

interface TutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function Tutorial({ onComplete, onSkip }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to Card Clash Legends!",
      description: "Learn the basics and become a champion",
      icon: BookOpen,
      content: "Card Clash Legends is a strategic card battler where you collect heroes, build decks, and battle opponents. Let's get you started!"
    },
    {
      title: "Collect Heroes",
      description: "Build your collection of powerful heroes",
      icon: Users,
      content: "Heroes have different rarities and abilities. Collect them through battles, card packs, and special events. Each hero can be leveled up through experience."
    },
    {
      title: "Build Your Deck",
      description: "Create the perfect battle strategy",
      icon: Package,
      content: "Your deck can hold up to 8 heroes. Choose wisely - balance attack, defense, and special abilities. You can only use heroes you've collected."
    },
    {
      title: "Battle System",
      description: "Fight other players and AI opponents",
      icon: Swords,
      content: "In battles, your deck's total power determines your chances. Heroes gain experience from battles, making them stronger over time."
    }
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTutorial = tutorialSteps[currentStep];
  const IconComponent = currentTutorial.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-6 justify-center">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 rounded-full transition-colors ${
                index === currentStep 
                  ? 'bg-primary' 
                  : index < currentStep 
                    ? 'bg-primary/50' 
                    : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className="p-4 rounded-full bg-gradient-to-br from-primary to-secondary">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{currentTutorial.title}</h2>
          <Badge variant="outline" className="mb-4">
            Step {currentStep + 1} of {tutorialSteps.length}
          </Badge>
          
          <p className="text-muted-foreground mb-6">
            {currentTutorial.description}
          </p>
          
          <div className="bg-muted/50 rounded-lg p-4 text-left">
            <p>{currentTutorial.content}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="text-muted-foreground"
          >
            Skip Tutorial
          </Button>

          <Button onClick={handleNext}>
            {currentStep === tutorialSteps.length - 1 ? 'Start Playing' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}