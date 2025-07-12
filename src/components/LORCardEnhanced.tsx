import * as React from 'react';
import { HeroCard as HeroCardType, Rarity } from '@/types/game';
import { calculateHeroStats } from '@/data/heroes';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useGameAudio } from '@/hooks/useAudio';
import { Shield, Sword, Star, Crown, Gem, Zap, Sparkles, Flame, Droplets, Wind } from 'lucide-react';

interface LORCardEnhancedProps {
  hero: HeroCardType;
  onClick?: () => void;
  isSelected?: boolean;
  showStats?: boolean;
  size?: 'small' | 'medium' | 'large';
  isAnimated?: boolean;
  manaCost?: number;
  isHoverable?: boolean;
  showRarityGlow?: boolean;
}

export function LORCardEnhanced({ 
  hero, 
  onClick, 
  isSelected = false, 
  showStats = true,
  size = 'medium',
  isAnimated = true,
  manaCost,
  isHoverable = true,
  showRarityGlow = true
}: LORCardEnhancedProps) {
  const stats = calculateHeroStats(hero);
  const { playCardPlay, playLegendaryDrop } = useGameAudio();
  const [isHovered, setIsHovered] = React.useState(false);
  
  const sizeClasses = {
    small: 'w-32 h-44',
    medium: 'w-48 h-68',
    large: 'w-56 h-80'
  };

  const getRarityConfig = (rarity: Rarity) => {
    const configs = {
      [Rarity.COMMON]: {
        borderGradient: 'from-slate-400 via-slate-300 to-slate-400',
        glowColor: 'shadow-slate-400/20',
        frameColor: 'border-slate-400',
        textColor: 'text-slate-100',
        bgOverlay: 'bg-gradient-to-b from-slate-900/90 to-slate-800/90',
        nameFrame: 'bg-slate-700/80 border-slate-400/50',
        cornerGem: 'bg-slate-400',
        rarityIcon: <Star className="w-3 h-3" />,
        manaGradient: 'from-blue-500 to-blue-700',
        attackGradient: 'from-red-500 to-red-700',
        healthGradient: 'from-green-500 to-green-700',
        borderWidth: 'border-2',
        cornerSize: 'w-2 h-2',
        particleColor: 'bg-slate-400',
        holographicIntensity: 0,
        energyGlow: 'shadow-slate-400/10'
      },
      [Rarity.UNCOMMON]: {
        borderGradient: 'from-green-400 via-emerald-300 to-green-400',
        glowColor: 'shadow-green-400/30',
        frameColor: 'border-green-400',
        textColor: 'text-green-100',
        bgOverlay: 'bg-gradient-to-b from-green-900/90 to-emerald-800/90',
        nameFrame: 'bg-green-700/80 border-green-400/50',
        cornerGem: 'bg-green-400',
        rarityIcon: <Star className="w-3 h-3" />,
        manaGradient: 'from-blue-500 to-blue-700',
        attackGradient: 'from-red-500 to-red-700',
        healthGradient: 'from-green-500 to-green-700',
        borderWidth: 'border-2',
        cornerSize: 'w-2 h-2',
        particleColor: 'bg-green-400',
        holographicIntensity: 0.1,
        energyGlow: 'shadow-green-400/15'
      },
      [Rarity.RARE]: {
        borderGradient: 'from-blue-400 via-cyan-300 to-blue-400',
        glowColor: 'shadow-blue-400/40 animate-pulse',
        frameColor: 'border-blue-400',
        textColor: 'text-blue-100',
        bgOverlay: 'bg-gradient-to-b from-blue-900/90 to-cyan-800/90',
        nameFrame: 'bg-blue-700/80 border-blue-400/50',
        cornerGem: 'bg-blue-400 animate-pulse',
        rarityIcon: <Gem className="w-3 h-3" />,
        manaGradient: 'from-blue-500 to-blue-700',
        attackGradient: 'from-red-500 to-red-700',
        healthGradient: 'from-green-500 to-green-700',
        borderWidth: 'border-2',
        cornerSize: 'w-2.5 h-2.5',
        particleColor: 'bg-blue-400',
        holographicIntensity: 0.2,
        energyGlow: 'shadow-blue-400/25'
      },
      [Rarity.EPIC]: {
        borderGradient: 'from-purple-400 via-violet-300 to-purple-400',
        glowColor: 'shadow-purple-400/50 animate-pulse',
        frameColor: 'border-purple-400',
        textColor: 'text-purple-100',
        bgOverlay: 'bg-gradient-to-b from-purple-900/90 to-violet-800/90',
        nameFrame: 'bg-purple-700/80 border-purple-400/50',
        cornerGem: 'bg-purple-400 animate-pulse',
        rarityIcon: <Crown className="w-3 h-3" />,
        manaGradient: 'from-blue-500 to-blue-700',
        attackGradient: 'from-red-500 to-red-700',
        healthGradient: 'from-green-500 to-green-700',
        borderWidth: 'border-3',
        cornerSize: 'w-3 h-3',
        particleColor: 'bg-purple-400',
        holographicIntensity: 0.3,
        energyGlow: 'shadow-purple-400/35'
      },
      [Rarity.LEGEND]: {
        borderGradient: 'from-amber-400 via-yellow-300 to-amber-400',
        glowColor: 'shadow-amber-400/60 animate-pulse',
        frameColor: 'border-amber-400',
        textColor: 'text-amber-100',
        bgOverlay: 'bg-gradient-to-b from-amber-900/90 to-yellow-800/90',
        nameFrame: 'bg-amber-700/80 border-amber-400/50',
        cornerGem: 'bg-amber-400 animate-pulse shadow-amber-400/50 shadow-lg',
        rarityIcon: <Crown className="w-4 h-4" />,
        manaGradient: 'from-blue-500 to-blue-700',
        attackGradient: 'from-red-500 to-red-700',
        healthGradient: 'from-green-500 to-green-700',
        borderWidth: 'border-3',
        cornerSize: 'w-3 h-3',
        particleColor: 'bg-amber-400',
        holographicIntensity: 0.5,
        energyGlow: 'shadow-amber-400/45'
      },
      [Rarity.ULTRA_LEGEND]: {
        borderGradient: 'from-pink-400 via-rose-300 to-pink-400',
        glowColor: 'shadow-pink-400/70 animate-pulse divine-glow',
        frameColor: 'border-pink-400',
        textColor: 'text-pink-100',
        bgOverlay: 'bg-gradient-to-b from-pink-900/90 to-rose-800/90',
        nameFrame: 'bg-pink-700/80 border-pink-400/50',
        cornerGem: 'bg-pink-400 animate-pulse shadow-pink-400/70 shadow-xl',
        rarityIcon: <Crown className="w-4 h-4" />,
        manaGradient: 'from-blue-500 to-blue-700',
        attackGradient: 'from-red-500 to-red-700',
        healthGradient: 'from-green-500 to-green-700',
        borderWidth: 'border-4',
        cornerSize: 'w-3.5 h-3.5',
        particleColor: 'bg-pink-400',
        holographicIntensity: 0.8,
        energyGlow: 'shadow-pink-400/60'
      }
    };
    return configs[rarity];
  };

  const rarityConfig = getRarityConfig(hero.rarity);
  const calculatedManaCost = manaCost || Math.ceil((stats.attack + stats.hp) / 15);

  const handleClick = () => {
    if (hero.rarity === Rarity.LEGEND || hero.rarity === Rarity.ULTRA_LEGEND) {
      playLegendaryDrop();
    } else {
      playCardPlay();
    }
    onClick?.();
  };

  const getElementIcon = (heroName: string) => {
    const name = heroName.toLowerCase();
    if (name.includes('fire') || name.includes('flame') || name.includes('burn')) {
      return <Flame className="w-3 h-3 text-orange-400" />;
    }
    if (name.includes('water') || name.includes('ice') || name.includes('frost')) {
      return <Droplets className="w-3 h-3 text-blue-400" />;
    }
    if (name.includes('wind') || name.includes('air') || name.includes('storm')) {
      return <Wind className="w-3 h-3 text-cyan-400" />;
    }
    return <Sparkles className="w-3 h-3 text-yellow-400" />;
  };

  return (
    <div 
      className={cn(
        'clickable-card relative group',
        sizeClasses[size],
        isHoverable && 'cursor-pointer',
        'focus-lor'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Enhanced Energy Field Effect */}
      {showRarityGlow && (
        <div className={cn(
          'absolute inset-0 rounded-lg transition-all duration-1000',
          rarityConfig.energyGlow,
          isHovered && 'animate-pulse'
        )} />
      )}

      {/* Main Card Container */}
      <Card 
        className={cn(
          'card-hover-lor relative overflow-hidden transform-gpu will-change-transform',
          'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900',
          rarityConfig.glowColor,
          isSelected && 'selected-lor',
          'transition-all duration-500 ease-out',
          'card-premium-enhanced',
          'focus-lor'
        )}
      >
        {/* Enhanced Outer Metallic Border Frame */}
        <div className={cn(
          'absolute inset-0 p-[4px] rounded-lg',
          `bg-gradient-to-br ${rarityConfig.borderGradient}`,
          'shadow-lg'
        )}>
          <div className="w-full h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-md" />
        </div>

        {/* Enhanced Inner Ornate Border */}
        <div className={cn(
          'absolute inset-[8px] rounded-md',
          rarityConfig.borderWidth,
          rarityConfig.frameColor,
          'bg-gradient-to-b from-slate-900/50 to-slate-800/50',
          'shadow-inner'
        )} />

        {/* Card Content */}
        <div className="relative z-10 h-full flex flex-col">
          
          {/* Top Section: Mana Cost & Rarity */}
          <div className="flex justify-between items-start p-3">
            {/* Enhanced Mana Cost Circle (LoR Style) */}
            <div className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center relative',
              `bg-gradient-to-br ${rarityConfig.manaGradient}`,
              'border-2 border-blue-300 shadow-lg',
              'text-white font-bold text-sm',
              'overflow-hidden'
            )}>
              {/* Mana orb inner glow */}
              <div className="absolute inset-1 rounded-full bg-white/20" />
              {/* Mana orb outer glow */}
              <div className="absolute inset-0 rounded-full bg-blue-400/30 animate-pulse" />
              {calculatedManaCost}
            </div>

            {/* Enhanced Rarity Badge */}
            <div className={cn(
              'flex items-center gap-1 px-3 py-1.5 rounded-full',
              'backdrop-blur-sm border',
              rarityConfig.nameFrame,
              rarityConfig.textColor,
              'shadow-md'
            )}>
              {rarityConfig.rarityIcon}
              <span className="text-xs font-bold uppercase tracking-wide">
                {hero.rarity.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Enhanced Hero Portrait - LoR Style */}
          <div className="flex-1 mx-3 mb-3 rounded-md overflow-hidden relative">
            {hero.imageUrl ? (
              <div className="relative w-full h-full">
                {/* Hero image with LoR-style framing */}
                <img 
                  src={hero.imageUrl} 
                  alt={hero.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    filter: 'brightness(1.1) contrast(1.1) saturate(1.2)',
                    transformOrigin: 'center center'
                  }}
                />
                
                {/* LoR-style image overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
                
                {/* Subtle vignette effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
                
                {/* Enhanced Holographic Overlay for high rarities */}
                {rarityConfig.holographicIntensity > 0 && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div 
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      )}
                      style={{ opacity: rarityConfig.holographicIntensity }}
                    />
                    <div 
                      className={cn(
                        "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-2000"
                      )}
                      style={{ opacity: rarityConfig.holographicIntensity }}
                    />
                    <div 
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br from-transparent via-white/8 to-transparent animate-pulse"
                      )}
                      style={{ opacity: rarityConfig.holographicIntensity }}
                    />
                  </div>
                )}

                {/* Enhanced Level indicator - LoR style */}
                <div className={cn(
                  'absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold',
                  'bg-black/80 border border-white/20 text-white',
                  'shadow-lg backdrop-blur-sm',
                  'backdrop-blur-md'
                )}>
                  LV {hero.level}
                </div>

                {/* Element indicator - LoR style */}
                <div className="absolute top-2 left-2 p-1.5 rounded-full bg-black/80 border border-white/20 shadow-lg backdrop-blur-md">
                  {getElementIcon(hero.name)}
                </div>

                {/* Experience bar for high level cards - LoR style */}
                {hero.level > 1 && (
                  <div className="absolute bottom-2 left-2 right-2 h-1.5 bg-black/60 rounded-full overflow-hidden backdrop-blur-sm">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${(hero.experience / hero.experienceToNext) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 relative">
                {/* Placeholder hero silhouette */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Hero silhouette */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-slate-600 rounded-full mb-8"></div>
                    <div className="absolute bottom-8 w-12 h-20 bg-slate-600 rounded-t-full"></div>
                  </div>
                  
                  {/* Sword and shield icons */}
                  <div className="absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-1 h-8 bg-amber-400 rounded-full"></div>
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-amber-400 rounded-full"></div>
                  </div>
                  
                  <div className="absolute right-1/4 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-6 h-8 border-2 border-green-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Level indicator for placeholder */}
                <div className={cn(
                  'absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold',
                  'bg-black/80 border border-white/20 text-white',
                  'shadow-lg backdrop-blur-sm'
                )}>
                  LV {hero.level}
                </div>

                {/* Element indicator for placeholder */}
                <div className="absolute top-2 left-2 p-1.5 rounded-full bg-black/80 border border-white/20 shadow-lg backdrop-blur-sm">
                  {getElementIcon(hero.name)}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Hero Name Frame (LoR Style) */}
          <div className={cn(
            'mx-3 mb-3 p-2 rounded-md border',
            rarityConfig.nameFrame,
            'shadow-md'
          )}>
            <h3 className={cn(
              'font-bold text-center text-sm tracking-wide text-shadow',
              rarityConfig.textColor
            )}>
              {hero.name.toUpperCase()}
            </h3>
          </div>

          {/* Enhanced Ability Text (if available) */}
          {hero.abilityName && hero.level >= 3 && (
            <div className="mx-3 mb-3 p-2 rounded-md bg-slate-900/80 border border-slate-600 shadow-md">
              <div className="text-amber-300 text-xs font-bold mb-1 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {hero.abilityName}
              </div>
              {hero.abilityDescription && (
                <div className="text-slate-300 text-xs leading-tight">
                  {hero.abilityDescription}
                </div>
              )}
            </div>
          )}

          {/* Enhanced Bottom Section: Attack & Health (LoR Style) */}
          <div className="flex justify-between items-end p-3">
            {/* Enhanced Attack (bottom left) */}
            <div className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center relative',
              `bg-gradient-to-br ${rarityConfig.attackGradient}`,
              'border-2 border-red-300 shadow-lg',
              'text-white font-bold text-sm',
              'overflow-hidden'
            )}>
              {/* Attack orb inner glow */}
              <div className="absolute inset-1 rounded-full bg-white/20" />
              {/* Attack orb outer glow */}
              <div className="absolute inset-0 rounded-full bg-red-400/30 animate-pulse" />
              {stats.attack}
            </div>

            {/* Enhanced Health (bottom right) */}
            <div className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center relative',
              `bg-gradient-to-br ${rarityConfig.healthGradient}`,
              'border-2 border-green-300 shadow-lg',
              'text-white font-bold text-sm',
              'overflow-hidden'
            )}>
              {/* Health orb inner glow */}
              <div className="absolute inset-1 rounded-full bg-white/20" />
              {/* Health orb outer glow */}
              <div className="absolute inset-0 rounded-full bg-green-400/30 animate-pulse" />
              {stats.hp}
            </div>
          </div>
        </div>

        {/* Enhanced Corner Decorative Elements */}
        <div className={cn(
          'absolute top-2 left-2 rounded-full',
          rarityConfig.cornerSize,
          rarityConfig.cornerGem,
          'shadow-md'
        )} />
        <div className={cn(
          'absolute top-2 right-2 rounded-full',
          rarityConfig.cornerSize,
          rarityConfig.cornerGem,
          'shadow-md'
        )} />
        <div className={cn(
          'absolute bottom-2 left-2 rounded-full',
          rarityConfig.cornerSize,
          rarityConfig.cornerGem,
          'shadow-md'
        )} />
        <div className={cn(
          'absolute bottom-2 right-2 rounded-full',
          rarityConfig.cornerSize,
          rarityConfig.cornerGem,
          'shadow-md'
        )} />

        {/* Enhanced Floating Particles */}
        {rarityConfig.holographicIntensity > 0.2 && (
          <div className="absolute inset-0 pointer-events-none">
            <div className={cn(
              "absolute w-1 h-1 rounded-full animate-bounce",
              rarityConfig.particleColor,
              "opacity-60"
            )} style={{ 
              top: '20%', 
              left: '15%', 
              animationDelay: '0s',
              animationDuration: '3s'
            }} />
            <div className={cn(
              "absolute w-1 h-1 rounded-full animate-bounce",
              rarityConfig.particleColor,
              "opacity-60"
            )} style={{ 
              top: '30%', 
              right: '20%', 
              animationDelay: '1s',
              animationDuration: '4s'
            }} />
            <div className={cn(
              "absolute w-1 h-1 rounded-full animate-bounce",
              rarityConfig.particleColor,
              "opacity-60"
            )} style={{ 
              bottom: '25%', 
              left: '25%', 
              animationDelay: '2s',
              animationDuration: '3.5s'
            }} />
          </div>
        )}

        {/* Enhanced Ultra Legendary special effects */}
        {hero.rarity === Rarity.ULTRA_LEGEND && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-conic from-pink-500/20 via-transparent to-pink-500/20 animate-spin duration-[3000ms]" />
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-purple-500/10 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-tl from-rose-500/5 via-transparent to-violet-500/5 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        )}

        {/* Enhanced Legendary effects */}
        {hero.rarity === Rarity.LEGEND && (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-yellow-500/5 animate-pulse pointer-events-none" />
        )}

        {/* Enhanced Selection Ring */}
        {isSelected && (
          <div className="absolute inset-0 ring-4 ring-primary/80 ring-offset-2 ring-offset-slate-900 rounded-lg animate-pulse" />
        )}
      </Card>
    </div>
  );
}