import { HeroCard as HeroCardType, Rarity } from '@/types/game';
import { calculateHeroStats, RARITY_COLORS } from '@/data/heroes';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useGameAudio } from '@/hooks/useAudio';

interface PremiumCardProps {
  hero: HeroCardType;
  onClick?: () => void;
  isSelected?: boolean;
  showStats?: boolean;
  size?: 'small' | 'medium' | 'large';
  isAnimated?: boolean;
}

export function PremiumCard({ 
  hero, 
  onClick, 
  isSelected = false, 
  showStats = true,
  size = 'medium',
  isAnimated = true
}: PremiumCardProps) {
  const stats = calculateHeroStats(hero);
  const { playCardPlay, playLegendaryDrop } = useGameAudio();
  
  const sizeClasses = {
    small: 'w-32 h-44',
    medium: 'w-48 h-64',
    large: 'w-56 h-76'
  };

  const getRarityEffects = (rarity: Rarity) => {
    const effects = {
      glow: '',
      border: '',
      background: '',
      overlay: ''
    };

    switch (rarity) {
      case Rarity.COMMON:
        effects.glow = 'shadow-lg';
        effects.border = 'border-2 border-muted';
        effects.background = 'bg-gradient-to-br from-card to-muted/50';
        break;
      case Rarity.UNCOMMON:
        effects.glow = 'shadow-xl shadow-rarity-uncommon/20';
        effects.border = 'border-2 border-rarity-uncommon';
        effects.background = 'bg-gradient-to-br from-card to-rarity-uncommon/10';
        break;
      case Rarity.RARE:
        effects.glow = 'shadow-2xl shadow-rarity-rare/30 animate-pulse-glow';
        effects.border = 'border-2 border-rarity-rare';
        effects.background = 'bg-gradient-to-br from-card via-rarity-rare/5 to-rarity-rare/10';
        effects.overlay = 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-rarity-rare/10 before:to-transparent before:animate-pulse';
        break;
      case Rarity.EPIC:
        effects.glow = 'shadow-2xl shadow-rarity-epic/40 animate-pulse-glow';
        effects.border = 'border-2 border-rarity-epic';
        effects.background = 'bg-gradient-to-br from-card via-rarity-epic/5 to-rarity-epic/15';
        effects.overlay = 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-rarity-epic/15 before:to-transparent before:animate-pulse';
        break;
      case Rarity.LEGEND:
        effects.glow = 'shadow-2xl shadow-rarity-legend/50 animate-pulse-glow';
        effects.border = 'border-2 border-rarity-legend animate-pulse';
        effects.background = 'bg-gradient-to-br from-card via-rarity-legend/10 to-rarity-legend/20';
        effects.overlay = 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-rarity-legend/20 before:to-transparent before:animate-pulse after:absolute after:inset-0 after:bg-gradient-conic after:from-rarity-legend/20 after:via-transparent after:to-rarity-legend/20 after:animate-spin after:duration-[3s]';
        break;
      case Rarity.ULTRA_LEGEND:
        effects.glow = 'shadow-2xl shadow-rarity-ultra-legend/60 animate-pulse-glow';
        effects.border = 'border-2 border-rarity-ultra-legend animate-pulse';
        effects.background = 'bg-gradient-to-br from-card via-rarity-ultra-legend/15 to-rarity-ultra-legend/25';
        effects.overlay = 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-rarity-ultra-legend/25 before:to-transparent before:animate-pulse after:absolute after:inset-0 after:bg-gradient-conic after:from-rarity-ultra-legend/30 after:via-rarity-legend/20 after:to-rarity-ultra-legend/30 after:animate-spin after:duration-[2s]';
        break;
    }

    return effects;
  };

  const effects = getRarityEffects(hero.rarity);

  const handleClick = () => {
    if (hero.rarity === Rarity.LEGEND || hero.rarity === Rarity.ULTRA_LEGEND) {
      playLegendaryDrop();
    } else {
      playCardPlay();
    }
    onClick?.();
  };

  return (
    <Card 
      className={cn(
        'relative cursor-pointer overflow-hidden group',
        'transition-all duration-300 ease-out',
        sizeClasses[size],
        effects.background,
        effects.border,
        effects.glow,
        effects.overlay,
        isSelected && 'ring-4 ring-primary scale-105',
        isAnimated && 'hover:scale-105 hover:-translate-y-2',
        'transform-gpu will-change-transform'
      )}
      onClick={handleClick}
    >
      {/* Premium border gradient */}
      <div className="absolute inset-0 rounded-lg p-0.5 bg-gradient-to-br from-primary/50 via-accent/30 to-primary/50">
        <div className={cn('w-full h-full rounded-md', effects.background)} />
      </div>

      {/* Card Content */}
      <div className="relative z-10 p-3 h-full flex flex-col">
        {/* Header with embossed text */}
        <div className="flex justify-between items-start mb-2">
          <Badge 
            variant="outline" 
            className={cn(
              'text-xs font-bold capitalize border-current backdrop-blur-sm',
              'shadow-lg text-shadow-sm',
              `text-${RARITY_COLORS[hero.rarity]} border-${RARITY_COLORS[hero.rarity]}`
            )}
          >
            {hero.rarity}
          </Badge>
          <div className="text-xs font-semibold text-muted-foreground bg-background/20 px-2 py-1 rounded backdrop-blur-sm">
            Lv.{hero.level}
          </div>
        </div>

        {/* Hero Image with premium frame */}
        <div className="flex-1 rounded-md mb-2 overflow-hidden relative bg-gradient-to-br from-muted to-muted/50">
          {hero.imageUrl ? (
            <img 
              src={hero.imageUrl} 
              alt={hero.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              style={{ imageRendering: 'crisp-edges' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">⚔️</div>
          )}
          
          {/* Holographic overlay for high rarity cards */}
          {(hero.rarity === Rarity.LEGEND || hero.rarity === Rarity.ULTRA_LEGEND) && (
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
          
          {/* Shimmer effect for ultra legends */}
          {hero.rarity === Rarity.ULTRA_LEGEND && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          )}
        </div>

        {/* Hero Name with embossed effect */}
        <h3 className="font-bold text-sm text-center mb-2 text-foreground text-shadow-sm">
          {hero.name}
        </h3>

        {/* Premium Stats Display */}
        {showStats && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1 bg-background/20 px-2 py-1 rounded backdrop-blur-sm">
              <div className="w-2 h-2 bg-game-attack rounded-full shadow-sm"></div>
              <span className="text-game-attack font-bold text-shadow-sm">{stats.attack}</span>
            </div>
            <div className="flex items-center gap-1 bg-background/20 px-2 py-1 rounded backdrop-blur-sm">
              <div className="w-2 h-2 bg-game-health rounded-full shadow-sm"></div>
              <span className="text-game-health font-bold text-shadow-sm">{stats.hp}</span>
            </div>
            {hero.level > 1 && (
              <div className="col-span-2 flex items-center gap-1 bg-background/20 px-2 py-1 rounded backdrop-blur-sm">
                <div className="w-2 h-2 bg-game-experience rounded-full shadow-sm"></div>
                <span className="text-game-experience text-xs font-medium">
                  {hero.experience}/{hero.experienceToNext} XP
                </span>
              </div>
            )}
          </div>
        )}

        {/* Premium Ability Display */}
        {hero.abilityName && hero.level >= 3 && (
          <div className="mt-2 p-2 bg-primary/10 rounded-md border border-primary/20 backdrop-blur-sm">
            <div className="font-bold text-xs text-primary text-shadow-sm">{hero.abilityName}</div>
            <div className="text-xs text-muted-foreground mt-1">{hero.abilityDescription}</div>
          </div>
        )}
      </div>

      {/* Premium corner decorations */}
      <div className="absolute top-1 left-1 w-3 h-3 border-l-2 border-t-2 border-accent opacity-50"></div>
      <div className="absolute top-1 right-1 w-3 h-3 border-r-2 border-t-2 border-accent opacity-50"></div>
      <div className="absolute bottom-1 left-1 w-3 h-3 border-l-2 border-b-2 border-accent opacity-50"></div>
      <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-accent opacity-50"></div>
    </Card>
  );
}