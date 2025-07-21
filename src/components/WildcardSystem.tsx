import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Sparkles, Star, Package, Recycle } from 'lucide-react';
import { EthicalEconomySystem, Wildcard, WildcardRarity } from '@/services/ethicalEconomySystem';
import { useToast } from '@/hooks/use-toast';

interface WildcardSystemProps {
  onBack: () => void;
}

export function WildcardSystem({ onBack }: WildcardSystemProps) {
  const [economySystem] = useState(new EthicalEconomySystem());
  const [craftingMaterials, setCraftingMaterials] = useState(economySystem.getCraftingMaterials());
  const [availableWildcards, setAvailableWildcards] = useState(economySystem.getAvailableWildcards());
  const [selectedDuplicates, setSelectedDuplicates] = useState<string[]>([]);
  
  const { toast } = useToast();

  // Mock duplicate cards for demonstration
  const duplicateCards = [
    { id: 'forest-ranger-dup-1', name: 'Forest Ranger', rarity: 'common' as WildcardRarity },
    { id: 'village-mage-dup-1', name: 'Village Mage', rarity: 'common' as WildcardRarity },
    { id: 'steel-knight-dup-1', name: 'Steel Knight', rarity: 'rare' as WildcardRarity },
    { id: 'fire-archer-dup-1', name: 'Fire Archer', rarity: 'rare' as WildcardRarity },
  ];

  const handleDustCards = () => {
    let totalShards = 0;
    let totalEssence = 0;

    selectedDuplicates.forEach(cardId => {
      const card = duplicateCards.find(c => c.id === cardId);
      if (card) {
        const materials = economySystem.handleDuplicateCard(card.id, card.rarity);
        totalShards += materials.shards;
        totalEssence += materials.wildcardEssence;
      }
    });

    setCraftingMaterials(economySystem.getCraftingMaterials());
    setSelectedDuplicates([]);

    toast({
      title: "Cards Dusted Successfully!",
      description: `Gained ${totalShards} Shards${totalEssence > 0 ? ` and ${totalEssence} Wildcard Essence` : ''}`,
    });
  };

  const handleCraftWildcard = (rarity: WildcardRarity) => {
    const wildcard = economySystem.craftWildcard(rarity);
    
    if (wildcard) {
      setCraftingMaterials(economySystem.getCraftingMaterials());
      setAvailableWildcards(economySystem.getAvailableWildcards());
      
      toast({
        title: "Wildcard Crafted!",
        description: `You now have a ${rarity} wildcard ready to redeem.`,
      });
    } else {
      toast({
        title: "Insufficient Materials",
        description: "You don't have enough resources to craft this wildcard.",
        variant: "destructive"
      });
    }
  };

  const getRarityColor = (rarity: WildcardRarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 border-gray-300';
      case 'rare': return 'text-blue-600 border-blue-300';
      case 'epic': return 'text-purple-600 border-purple-300';
      case 'legendary': return 'text-orange-600 border-orange-300';
    }
  };

  const craftingCosts = {
    common: { shards: 100, essence: 0 },
    rare: { shards: 300, essence: 10 },
    epic: { shards: 800, essence: 25 },
    legendary: { shards: 2000, essence: 50 }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Collection
          </Button>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Shards</p>
              <p className="font-bold text-lg">{craftingMaterials.shards}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Wildcard Essence</p>
              <p className="font-bold text-lg">{craftingMaterials.wildcardEssence}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Ethical Wildcard System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">How It Works</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• <strong>Dust duplicate cards</strong> to get Shards and Wildcard Essence</li>
                  <li>• <strong>Craft Wildcards</strong> using your materials</li>
                  <li>• <strong>Redeem Wildcards</strong> for any card of the same rarity</li>
                  <li>• <strong>No trading required</strong> - build your collection at your own pace</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="dust" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dust" className="flex items-center gap-2">
                <Recycle className="h-4 w-4" />
                Dust Cards
              </TabsTrigger>
              <TabsTrigger value="craft" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Craft Wildcards
              </TabsTrigger>
              <TabsTrigger value="collection" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Your Wildcards
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dust" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dust Duplicate Cards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Select duplicate cards to convert into crafting materials. 
                      Higher rarity cards give more Shards and Wildcard Essence.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {duplicateCards.map((card) => (
                        <div 
                          key={card.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedDuplicates.includes(card.id) 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => {
                            setSelectedDuplicates(prev => 
                              prev.includes(card.id) 
                                ? prev.filter(id => id !== card.id)
                                : [...prev, card.id]
                            );
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold">{card.name}</h4>
                              <Badge variant="outline" className={getRarityColor(card.rarity)}>
                                {card.rarity}
                              </Badge>
                            </div>
                            <div className="text-right text-sm">
                              <p>+{card.rarity === 'common' ? 10 : card.rarity === 'rare' ? 30 : card.rarity === 'epic' ? 80 : 200} Shards</p>
                              {(card.rarity === 'epic' || card.rarity === 'legendary') && (
                                <p className="text-purple-600">+{card.rarity === 'epic' ? 2 : 5} Essence</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedDuplicates.length > 0 && (
                      <Button onClick={handleDustCards} className="w-full">
                        Dust {selectedDuplicates.length} Card{selectedDuplicates.length > 1 ? 's' : ''}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="craft" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(['common', 'rare', 'epic', 'legendary'] as WildcardRarity[]).map((rarity) => {
                  const cost = craftingCosts[rarity];
                  const canCraft = economySystem.canCraftWildcard(rarity);
                  
                  return (
                    <Card key={rarity} className={`${getRarityColor(rarity)} border-2`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-center capitalize">
                          {rarity} Wildcard
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center space-y-2">
                          <div className="text-sm">
                            <p>Cost: {cost.shards} Shards</p>
                            {cost.essence > 0 && (
                              <p>{cost.essence} Wildcard Essence</p>
                            )}
                          </div>
                          
                          <Progress 
                            value={Math.min(100, (craftingMaterials.shards / cost.shards) * 100)}
                            className="h-2"
                          />
                          
                          {cost.essence > 0 && (
                            <Progress 
                              value={Math.min(100, (craftingMaterials.wildcardEssence / cost.essence) * 100)}
                              className="h-2"
                            />
                          )}
                        </div>
                        
                        <Button 
                          onClick={() => handleCraftWildcard(rarity)}
                          disabled={!canCraft}
                          className="w-full"
                          size="sm"
                        >
                          Craft
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="collection" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Wildcard Collection</CardTitle>
                </CardHeader>
                <CardContent>
                  {availableWildcards.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No wildcards available.</p>
                      <p className="text-sm text-muted-foreground">Craft wildcards to add cards to your collection!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {availableWildcards.map((wildcard) => (
                        <Card key={wildcard.id} className={`${getRarityColor(wildcard.rarity)} border-2`}>
                          <CardContent className="p-4 text-center">
                            <Star className="h-8 w-8 mx-auto mb-2" />
                            <h4 className="font-semibold capitalize">{wildcard.rarity} Wildcard</h4>
                            <p className="text-xs text-muted-foreground mb-3">
                              Created {wildcard.createdAt.toLocaleDateString()}
                            </p>
                            <Button size="sm" className="w-full">
                              Redeem for Card
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}