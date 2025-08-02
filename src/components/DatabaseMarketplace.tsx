import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Search, Gem, Clock, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';
import { HeroCard as HeroCardType, EditionType } from '@/types/game';
import { supabase } from '@/integrations/supabase/client';

interface DatabaseMarketplaceProps {
  collection: HeroCardType[];
  gameStats: any;
  userProfile: any;
  onBack: () => void;
  onTradeCard: (cardId: string, price: number, currency: 'gems') => void;
  onBuyCard: (card: HeroCardType, price: number) => void;
}

export const DatabaseMarketplace: React.FC<DatabaseMarketplaceProps> = ({ 
  collection, 
  gameStats, 
  userProfile,
  onBack, 
  onTradeCard, 
  onBuyCard 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState<HeroCardType | null>(null);
  const [tradePrice, setTradePrice] = useState<number>(100);
  const [editionFilter, setEditionFilter] = useState<EditionType | 'all'>('all');
  const [activeListings, setActiveListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load active listings from database
  useEffect(() => {
    loadActiveListings();
  }, []);

  const loadActiveListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select(`
          *,
          profiles!seller_id(display_name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActiveListings(data || []);
    } catch (error) {
      console.error('Error loading listings:', error);
      toast.error('Failed to load marketplace listings');
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = activeListings.filter(listing => {
    const matchesSearch = listing.card_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEdition = editionFilter === 'all' || listing.card_edition === editionFilter;
    return matchesSearch && matchesEdition;
  });

  const tradableCards = collection.filter(card => card.unlocked);

  const handleListCard = async () => {
    if (!selectedCard || !userProfile) return;
    
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to list cards');
        return;
      }

      const { error } = await supabase
        .from('marketplace_listings')
        .insert({
          seller_id: user.id,
          card_id: selectedCard.id,
          card_name: selectedCard.name,
          card_rarity: selectedCard.rarity,
          card_edition: selectedCard.edition,
          price: tradePrice,
          currency: 'gems'
        });

      if (error) throw error;

      onTradeCard(selectedCard.id, tradePrice, 'gems');
      await loadActiveListings();
      setSelectedCard(null);
      
      toast.success(`Listed ${selectedCard.name} for ${tradePrice} gems!`);
    } catch (error) {
      console.error('Error listing card:', error);
      toast.error('Failed to list card');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyCard = async (listingId: string, listing: any) => {
    if (!userProfile) {
      toast.error('Please log in to buy cards');
      return;
    }

    if (userProfile.gem_balance < listing.price) {
      toast.error('Insufficient gems');
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to buy cards');
        return;
      }

      // Update listing status to sold
      const { error: listingError } = await supabase
        .from('marketplace_listings')
        .update({ status: 'sold' })
        .eq('id', listingId);

      if (listingError) throw listingError;

      // Create card object for onBuyCard callback
      const card: HeroCardType = {
        id: listing.card_id,
        name: listing.card_name,
        rarity: listing.card_rarity,
        edition: listing.card_edition,
        baseAttack: 100, // Default values
        baseHP: 100,
        level: 1,
        experience: 0,
        experienceToNext: 100,
        unlocked: true
      };

      onBuyCard(card, listing.price);
      await loadActiveListings();
      
      toast.success(`Purchased ${listing.card_name} for ${listing.price} gems!`);
    } catch (error) {
      console.error('Error buying card:', error);
      toast.error('Failed to purchase card');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeRemaining = (createdAt: Date): string => {
    const now = new Date();
    const created = new Date(createdAt);
    const hoursDiff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
    const remaining = Math.max(0, 24 - hoursDiff);
    
    if (remaining > 0) {
      return `${remaining}h remaining`;
    }
    return 'Expired';
  };

  const getEditionBadgeColor = (edition: EditionType) => {
    switch (edition) {
      case EditionType.LIMITED:
        return 'border-yellow-400 text-yellow-400';
      case EditionType.SPECIAL:
        return 'border-purple-400 text-purple-400';
      case EditionType.PREMIUM:
        return 'border-blue-400 text-blue-400';
      default:
        return 'border-gray-400 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-slate-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">💎 Gem Marketplace</h1>
            <p className="text-slate-400">Buy and sell cards with gems</p>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Currency Display */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-purple-400" />
            <span className="text-white font-medium">{userProfile?.gem_balance || 0} Gems</span>
          </div>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
            <TabsTrigger value="browse" className="text-white data-[state=active]:bg-slate-700">
              Browse Marketplace
            </TabsTrigger>
            <TabsTrigger value="sell" className="text-white data-[state=active]:bg-slate-700">
              List Cards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            {/* Search and Filters */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search marketplace..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <Select value={editionFilter} onValueChange={(value) => setEditionFilter(value as any)}>
                <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Edition" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Editions</SelectItem>
                  <SelectItem value={EditionType.NORMAL}>Normal</SelectItem>
                  <SelectItem value={EditionType.PREMIUM}>Premium</SelectItem>
                  <SelectItem value={EditionType.SPECIAL}>Special</SelectItem>
                  <SelectItem value={EditionType.LIMITED}>Limited</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Edition Guide */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Edition Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Badge variant="outline" className={getEditionBadgeColor(EditionType.NORMAL)}>
                      Normal
                    </Badge>
                    <p className="mt-1 text-slate-400">Basic edition cards</p>
                  </div>
                  <div>
                    <Badge variant="outline" className={getEditionBadgeColor(EditionType.PREMIUM)}>
                      Premium
                    </Badge>
                    <p className="mt-1 text-slate-400">Enhanced visual effects</p>
                  </div>
                  <div>
                    <Badge variant="outline" className={getEditionBadgeColor(EditionType.SPECIAL)}>
                      Special
                    </Badge>
                    <p className="mt-1 text-slate-400">Rare animated effects</p>
                  </div>
                  <div>
                    <Badge variant="outline" className={getEditionBadgeColor(EditionType.LIMITED)}>
                      Limited
                    </Badge>
                    <p className="mt-1 text-slate-400">Ultra-rare exclusive cards</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-24 bg-slate-700 rounded mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                filteredListings.map((listing) => (
                  <Card key={listing.id} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-white font-semibold">{listing.card_name}</h3>
                          <p className="text-slate-400 text-sm">
                            Sold by {listing.profiles?.display_name || 'Player'}
                          </p>
                        </div>
                        <Badge variant="outline" className={getEditionBadgeColor(listing.card_edition)}>
                          {listing.card_edition}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {listing.card_rarity}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-400 text-sm">
                            {formatTimeRemaining(new Date(listing.created_at))}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Gem className="h-4 w-4 text-purple-400" />
                          <span className="text-white font-bold">{listing.price}</span>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleBuyCard(listing.id, listing)}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={loading || (userProfile?.gem_balance || 0) < listing.price}
                        >
                          {(userProfile?.gem_balance || 0) < listing.price ? 'Insufficient Gems' : 'Buy Now'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {!loading && filteredListings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-lg font-semibold mb-2 text-white">No listings found</h3>
                <p className="text-slate-400">Try adjusting your search or check back later</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">List Card for Sale</CardTitle>
                <CardDescription className="text-slate-400">
                  Select a card from your collection and set a price
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Card Selection */}
                  <div>
                    <label className="text-sm font-medium mb-2 block text-white">Select Card to Sell</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                      {tradableCards.map((card) => (
                        <div 
                          key={card.id} 
                          className={`relative cursor-pointer rounded border-2 transition-colors ${
                            selectedCard?.id === card.id 
                              ? 'border-blue-400' 
                              : 'border-transparent hover:border-slate-600'
                          }`}
                          onClick={() => setSelectedCard(card)}
                        >
                          <div className="aspect-[3/4] bg-slate-700 rounded flex items-center justify-center">
                            <span className="text-xs text-center p-2 text-white">{card.name}</span>
                          </div>
                          <Badge 
                            variant="outline"
                            className={`absolute -top-1 -right-1 text-xs ${getEditionBadgeColor(card.edition)}`}
                          >
                            {card.edition.charAt(0).toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedCard && (
                    <div className="space-y-4 p-4 bg-slate-700/50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-white">
                          {selectedCard.name}
                          <Badge 
                            variant="outline" 
                            className={`ml-2 ${getEditionBadgeColor(selectedCard.edition)}`}
                          >
                            {selectedCard.edition}
                          </Badge>
                        </h4>
                        <p className="text-sm text-slate-400">Level {selectedCard.level}</p>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block text-white">Price (Gems)</label>
                        <Input
                          type="number"
                          value={tradePrice}
                          onChange={(e) => setTradePrice(Number(e.target.value))}
                          placeholder="Enter gem price"
                          min="1"
                          className="bg-slate-800 border-slate-600 text-white"
                        />
                      </div>

                      <Button 
                        onClick={handleListCard}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={loading || !userProfile}
                      >
                        <Gem className="w-4 h-4 mr-2" />
                        {loading ? 'Listing...' : `List for ${tradePrice} Gems`}
                      </Button>
                    </div>
                  )}
                </div>

                {tradableCards.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📦</div>
                    <h3 className="text-lg font-semibold mb-2 text-white">No tradable cards</h3>
                    <p className="text-slate-400">Open card packs to get cards to trade</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};