import { useState } from 'react';
import { HeroCard as HeroCardType, PlayerDeck } from '@/types/game';
import { LORCard } from './LORCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus, X, Save, Shuffle, BarChart3, Zap, Shield, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface DeckBuilderProps {
  collection: HeroCardType[];
  currentDeck: PlayerDeck;
  onBack: () => void;
  onAddCard: (card: HeroCardType) => boolean;
  onRemoveCard: (cardId: string) => void;
  onSaveDeck?: () => void;
}

// Enhanced mana curve visualization component
const ManaCurveChart = ({ cards }: { cards: HeroCardType[] }) => {
  const manaCosts = Array.from({ length: 8 }, (_, i) => i + 1);
  const cardCounts = manaCosts.map(cost => 
    cards.filter(card => card.level === cost).length
  );
  const maxCount = Math.max(...cardCounts, 1);

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-amber-200 flex items-center gap-2">
        <BarChart3 className="w-4 h-4" />
        Mana Curve
      </h4>
      <div className="grid grid-cols-8 gap-2 h-24 items-end">
        {manaCosts.map((cost, index) => {
          const count = cardCounts[index];
          const height = (count / maxCount) * 100;
          
          return (
            <div key={cost} className="flex flex-col items-center gap-1">
              <motion.div
                className="w-full bg-gradient-to-t from-amber-500 to-amber-300 rounded-sm min-h-[2px] shadow-lg"
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
              <span className="text-xs text-slate-400">{cost}</span>
              <span className="text-xs font-medium text-amber-300">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Enhanced deck stats component
const DeckStats = ({ cards }: { cards: HeroCardType[] }) => {
  if (cards.length === 0) return null;

  const avgAttack = Math.round(cards.reduce((sum, card) => sum + card.baseAttack, 0) / cards.length);
  const avgHP = Math.round(cards.reduce((sum, card) => sum + card.baseHP, 0) / cards.length);
  const avgLevel = (cards.reduce((sum, card) => sum + card.level, 0) / cards.length).toFixed(1);
  const totalPower = cards.reduce((total, card) => total + card.baseAttack + (card.level - 1) * 10, 0);

  const stats = [
    { label: 'Avg. Attack', value: avgAttack, icon: Zap, color: 'text-red-400' },
    { label: 'Avg. Health', value: avgHP, icon: Heart, color: 'text-green-400' },
    { label: 'Avg. Level', value: avgLevel, icon: Shield, color: 'text-blue-400' },
    { label: 'Total Power', value: totalPower, icon: BarChart3, color: 'text-amber-400' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-sm text-slate-400">{stat.label}</span>
            </div>
            <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
          </motion.div>
        );
      })}
    </div>
  );
};

interface DeckBuilderProps {
  collection: HeroCardType[];
  currentDeck: PlayerDeck;
  onBack: () => void;
  onAddCard: (card: HeroCardType) => boolean;
  onRemoveCard: (cardId: string) => void;
  onSaveDeck?: () => void;
}

export function DeckBuilder({ 
  collection, 
  currentDeck, 
  onBack, 
  onAddCard, 
  onRemoveCard,
  onSaveDeck 
}: DeckBuilderProps) {
  const [selectedTab, setSelectedTab] = useState<'deck' | 'collection'>('deck');
  const { toast } = useToast();

  const handleAddCard = (card: HeroCardType) => {
    const success = onAddCard(card);
    if (success) {
      toast({
        title: "Card Added",
        description: `${card.name} added to deck`,
      });
    } else {
      toast({
        title: "Cannot Add Card",
        description: "Deck is full or card already in deck",
        variant: "destructive"
      });
    }
  };

  const handleRemoveCard = (cardId: string) => {
    const card = currentDeck.cards.find(c => c.id === cardId);
    onRemoveCard(cardId);
    if (card) {
      toast({
        title: "Card Removed",
        description: `${card.name} removed from deck`,
      });
    }
  };

  const handleAutoFill = () => {
    const availableCards = collection.filter(
      card => !currentDeck.cards.find(deckCard => deckCard.id === card.id)
    );
    
    const slotsToFill = currentDeck.maxSize - currentDeck.cards.length;
    const cardsToAdd = availableCards
      .sort((a, b) => {
        const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legend: 5, 'ultra-legend': 6 };
        return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0) || b.level - a.level;
      })
      .slice(0, slotsToFill);

    cardsToAdd.forEach(card => onAddCard(card));
    
    toast({
      title: "Deck Auto-filled",
      description: `Added ${cardsToAdd.length} cards to deck`,
    });
  };

  const deckPower = currentDeck.cards.reduce((total, card) => {
    return total + card.baseAttack + (card.level - 1) * 10;
  }, 0);

  return (
    <motion.div 
      className="container mx-auto px-6 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Enhanced Header */}
      <motion.div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 hover:from-slate-600/60 hover:to-slate-500/60 border border-slate-600/50 hover:border-slate-500/60 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 bg-clip-text text-transparent font-fantasy">
              Deck Builder
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-slate-300">
                {currentDeck.cards.length}/{currentDeck.maxSize} cards
              </span>
              <span className="text-amber-300 font-medium">
                Power: {deckPower}
              </span>
            </div>
          </div>
        </div>

        <motion.div 
          className="flex gap-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button 
            variant="outline" 
            onClick={handleAutoFill}
            className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-500/50 hover:border-blue-400/60 text-blue-300 hover:text-blue-200 transition-all duration-300"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Auto-fill
          </Button>
          {onSaveDeck && (
            <Button 
              onClick={onSaveDeck}
              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 font-medium shadow-lg hover:shadow-amber-400/20 transition-all duration-300"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Deck
            </Button>
          )}
        </motion.div>
      </motion.div>

      {/* Enhanced Tabs */}
      <motion.div 
        className="flex gap-3 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Button
          variant={selectedTab === 'deck' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('deck')}
          className={selectedTab === 'deck' ? 
            'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-medium' : 
            'bg-slate-800/50 border-slate-600/50 hover:border-slate-500/60 text-slate-300 hover:text-slate-200'
          }
        >
          Current Deck ({currentDeck.cards.length})
        </Button>
        <Button
          variant={selectedTab === 'collection' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('collection')}
          className={selectedTab === 'collection' ? 
            'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-900 font-medium' : 
            'bg-slate-800/50 border-slate-600/50 hover:border-slate-500/60 text-slate-300 hover:text-slate-200'
          }
        >
          Collection ({collection.length})
        </Button>
      </motion.div>

      <AnimatePresence mode="wait">
        {selectedTab === 'deck' && (
          <motion.div
            key="deck"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Enhanced Deck Slots */}
            <Card className="p-8 mb-8 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-md border border-slate-700/50 shadow-xl">
              <h3 className="font-bold text-xl mb-6 bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text text-transparent">
                Battle Deck
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {Array.from({ length: currentDeck.maxSize }).map((_, index) => {
                  const card = currentDeck.cards[index];
                  return (
                    <motion.div 
                      key={index} 
                      className="aspect-[3/4]"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      {card ? (
                        <motion.div 
                          className="relative group"
                          whileHover={{ scale: 1.05, y: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <LORCard 
                            hero={card} 
                            size="small"
                            showStats={false}
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600 hover:bg-red-500"
                            onClick={() => handleRemoveCard(card.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className="w-full h-full border-2 border-dashed border-slate-600/50 bg-slate-800/30 hover:border-amber-400/50 hover:bg-slate-700/30 flex items-center justify-center transition-all duration-300">
                            <Plus className="w-6 h-6 text-slate-500 group-hover:text-amber-400" />
                          </Card>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </Card>

            {/* Enhanced Deck Analysis */}
            {currentDeck.cards.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-md border border-slate-700/50 shadow-xl">
                  <h4 className="font-bold text-lg mb-4 bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text text-transparent">
                    Deck Statistics
                  </h4>
                  <DeckStats cards={currentDeck.cards} />
                </Card>
                
                <Card className="p-6 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-md border border-slate-700/50 shadow-xl">
                  <ManaCurveChart cards={currentDeck.cards} />
                </Card>
              </div>
            )}
          </motion.div>
        )}

        {selectedTab === 'collection' && (
          <motion.div
            key="collection"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {collection.map((card, index) => {
                const isInDeck = currentDeck.cards.find(deckCard => deckCard.id === card.id);
                return (
                  <motion.div 
                    key={card.id} 
                    className="relative"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.02 }}
                    whileHover={{ scale: isInDeck ? 1 : 1.05, y: isInDeck ? 0 : -5 }}
                  >
                    <LORCard
                      hero={card}
                      size="medium"
                      onClick={() => !isInDeck && handleAddCard(card)}
                      isSelected={false}
                    />
                    <AnimatePresence>
                      {isInDeck && (
                        <motion.div 
                          className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center backdrop-blur-sm"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="text-white font-medium text-sm bg-amber-600 px-3 py-1 rounded-full">
                            In Deck
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}