import { HeroCard, Rarity, EditionType } from '@/types/game';

// Import card images
import fierceMage from '@/assets/cards/fierce-mage.jpg';
import shadowBlade from '@/assets/cards/shadow-blade.jpg';
import forestRanger from '@/assets/cards/forest-ranger.jpg';

// 3 Epic Heroes as requested: Flame Mage, Shadow Assassin, Tree Guardian
export const NEW_EPIC_HEROES_BASE: Omit<HeroCard, 'edition'>[] = [
  {
    id: 'flame-mage',
    name: 'Flame Mage',
    rarity: Rarity.COMMON,
    baseAttack: 180,
    baseHP: 140,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    abilityName: 'Inferno Blast',
    abilityDescription: 'Unleashes devastating fire magic that burns all enemies',
    imageUrl: fierceMage,
    unlocked: true
  },
  {
    id: 'shadow-assassin',
    name: 'Shadow Assassin',
    rarity: Rarity.COMMON,
    baseAttack: 220,
    baseHP: 120,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    abilityName: 'Shadow Strike',
    abilityDescription: 'Moves through shadows to deliver critical strikes',
    imageUrl: shadowBlade,
    unlocked: true
  },
  {
    id: 'tree-guardian',
    name: 'Tree Guardian',
    rarity: Rarity.COMMON,
    baseAttack: 140,
    baseHP: 200,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    abilityName: 'Nature\'s Wrath',
    abilityDescription: 'Calls upon forest spirits to protect and heal allies',
    imageUrl: forestRanger,
    unlocked: true
  }
];

// Generate all 3 editions for each hero: Normal, Premium, Special
export const NEW_EPIC_HEROES_DATABASE: HeroCard[] = [];

NEW_EPIC_HEROES_BASE.forEach(baseHero => {
  // Normal Edition - Basic outfit, standard effects
  NEW_EPIC_HEROES_DATABASE.push({
    ...baseHero,
    id: `${baseHero.id}-normal`,
    edition: EditionType.NORMAL,
    rarity: Rarity.COMMON
  });

  // Premium Edition - Unique outfit, enhanced effects
  NEW_EPIC_HEROES_DATABASE.push({
    ...baseHero,
    id: `${baseHero.id}-premium`,
    edition: EditionType.PREMIUM,
    rarity: Rarity.UNCOMMON,
    baseAttack: Math.floor(baseHero.baseAttack * 1.15),
    baseHP: Math.floor(baseHero.baseHP * 1.15),
    abilityDescription: `Premium: ${baseHero.abilityDescription} with enhanced visual effects`,
    unlocked: false
  });

  // Special Edition - Rare visuals, animated effects
  NEW_EPIC_HEROES_DATABASE.push({
    ...baseHero,
    id: `${baseHero.id}-special`,
    edition: EditionType.SPECIAL,
    rarity: Rarity.RARE,
    baseAttack: Math.floor(baseHero.baseAttack * 1.3),
    baseHP: Math.floor(baseHero.baseHP * 1.3),
    abilityDescription: `Special: ${baseHero.abilityDescription} with rare animated effects`,
    unlocked: false
  });
});

export const EDITION_DESCRIPTIONS = {
  [EditionType.NORMAL]: 'Basic outfit, standard effects',
  [EditionType.PREMIUM]: 'Unique outfit, enhanced effects',
  [EditionType.SPECIAL]: 'Rare visuals, animated effects'
};

export const EDITION_VISUAL_EFFECTS = {
  [EditionType.NORMAL]: 'basic-glow',
  [EditionType.PREMIUM]: 'premium-shine',
  [EditionType.SPECIAL]: 'special-animation'
};