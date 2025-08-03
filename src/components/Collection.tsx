import { useState } from 'react';
import { HeroCard as HeroCardType, Rarity } from '@/types/game';
import { OptimizedGameCard, OptimizedCardGrid } from '@/components/OptimizedCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Hero Collection</h1>
          <p className="text-muted-foreground">
            {collection.length} heroes collected
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <Card className="p-4 mb-6">
        <h3 className="font-semibold mb-3">Collection Stats</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(rarityStats).map(([rarity, count]) => (
            <Badge 
              key={rarity} 
              variant="outline"
              className={cn(
                'capitalize',
                `border-rarity-${rarity} text-rarity-${rarity}`
              )}
            >
              {rarity}: {count}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search heroes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {rarities.map(rarity => (
            <Button
              key={rarity}
              variant={selectedRarity === rarity ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRarity(rarity)}
              className={cn(
                'capitalize',
                selectedRarity === rarity && rarity !== 'all' && 
                `bg-rarity-${rarity} hover:bg-rarity-${rarity}/80`
              )}
            >
              {rarity}
            </Button>
          ))}
        </div>
      </div>

      {/* Collection Grid */}
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

      {/* Empty State */}
      {filteredCollection.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🃏</div>
          <h3 className="text-lg font-semibold mb-2">No heroes found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Selected Card Details */}
      {selectedCard && (
        <Card className="fixed bottom-4 right-4 p-4 w-80 bg-card/95 backdrop-blur-sm">
          <h4 className="font-bold mb-2">{selectedCard.name}</h4>
          <p className="text-sm text-muted-foreground mb-2">
            {selectedCard.abilityDescription}
          </p>
          <div className="flex justify-between text-sm">
            <span>Level: {selectedCard.level}</span>
            <span>XP: {selectedCard.experience}/{selectedCard.experienceToNext}</span>
          </div>
        </Card>
      )}
    </div>
  );
}