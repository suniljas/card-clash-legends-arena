import { HeroCard, Rarity } from '@/types/game';

// Import card images
import commonKnight from '@/assets/cards/common-knight.png';
import rareMage from '@/assets/cards/rare-mage.png';
import legendDragon from '@/assets/cards/legend-dragon.png';
import ultraLegendPhoenix from '@/assets/cards/ultra-legend-phoenix.png';
import uncommonWarrior from '@/assets/cards/uncommon-warrior.png';
import epicSorceress from '@/assets/cards/epic-sorceress.png';
import legendGriffin from '@/assets/cards/legend-griffin.png';
import ultraLegendTitan from '@/assets/cards/ultra-legend-titan.png';

export const EXPANDED_HERO_DATABASE: HeroCard[] = [
  // Common Heroes (50 cards)
  {
    id: 'iron-guard',
    name: 'Iron Guard',
    rarity: Rarity.COMMON,
    baseAttack: 85,
    baseHP: 140,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    abilityName: 'Shield Bash',
    abilityDescription: 'Stuns enemy for 1 turn',
    imageUrl: commonKnight,
    unlocked: true
  },
  {
    id: 'forest-ranger',
    name: 'Forest Ranger',
    rarity: Rarity.COMMON,
    baseAttack: 95,
    baseHP: 125,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    abilityName: 'Nature Shot',
    abilityDescription: 'Piercing attack that hits multiple enemies',
    unlocked: true
  },
  {
    id: 'apprentice-mage',
    name: 'Apprentice Mage',
    rarity: Rarity.COMMON,
    baseAttack: 75,
    baseHP: 110,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    abilityName: 'Magic Bolt',
    abilityDescription: 'Basic magic damage',
    unlocked: true
  },
  {
    id: 'village-priest',
    name: 'Village Priest',
    rarity: Rarity.COMMON,
    baseAttack: 60,
    baseHP: 130,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    abilityName: 'Blessing',
    abilityDescription: 'Heals ally and boosts attack',
    unlocked: true
  },
  {
    id: 'town-militia',
    name: 'Town Militia',
    rarity: Rarity.COMMON,
    baseAttack: 90,
    baseHP: 120,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    abilityName: 'Rally',
    abilityDescription: 'Boosts nearby allies attack',
    unlocked: true
  },

  // Uncommon Heroes (40 cards)
  {
    id: 'steel-templar',
    name: 'Steel Templar',
    rarity: Rarity.UNCOMMON,
    baseAttack: 130,
    baseHP: 180,
    level: 1,
    experience: 0,
    experienceToNext: 150,
    abilityName: 'Divine Strike',
    abilityDescription: 'Holy damage that pierces armor',
    unlocked: false
  },
  {
    id: 'shadow-blade',
    name: 'Shadow Blade',
    rarity: Rarity.UNCOMMON,
    baseAttack: 155,
    baseHP: 140,
    level: 1,
    experience: 0,
    experienceToNext: 150,
    abilityName: 'Stealth Strike',
    abilityDescription: 'Invisible attack with critical chance',
    unlocked: false
  },
  {
    id: 'frost-mage',
    name: 'Frost Mage',
    rarity: Rarity.UNCOMMON,
    baseAttack: 120,
    baseHP: 150,
    level: 1,
    experience: 0,
    experienceToNext: 150,
    abilityName: 'Ice Shard',
    abilityDescription: 'Slows enemy and deals damage',
    unlocked: false
  },
  {
    id: 'storm-archer',
    name: 'Storm Archer',
    rarity: Rarity.UNCOMMON,
    baseAttack: 145,
    baseHP: 135,
    level: 1,
    experience: 0,
    experienceToNext: 150,
    abilityName: 'Lightning Arrow',
    abilityDescription: 'Electric damage that chains',
    unlocked: false
  },
  {
    id: 'earth-shaman',
    name: 'Earth Shaman',
    rarity: Rarity.UNCOMMON,
    baseAttack: 110,
    baseHP: 170,
    level: 1,
    experience: 0,
    experienceToNext: 150,
    abilityName: 'Stone Skin',
    abilityDescription: 'Increases defense and heals',
    unlocked: false
  },

  // Rare Heroes (30 cards)
  {
    id: 'golden-paladin',
    name: 'Golden Paladin',
    rarity: Rarity.RARE,
    baseAttack: 190,
    baseHP: 220,
    level: 1,
    experience: 0,
    experienceToNext: 200,
    abilityName: 'Sacred Light',
    abilityDescription: 'Heals all allies and damages enemies',
    imageUrl: rareMage,
    unlocked: false
  },
  {
    id: 'void-assassin',
    name: 'Void Assassin',
    rarity: Rarity.RARE,
    baseAttack: 230,
    baseHP: 160,
    level: 1,
    experience: 0,
    experienceToNext: 200,
    abilityName: 'Void Strike',
    abilityDescription: 'Ignores all defenses',
    unlocked: false
  },
  {
    id: 'arcane-master',
    name: 'Arcane Master',
    rarity: Rarity.RARE,
    baseAttack: 210,
    baseHP: 180,
    level: 1,
    experience: 0,
    experienceToNext: 200,
    abilityName: 'Arcane Explosion',
    abilityDescription: 'Massive area magic damage',
    unlocked: false
  },
  {
    id: 'crimson-berserker',
    name: 'Crimson Berserker',
    rarity: Rarity.RARE,
    baseAttack: 240,
    baseHP: 170,
    level: 1,
    experience: 0,
    experienceToNext: 200,
    abilityName: 'Blood Rage',
    abilityDescription: 'Attack increases as HP decreases',
    unlocked: false
  },
  {
    id: 'celestial-healer',
    name: 'Celestial Healer',
    rarity: Rarity.RARE,
    baseAttack: 150,
    baseHP: 250,
    level: 1,
    experience: 0,
    experienceToNext: 200,
    abilityName: 'Divine Renewal',
    abilityDescription: 'Resurrects fallen allies',
    unlocked: false
  },

  // Epic Heroes (20 cards)
  {
    id: 'dragon-lord',
    name: 'Dragon Lord',
    rarity: Rarity.EPIC,
    baseAttack: 280,
    baseHP: 320,
    level: 1,
    experience: 0,
    experienceToNext: 300,
    abilityName: 'Dragon Storm',
    abilityDescription: 'Summons fire tornadoes',
    unlocked: false
  },
  {
    id: 'lich-king',
    name: 'Lich King',
    rarity: Rarity.EPIC,
    baseAttack: 260,
    baseHP: 300,
    level: 1,
    experience: 0,
    experienceToNext: 300,
    abilityName: 'Death Magic',
    abilityDescription: 'Drains life from all enemies',
    unlocked: false
  },
  {
    id: 'titan-warrior',
    name: 'Titan Warrior',
    rarity: Rarity.EPIC,
    baseAttack: 300,
    baseHP: 280,
    level: 1,
    experience: 0,
    experienceToNext: 300,
    abilityName: 'Titan Smash',
    abilityDescription: 'Earthquake that stuns all enemies',
    unlocked: false
  },
  {
    id: 'phoenix-mage',
    name: 'Phoenix Mage',
    rarity: Rarity.EPIC,
    baseAttack: 250,
    baseHP: 290,
    level: 1,
    experience: 0,
    experienceToNext: 300,
    abilityName: 'Phoenix Fire',
    abilityDescription: 'Burning damage over time',
    unlocked: false
  },
  {
    id: 'void-keeper',
    name: 'Void Keeper',
    rarity: Rarity.EPIC,
    baseAttack: 270,
    baseHP: 310,
    level: 1,
    experience: 0,
    experienceToNext: 300,
    abilityName: 'Void Portal',
    abilityDescription: 'Banishes enemies temporarily',
    unlocked: false
  },

  // Legend Heroes (8 cards)
  {
    id: 'ancient-dragon',
    name: 'Ancient Dragon',
    rarity: Rarity.LEGEND,
    baseAttack: 350,
    baseHP: 400,
    level: 1,
    experience: 0,
    experienceToNext: 500,
    abilityName: 'Ancient Wrath',
    abilityDescription: 'Devastating fire that grows stronger',
    imageUrl: legendDragon,
    unlocked: false
  },
  {
    id: 'cosmic-guardian',
    name: 'Cosmic Guardian',
    rarity: Rarity.LEGEND,
    baseAttack: 320,
    baseHP: 420,
    level: 1,
    experience: 0,
    experienceToNext: 500,
    abilityName: 'Star Shield',
    abilityDescription: 'Reflects all damage back to enemies',
    unlocked: false
  },
  {
    id: 'time-weaver',
    name: 'Time Weaver',
    rarity: Rarity.LEGEND,
    baseAttack: 300,
    baseHP: 380,
    level: 1,
    experience: 0,
    experienceToNext: 500,
    abilityName: 'Time Stop',
    abilityDescription: 'Freezes all enemies in time',
    unlocked: false
  },
  {
    id: 'soul-reaper',
    name: 'Soul Reaper',
    rarity: Rarity.LEGEND,
    baseAttack: 380,
    baseHP: 350,
    level: 1,
    experience: 0,
    experienceToNext: 500,
    abilityName: 'Soul Harvest',
    abilityDescription: 'Instantly defeats low-health enemies',
    unlocked: false
  },

  // Ultra Legend Heroes (2 cards)
  {
    id: 'infinity-phoenix',
    name: 'Infinity Phoenix',
    rarity: Rarity.ULTRA_LEGEND,
    baseAttack: 450,
    baseHP: 500,
    level: 1,
    experience: 0,
    experienceToNext: 1000,
    abilityName: 'Infinite Rebirth',
    abilityDescription: 'Cannot be permanently defeated',
    imageUrl: ultraLegendPhoenix,
    unlocked: false
  },
  {
    id: 'reality-shaper',
    name: 'Reality Shaper',
    rarity: Rarity.ULTRA_LEGEND,
    baseAttack: 500,
    baseHP: 450,
    level: 1,
    experience: 0,
    experienceToNext: 1000,
    abilityName: 'Reality Warp',
    abilityDescription: 'Rewrites the laws of the battlefield',
    unlocked: false
  }
];

