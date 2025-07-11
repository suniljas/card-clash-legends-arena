import { memo, useState, useEffect, useMemo } from 'react';
import { HeroCard } from './HeroCard';
import { HeroCard as HeroCardType } from '@/types/game';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OptimizedCardGridProps {
  cards: HeroCardType[];
  onCardClick?: (card: HeroCardType) => void;
  selectedCards?: string[];
  itemsPerPage?: number;
  className?: string;
}

export const OptimizedCardGrid = memo(function OptimizedCardGrid({
  cards,
  onCardClick,
  selectedCards = [],
  itemsPerPage = 8,
  className = ""
}: OptimizedCardGridProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleCards, setVisibleCards] = useState<HeroCardType[]>([]);

  const totalPages = Math.ceil(cards.length / itemsPerPage);

  // Virtualization - only render visible cards
  useEffect(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setVisibleCards(cards.slice(startIndex, endIndex));
  }, [cards, currentPage, itemsPerPage]);

  const memoizedCards = useMemo(() => {
    return visibleCards.map((card, index) => (
      <div
        key={card.id}
        className={`transition-all duration-200 hover:scale-105 cursor-pointer ${
          selectedCards.includes(card.id) ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => onCardClick?.(card)}
        style={{
          animationDelay: `${index * 50}ms`
        }}
      >
        <HeroCard 
          hero={card} 
          size="medium"
        />
      </div>
    ));
  }, [visibleCards, selectedCards, onCardClick]);

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No cards to display</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {memoizedCards}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="touch-target"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageIndex;
              if (totalPages <= 5) {
                pageIndex = i;
              } else if (currentPage < 3) {
                pageIndex = i;
              } else if (currentPage >= totalPages - 3) {
                pageIndex = totalPages - 5 + i;
              } else {
                pageIndex = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageIndex}
                  variant={currentPage === pageIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageIndex)}
                  className="w-10 h-10 touch-target"
                >
                  {pageIndex + 1}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="touch-target"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Page Info */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, cards.length)} of {cards.length} cards
      </div>
    </div>
  );
});