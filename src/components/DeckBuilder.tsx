import { useState } from 'react';
import { HeroCard as HeroCardType, PlayerDeck } from '@/types/game';
import { LORCard } from './LORCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus, X, Save, Shuffle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
        // Sort by rarity and level
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
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Deck Builder</h1>
            <p className="text-muted-foreground">
              {currentDeck.cards.length}/{currentDeck.maxSize} cards • Power: {deckPower}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAutoFill}>
            <Shuffle className="w-4 h-4 mr-2" />
            Auto-fill
          </Button>
          {onSaveDeck && (
            <Button onClick={onSaveDeck}>
              <Save className="w-4 h-4 mr-2" />
              Save Deck
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={selectedTab === 'deck' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('deck')}
        >
          Current Deck ({currentDeck.cards.length})
        </Button>
        <Button
          variant={selectedTab === 'collection' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('collection')}
        >
          Collection ({collection.length})
        </Button>
      </div>

      {selectedTab === 'deck' && (
        <div>
          {/* Deck Slots */}
          <Card className="p-6 mb-6">
            <h3 className="font-semibold mb-4">Battle Deck</h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              {Array.from({ length: currentDeck.maxSize }).map((_, index) => {
                const card = currentDeck.cards[index];
                return (
                  <div key={index} className="aspect-[3/4]">
                    {card ? (
                      <div className="relative">
                        <LORCard 
                          hero={card} 
                          size="small"
                          showStats={false}
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                          onClick={() => handleRemoveCard(card.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <Card className="w-full h-full border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                        <Plus className="w-6 h-6 text-muted-foreground/50" />
                      </Card>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Deck Analysis */}
          {currentDeck.cards.length > 0 && (
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Deck Analysis</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Avg. Attack</div>
                  <div className="font-medium">
                    {Math.round(currentDeck.cards.reduce((sum, card) => sum + card.baseAttack, 0) / currentDeck.cards.length)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Avg. HP</div>
                  <div className="font-medium">
                    {Math.round(currentDeck.cards.reduce((sum, card) => sum + card.baseHP, 0) / currentDeck.cards.length)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Avg. Level</div>
                  <div className="font-medium">
                    {(currentDeck.cards.reduce((sum, card) => sum + card.level, 0) / currentDeck.cards.length).toFixed(1)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total Power</div>
                  <div className="font-medium text-primary">{deckPower}</div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {selectedTab === 'collection' && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {collection.map((card) => {
              const isInDeck = currentDeck.cards.find(deckCard => deckCard.id === card.id);
              return (
                <div key={card.id} className="relative">
                  <LORCard
                    hero={card}
                    size="medium"
                    onClick={() => !isInDeck && handleAddCard(card)}
                    isSelected={false}
                  />
                  {isInDeck && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium">In Deck</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}