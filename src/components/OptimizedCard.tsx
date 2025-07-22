import React, { memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Optimized Card Types
export interface OptimizedGameCardProps {
  card?: {
    id: string;
    name: string;
    artwork: string;
    attack: number;
    health: number;
    cost: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    faction: 'flames' | 'depths' | 'guardians' | 'void';
    description: string;
    keywords?: string[];
  };
  isSelected?: boolean;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
  onCardSelect?: (cardId: string) => void;
  className?: string;
}

// Memoized Card Component
const OptimizedGameCard = memo<OptimizedGameCardProps>(({
  card,
  isSelected = false,
  size = 'medium',
  interactive = true,
  onCardSelect,
  className
}) => {
  const handleClick = useCallback(() => {
    if (interactive && card?.id && onCardSelect) {
      onCardSelect(card.id);
    }
  }, [interactive, card?.id, onCardSelect]);

  // Memoized styling calculations
  const styles = useMemo(() => {
    const sizeClasses = {
      small: 'w-20 h-28 text-xs',
      medium: 'w-28 h-40 text-sm',
      large: 'w-36 h-52 text-base'
    };

    const factionColors = {
      flames: 'from-orange-600 to-red-600',
      depths: 'from-blue-600 to-cyan-600',
      guardians: 'from-green-600 to-emerald-600',
      void: 'from-purple-600 to-violet-600'
    };

    const rarityBorders = {
      common: 'border-gray-500',
      rare: 'border-blue-500',
      epic: 'border-purple-500',
      legendary: 'border-yellow-500'
    };

    return {
      sizeClass: sizeClasses[size],
      factionGradient: card ? factionColors[card.faction] : factionColors.flames,
      rarityBorder: card ? rarityBorders[card.rarity] : rarityBorders.common
    };
  }, [size, card]);

  if (!card) {
    return (
      <div
        className={cn(
          "rounded-lg border-2 border-dashed border-gray-600 bg-gray-800/50",
          styles.sizeClass,
          "flex items-center justify-center text-gray-400",
          className
        )}
      >
        <span>Empty</span>
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        "relative rounded-lg border-2 overflow-hidden cursor-pointer",
        "bg-gradient-to-br from-gray-900 to-gray-800",
        styles.sizeClass,
        styles.rarityBorder,
        isSelected && "ring-2 ring-blue-400 scale-105",
        interactive && "hover:scale-105",
        className
      )}
      onClick={handleClick}
      whileHover={interactive ? { scale: 1.05 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      layout={false} // Disable layout animations for performance
    >
      {/* Optimized background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{ 
          backgroundImage: `url(${card.artwork})`,
          filter: 'brightness(0.8)'
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

      {/* Faction stripe */}
      <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", styles.factionGradient)} />

      {/* Cost */}
      <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
        {card.cost}
      </div>

      {/* Attack/Health */}
      <div className="absolute bottom-1 left-1 right-1 flex justify-between">
        <div className="w-5 h-5 bg-red-600 rounded text-white font-bold text-xs flex items-center justify-center">
          {card.attack}
        </div>
        <div className="w-5 h-5 bg-green-600 rounded text-white font-bold text-xs flex items-center justify-center">
          {card.health}
        </div>
      </div>

      {/* Card name */}
      <div className="absolute bottom-6 left-1 right-1 text-center">
        <h4 className="text-white font-semibold text-xs truncate drop-shadow-lg">
          {card.name}
        </h4>
      </div>

      {/* Rarity indicator */}
      <div className={cn(
        "absolute top-1 right-1 w-4 h-4 rounded-full border",
        card.rarity === 'legendary' && "bg-yellow-500 border-yellow-300",
        card.rarity === 'epic' && "bg-purple-500 border-purple-300", 
        card.rarity === 'rare' && "bg-blue-500 border-blue-300",
        card.rarity === 'common' && "bg-gray-500 border-gray-300"
      )} />
    </motion.div>
  );
});

OptimizedGameCard.displayName = "OptimizedGameCard";

// Optimized Collection Grid with Virtual Scrolling for large collections
const OptimizedCardGrid = memo<{
  cards: OptimizedGameCardProps['card'][];
  selectedCards?: string[];
  onCardSelect?: (cardId: string) => void;
  size?: OptimizedGameCardProps['size'];
  maxVisible?: number;
}>(({ cards, selectedCards = [], onCardSelect, size = 'medium', maxVisible = 20 }) => {
  // Only render visible cards for performance
  const visibleCards = useMemo(() => 
    cards.slice(0, maxVisible), 
    [cards, maxVisible]
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4">
      {visibleCards.map((card, index) => (
        <OptimizedGameCard
          key={card?.id || index}
          card={card}
          size={size}
          isSelected={selectedCards.includes(card?.id || '')}
          onCardSelect={onCardSelect}
        />
      ))}
    </div>
  );
});

OptimizedCardGrid.displayName = "OptimizedCardGrid";

// Lightweight Card Components for UI
const OptimizedCard = memo<React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }) => (
  <div
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow",
      "bg-gray-900/90 border-gray-700/50",
      className
    )}
    {...props}
  >
    {children}
  </div>
));

const OptimizedCardHeader = memo<React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-4", className)} {...props}>
    {children}
  </div>
));

const OptimizedCardTitle = memo<React.HTMLAttributes<HTMLHeadingElement>>(({ className, children, ...props }) => (
  <h3
    className={cn("text-lg font-semibold leading-none tracking-tight text-white", className)}
    {...props}
  >
    {children}
  </h3>
));

const OptimizedCardContent = memo<React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }) => (
  <div className={cn("p-4 pt-0", className)} {...props}>
    {children}
  </div>
));

OptimizedCard.displayName = "OptimizedCard";
OptimizedCardHeader.displayName = "OptimizedCardHeader"; 
OptimizedCardTitle.displayName = "OptimizedCardTitle";
OptimizedCardContent.displayName = "OptimizedCardContent";

export {
  OptimizedGameCard,
  OptimizedCardGrid,
  OptimizedCard,
  OptimizedCardHeader,
  OptimizedCardTitle,
  OptimizedCardContent
};