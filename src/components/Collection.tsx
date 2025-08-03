import { useState } from 'react';
import { HeroCard as HeroCardType, Rarity } from '@/types/game';
import { OptimizedGameCard, OptimizedCardGrid } from '@/components/OptimizedCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { EmptyCollection } from '@/components/ui/empty-state';
import { ArrowLeft, Search, Filter, Star, Trophy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CollectionProps {
  collection: HeroCardType[];
  onBack: () => void;
  onCardSelect?: (card: HeroCardType) => void;
}

// Enhanced rarity configuration with premium visual effects
const rarityConfig = {
  common: {
    color: 'text-slate-400',
    bgColor: 'from-slate-600/20 to-slate-500/20',
    borderColor: 'border-slate-500/50',
    glowColor: 'slate',
    icon: Star
  },
  uncommon: {
    color: 'text-green-400',
    bgColor: 'from-green-600/20 to-emerald-500/20',
    borderColor: 'border-green-500/50',
    glowColor: 'green',
    icon: Star
  },
  rare: {
    color: 'text-blue-400',
    bgColor: 'from-blue-600/20 to-cyan-500/20',
    borderColor: 'border-blue-500/50',
    glowColor: 'blue',
    icon: Trophy
  },
  epic: {
    color: 'text-purple-400',
    bgColor: 'from-purple-600/20 to-violet-500/20',
    borderColor: 'border-purple-500/50',
    glowColor: 'purple',
    icon: Trophy
  },
  legend: {
    color: 'text-amber-400',
    bgColor: 'from-amber-600/20 to-yellow-500/20',
    borderColor: 'border-amber-500/50',
    glowColor: 'amber',
    icon: Sparkles
  },
  'ultra-legend': {
    color: 'text-pink-400',
    bgColor: 'from-pink-600/20 to-rose-500/20',
    borderColor: 'border-pink-500/50',
    glowColor: 'pink',
    icon: Sparkles
  }
};

// Enhanced animated progress bar component
const ProgressBar = ({ current, max, label, color = "blue" }: {
  current: number;
  max: number;
  label: string;
  color?: string;
}) => {
  const percentage = Math.min((current / max) * 100, 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="text-sm text-slate-400">{current}/{max}</span>
      </div>
      <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-400 rounded-full shadow-lg`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

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
    faction: "guardians" as const,
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

  const totalCards = collection.length;
  const collectionProgress = (totalCards / 200) * 100; // Assuming 200 total cards available

  return (
    <motion.div 
      className="container mx-auto px-6 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Enhanced Header */}
      <motion.div 
        className="flex items-center gap-6 mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-slate-600/60 hover:to-slate-500/60 border border-slate-600/50 hover:border-slate-500/60 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 bg-clip-text text-transparent font-fantasy">
            Hero Collection
          </h1>
          <p className="text-slate-300 mt-1">
            {collection.length} heroes collected
          </p>
        </div>
        
        {/* Collection Progress */}
        <motion.div 
          className="hidden md:block min-w-64"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <ProgressBar 
            current={totalCards} 
            max={200} 
            label="Collection Progress" 
            color="amber" 
          />
        </motion.div>
      </motion.div>

      {/* Enhanced Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="p-6 mb-8 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-md border border-slate-700/50 shadow-xl">
          <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text text-transparent">
            Collection Stats
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {Object.entries(rarityStats).map(([rarity, count], index) => {
              const config = rarityConfig[rarity as keyof typeof rarityConfig];
              const Icon = config?.icon || Star;
              
              return (
                <motion.div
                  key={rarity}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className={`p-3 bg-gradient-to-br ${config?.bgColor || 'from-slate-600/20 to-slate-500/20'} ${config?.borderColor || 'border-slate-500/50'} hover:shadow-lg transition-all duration-300 mystical-shimmer`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-4 h-4 ${config?.color || 'text-slate-400'}`} />
                      <span className={`text-sm font-medium capitalize ${config?.color || 'text-slate-400'}`}>
                        {rarity.replace('-', ' ')}
                      </span>
                    </div>
                    <div className={`text-lg font-bold ${config?.color || 'text-slate-400'}`}>
                      {count}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Enhanced Filters */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search heroes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-600/50 focus:border-amber-400/50 transition-all duration-300"
          />
        </div>
        
        <div className="flex gap-2 items-center flex-wrap">
          <Filter className="w-4 h-4 text-slate-400" />
          {rarities.map((rarity, index) => {
            const config = rarityConfig[rarity as keyof typeof rarityConfig];
            const isSelected = selectedRarity === rarity;
            
            return (
              <motion.div
                key={rarity}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
              >
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRarity(rarity)}
                  className={cn(
                    'capitalize transition-all duration-300',
                    isSelected && rarity !== 'all' ? 
                      `bg-gradient-to-r ${config?.bgColor} ${config?.borderColor} ${config?.color} hover:scale-105` :
                      'bg-slate-800/50 border-slate-600/50 hover:border-slate-500/60 hover:scale-105'
                  )}
                >
                  {rarity.replace('-', ' ')}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Collection Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
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
          maxVisible={50}
        />
      </motion.div>

      {/* Enhanced Empty State */}
      <AnimatePresence>
        {filteredCollection.length === 0 && (
          <EmptyCollection
            title={searchTerm ? "No matching heroes found" : undefined}
            description={searchTerm ? 
              `No heroes match "${searchTerm}". Try a different search term or clear filters.` :
              collection.length === 0 ?
                "Start your adventure by opening card packs from the shop!" :
                "Try adjusting your filters to see more heroes."
            }
            action={collection.length === 0 ? {
              label: "Visit Shop",
              onClick: () => {/* Navigate to shop */},
              variant: "primary"
            } : undefined}
          />
        )}
      </AnimatePresence>

      {/* Enhanced Selected Card Details */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className="p-6 w-80 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-md border border-slate-600/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-full bg-gradient-to-br ${rarityConfig[selectedCard.rarity as keyof typeof rarityConfig]?.bgColor || 'from-slate-600/20 to-slate-500/20'}`}>
                  {(() => {
                    const config = rarityConfig[selectedCard.rarity as keyof typeof rarityConfig];
                    const IconComponent = config?.icon;
                    return IconComponent ? <IconComponent className={`w-5 h-5 ${config?.color}`} /> : null;
                  })()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">{selectedCard.name}</h4>
                  <Badge className={`capitalize text-xs ${rarityConfig[selectedCard.rarity as keyof typeof rarityConfig]?.color} ${rarityConfig[selectedCard.rarity as keyof typeof rarityConfig]?.borderColor}`}>
                    {selectedCard.rarity.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
              
              {selectedCard.abilityDescription && (
                <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                  {selectedCard.abilityDescription}
                </p>
              )}
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Level:</span>
                  <span className="text-slate-200 font-medium">{selectedCard.level}</span>
                </div>
                {selectedCard.experience !== undefined && selectedCard.experienceToNext !== undefined && (
                  <ProgressBar 
                    current={selectedCard.experience} 
                    max={selectedCard.experienceToNext} 
                    label="Experience" 
                    color="blue" 
                  />
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCard(null)}
                className="w-full mt-4 bg-slate-800/50 border-slate-600/50 hover:border-slate-500/60"
              >
                Close
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}