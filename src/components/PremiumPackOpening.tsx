import { useState } from 'react';
import { HeroCard, Rarity } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PremiumCard } from './PremiumCard';
import { useGameAudio } from '@/hooks/useAudio';
import { cn } from '@/lib/utils';

interface PremiumPackOpeningProps {
  packType: 'beginner' | 'legendary' | 'event';
  cards: HeroCard[];
  onComplete: () => void;
}

export function PremiumPackOpening({ packType, cards, onComplete }: PremiumPackOpeningProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const { playPackOpen, playLegendaryDrop } = useGameAudio();

  const packStyles = {
    beginner: {
      background: 'bg-gradient-to-br from-muted via-muted/80 to-card',
      border: 'border-muted-foreground',
      glow: 'shadow-lg'
    },
    legendary: {
      background: 'bg-gradient-to-br from-rarity-legend/20 via-accent/10 to-primary/20',
      border: 'border-rarity-legend',
      glow: 'shadow-2xl shadow-rarity-legend/50 animate-pulse-glow'
    },
    event: {
      background: 'bg-gradient-to-br from-rarity-ultra-legend/20 via-secondary/10 to-primary/20',
      border: 'border-rarity-ultra-legend',
      glow: 'shadow-2xl shadow-rarity-ultra-legend/60 divine-glow'
    }
  };

  const handleOpenPack = () => {
    setIsOpening(true);
    playPackOpen();
    
    // Reveal cards one by one with dramatic timing
    cards.forEach((card, index) => {
      setTimeout(() => {
        if (card.rarity === Rarity.LEGEND || card.rarity === Rarity.ULTRA_LEGEND) {
          playLegendaryDrop();
        }
        setRevealedCards(prev => [...prev, index]);
      }, (index + 1) * 800);
    });
  };

  const packStyle = packStyles[packType];

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {!isOpening ? (
          // Pack Sealed State
          <div className="text-center">
            <Card className={cn(
              'w-64 h-80 mx-auto mb-8 cursor-pointer transition-all duration-500',
              'hover:scale-105 hover:-translate-y-4',
              packStyle.background,
              packStyle.border,
              packStyle.glow,
              'border-2 relative overflow-hidden'
            )}>
              {/* Premium Pack Design */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent" />
              
              {/* Pack Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-bold mb-2 capitalize text-shadow">
                  {packType} Pack
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  {packType === 'beginner' && '3 Common Cards'}
                  {packType === 'legendary' && '2 Rare + 1 Legend'}
                  {packType === 'event' && '1 Ultra Legend + 2 Random'}
                </p>
              </div>

              {/* Premium Corner Decorations */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-accent opacity-70"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-accent opacity-70"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-accent opacity-70"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-accent opacity-70"></div>
            </Card>

            <Button
              onClick={handleOpenPack}
              size="lg"
              className="btn-premium text-lg px-8 py-4"
            >
              ✨ Open Pack ✨
            </Button>
          </div>
        ) : (
          // Cards Revealed State
          <div>
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              ✨ Pack Opened! ✨
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  className={cn(
                    'transform transition-all duration-1000',
                    revealedCards.includes(index) 
                      ? 'scale-100 opacity-100 translate-y-0' 
                      : 'scale-50 opacity-0 translate-y-8'
                  )}
                >
                  {revealedCards.includes(index) && (
                    <PremiumCard
                      hero={card}
                      size="medium"
                      isAnimated={true}
                    />
                  )}
                </div>
              ))}
            </div>

            {revealedCards.length === cards.length && (
              <div className="text-center animate-fade-in">
                <Button
                  onClick={onComplete}
                  size="lg"
                  className="btn-premium"
                >
                  Continue
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}