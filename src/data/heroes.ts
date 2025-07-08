import { HeroCard, Rarity } from '@/types/game';

export const HERO_DATABASE: HeroCard[] = [
  // Common Heroes
  {
    id: 'warrior-novice',
    name: 'Warrior Novice',
    rarity: Rarity.COMMON,
    baseAttack: 100,
    baseHP: 150,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    abilityName: 'Battle Cry',
    abilityDescription: 'Increases attack by 10% for 2 turns',
    unlocked: true
  },
  {
    id: 'forest-scout',
    name: 'Forest Scout',
    rarity: Rarity.COMMON,
    baseAttack: 90,
    baseHP: 120,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    abilityName: 'Quick Strike',
    abilityDescription: 'Attacks twice in one turn',
    unlocked: true
  },
  {
    id: 'village-mage',
    name: 'Village Mage',
    rarity: Rarity.COMMON,
    baseAttack: 80,
    baseHP: 100,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    abilityName: 'Heal',
    abilityDescription: 'Restores 50 HP to self',
    unlocked: true
  },

  // Uncommon Heroes
  {
    id: 'steel-knight',
    name: 'Steel Knight',
    rarity: Rarity.UNCOMMON,
    baseAttack: 150,
    baseHP: 200,
    level: 1,
    experience: 0,
    experienceToNext: 150,
    abilityName: 'Shield Wall',
    abilityDescription: 'Reduces all damage by 50% for 3 turns',
    unlocked: false
  },
  {
    id: 'fire-archer',
    name: 'Fire Archer',
    rarity: Rarity.UNCOMMON,
    baseAttack: 140,
    baseHP: 160,
    level: 1,
    experience: 0,
    experienceToNext: 150,
    abilityName: 'Flame Arrow',
    abilityDescription: 'Deals 200% damage and burns enemy',
    unlocked: false
  },

  // Rare Heroes
  {
    id: 'crystal-wizard',
    name: 'Crystal Wizard',
    rarity: Rarity.RARE,
    baseAttack: 200,
    baseHP: 180,
    level: 1,
    experience: 0,
    experienceToNext: 200,
    abilityName: 'Crystal Blast',
    abilityDescription: 'Damages all enemies for 150% attack',
    unlocked: false
  },
  {
    id: 'shadow-assassin',
    name: 'Shadow Assassin',
    rarity: Rarity.RARE,
    baseAttack: 220,
    baseHP: 140,
    level: 1,
    experience: 0,
    experienceToNext: 200,
    abilityName: 'Shadow Strike',
    abilityDescription: 'Critical hit that ignores armor',
    unlocked: false
  },

  // Epic Heroes
  {
    id: 'dragon-knight',
    name: 'Dragon Knight',
    rarity: Rarity.EPIC,
    baseAttack: 250,
    baseHP: 300,
    level: 1,
    experience: 0,
    experienceToNext: 300,
    abilityName: 'Dragon Breath',
    abilityDescription: 'Massive fire damage to all enemies',
    unlocked: false
  },

  // Legend Heroes
  {
    id: 'phoenix-guardian',
    name: 'Phoenix Guardian',
    rarity: Rarity.LEGEND,
    baseAttack: 300,
    baseHP: 350,
    level: 1,
    experience: 0,
    experienceToNext: 500,
    abilityName: 'Rebirth',
    abilityDescription: 'Revives with full HP when defeated',
    unlocked: false
  },

  // Ultra Legend Heroes
  {
    id: 'cosmic-destroyer',
    name: 'Cosmic Destroyer',
    rarity: Rarity.ULTRA_LEGEND,
    baseAttack: 400,
    baseHP: 400,
    level: 1,
    experience: 0,
    experienceToNext: 1000,
    abilityName: 'Cosmic Storm',
    abilityDescription: 'Destroys all enemies instantly',
    unlocked: false
  }
];

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