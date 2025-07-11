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

  const getRarityGlow = (rarity: Rarity) => {
    switch (rarity) {
      case Rarity.RARE:
        return 'shadow-[0_0_20px_hsl(var(--rare)/0.6)] animate-pulse-glow';
      case Rarity.EPIC:
        return 'shadow-[0_0_25px_hsl(var(--epic)/0.7)] animate-pulse-glow';
      case Rarity.LEGEND:
        return 'shadow-[0_0_30px_hsl(var(--legend)/0.8)] animate-pulse-glow';
      case Rarity.ULTRA_LEGEND:
        return 'shadow-[0_0_40px_hsl(var(--ultra-legend)/0.9)] animate-pulse-glow';
      default:
        return '';
    }
  };

  const handleClick = () => {
    playCardPlay();
    onClick?.();
  };

  return (
    <Card 
      className={cn(
        'relative cursor-pointer transition-all duration-300 overflow-hidden bg-gradient-to-br from-card to-muted',
        sizeClasses[size],
        isSelected && 'ring-2 ring-primary scale-105',
        getRarityGlow(hero.rarity),
        'hover:scale-105 hover:shadow-lg'
      )}
      onClick={handleClick}
    >
      {/* Rarity Border */}
      <div className={cn(
        'absolute inset-0 p-1 rounded-lg',
        `bg-${RARITY_COLORS[hero.rarity]}`
      )}>
        <div className="w-full h-full bg-card rounded-md" />
      </div>

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

        {/* Hero Image */}
        <div className="flex-1 bg-gradient-to-br from-muted to-muted/50 rounded-md mb-2 flex items-center justify-center overflow-hidden relative">
          {hero.imageUrl ? (
            <img 
              src={hero.imageUrl} 
              alt={hero.name}
              className="w-full h-full object-cover rounded-md"
              style={{ imageRendering: 'crisp-edges' }}
            />
          ) : (
            <div className="text-2xl">⚔️</div>
          )}
          {/* Holographic overlay for Ultra Legends */}
          {hero.rarity === Rarity.ULTRA_LEGEND && (
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent animate-pulse opacity-50" />
          )}
        </div>

        {/* Hero Name */}
        <h3 className="font-bold text-sm text-center mb-2 text-foreground">
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