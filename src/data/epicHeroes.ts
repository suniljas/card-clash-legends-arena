import { HeroCard, Rarity, EditionType } from '@/types/game';

// Import card images
import commonKnight from '@/assets/cards/common-knight.png';
import rareMage from '@/assets/cards/rare-mage.png';
import legendDragon from '@/assets/cards/legend-dragon.png';
import ultraLegendPhoenix from '@/assets/cards/ultra-legend-phoenix.png';
import uncommonWarrior from '@/assets/cards/uncommon-warrior.png';
import epicSorceress from '@/assets/cards/epic-sorceress.png';
import legendGriffin from '@/assets/cards/legend-griffin.png';
import ultraLegendTitan from '@/assets/cards/ultra-legend-titan.png';
import fierceMage from '@/assets/cards/fierce-mage.jpg';
import masterShaman from '@/assets/cards/master-shaman.jpg';
import strongSorcerer from '@/assets/cards/strong-sorcerer.jpg';
import swiftPriest from '@/assets/cards/swift-priest.jpg';
import fierceWarrior from '@/assets/cards/fierce-warrior.jpg';
import ironGuard from '@/assets/cards/iron-guard.jpg';
import forestRanger from '@/assets/cards/forest-ranger.jpg';
import goldenPaladin from '@/assets/cards/golden-paladin.jpg';
import shadowBlade from '@/assets/cards/shadow-blade.jpg';
import ancientDragon from '@/assets/cards/ancient-dragon.jpg';

// 10 Epic Heroes with multiple editions as per requirements
export const EPIC_HEROES_BASE: Omit<HeroCard, 'edition'>[] = [
  {
    id: 'dark-knight',
    name: 'Dark Knight',
    rarity: Rarity.COMMON,
    baseAttack: 120,
    baseHP: 160,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    abilityName: 'Shadow Strike',
    abilityDescription: 'Deals dark damage to enemy',
    imageUrl: shadowBlade,
    unlocked: true
  },
  {
    id: 'epic-warrior',
    name: 'Epic Warrior',
    rarity: Rarity.UNCOMMON,
    baseAttack: 150,
    baseHP: 180,
    level: 1,
    experience: 0,
    experienceToNext: 150,
    abilityName: 'Berserker Rage',
    abilityDescription: 'Increases attack for 3 turns',
    imageUrl: fierceWarrior,
    unlocked: false
  },
  {
    id: 'flame-mage',
    name: 'Flame Mage',
    rarity: Rarity.RARE,
    baseAttack: 200,
    baseHP: 140,
    level: 1,
    experience: 0,
    experienceToNext: 200,
    abilityName: 'Inferno Blast',
    abilityDescription: 'Area fire damage to all enemies',
    imageUrl: fierceMage,
    unlocked: false
  },
  {
    id: 'shadow-assassin',
    name: 'Shadow Assassin',
    rarity: Rarity.VERY_RARE,
    baseAttack: 280,
    baseHP: 180,
    level: 1,
    experience: 0,
    experienceToNext: 300,
    abilityName: 'Void Strike',
    abilityDescription: 'Ignores all defenses',
    imageUrl: shadowBlade,
    unlocked: false
  },
  {
    id: 'crystal-guardian',
    name: 'Crystal Guardian',
    rarity: Rarity.COMMON,
    baseAttack: 100,
    baseHP: 200,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    abilityName: 'Crystal Shield',
    abilityDescription: 'Reflects damage back to attacker',
    imageUrl: ironGuard,
    unlocked: true
  },
  {
    id: 'storm-lord',
    name: 'Storm Lord',
    rarity: Rarity.UNCOMMON,
    baseAttack: 170,
    baseHP: 160,
    level: 1,
    experience: 0,
    experienceToNext: 150,
    abilityName: 'Lightning Storm',
    abilityDescription: 'Chain lightning damage',
    imageUrl: masterShaman,
    unlocked: false
  },
  {
    id: 'mystic-archer',
    name: 'Mystic Archer',
    rarity: Rarity.COMMON,
    baseAttack: 140,
    baseHP: 120,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    abilityName: 'Piercing Shot',
    abilityDescription: 'Arrow pierces through enemies',
    imageUrl: forestRanger,
    unlocked: true
  },
  {
    id: 'void-priest',
    name: 'Void Priest',
    rarity: Rarity.COMMON,
    baseAttack: 90,
    baseHP: 180,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    abilityName: 'Dark Heal',
    abilityDescription: 'Drains enemy HP to heal allies',
    imageUrl: swiftPriest,
    unlocked: true
  },
  {
    id: 'ancient-dragon',
    name: 'Ancient Dragon',
    rarity: Rarity.VERY_RARE,
    baseAttack: 350,
    baseHP: 300,
    level: 1,
    experience: 0,
    experienceToNext: 500,
    abilityName: 'Dragon Breath',
    abilityDescription: 'Devastating fire breath attack',
    imageUrl: ancientDragon,
    unlocked: false
  },
  {
    id: 'celestial-phoenix',
    name: 'Celestial Phoenix',
    rarity: Rarity.VERY_RARE,
    baseAttack: 320,
    baseHP: 250,
    level: 1,
    experience: 0,
    experienceToNext: 500,
    abilityName: 'Phoenix Rebirth',
    abilityDescription: 'Revives with full HP when defeated',
    imageUrl: ultraLegendPhoenix,
    unlocked: false
  }
];

// Generate all editions for each hero
export const EPIC_HEROES_DATABASE: HeroCard[] = [];

EPIC_HEROES_BASE.forEach(baseHero => {
  // Normal Edition
  EPIC_HEROES_DATABASE.push({
    ...baseHero,
    id: `${baseHero.id}-normal`,
    edition: EditionType.NORMAL
  });

  // Premium Edition - Enhanced stats
  EPIC_HEROES_DATABASE.push({
    ...baseHero,
    id: `${baseHero.id}-premium`,
    edition: EditionType.PREMIUM,
    baseAttack: Math.floor(baseHero.baseAttack * 1.2),
    baseHP: Math.floor(baseHero.baseHP * 1.2),
    abilityDescription: `Enhanced: ${baseHero.abilityDescription}`
  });

  // Special Edition - Significantly enhanced
  EPIC_HEROES_DATABASE.push({
    ...baseHero,
    id: `${baseHero.id}-special`,
    edition: EditionType.SPECIAL,
    baseAttack: Math.floor(baseHero.baseAttack * 1.5),
    baseHP: Math.floor(baseHero.baseHP * 1.5),
    abilityDescription: `Special: ${baseHero.abilityDescription} + bonus effects`
  });

  // Limited Edition - Ultra rare with maximum enhancements
  if (Math.random() < 0.3) { // Only some heroes get limited editions
    EPIC_HEROES_DATABASE.push({
      ...baseHero,
      id: `${baseHero.id}-limited`,
      edition: EditionType.LIMITED,
      baseAttack: Math.floor(baseHero.baseAttack * 2),
      baseHP: Math.floor(baseHero.baseHP * 2),
      abilityDescription: `Limited: ${baseHero.abilityDescription} + exclusive legendary effects`,
      unlocked: false
    });
  }
});