import { useEffect, useState, memo } from 'react';
import { HeroCard as HeroCardType, Rarity } from '@/types/game';
import { OptimizedGameCard, OptimizedCardGrid } from '@/components/OptimizedCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Filter, Star, Trophy, Award, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { OptimizedBackground } from './OptimizedBackground';

interface CollectionProps {
  collection: HeroCardType[];
  onBack: () => void;
  onCardSelect?: (card: HeroCardType) => void;
}

const Collection = memo(({ collection, onBack, onCardSelect }: CollectionProps) => {
  const [selectedCard, setSelectedCard] = useState<HeroCardType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<Rarity | 'All'>('All');

  const filteredCollection = collection.filter((card) => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = selectedRarity === 'All' || card.rarity === selectedRarity;
    return matchesSearch && matchesRarity;
  });

  const handleCardClick = (card: HeroCardType) => {
    setSelectedCard(card);
    onCardSelect?.(card);
  };

  const handleBackClick = () => {
    if (selectedCard) {
      setSelectedCard(null);
    } else {
      onBack();
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <OptimizedBackground />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 left-4 z-10"
      >
        <Button onClick={handleBackClick} className="gap-2">
          <ArrowLeft size={18} /> Back
        </Button>
      </motion.div>

      <div className="pt-16 px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex gap-2 items-center">
            <Search size={20} />
            <Input
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {(['All', 'Common', 'Rare', 'Epic', 'Legendary'] as const).map((rarity) => (
              <Badge
                key={rarity}
                variant={selectedRarity === rarity ? 'default' : 'outline'}
                onClick={() => setSelectedRarity(rarity)}
                className={cn(
                  'cursor-pointer transition-transform',
                  selectedRarity === rarity && 'scale-110'
                )}
              >
                {rarity}
              </Badge>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!selectedCard ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <OptimizedCardGrid>
                {filteredCollection.map((card) => (
                  <OptimizedGameCard
                    key={card.id}
                    card={card}
                    onClick={() => handleCardClick(card)}
                    className="hover:scale-105 transition-transform"
                  />
                ))}
              </OptimizedCardGrid>
            </motion.div>
          ) : (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 max-w-xl mx-auto text-center bg-white/10 backdrop-blur-lg">
                <h2 className="text-2xl font-bold mb-2">{selectedCard.name}</h2>
                <p className="mb-4 text-muted-foreground">{selectedCard.description}</p>
                <div className="flex justify-center gap-4 mt-4">
                  <Badge>{selectedCard.rarity}</Badge>
                  <Badge>{selectedCard.type}</Badge>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

Collection.displayName = 'Collection';
export default Collection;
