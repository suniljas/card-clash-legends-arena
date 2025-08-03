import { useState } from 'react';
import { HeroCard as HeroCardType, Rarity } from '@/types/game';
import { OptimizedGameCard, OptimizedCardGrid } from '@/components/OptimizedCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Filter, Star, Award, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedBackground } from './OptimizedBackground';

interface CollectionProps {
  collection: HeroCardType[];
  onBack: () => void;
  onCardSelect?: (card: HeroCardType) => void;
}

// Enhanced Rarity Filter Button Component
const RarityFilterButton = ({ 
  rarity, 
  count, 
  isSelected, 
  onClick 
}: { 
  rarity: Rarity | 'all'; 
  count: number; 
  isSelected: boolean; 
  onClick: () => void; 
}) => {
  const rarityConfig = {
    all: { color: 'slate', icon: Filter, glow: '#64748b' },
    common: { color: 'gray', icon: Filter, glow: '#6b7280' },
    uncommon: { color: 'green', icon: Filter, glow: '#10b981' },
    rare: { color: 'blue', icon: Star, glow: '#3b82f6' },
    'very-rare': { color: 'purple', icon: Award, glow: '#8b5cf6' },
    epic: { color: 'orange', icon: Award, glow: '#f97316' },
    legend: { color: 'amber', icon: Sparkles, glow: '#f59e0b' },
    'ultra-legend': { color: 'pink', icon: Sparkles, glow: '#ec4899' }
  };

  const config = rarityConfig[rarity as keyof typeof rarityConfig] || rarityConfig.all;
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant={isSelected ? "default" : "outline"}
        size="sm"
        onClick={onClick}
        className={cn(
          'relative capitalize font-medium transition-all duration-300 overflow-hidden',
          isSelected ? 
            `bg-gradient-to-r from-${config.color}-600 to-${config.color}-700 hover:from-${config.color}-700 hover:to-${config.color}-800 text-white border-${config.color}-500 shadow-lg` :
            `hover:border-${config.color}-400 hover:text-${config.color}-400 hover:bg-${config.color}-50/10`
        )}
        style={isSelected ? { boxShadow: `0 0 20px ${config.glow}40` } : {}}
      >
        {/* Premium shimmer effect */}
        {isSelected && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
        )}
        
        <Icon className="w-3 h-3 mr-1.5" />
        {rarity}
        {count > 0 && (
          <Badge 
            variant="secondary" 
            className="ml-2 text-xs bg-white/20 text-white border-none"
          >
            {count}
          </Badge>
        )}
      </Button>
    </motion.div>
  );
};

interface CollectionProps {
  collection: HeroCardType[];
  onBack: () => void;
  onCardSelect?: (card: HeroCardType) => void;
}

