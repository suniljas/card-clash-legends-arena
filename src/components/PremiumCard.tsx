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
      overlay: '',
      frame: '',
      textColor: '',
      badgeStyle: ''
    };

    switch (rarity) {
      case Rarity.COMMON:
        effects.glow = 'shadow-lg shadow-rarity-common/20';
        effects.border = 'border-2 border-rarity-common';
        effects.background = 'bg-gradient-to-br from-card via-rarity-common/5 to-muted/30';
        effects.frame = 'bg-gradient-to-br from-rarity-common/20 to-transparent';
        effects.textColor = 'text-rarity-common';
        effects.badgeStyle = 'bg-rarity-common/20 border-rarity-common text-rarity-common';
        break;
      case Rarity.UNCOMMON:
        effects.glow = 'shadow-xl shadow-rarity-uncommon/30';
        effects.border = 'border-2 border-rarity-uncommon';
        effects.background = 'bg-gradient-to-br from-card via-rarity-uncommon/8 to-rarity-uncommon/15';
        effects.overlay = 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-rarity-uncommon/10 before:to-transparent before:animate-pulse';
        effects.frame = 'bg-gradient-to-br from-rarity-uncommon/25 to-transparent';
        effects.textColor = 'text-rarity-uncommon';
        effects.badgeStyle = 'bg-rarity-uncommon/25 border-rarity-uncommon text-rarity-uncommon';
        break;
      case Rarity.RARE:
        effects.glow = 'shadow-2xl shadow-rarity-rare/40 animate-pulse-glow';
        effects.border = 'border-2 border-rarity-rare';
        effects.background = 'bg-gradient-to-br from-card via-rarity-rare/10 to-rarity-rare/20';
        effects.overlay = 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-rarity-rare/15 before:to-transparent before:animate-pulse';
        effects.frame = 'bg-gradient-to-br from-rarity-rare/30 to-transparent foil-effect';
        effects.textColor = 'text-rarity-rare';
        effects.badgeStyle = 'bg-rarity-rare/30 border-rarity-rare text-rarity-rare';
        break;
      case Rarity.EPIC:
        effects.glow = 'shadow-2xl shadow-rarity-epic/50 animate-pulse-glow';
        effects.border = 'border-2 border-rarity-epic';
        effects.background = 'bg-gradient-to-br from-card via-rarity-epic/12 to-rarity-epic/25';
        effects.overlay = 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-rarity-epic/20 before:to-transparent before:animate-pulse';
        effects.frame = 'bg-gradient-to-br from-rarity-epic/35 to-transparent foil-effect';
        effects.textColor = 'text-rarity-epic';
        effects.badgeStyle = 'bg-rarity-epic/35 border-rarity-epic text-rarity-epic';
        break;
      case Rarity.LEGEND:
        effects.glow = 'shadow-2xl shadow-rarity-legend/60 animate-pulse-glow';
        effects.border = 'border-2 border-rarity-legend animate-pulse';
        effects.background = 'bg-gradient-to-br from-card via-rarity-legend/15 to-rarity-legend/30';
        effects.overlay = 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-rarity-legend/25 before:to-transparent before:animate-pulse after:absolute after:inset-0 after:bg-gradient-conic after:from-rarity-legend/25 after:via-transparent after:to-rarity-legend/25 after:animate-spin after:duration-[3000ms]';
        effects.frame = 'bg-gradient-to-br from-rarity-legend/40 to-transparent foil-effect holographic';
        effects.textColor = 'text-rarity-legend';
        effects.badgeStyle = 'bg-rarity-legend/40 border-rarity-legend text-rarity-legend divine-glow';
        break;
      case Rarity.ULTRA_LEGEND:
        effects.glow = 'shadow-2xl shadow-rarity-ultra-legend/70 animate-pulse-glow divine-glow';
        effects.border = 'border-2 border-rarity-ultra-legend animate-pulse';
        effects.background = 'bg-gradient-to-br from-card via-rarity-ultra-legend/20 to-rarity-ultra-legend/35';
        effects.overlay = 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-rarity-ultra-legend/30 before:to-transparent before:animate-pulse after:absolute after:inset-0 after:bg-gradient-conic after:from-rarity-ultra-legend/35 after:via-rarity-legend/25 after:to-rarity-ultra-legend/35 after:animate-spin after:duration-[2000ms]';
        effects.frame = 'bg-gradient-to-br from-rarity-ultra-legend/45 to-transparent foil-effect holographic particle-effect';
        effects.textColor = 'text-rarity-ultra-legend text-glow';
        effects.badgeStyle = 'bg-rarity-ultra-legend/45 border-rarity-ultra-legend text-rarity-ultra-legend divine-glow';
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
        'relative cursor-pointer overflow-hidden group card-premium card-3d',
        'transition-all duration-500 ease-out',
        sizeClasses[size],
        effects.background,
        effects.border,
        effects.glow,
        effects.overlay,
        isSelected && 'ring-4 ring-primary scale-105',
        isAnimated && 'hover:scale-105 hover:-translate-y-3',
        'transform-gpu will-change-transform'
      )}
      onClick={handleClick}
    >
      {/* Premium metallic border frame */}
      <div className={cn(
        'absolute inset-0 rounded-lg p-1',
        'bg-gradient-to-br from-primary/60 via-accent/40 to-primary/60',
        effects.frame
      )}>
        <div className={cn('w-full h-full rounded-md', effects.background)} />
      </div>

      {/* Card Content */}
      <div className="relative z-10 p-3 h-full flex flex-col">
        {/* Header with premium badges */}
        <div className="flex justify-between items-start mb-2">
          <Badge 
            variant="outline" 
            className={cn(
              'text-xs font-bold capitalize backdrop-blur-sm',
              'shadow-lg text-shadow-sm',
              effects.badgeStyle
            )}
          >
            {hero.rarity}
          </Badge>
          <div className={cn(
            'text-xs font-semibold px-2 py-1 rounded backdrop-blur-sm',
            'bg-background/30 border border-primary/20',
            effects.textColor
          )}>
            Lv.{hero.level}
          </div>
        </div>

        {/* Hero Image with premium frame and effects */}
        <div className={cn(
          'flex-1 rounded-md mb-2 overflow-hidden relative',
          'bg-gradient-to-br from-muted/80 to-muted/40',
          'border border-primary/20'
        )}>
          {hero.imageUrl ? (
            <img 
              src={hero.imageUrl} 
              alt={hero.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              style={{ imageRendering: 'crisp-edges' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">⚔️</div>
          )}
          
          {/* Enhanced holographic overlay for high rarity cards */}
          {(hero.rarity === Rarity.LEGEND || hero.rarity === Rarity.ULTRA_LEGEND) && (
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          )}
          
          {/* Advanced shimmer effect for ultra legends */}
          {hero.rarity === Rarity.ULTRA_LEGEND && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
          )}

          {/* Rarity-specific frame overlay */}
          <div className={cn(
            'absolute inset-0 rounded-md border-2 opacity-20',
            `border-rarity-${hero.rarity}`
          )} />
        </div>

        {/* Hero Name with premium embossed effect */}
        <h3 className={cn(
          'font-bold text-sm text-center mb-2 text-shadow-sm',
          effects.textColor
        )}>
          {hero.name}
        </h3>

        {/* Premium Stats Display */}
        {showStats && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1 bg-background/30 px-2 py-1 rounded backdrop-blur-sm border border-primary/20">
              <div className="w-2 h-2 bg-game-attack rounded-full shadow-sm"></div>
              <span className="text-game-attack font-bold text-shadow-sm">{stats.attack}</span>
            </div>
            <div className="flex items-center gap-1 bg-background/30 px-2 py-1 rounded backdrop-blur-sm border border-primary/20">
              <div className="w-2 h-2 bg-game-health rounded-full shadow-sm"></div>
              <span className="text-game-health font-bold text-shadow-sm">{stats.hp}</span>
            </div>
            {hero.level > 1 && (
              <div className="col-span-2 flex items-center gap-1 bg-background/30 px-2 py-1 rounded backdrop-blur-sm border border-primary/20">
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
          <div className={cn(
            'mt-2 p-2 rounded-md border backdrop-blur-sm',
            'bg-primary/15 border-primary/30',
            effects.textColor
          )}>
            <div className="font-bold text-xs text-shadow-sm">{hero.abilityName}</div>
            <div className="text-xs text-muted-foreground mt-1">{hero.abilityDescription}</div>
          </div>
        )}
      </div>

      {/* Enhanced premium corner decorations */}
      <div className="absolute top-1 left-1 w-4 h-4 border-l-2 border-t-2 border-accent opacity-70"></div>
      <div className="absolute top-1 right-1 w-4 h-4 border-r-2 border-t-2 border-accent opacity-70"></div>
      <div className="absolute bottom-1 left-1 w-4 h-4 border-l-2 border-b-2 border-accent opacity-70"></div>
      <div className="absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2 border-accent opacity-70"></div>

      {/* Rarity-specific corner gems */}
      {(hero.rarity === Rarity.RARE || hero.rarity === Rarity.EPIC || hero.rarity === Rarity.LEGEND || hero.rarity === Rarity.ULTRA_LEGEND) && (
        <div className={cn(
          'absolute top-2 right-2 w-3 h-3 rounded-full animate-pulse',
          `bg-rarity-${hero.rarity}`
        )} />
      )}
    </Card>
  );
}