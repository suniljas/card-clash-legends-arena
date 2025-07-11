import { HeroCard, Rarity } from '@/types/game';
import { ALL_HEROES } from './expandedHeroes';

export const HERO_DATABASE: HeroCard[] = ALL_HEROES;
// HERO_DATABASE is now imported from expandedHeroes.ts for better organization

export const RARITY_DROP_RATES = {
  [Rarity.COMMON]: 0.5,
  [Rarity.UNCOMMON]: 0.3,
  [Rarity.RARE]: 0.1,
  [Rarity.EPIC]: 0.07,
  [Rarity.LEGEND]: 0.02,
  [Rarity.ULTRA_LEGEND]: 0.01
};

export const RARITY_COLORS = {
  [Rarity.COMMON]: 'rarity-common',
  [Rarity.UNCOMMON]: 'rarity-uncommon',
  [Rarity.RARE]: 'rarity-rare',
  [Rarity.EPIC]: 'rarity-epic',
  [Rarity.LEGEND]: 'rarity-legend',
  [Rarity.ULTRA_LEGEND]: 'rarity-ultra-legend'
};

export function getHeroById(id: string): HeroCard | undefined {
  return HERO_DATABASE.find(hero => hero.id === id);
}

export function getHeroesByRarity(rarity: Rarity): HeroCard[] {
  return HERO_DATABASE.filter(hero => hero.rarity === rarity);
}

export function calculateHeroStats(hero: HeroCard): { attack: number; hp: number } {
  const growthRates = {
    [Rarity.COMMON]: 10,
    [Rarity.UNCOMMON]: 15,
    [Rarity.RARE]: 20,
    [Rarity.EPIC]: 25,
    [Rarity.LEGEND]: 30,
    [Rarity.ULTRA_LEGEND]: 40
  };

  const growth = growthRates[hero.rarity];
  return {
    attack: hero.baseAttack + (growth * (hero.level - 1)),
    hp: hero.baseHP + (growth * (hero.level - 1))
  };
}