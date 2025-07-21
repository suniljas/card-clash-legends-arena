import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { HeroCard as HeroCardType, Rarity } from '@/types/game';
import { HeroCard } from './HeroCard';
import { AnimatedButton, ParticleSystem } from './PremiumAnimations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  Star,
  Zap,
  Eye,
  Play,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedCollectionManagerProps {
  collection: HeroCardType[];
  onBack: () => void;
  onCardSelect?: (card: HeroCardType) => void;
  onTestDeck?: () => void;
  mode?: 'collection' | 'deck-builder';
}

export function EnhancedCollectionManager({ 
  collection, 
  onBack, 
  onCardSelect,
  onTestDeck,
  mode = 'collection'
}: EnhancedCollectionManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<Rarity | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'rarity' | 'power' | 'level'>('rarity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCard, setSelectedCard] = useState<HeroCardType | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState(50);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setVisibleCards(prev => Math.min(prev + 20, filteredCollection.length));
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const rarities: (Rarity | 'all')[] = ['all', ...Object.values(Rarity)];

  const filteredCollection = useMemo(() => {
    let filtered = collection.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.abilityName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRarity = selectedRarity === 'all' || card.rarity === selectedRarity;
      return matchesSearch && matchesRarity;
    });

    // Sort cards
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'power':
          return (b.baseAttack + b.baseHP) - (a.baseAttack + a.baseHP);
        case 'level':
          return b.level - a.level;
        case 'rarity':
          const rarityOrder = { 
            'ultra-legend': 6, 
            'legend': 5, 
            'epic': 4, 
            'rare': 3, 
            'uncommon': 2, 
            'common': 1 
          };
          return (rarityOrder[b.rarity as keyof typeof rarityOrder] || 0) - 
                 (rarityOrder[a.rarity as keyof typeof rarityOrder] || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [collection, searchTerm, selectedRarity, sortBy]);

  const rarityStats = useMemo(() => {
    return Object.values(Rarity).reduce((stats, rarity) => {
      stats[rarity] = collection.filter(card => card.rarity === rarity).length;
      return stats;
    }, {} as Record<Rarity, number>);
  }, [collection]);

  const handleCardClick = useCallback((card: HeroCardType) => {
    setSelectedCard(card);
    onCardSelect?.(card);
  }, [onCardSelect]);

  const getRarityColor = (rarity: Rarity) => {
    const colors = {
      [Rarity.COMMON]: 'text-rarity-common border-rarity-common',
      [Rarity.UNCOMMON]: 'text-rarity-uncommon border-rarity-uncommon',
      [Rarity.RARE]: 'text-rarity-rare border-rarity-rare',
      [Rarity.EPIC]: 'text-rarity-epic border-rarity-epic',
      [Rarity.LEGEND]: 'text-rarity-legend border-rarity-legend',
      [Rarity.ULTRA_LEGEND]: 'text-rarity-ultra-legend border-rarity-ultra-legend'
    };
    return colors[rarity] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 relative overflow-hidden">
      {/* Ambient Effects */}
      <ParticleSystem type="sparkles" intensity="low" className="opacity-20" />

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Enhanced Header */}
        <div className="flex items-center gap-4 mb-6">
          <AnimatedButton
            variant="secondary"
            size="sm"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </AnimatedButton>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {mode === 'collection' ? '📚 Hero Collection' : '🛠️ Deck Builder'}
            </h1>
            <p className="text-muted-foreground">
              {collection.length} heroes collected • {filteredCollection.length} shown
            </p>
          </div>
          {mode === 'deck-builder' && onTestDeck && (
            <AnimatedButton
              variant="premium"
              size="sm"
              onClick={onTestDeck}
            >
              <Play className="w-4 h-4 mr-2" />
              Test Deck
            </AnimatedButton>
          )}
        </div>

        {/* Enhanced Stats Overview */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-card/80 to-primary/5 backdrop-blur-sm border-primary/20">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Collection Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {Object.entries(rarityStats).map(([rarity, count]) => (
              <div
                key={rarity}
                className={cn(
                  'text-center p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer',
                  'hover:scale-105 hover:shadow-lg',
                  selectedRarity === rarity 
                    ? 'bg-primary/20 border-primary' 
                    : 'bg-muted/20 border-muted',
                  getRarityColor(rarity as Rarity)
                )}
                onClick={() => setSelectedRarity(selectedRarity === rarity ? 'all' : rarity as Rarity)}
              >
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs capitalize">{rarity.replace('-', ' ')}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Enhanced Filters */}
        <Card className="p-4 mb-6 bg-card/80 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search heroes by name or ability..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2 items-center">
              <Filter className="w-4 h-4 text-muted-foreground" />
              
              {/* Rarity Filter */}
              <div className="flex gap-1">
                {rarities.map(rarity => (
                  <Button
                    key={rarity}
                    variant={selectedRarity === rarity ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRarity(rarity)}
                    className={cn(
                      'capitalize text-xs',
                      selectedRarity === rarity && rarity !== 'all' && 
                      getRarityColor(rarity as Rarity)
                    )}
                  >
                    {rarity === 'all' ? 'All' : rarity.replace('-', ' ')}
                  </Button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 rounded-md border border-input bg-background text-sm"
              >
                <option value="rarity">Sort by Rarity</option>
                <option value="name">Sort by Name</option>
                <option value="power">Sort by Power</option>
                <option value="level">Sort by Level</option>
              </select>

              {/* View Mode */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Enhanced Collection Display */}
        <div 
          ref={scrollRef}
          className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
        >
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredCollection.slice(0, visibleCards).map((card) => (
                <div
                  key={card.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Enhanced Card with Hover Effects */}
                  <div className={cn(
                    'transition-all duration-300 cursor-pointer',
                    hoveredCard === card.id && 'scale-105 z-10',
                    selectedCard?.id === card.id && 'ring-2 ring-primary'
                  )}>
                    <HeroCard
                      hero={card}
                      size="medium"
                      onClick={() => handleCardClick(card)}
                      isSelected={selectedCard?.id === card.id}
                    />
                  </div>

                  {/* Quick Actions Overlay */}
                  {hoveredCard === card.id && (
                    <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(card);
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        {mode === 'deck-builder' && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCardSelect?.(card);
                            }}
                          >
                            <Zap className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rarity Glow Effect */}
                  {(card.rarity === Rarity.LEGEND || card.rarity === Rarity.ULTRA_LEGEND) && (
                    <div className="absolute inset-0 rounded-lg animate-pulse-glow opacity-30 pointer-events-none" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCollection.slice(0, visibleCards).map((card) => (
                <Card
                  key={card.id}
                  className={cn(
                    'p-4 cursor-pointer transition-all duration-300 hover:shadow-lg',
                    selectedCard?.id === card.id && 'ring-2 ring-primary bg-primary/5'
                  )}
                  onClick={() => handleCardClick(card)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 flex-shrink-0">
                      <HeroCard hero={card} size="small" showStats={false} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{card.name}</h3>
                        <Badge 
                          variant="outline"
                          className={cn('capitalize', getRarityColor(card.rarity))}
                        >
                          {card.rarity.replace('-', ' ')}
                        </Badge>
                        <Badge variant="secondary">Lv.{card.level}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {card.abilityDescription}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Sword className="w-3 h-3 text-game-attack" />
                          {card.baseAttack + (card.level * 10)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-game-health" />
                          {card.baseHP + (card.level * 15)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-game-experience" />
                          {card.experience}/{card.experienceToNext}
                        </span>
                      </div>
                    </div>
                    {mode === 'deck-builder' && (
                      <AnimatedButton
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCardSelect?.(card);
                        }}
                      >
                        Add to Deck
                      </AnimatedButton>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Loading More Indicator */}
          {visibleCards < filteredCollection.length && (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredCollection.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No heroes found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <AnimatedButton
              variant="secondary"
              onClick={() => {
                setSearchTerm('');
                setSelectedRarity('all');
              }}
            >
              Clear Filters
            </AnimatedButton>
          </div>
        )}

        {/* Enhanced Card Details Modal */}
        {selectedCard && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-6 bg-gradient-to-br from-card to-primary/5 border-primary/30">
              <div className="text-center mb-4">
                <HeroCard hero={selectedCard} size="large" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{selectedCard.name}</h3>
                  <Badge 
                    variant="outline"
                    className={cn('capitalize mb-2', getRarityColor(selectedCard.rarity))}
                  >
                    {selectedCard.rarity.replace('-', ' ')}
                  </Badge>
                </div>

                {selectedCard.abilityDescription && (
                  <div>
                    <h4 className="font-semibold text-primary mb-1">{selectedCard.abilityName}</h4>
                    <p className="text-sm text-muted-foreground">{selectedCard.abilityDescription}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-2 bg-muted/20 rounded">
                    <div className="font-bold text-game-attack">{selectedCard.baseAttack + (selectedCard.level * 10)}</div>
                    <div className="text-xs text-muted-foreground">Attack</div>
                  </div>
                  <div className="text-center p-2 bg-muted/20 rounded">
                    <div className="font-bold text-game-health">{selectedCard.baseHP + (selectedCard.level * 15)}</div>
                    <div className="text-xs text-muted-foreground">Health</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <AnimatedButton
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedCard(null)}
                  >
                    Close
                  </AnimatedButton>
                  {mode === 'deck-builder' && (
                    <AnimatedButton
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        onCardSelect?.(selectedCard);
                        setSelectedCard(null);
                      }}
                    >
                      Add to Deck
                    </AnimatedButton>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}