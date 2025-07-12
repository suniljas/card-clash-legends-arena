import { HeroCard as HeroCardType, Rarity } from '@/types/game';
import { calculateHeroStats, RARITY_COLORS } from '@/data/heroes';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useGameAudio } from '@/hooks/useAudio';

interface HeroCardProps {
  hero: HeroCardType;
  onClick?: () => void;
  isSelected?: boolean;
  showStats?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function HeroCard({ 
  hero, 
  onClick, 
  isSelected = false, 
  showStats = true,
  size = 'medium' 
}: HeroCardProps) {
  const stats = calculateHeroStats(hero);
  const { playCardPlay } = useGameAudio();
  
  const sizeClasses = {
    small: 'w-24 h-32',
    medium: 'w-40 h-56',
    large: 'w-48 h-64'
  };

  const getRarityEffects = (rarity: Rarity) => {
    const baseClasses = 'card-metallic transition-all duration-300';
    
    switch (rarity) {
      case Rarity.COMMON:
        return `${baseClasses} rarity-common`;
      case Rarity.UNCOMMON:
        return `${baseClasses} rarity-uncommon`;
      case Rarity.RARE:
        return `${baseClasses} rarity-rare foil-shine card-3d`;
      case Rarity.EPIC:
        return `${baseClasses} rarity-epic foil-shine card-3d corner-gems`;
      case Rarity.LEGEND:
        return `${baseClasses} rarity-legend foil-shine card-3d corner-gems animate-card-tilt`;
      case Rarity.ULTRA_LEGEND:
        return `${baseClasses} rarity-ultra-legend foil-shine card-3d corner-gems animate-divine-pulse divine-glow`;
      default:
        return baseClasses;
    }
  };

  const handleClick = () => {
    playCardPlay();
    onClick?.();
  };

  return (
    <Card 
      className={cn(
        'relative cursor-pointer overflow-hidden group gpu-accelerated',
        sizeClasses[size],
        getRarityEffects(hero.rarity),
        isSelected && 'ring-4 ring-primary scale-110 z-20',
        'hover:scale-110 hover:z-10 transform-gpu'
      )}
      onClick={handleClick}
    >
      {/* Premium Rarity Frame */}
      <div className="absolute inset-0 p-[2px] rounded-lg">
        <div className={cn(
          'w-full h-full rounded-md border-2',
          `border-rarity-${hero.rarity.toLowerCase().replace('_', '-')}`,
          hero.rarity === Rarity.ULTRA_LEGEND && 'animate-foil-rainbow'
        )} />
      </div>
      
      {/* Metallic Background */}
      <div className="absolute inset-[3px] bg-gradient-to-br from-card via-card/95 to-muted/50 rounded-md" />

      {/* Card Content */}
      <div className="relative z-10 p-3 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <Badge 
            variant="outline" 
            className={cn(
              'text-xs capitalize border-current',
              `text-${RARITY_COLORS[hero.rarity]}`
            )}
          >
            {hero.rarity}
          </Badge>
          <div className="text-xs text-muted-foreground">
            Lv.{hero.level}
          </div>
        </div>

        {/* Hero Image with Premium Effects */}
        <div className="flex-1 bg-gradient-to-br from-muted to-muted/50 rounded-md mb-2 flex items-center justify-center overflow-hidden relative group">
          {hero.imageUrl ? (
            <img 
              src={hero.imageUrl} 
              alt={hero.name}
              className="w-full h-full object-cover rounded-md crisp-edges group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className={cn(
              "text-2xl transition-all duration-300",
              hero.rarity === Rarity.ULTRA_LEGEND && 'text-glow animate-float'
            )}>⚔️</div>
          )}
          
          {/* Advanced Holographic Overlays */}
          {hero.rarity === Rarity.RARE && (
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-rarity-rare/10 to-transparent opacity-60" />
          )}
          {hero.rarity === Rarity.EPIC && (
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-rarity-epic/15 to-transparent animate-shimmer opacity-70" />
          )}
          {hero.rarity === Rarity.LEGEND && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rarity-legend/20 via-accent/10 to-transparent animate-shimmer opacity-80" />
          )}
          {hero.rarity === Rarity.ULTRA_LEGEND && (
            <div className="absolute inset-0 holographic animate-divine-pulse opacity-90" />
          )}
        </div>

        {/* Hero Name with Premium Typography */}
        <h3 className={cn(
          "font-bold text-sm text-center mb-2 text-foreground",
          hero.rarity === Rarity.LEGEND && 'text-embossed text-rarity-legend',
          hero.rarity === Rarity.ULTRA_LEGEND && 'text-glow text-rarity-ultra-legend text-shadow'
        )}>
          {hero.name}
        </h3>

        {/* Stats */}
        {showStats && (
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-game-attack rounded"></div>
              <span className="text-game-attack font-medium">{stats.attack}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-game-health rounded"></div>
              <span className="text-game-health font-medium">{stats.hp}</span>
            </div>
            {hero.level > 1 && (
              <div className="col-span-2 flex items-center gap-1">
                <div className="w-2 h-2 bg-game-experience rounded"></div>
                <span className="text-game-experience text-xs">
                  {hero.experience}/{hero.experienceToNext} XP
                </span>
              </div>
            )}
          </div>
        )}

        {/* Ability */}
        {hero.abilityName && hero.level >= 3 && (
          <div className="mt-2 p-1 bg-primary/10 rounded text-xs">
            <div className="font-medium text-primary">{hero.abilityName}</div>
          </div>
        )}
      </div>
    </Card>
  );
}