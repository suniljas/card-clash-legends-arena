import { useState } from 'react';
import { HeroCard as HeroCardType, Rarity } from '@/types/game';
import { HeroCard } from './HeroCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Search, Coins, Gem, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MarketplaceProps {
  collection: HeroCardType[];
  gameStats: any;
  onBack: () => void;
  onTradeCard: (cardId: string, price: number, currency: 'coins' | 'gems') => void;
  onBuyCard: (listing: MarketListing) => void;
}

interface MarketListing {
  id: string;
  card: HeroCardType;
  price: number;
  currency: 'coins' | 'gems';
  seller: string;
  timeRemaining: number;
}

// Mock marketplace data
const MOCK_LISTINGS: MarketListing[] = [
  {
    id: '1',
    card: {
      id: 'dragon-knight-marketplace',
      name: 'Dragon Knight',
      rarity: Rarity.EPIC,
      baseAttack: 250,
      baseHP: 300,
      level: 2,
      experience: 150,
      experienceToNext: 300,
      abilityName: 'Dragon Breath',
      abilityDescription: 'Massive fire damage to all enemies',
      unlocked: true
    },
    price: 500,
    currency: 'gems',
    seller: 'DragonMaster',
    timeRemaining: 82800 // 23 hours
  },
  {
    id: '2',
    card: {
      id: 'crystal-wizard-marketplace',
      name: 'Crystal Wizard',
      rarity: Rarity.RARE,
      baseAttack: 200,
      baseHP: 180,
      level: 3,
      experience: 200,
      experienceToNext: 200,
      abilityName: 'Crystal Blast',
      abilityDescription: 'Damages all enemies for 150% attack',
      unlocked: true
    },
    price: 1200,
    currency: 'coins',
    seller: 'MagePlayer',
    timeRemaining: 43200 // 12 hours
  }
];

export function Marketplace({ collection, gameStats, onBack, onTradeCard, onBuyCard }: MarketplaceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState<HeroCardType | null>(null);
  const [tradePrice, setTradePrice] = useState('');
  const [tradeCurrency, setTradeCurrency] = useState<'coins' | 'gems'>('coins');
  const [activeListings] = useState<MarketListing[]>(MOCK_LISTINGS);
  const { toast } = useToast();

  const filteredListings = activeListings.filter(listing =>
    listing.card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tradableCards = collection.filter(card => 
    card.level > 1 && // Only tradable if leveled up
    !selectedCard || card.id !== selectedCard.id
  );

  const handleListCard = () => {
    if (!selectedCard || !tradePrice) {
      toast({
        title: "Invalid Listing",
        description: "Please select a card and set a price",
        variant: "destructive"
      });
      return;
    }

    const price = parseInt(tradePrice);
    if (price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Price must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    onTradeCard(selectedCard.id, price, tradeCurrency);
    toast({
      title: "Card Listed!",
      description: `${selectedCard.name} listed for ${price} ${tradeCurrency}`,
    });
    setSelectedCard(null);
    setTradePrice('');
  };

  const handleBuyCard = (listing: MarketListing) => {
    const canAfford = listing.currency === 'coins' 
      ? gameStats.coins >= listing.price 
      : gameStats.gems >= listing.price;

    if (!canAfford) {
      toast({
        title: "Insufficient Funds",
        description: `You need ${listing.price} ${listing.currency}`,
        variant: "destructive"
      });
      return;
    }

    onBuyCard(listing);
    toast({
      title: "Purchase Successful!",
      description: `You bought ${listing.card.name} for ${listing.price} ${listing.currency}`,
    });
  };

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">🏪 Marketplace</h1>
          <p className="text-muted-foreground">Trade heroes with other players</p>
        </div>
      </div>

      {/* Currency Display */}
      <Card className="p-4 mb-6">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-game-coins" />
            <span className="font-medium">{gameStats.coins.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">Coins</span>
          </div>
          <div className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-game-gems" />
            <span className="font-medium">{gameStats.gems.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">Gems</span>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Listings</TabsTrigger>
          <TabsTrigger value="sell">Sell Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search marketplace..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="p-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <HeroCard 
                      hero={listing.card} 
                      size="small"
                      showStats={false}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-bold">{listing.card.name}</h3>
                      <Badge 
                        variant="outline" 
                        className={`text-rarity-${listing.card.rarity} border-rarity-${listing.card.rarity}`}
                      >
                        {listing.card.rarity}
                      </Badge>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{listing.seller}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeRemaining(listing.timeRemaining)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {listing.currency === 'coins' ? 
                          <Coins className="w-4 h-4 text-game-coins" /> : 
                          <Gem className="w-4 h-4 text-game-gems" />
                        }
                        <span className="font-bold">{listing.price}</span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleBuyCard(listing)}
                      >
                        Buy
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">No listings found</h3>
              <p className="text-muted-foreground">Try adjusting your search</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sell" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">List a Card for Sale</h3>
            
            {/* Card Selection */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Card to Sell</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                  {tradableCards.map((card) => (
                    <HeroCard
                      key={card.id}
                      hero={card}
                      size="small"
                      isSelected={selectedCard?.id === card.id}
                      onClick={() => setSelectedCard(card)}
                      showStats={false}
                    />
                  ))}
                </div>
              </div>

              {selectedCard && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Selected: {selectedCard.name}</h4>
                    <p className="text-sm text-muted-foreground">Level {selectedCard.level}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Price</label>
                      <Input
                        type="number"
                        value={tradePrice}
                        onChange={(e) => setTradePrice(e.target.value)}
                        placeholder="Enter price"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Currency</label>
                      <div className="flex gap-2">
                        <Button
                          variant={tradeCurrency === 'coins' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTradeCurrency('coins')}
                          className="flex-1"
                        >
                          <Coins className="w-3 h-3 mr-1" />
                          Coins
                        </Button>
                        <Button
                          variant={tradeCurrency === 'gems' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTradeCurrency('gems')}
                          className="flex-1"
                        >
                          <Gem className="w-3 h-3 mr-1" />
                          Gems
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleListCard} className="w-full">
                    List Card for Sale
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {tradableCards.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-semibold mb-2">No tradable cards</h3>
              <p className="text-muted-foreground">Level up your cards to make them tradable</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}