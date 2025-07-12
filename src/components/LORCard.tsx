import * as React from 'react';
import { HeroCard as HeroCardType, Rarity } from '@/types/game';
import { calculateHeroStats } from '@/data/heroes';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useGameAudio } from '@/hooks/useAudio';
import { Shield, Sword, Star, Crown, Gem, Sparkles } from 'lucide-react';

interface LORCardProps {
  hero: HeroCardType;
  onClick?: () => void;
  isSelected?: boolean;
  showStats?: boolean;
  size?: 'small' | 'medium' | 'large';
  isAnimated?: boolean;
  manaCost?: number;
}

export function LORCard({ 
  hero, 
  onClick, 
  isSelected = false, 
  showStats = true,
  size = 'medium',
  isAnimated = true,
  manaCost
}: LORCardProps) {
  const stats = calculateHeroStats(hero);
  const { playCardPlay, playLegendaryDrop } = useGameAudio();
  
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
        manaOrb: 'from-blue-500 to-blue-700',
        attackOrb: 'from-red-500 to-red-700',
        healthOrb: 'from-green-500 to-green-700'
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
        manaOrb: 'from-blue-500 to-blue-700',
        attackOrb: 'from-red-500 to-red-700',
        healthOrb: 'from-green-500 to-green-700'
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
        manaOrb: 'from-blue-500 to-blue-700',
        attackOrb: 'from-red-500 to-red-700',
        healthOrb: 'from-green-500 to-green-700'
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
        manaOrb: 'from-blue-500 to-blue-700',
        attackOrb: 'from-red-500 to-red-700',
        healthOrb: 'from-green-500 to-green-700'
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
        manaOrb: 'from-blue-500 to-blue-700',
        attackOrb: 'from-red-500 to-red-700',
        healthOrb: 'from-green-500 to-green-700'
      },
      [Rarity.ULTRA_LEGEND]: {
        borderGradient: 'from-pink-400 via-rose-300 to-pink-400',
        glowColor: 'shadow-pink-400/70 animate-pulse divine-glow',
        frameColor: 'border-pink-400',
        textColor: 'text-pink-100',
        bgOverlay: 'bg-gradient-to-b from-pink-900/90 to-rose-800/90',
        nameFrame: 'bg-pink-700/80 border-pink-400/50',
        cornerGem: 'bg-pink-400 animate-pulse shadow-pink-400/70 shadow-xl',
        rarityIcon: <Sparkles className="w-4 h-4" />,
        manaOrb: 'from-blue-500 to-blue-700',
        attackOrb: 'from-red-500 to-red-700',
        healthOrb: 'from-green-500 to-green-700'
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

  return (
    <Card 
      className={cn(
        'relative cursor-pointer overflow-hidden group',
        'transition-all duration-500 ease-out transform-gpu will-change-transform',
        'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900',
        sizeClasses[size],
        rarityConfig.glowColor,
        isSelected && 'ring-4 ring-primary scale-105',
        isAnimated && 'hover:scale-105 hover:-translate-y-2'
      )}
      onClick={handleClick}
    >
      {/* Enhanced Outer Metallic Border Frame */}
      <div className={cn(
        'absolute inset-0 p-[4px] rounded-lg',
        `bg-gradient-to-br ${rarityConfig.borderGradient}`,
        'shadow-lg'
      )}>
        <div className="w-full h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-md" />
      </div>

      {/* Enhanced Inner Ornate Border with Corner Decorations */}
      <div className={cn(
        'absolute inset-[8px] border-2 rounded-md',
        rarityConfig.frameColor,
        'bg-gradient-to-b from-slate-900/50 to-slate-800/50'
      )} />

      {/* Corner Decorative Elements - Enhanced */}
      <div className={cn(
        'absolute top-2 left-2 w-2 h-2 rounded-full',
        rarityConfig.cornerGem,
        'shadow-sm'
      )} />
      <div className={cn(
        'absolute top-2 right-2 w-2 h-2 rounded-full',
        rarityConfig.cornerGem,
        'shadow-sm'
      )} />
      <div className={cn(
        'absolute bottom-2 left-2 w-2 h-2 rounded-full',
        rarityConfig.cornerGem,
        'shadow-sm'
      )} />
      <div className={cn(
        'absolute bottom-2 right-2 w-2 h-2 rounded-full',
        rarityConfig.cornerGem,
        'shadow-sm'
      )} />

      {/* Card Content */}
      <div className="relative z-10 h-full flex flex-col">
        
        {/* Top Section: Mana Cost & Rarity */}
        <div className="flex justify-between items-start p-3">
          {/* Enhanced Mana Cost Circle (LOR Style) */}
          <div className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center',
            'bg-gradient-to-br border-2 border-blue-300 shadow-lg',
            rarityConfig.manaOrb,
            'text-white font-bold text-sm relative'
          )}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
            <span className="relative z-10">{calculatedManaCost}</span>
          </div>

          {/* Enhanced Rarity Badge */}
          <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-full',
            'backdrop-blur-sm border shadow-sm',
            rarityConfig.nameFrame,
            rarityConfig.textColor
          )}>
            {rarityConfig.rarityIcon}
            <span className="text-xs font-bold uppercase tracking-wide">
              {hero.rarity.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Enhanced Hero Portrait */}
        <div className="flex-1 mx-3 mb-3 rounded-md overflow-hidden relative border border-slate-600 shadow-inner">
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
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
            </>
          )}

          {/* Enhanced Level indicator */}
          <div className={cn(
            'absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold',
            'bg-slate-900/90 border border-slate-500 text-slate-100 shadow-sm',
            'backdrop-blur-sm'
          )}>
            LV {hero.level}
          </div>
        </div>

        {/* Enhanced Hero Name Frame (LOR Style) */}
        <div className={cn(
          'mx-3 mb-3 p-2 rounded-md border shadow-sm',
          rarityConfig.nameFrame
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
          <div className="mx-3 mb-3 p-2 rounded-md bg-slate-900/80 border border-slate-600 shadow-sm">
            <div className="text-amber-300 text-xs font-bold mb-1">{hero.abilityName}</div>
            {hero.abilityDescription && (
              <div className="text-slate-300 text-xs leading-tight">
                {hero.abilityDescription}
              </div>
            )}
          </div>
        )}

        {/* Bottom Section: Attack & Health (Enhanced LOR Style) */}
        <div className="flex justify-between items-end p-3">
          {/* Enhanced Attack (bottom left) */}
          <div className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center',
            'bg-gradient-to-br border-2 border-red-300 shadow-lg',
            rarityConfig.attackOrb,
            'text-white font-bold text-sm relative'
          )}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
            <span className="relative z-10">{stats.attack}</span>
          </div>

          {/* Enhanced Health (bottom right) */}
          <div className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center',
            'bg-gradient-to-br border-2 border-green-300 shadow-lg',
            rarityConfig.healthOrb,
            'text-white font-bold text-sm relative'
          )}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
            <span className="relative z-10">{stats.hp}</span>
          </div>
        </div>
      </div>

      {/* Ultra Legendary special effects - Enhanced */}
      {hero.rarity === Rarity.ULTRA_LEGEND && (
        <>
          <div className="absolute inset-0 bg-gradient-conic from-pink-500/20 via-transparent to-pink-500/20 animate-spin duration-[3000ms] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-purple-500/10 animate-pulse pointer-events-none" />
        </>
      )}

      {/* Enhanced Hover Effects */}
      {isAnimated && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </Card>
  );
}