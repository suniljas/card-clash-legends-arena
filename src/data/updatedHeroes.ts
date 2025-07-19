import { HeroCard, Rarity, EditionType } from '@/types/game';
import { EPIC_HEROES_DATABASE } from './epicHeroes';
import { NEW_EPIC_HEROES_DATABASE } from './newHeroes';

// Updated hero database that includes both existing and new heroes
export const HERO_DATABASE: HeroCard[] = [...EPIC_HEROES_DATABASE, ...NEW_EPIC_HEROES_DATABASE];

export const RARITY_DROP_RATES = {
  [Rarity.COMMON]: 0.4,      // 4 heroes (40%)
  [Rarity.UNCOMMON]: 0.2,    // 2 heroes (20%)
  [Rarity.RARE]: 0.1,        // 1 hero (10%)
  [Rarity.VERY_RARE]: 0.1,   // 1 hero (10%)
  [Rarity.EPIC]: 0.15,       // Adjusted for better distribution
  [Rarity.LEGEND]: 0.04,     // Reduced for rarity
  [Rarity.ULTRA_LEGEND]: 0.01 // Ultra rare
};

export const RARITY_COLORS = {
  [Rarity.COMMON]: 'rarity-common',
  [Rarity.UNCOMMON]: 'rarity-uncommon',
  [Rarity.RARE]: 'rarity-rare',
  [Rarity.VERY_RARE]: 'rarity-very-rare',
  [Rarity.EPIC]: 'rarity-epic',
  [Rarity.LEGEND]: 'rarity-legend',
  [Rarity.ULTRA_LEGEND]: 'rarity-ultra-legend'
};

export const EDITION_COLORS = {
  [EditionType.NORMAL]: 'edition-normal',
  [EditionType.PREMIUM]: 'edition-premium',
  [EditionType.SPECIAL]: 'edition-special',
  [EditionType.LIMITED]: 'edition-limited'
};

export function getHeroById(id: string): HeroCard | undefined {
  return HERO_DATABASE.find(hero => hero.id === id);
}

export function getHeroesByRarity(rarity: Rarity): HeroCard[] {
  return HERO_DATABASE.filter(hero => hero.rarity === rarity);
}

export function getHeroesByEdition(edition: EditionType): HeroCard[] {
  return HERO_DATABASE.filter(hero => hero.edition === edition);
}

export function calculateHeroStats(hero: HeroCard): { attack: number; hp: number } {
  const growthRates = {
    [Rarity.COMMON]: 10,
    [Rarity.UNCOMMON]: 15,
    [Rarity.RARE]: 20,
    [Rarity.VERY_RARE]: 25,
    [Rarity.EPIC]: 30,
    [Rarity.LEGEND]: 35,
    [Rarity.ULTRA_LEGEND]: 50
  };

  // Edition multipliers
  const editionMultipliers = {
    [EditionType.NORMAL]: 1.0,
    [EditionType.PREMIUM]: 1.2,
    [EditionType.SPECIAL]: 1.5,
    [EditionType.LIMITED]: 2.0
  };

  const growth = growthRates[hero.rarity];
  const multiplier = editionMultipliers[hero.edition];
  
  return {
    attack: Math.floor((hero.baseAttack + (growth * (hero.level - 1))) * multiplier),
    hp: Math.floor((hero.baseHP + (growth * (hero.level - 1))) * multiplier)
  };
}