// Generate additional heroes to reach 150 total
const generateAdditionalHeroes = (): HeroCard[] => {
  const additionalHeroes: HeroCard[] = [];
  const rarityTargets = {
    [Rarity.COMMON]: 45, // Need 45 more commons
    [Rarity.UNCOMMON]: 35, // Need 35 more uncommons  
    [Rarity.RARE]: 25, // Need 25 more rares
    [Rarity.EPIC]: 15, // Need 15 more epics
    [Rarity.LEGEND]: 4, // Need 4 more legends
    [Rarity.ULTRA_LEGEND]: 1 // Need 1 more ultra legend
  };

  const nameTemplates = {
    [Rarity.COMMON]: ['Brave', 'Swift', 'Strong', 'Bold', 'Fierce', 'Noble'],
    [Rarity.UNCOMMON]: ['Elite', 'Veteran', 'Master', 'Champion', 'Skilled'],
    [Rarity.RARE]: ['Royal', 'Divine', 'Mystic', 'Sacred', 'Legendary'],
    [Rarity.EPIC]: ['Supreme', 'Eternal', 'Immortal', 'Godlike', 'Mythic'],
    [Rarity.LEGEND]: ['Primordial', 'Celestial', 'Transcendent', 'Omnipotent'],
    [Rarity.ULTRA_LEGEND]: ['Omniversal', 'Infinite', 'Absolute', 'Perfect']
  };

  const classTypes = ['Warrior', 'Mage', 'Archer', 'Paladin', 'Assassin', 'Berserker', 'Shaman', 'Priest', 'Guardian', 'Sorcerer'];

  Object.entries(rarityTargets).forEach(([rarity, count]) => {
    const rarityEnum = rarity as Rarity;
    const baseStats = {
      [Rarity.COMMON]: { attack: [70, 100], hp: [100, 150] },
      [Rarity.UNCOMMON]: { attack: [110, 160], hp: [130, 180] },
      [Rarity.RARE]: { attack: [180, 250], hp: [160, 240] },
      [Rarity.EPIC]: { attack: [250, 320], hp: [280, 350] },
      [Rarity.LEGEND]: { attack: [320, 400], hp: [350, 450] },
      [Rarity.ULTRA_LEGEND]: { attack: [450, 500], hp: [450, 500] }
    };

    for (let i = 0; i < count; i++) {
      const namePrefix = nameTemplates[rarityEnum][Math.floor(Math.random() * nameTemplates[rarityEnum].length)];
      const classType = classTypes[Math.floor(Math.random() * classTypes.length)];
      const stats = baseStats[rarityEnum];
      
      additionalHeroes.push({
        id: `${rarityEnum}-${namePrefix.toLowerCase()}-${classType.toLowerCase()}-${i + 1}`,
        name: `${namePrefix} ${classType}`,
        rarity: rarityEnum,
        baseAttack: Math.floor(Math.random() * (stats.attack[1] - stats.attack[0]) + stats.attack[0]),
        baseHP: Math.floor(Math.random() * (stats.hp[1] - stats.hp[0]) + stats.hp[0]),
        level: 1,
        experience: 0,
        experienceToNext: rarityEnum === Rarity.ULTRA_LEGEND ? 1000 : 
                          rarityEnum === Rarity.LEGEND ? 500 :
                          rarityEnum === Rarity.EPIC ? 300 :
                          rarityEnum === Rarity.RARE ? 200 :
                          rarityEnum === Rarity.UNCOMMON ? 150 : 100,
        abilityName: `${namePrefix} Power`,
        abilityDescription: `A powerful ${rarityEnum} ability`,
        unlocked: rarityEnum === Rarity.COMMON
      });
    }
  });

  return additionalHeroes;
};

export const ALL_HEROES = [...EXPANDED_HERO_DATABASE, ...generateAdditionalHeroes()];