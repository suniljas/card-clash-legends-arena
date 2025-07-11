import { useMemo, useState, useCallback } from 'react';
import { HeroCard as HeroCardType } from '@/types/game';
import { HeroCard } from './HeroCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

interface OptimizedCardGridProps {
  cards: HeroCardType[];
  onCardClick?: (card: HeroCardType) => void;
  selectedCards?: string[];
  showSearch?: boolean;
  showFilters?: boolean;
  maxVisible?: number;
}

export function OptimizedCardGrid({ 
  cards, 
  onCardClick, 
  selectedCards = [], 
  showSearch = true,
  showFilters = true,
  maxVisible = 50
}: OptimizedCardGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [visibleCount, setVisibleCount] = useState(maxVisible);
  const { cardClassName } = usePerformanceOptimization();

  // Memoized filtering and sorting
  const filteredAndSortedCards = useMemo(() => {
    let filtered = cards;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.abilityName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rarity filter
    if (rarityFilter !== 'all') {
      filtered = filtered.filter(card => card.rarity === rarityFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'power':
          return b.baseAttack - a.baseAttack;
        case 'level':
          return b.level - a.level;
        case 'rarity':
          const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legend: 5, 'ultra-legend': 6 };
          return (rarityOrder[b.rarity as keyof typeof rarityOrder] || 0) - (rarityOrder[a.rarity as keyof typeof rarityOrder] || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [cards, searchTerm, rarityFilter, sortBy]);

  // Virtualized rendering - only render visible cards
  const visibleCards = useMemo(() => 
    filteredAndSortedCards.slice(0, visibleCount),
    [filteredAndSortedCards, visibleCount]
  );

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 20, filteredAndSortedCards.length));
  }, [filteredAndSortedCards.length]);

  const rarities = useMemo(() => 
    [...new Set(cards.map(card => card.rarity))],
    [cards]
  );

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="flex flex-col sm:flex-row gap-4">
          {showSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
          
          {showFilters && (
            <div className="flex gap-2">
              <Select value={rarityFilter} onValueChange={setRarityFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Rarity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rarities</SelectItem>
                  {rarities.map(rarity => (
                    <SelectItem key={rarity} value={rarity}>
                      {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="power">Power</SelectItem>
                  <SelectItem value="level">Level</SelectItem>
                  <SelectItem value="rarity">Rarity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <Badge variant="outline">
          {filteredAndSortedCards.length} card{filteredAndSortedCards.length !== 1 ? 's' : ''}
        </Badge>
        {visibleCount < filteredAndSortedCards.length && (
          <button 
            onClick={loadMore}
            className="text-sm text-primary hover:underline"
          >
            Load more ({filteredAndSortedCards.length - visibleCount} remaining)
          </button>
        )}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {visibleCards.map((card) => (
          <div
            key={card.id}
            className={cardClassName}
            onClick={() => onCardClick?.(card)}
          >
            <HeroCard
              hero={card}
              size="small"
              isSelected={selectedCards.includes(card.id)}
            />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredAndSortedCards.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold mb-2">No cards found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Lazy loading trigger */}
      {visibleCount < filteredAndSortedCards.length && (
        <div className="h-20 flex items-center justify-center">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
}