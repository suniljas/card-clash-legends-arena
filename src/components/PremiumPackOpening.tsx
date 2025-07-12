import { useState } from 'react';
import { HeroCard, Rarity } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PremiumCard } from './PremiumCard';
import { useGameAudio } from '@/hooks/useAudio';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

interface PremiumPackOpeningProps {
  packType: 'beginner' | 'legendary' | 'event';
  cards: HeroCard[];
  onComplete: () => void;
  enableMusic?: boolean;
  onAllRevealed?: () => void;
}

export function PremiumPackOpening({ packType, cards, onComplete, enableMusic = true, onAllRevealed }: PremiumPackOpeningProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const { playPackOpen, playLegendaryDrop, playVictory } = useGameAudio();

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
    if (enableMusic) playVictory();
    // Reveal cards one by one with dramatic timing
    cards.forEach((card, index) => {
      setTimeout(() => {
        if (card.rarity === Rarity.LEGEND || card.rarity === Rarity.ULTRA_LEGEND) {
          playLegendaryDrop();
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2000);
        }
        setRevealedCards(prev => [...prev, index]);
        if (index === cards.length - 1 && onAllRevealed) onAllRevealed();
      }, (index + 1) * 900);
    });
  };

  const packStyle = packStyles[packType];

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Dynamic swirling background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 pointer-events-none"
      >
        <motion.div
          className="absolute w-[120vw] h-[120vw] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 blur-3xl animate-spin-slow"
          style={{ zIndex: 1 }}
        />
      </motion.div>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={200} recycle={false} />} 
      <div className="w-full max-w-4xl relative z-10">
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
                <AnimatePresence key={card.id}>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: 80, rotateY: 90 }}
                    animate={revealedCards.includes(index)
                      ? { scale: 1, opacity: 1, y: 0, rotateY: 0 }
                      : {}}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className={cn(
                      'transform transition-all duration-1000',
                      revealedCards.includes(index)
                        ? 'scale-100 opacity-100 translate-y-0 card-reveal'
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
                  </motion.div>
                </AnimatePresence>
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