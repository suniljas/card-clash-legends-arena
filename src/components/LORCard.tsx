import * as React from 'react';
import { HeroCard as HeroCardType, Rarity } from '@/types/game';
import { calculateHeroStats } from '@/data/heroes';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useGameAudio } from '@/hooks/useAudio';
import { Shield, Sword, Star, Crown, Gem, Zap, Sparkles, Flame, Droplets, Wind } from 'lucide-react';

interface LORCardProps {
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

export function LORCard({ 
  hero, 
  onClick, 
  isSelected = false, 
  showStats = true,
  size = 'medium',
  isAnimated = true,
  manaCost,
  isHoverable = true,
  showRarityGlow = true
}: LORCardProps) {
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
        'relative group',
        sizeClasses[size],
        isHoverable && 'cursor-pointer'
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
          'relative overflow-hidden transform-gpu will-change-transform',
          'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900',
          rarityConfig.glowColor,
          isSelected && 'ring-4 ring-primary scale-105',
          isAnimated && isHoverable && 'hover:scale-105 hover:-translate-y-2',
          'transition-all duration-500 ease-out',
          'card-premium-enhanced'
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
          {/* Enhanced Mana Cost Circle (LOR Style) */}
          <div className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center',
            `bg-gradient-to-br ${rarityConfig.manaGradient}`,
            'border-2 border-blue-300 shadow-lg',
            'text-white font-bold text-sm',
            'relative overflow-hidden'
          )}>
            {/* Mana orb inner glow */}
            <div className="absolute inset-1 rounded-full bg-white/20" />
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

        {/* Enhanced Hero Portrait */}
        <div className="flex-1 mx-3 mb-3 rounded-md overflow-hidden relative border-2 border-slate-600 shadow-inner">
          {hero.imageUrl ? (
            <img 
              src={hero.imageUrl} 
              alt={hero.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 text-4xl">
              ⚔️
            </div>
          )}

          {/* Enhanced Holographic Overlay for high rarities */}
          {(hero.rarity === Rarity.LEGEND || hero.rarity === Rarity.ULTRA_LEGEND) && (
            <div>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent animate-pulse" />
            </div>
          )}

          {/* Enhanced Level indicator */}
          <div className={cn(
            'absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold',
            'bg-slate-900/90 border border-slate-500 text-slate-100',
            'shadow-lg backdrop-blur-sm'
          )}>
            LV {hero.level}
          </div>

          {/* Element indicator */}
          <div className="absolute top-2 left-2 p-1 rounded-full bg-slate-900/90 border border-slate-500 shadow-lg backdrop-blur-sm">
            {getElementIcon(hero.name)}
          </div>

          {/* Experience bar for high level cards */}
          {hero.level > 1 && (
            <div className="absolute bottom-2 left-2 right-2 h-1 bg-slate-800/80 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${(hero.experience / hero.experienceToNext) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Enhanced Hero Name Frame (LOR Style) */}
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

        {/* Enhanced Bottom Section: Attack & Health (LOR Style) */}
        <div className="flex justify-between items-end p-3">
          {/* Enhanced Attack (bottom left) */}
          <div className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center',
            `bg-gradient-to-br ${rarityConfig.attackGradient}`,
            'border-2 border-red-300 shadow-lg',
            'text-white font-bold text-sm',
            'relative overflow-hidden'
          )}>
            {/* Attack orb inner glow */}
            <div className="absolute inset-1 rounded-full bg-white/20" />
            {stats.attack}
          </div>

          {/* Enhanced Health (bottom right) */}
          <div className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center',
            `bg-gradient-to-br ${rarityConfig.healthGradient}`,
            'border-2 border-green-300 shadow-lg',
            'text-white font-bold text-sm',
            'relative overflow-hidden'
          )}>
            {/* Health orb inner glow */}
            <div className="absolute inset-1 rounded-full bg-white/20" />
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

      {/* Enhanced Ultra Legendary special effects */}
      {hero.rarity === Rarity.ULTRA_LEGEND && (
        <div>
          <div className="absolute inset-0 bg-gradient-conic from-pink-500/20 via-transparent to-pink-500/20 animate-spin duration-[3000ms] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-purple-500/10 animate-pulse pointer-events-none" />
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