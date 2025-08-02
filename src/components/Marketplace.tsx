import { useState } from 'react';
import { HeroCard as HeroCardType, EditionType } from '@/types/game';
import { HeroCard } from './HeroCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Gem, Users, Clock, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MarketplaceSystem } from '@/services/marketplaceSystem';

interface MarketplaceProps {
  collection: HeroCardType[];
  gameStats: any;
  userProfile: any;
  onBack: () => void;
  onTradeCard: (cardId: string, price: number, currency: 'gems') => void;
  onBuyCard: (card: HeroCardType, price: number) => void;
}

export function Marketplace({ collection, gameStats, onBack, onTradeCard, onBuyCard }: MarketplaceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState<HeroCardType | null>(null);
  const [tradePrice, setTradePrice] = useState('');
  const [editionFilter, setEditionFilter] = useState<EditionType | 'all'>('all');
  const [activeListings, setActiveListings] = useState(MarketplaceSystem.getActiveListings());
  const { toast } = useToast();

  const filteredListings = activeListings.filter(listing => {
    const matchesSearch = listing.card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEdition = editionFilter === 'all' || listing.card.edition === editionFilter;
    return matchesSearch && matchesEdition;
  });

  const tradableCards = collection.filter(card => 
    card && card.level > 1 && // Only tradable if leveled up
    (!selectedCard || card.id !== selectedCard.id)
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

    // List card using marketplace system
    MarketplaceSystem.listCard(selectedCard, price, 'You');
    onTradeCard(selectedCard.id, price, 'gems');
    
    // Refresh listings
    setActiveListings(MarketplaceSystem.getActiveListings());
    
    toast({
      title: "Card Listed!",
      description: `${selectedCard.name} (${selectedCard.edition}) listed for ${price} gems`,
    });
    setSelectedCard(null);
    setTradePrice('');
  };

  const handleBuyCard = (listingId: string, listing: any) => {
    if (gameStats.gems < listing.price) {
      toast({
        title: "Insufficient Gems",
        description: `You need ${listing.price} gems`,
        variant: "destructive"
      });
      return;
    }

    const purchasedCard = MarketplaceSystem.buyCard(listingId, 'You');
    
    if (purchasedCard) {
      onBuyCard(purchasedCard, listing.price);
      setActiveListings(MarketplaceSystem.getActiveListings());
      
      toast({
        title: "Purchase Successful!",
        description: `You bought ${purchasedCard.name} (${purchasedCard.edition}) for ${listing.price} gems`,
      });
    }
  };

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getEditionBadgeColor = (edition: EditionType) => {
    switch (edition) {
      case EditionType.LIMITED:
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case EditionType.SPECIAL:
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case EditionType.PREMIUM:
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
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
          <h1 className="text-2xl font-bold">💎 Gem Marketplace</h1>
          <p className="text-muted-foreground">Trade premium card editions with gems</p>
        </div>
      </div>

      {/* Currency Display */}
      <Card className="p-4 mb-6">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-game-gems" />
            <span className="font-medium">{gameStats.gems.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">Gems</span>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Marketplace</TabsTrigger>
          <TabsTrigger value="sell">List Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search marketplace..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={editionFilter} onValueChange={(value) => setEditionFilter(value as any)}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Edition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Editions</SelectItem>
                <SelectItem value={EditionType.NORMAL}>Normal</SelectItem>
                <SelectItem value={EditionType.PREMIUM}>Premium</SelectItem>
                <SelectItem value={EditionType.SPECIAL}>Special</SelectItem>
                <SelectItem value={EditionType.LIMITED}>Limited</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Edition Guide */}
          <Card className="p-4 mb-4 bg-gradient-to-r from-primary/10 to-secondary/10">
            <h3 className="font-semibold mb-2">Edition Guide</h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <Badge className={getEditionBadgeColor(EditionType.NORMAL)}>Normal</Badge>
                <p className="mt-1">Basic outfit, simple effects</p>
              </div>
              <div>
                <Badge className={getEditionBadgeColor(EditionType.PREMIUM)}>Premium</Badge>
                <p className="mt-1">Enhanced outfit, moderate effects</p>
              </div>
              <div>
                <Badge className={getEditionBadgeColor(EditionType.SPECIAL)}>Special</Badge>
                <p className="mt-1">Rare outfit, advanced effects</p>
              </div>
              <div>
                <Badge className={getEditionBadgeColor(EditionType.LIMITED)}>Limited</Badge>
                <p className="mt-1">Ultra-rare, exclusive effects</p>
              </div>
            </div>
          </Card>

          {/* Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredListings.map((listing) => {
              const priceStats = MarketplaceSystem.getCardPriceStats(listing.card.name, listing.card.edition);
              
              return (
                <Card key={listing.id} className="p-4 hover:shadow-lg transition-shadow">
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
                        <Badge className={getEditionBadgeColor(listing.card.edition)}>
                          {listing.card.edition}
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

                      {/* Price Statistics */}
                      {priceStats.totalListings > 1 && (
                        <div className="text-xs text-muted-foreground">
                          Avg: {Math.round(priceStats.averagePrice)} • Low: {priceStats.lowestPrice}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Gem className="w-4 h-4 text-game-gems" />
                          <span className="font-bold text-lg">{listing.price}</span>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleBuyCard(listing.id, listing)}
                          disabled={gameStats.gems < listing.price}
                        >
                          Buy
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">No listings found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sell" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">List Card for Gem Sale</h3>
            
            {/* Card Selection */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Card to Sell</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                  {tradableCards.map((card) => (
                    <div key={card.id} className="relative">
                      <HeroCard
                        hero={card}
                        size="small"
                        isSelected={selectedCard?.id === card.id}
                        onClick={() => setSelectedCard(card)}
                        showStats={false}
                      />
                      <Badge 
                        className={`absolute -top-1 -right-1 text-xs ${getEditionBadgeColor(card.edition)}`}
                      >
                        {card.edition.charAt(0).toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {selectedCard && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">
                      {selectedCard.name} 
                      <Badge className={`ml-2 ${getEditionBadgeColor(selectedCard.edition)}`}>
                        {selectedCard.edition}
                      </Badge>
                    </h4>
                    <p className="text-sm text-muted-foreground">Level {selectedCard.level}</p>
                  </div>

                  {/* Price Suggestion */}
                  {(() => {
                    const priceStats = MarketplaceSystem.getCardPriceStats(selectedCard.name, selectedCard.edition);
                    return priceStats.totalListings > 0 && (
                      <div className="p-3 bg-primary/10 rounded">
                        <p className="text-sm font-medium">Market Price Guide:</p>
                        <p className="text-sm">Average: {Math.round(priceStats.averagePrice)} gems</p>
                        <p className="text-sm">Range: {priceStats.lowestPrice} - {priceStats.highestPrice} gems</p>
                      </div>
                    );
                  })()}

                  <div>
                    <label className="text-sm font-medium mb-2 block">Price (Gems Only)</label>
                    <Input
                      type="number"
                      value={tradePrice}
                      onChange={(e) => setTradePrice(e.target.value)}
                      placeholder="Enter gem price"
                      min="1"
                    />
                  </div>

                  <Button onClick={handleListCard} className="w-full">
                    <Gem className="w-4 h-4 mr-2" />
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