export function Collection({ collection, onBack, onCardSelect }: CollectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<Rarity | 'all'>('all');
  const [selectedCard, setSelectedCard] = useState<HeroCardType | null>(null);

  // Convert HeroCard to OptimizedGameCard format
  const convertToOptimizedCard = (heroCard: HeroCardType) => ({
    id: heroCard.id,
    name: heroCard.name,
    artwork: heroCard.imageUrl || '/placeholder.svg',
    attack: heroCard.baseAttack || 0,
    health: heroCard.baseHP || 0,
    cost: heroCard.level || 1,
    rarity: heroCard.rarity === 'legend' ? 'legendary' as const : heroCard.rarity as "common" | "rare" | "epic" | "legendary",
    faction: "guardians" as const, // Default faction since HeroCard doesn't have faction
    description: heroCard.abilityDescription || ''
  });

  const rarities: (Rarity | 'all')[] = ['all', ...Object.values(Rarity)];

  const filteredCollection = collection.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = selectedRarity === 'all' || card.rarity === selectedRarity;
    return matchesSearch && matchesRarity;
  });

  const rarityStats = Object.values(Rarity).reduce((stats, rarity) => {
    stats[rarity] = collection.filter(card => card.rarity === rarity).length;
    return stats;
  }, {} as Record<Rarity, number>);

  // Calculate collection completion percentage
  const totalCards = collection.length;
  const completionPercentage = totalCards > 0 ? (totalCards / 100) * 100 : 0; // Assuming 100 total possible cards

  return (
    <OptimizedBackground variant="collection" intensity="medium">
      <div className="min-h-screen relative">
        <div className="container mx-auto px-4 py-8">
          {/* Enhanced Header with Premium Styling */}
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  onClick={onBack}
                  className="btn-lor-secondary hover:bg-slate-700/50 border border-slate-600/30"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </motion.div>
              <div>
                <motion.h1 
                  className="text-3xl font-bold text-gradient-premium mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Hero Collection
                </motion.h1>
                <motion.p 
                  className="text-slate-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {collection.length} heroes collected
                </motion.p>
              </div>
            </div>

            {/* Collection Progress */}
            <motion.div
              className="text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-sm text-slate-300 mb-1">Collection Progress</div>
              <div className="w-48 h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(completionPercentage, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {Math.round(completionPercentage)}% Complete
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6 mb-8 bg-gradient-to-br from-slate-800/80 via-slate-700/60 to-slate-800/80 backdrop-blur-md border-slate-600/50 shadow-xl">
              <h3 className="font-bold text-lg mb-4 text-slate-200">Collection Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {Object.entries(rarityStats).map(([rarity, count], index) => (
                  <motion.div
                    key={rarity}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-center p-3 rounded-lg bg-slate-800/50 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300"
                  >
                    <div className="text-2xl font-bold text-gradient-premium">{count}</div>
                    <div className="text-xs text-slate-400 capitalize">{rarity}</div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Enhanced Filters */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-slate-800/70 via-slate-700/50 to-slate-800/70 backdrop-blur-md border-slate-600/50">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Enhanced Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Search heroes by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder:text-slate-400 focus:border-primary/50 focus:bg-slate-700/70 transition-all duration-300"
                  />
                </div>
                
                {/* Enhanced Rarity Filters */}
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="text-sm text-slate-300 font-medium mr-2">Filter by rarity:</div>
                  {rarities.map(rarity => (
                    <RarityFilterButton
                      key={rarity}
                      rarity={rarity}
                      count={rarity === 'all' ? totalCards : rarityStats[rarity as Rarity] || 0}
                      isSelected={selectedRarity === rarity}
                      onClick={() => setSelectedRarity(rarity)}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Enhanced Collection Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <OptimizedCardGrid
              cards={filteredCollection.map(convertToOptimizedCard)}
              onCardSelect={(cardId) => {
                const heroCard = filteredCollection.find(c => c.id === cardId);
                if (heroCard) {
                  setSelectedCard(heroCard);
                  onCardSelect?.(heroCard);
                }
              }}
              selectedCards={selectedCard ? [selectedCard.id] : []}
              maxVisible={50} // Limit visible cards for performance
            />
          </motion.div>

          {/* Enhanced Empty State */}
          <AnimatePresence>
            {filteredCollection.length === 0 && (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="text-6xl mb-6"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatType: "reverse" 
                  }}
                >
                  🃏
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-slate-200">No heroes found</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  {searchTerm ? 'Try adjusting your search term' : 'Try changing your rarity filter'} to discover more heroes in your collection
                </p>
                {(searchTerm || selectedRarity !== 'all') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4"
                  >
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedRarity('all');
                      }}
                      className="btn-lor-secondary"
                    >
                      Clear Filters
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Selected Card Details */}
          <AnimatePresence>
            {selectedCard && (
              <motion.div
                initial={{ opacity: 0, x: 100, y: 100 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 100, y: 100 }}
                className="fixed bottom-6 right-6 z-50"
              >
                <Card className="p-6 w-80 bg-gradient-to-br from-slate-800/95 via-slate-700/90 to-slate-800/95 backdrop-blur-lg border-slate-600/50 shadow-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-lg text-gradient-premium">{selectedCard.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCard(null)}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      ✕
                    </Button>
                  </div>
                  <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                    {selectedCard.abilityDescription}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-slate-700/50 p-2 rounded">
                      <span className="text-slate-400">Level:</span>
                      <span className="ml-2 font-medium text-slate-200">{selectedCard.level}</span>
                    </div>
                    <div className="bg-slate-700/50 p-2 rounded">
                      <span className="text-slate-400">XP:</span>
                      <span className="ml-2 font-medium text-slate-200">
                        {selectedCard.experience}/{selectedCard.experienceToNext}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </OptimizedBackground>
  );
}