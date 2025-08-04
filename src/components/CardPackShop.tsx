import { useState } from 'react';
import { HeroCard as HeroCardType, GameStats } from '@/types/game';
import { HeroCard } from './HeroCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Coins, Gem, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CardPackShopProps {
  gameStats: GameStats;
  onBack: () => void;
  onOpenPack: () => HeroCardType[];
  onSpendCoins: (amount: number) => boolean;
  onSpendGems: (amount: number) => boolean;
}

export function CardPackShop({ 
  gameStats, 
  onBack, 
  onOpenPack,
  onSpendCoins,
  onSpendGems 
}: CardPackShopProps) {
  const [openingPack, setOpeningPack] = useState(false);
  const [revealedCards, setRevealedCards] = useState<HeroCardType[]>([]);
  const [showCards, setShowCards] = useState(false);
  const { toast } = useToast();

  const packTypes = [
    {
      id: 'basic',
      name: 'Basic Pack',
      description: '2 cards with common-rare chances',
      cost: { coins: 300 },
      icon: Package,
      gradient: 'from-muted to-muted/70'
    },
    {
      id: 'premium',
      name: 'Premium Pack',
      description: '2 cards with guaranteed rare+',
      cost: { gems: 8 },
      icon: Sparkles,
      gradient: 'from-primary to-primary/70'
    },
    {
      id: 'legendary',
      name: 'Legendary Pack',
      description: '2 cards with guaranteed epic+',
      cost: { gems: 15 },
      icon: Gem,
      gradient: 'from-accent to-accent/70'
    }
  ];

  const handleOpenPack = async (packType: typeof packTypes[0]) => {
    // Check if player can afford
    if (packType.cost.coins && !onSpendCoins(packType.cost.coins)) {
      toast({
        title: "Insufficient Coins",
        description: `You need ${packType.cost.coins} coins`,
        variant: "destructive"
      });
      return;
    }

    if (packType.cost.gems && !onSpendGems(packType.cost.gems)) {
      toast({
        title: "Insufficient Gems",
        description: `You need ${packType.cost.gems} gems`,
        variant: "destructive"
      });
      return;
    }

    setOpeningPack(true);
    setShowCards(false);

    // Simulate pack opening animation
    setTimeout(() => {
      const newCards = onOpenPack();
      setRevealedCards(newCards);
      setOpeningPack(false);
      setShowCards(true);
      
      toast({
        title: "Pack Opened!",
        description: `You got ${newCards.length} new cards!`,
      });
    }, 2000);
  };

  const handleContinue = () => {
    setShowCards(false);
    setRevealedCards([]);
  };

  if (showCards && revealedCards.length > 0) {
    return (
      <div className="container mx-auto px-4 py-6 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 min-h-screen">
        <div className="text-center mb-8">
          <h2 className="gradient-text text-3xl font-bold mb-2 font-fantasy">🎉 Pack Opened! 🎉</h2>
          <p className="text-muted-foreground">You received these heroes:</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto mb-8">
          {revealedCards.map((card, index) => (
            <div
              key={card.id}
              className="animate-in slide-in-from-bottom duration-500"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <HeroCard hero={card} size="medium" />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button onClick={handleContinue} size="lg" className="btn-modern-primary">
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (openingPack) {
    return (
      <div className="container mx-auto px-4 py-6 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📦</div>
          <h2 className="gradient-text text-2xl font-bold mb-2 font-fantasy">Opening Pack...</h2>
          <p className="text-muted-foreground">Revealing your new heroes!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack} className="btn-modern-secondary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="gradient-text text-2xl font-bold font-fantasy">Card Pack Shop</h1>
          <p className="text-muted-foreground">
            Expand your collection with new heroes
          </p>
        </div>
      </div>

      {/* Currency Display */}
      <Card className="modern-card p-4 mb-6">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-accent" />
            <span className="font-medium text-accent">{gameStats.coins.toLocaleString()}</span>
            <span className="text-muted-foreground">Coins</span>
          </div>
          <div className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-primary" />
            <span className="font-medium text-primary">{gameStats.gems}</span>
            <span className="text-muted-foreground">Gems</span>
          </div>
        </div>
      </Card>

      {/* Pack Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {packTypes.map((pack) => {
          const IconComponent = pack.icon;
          const canAfford = pack.cost.coins ? 
            gameStats.coins >= pack.cost.coins : 
            gameStats.gems >= (pack.cost.gems || 0);

          return (
            <Card
              key={pack.id}
              className="relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${pack.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
              
              {/* Content */}
              <div className="relative z-10 p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className={`p-4 rounded-full bg-gradient-to-br ${pack.gradient}`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{pack.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {pack.description}
                </p>

                {/* Cost */}
                <div className="mb-4">
                  {pack.cost.coins && (
                    <Badge 
                      variant="outline" 
                      className="text-accent border-accent"
                    >
                      <Coins className="w-3 h-3 mr-1" />
                      {pack.cost.coins}
                    </Badge>
                  )}
                  {pack.cost.gems && (
                    <Badge 
                      variant="outline" 
                      className="text-primary border-primary"
                    >
                      <Gem className="w-3 h-3 mr-1" />
                      {pack.cost.gems}
                    </Badge>
                  )}
                </div>

                {/* Buy Button */}
                <Button
                  className={canAfford ? "btn-modern-primary w-full" : "btn-modern-secondary w-full"}
                  disabled={!canAfford}
                  onClick={() => handleOpenPack(pack)}
                >
                  {canAfford ? "Open Pack" : "Cannot Afford"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pack Opening Tips */}
      <Card className="modern-card mt-8 p-4 max-w-2xl mx-auto">
        <h4 className="font-semibold mb-2">💡 Pack Opening Tips</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• All packs now contain 2 cards for better value</li>
          <li>• Basic packs have a chance for rare heroes</li>
          <li>• Premium packs guarantee at least one rare+ hero</li>
          <li>• Legendary packs guarantee at least one epic+ hero</li>
          <li>• Earn coins by winning battles and completing campaigns</li>
          <li>• Earn gems through special events and achievements</li>
        </ul>
      </Card>
    </div>
  );
}