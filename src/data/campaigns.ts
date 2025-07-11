import { CampaignLevel, HeroCard, Rarity } from '@/types/game';
import { HERO_DATABASE } from './heroes';

export const CAMPAIGN_DATA: CampaignLevel[] = [
  // Beginner Campaign
  {
    id: 1,
    name: "Forest Outpost",
    difficulty: 1,
    enemyDeck: [
      { ...HERO_DATABASE[0], level: 1 }, // Warrior Novice
      { ...HERO_DATABASE[1], level: 1 }, // Forest Scout
    ],
    rewards: { coins: 100, experience: 50 },
    unlocked: true,
    completed: false,
  },
  {
    id: 2,
    name: "Mountain Pass",
    difficulty: 2,
    enemyDeck: [
      { ...HERO_DATABASE[0], level: 2 },
      { ...HERO_DATABASE[2], level: 1 }, // Village Mage
      { ...HERO_DATABASE[3], level: 1 }, // Steel Knight
    ],
    rewards: { 
      coins: 150, 
      experience: 75,
      cards: [{ ...HERO_DATABASE[3], id: `steel-knight-reward-${Date.now()}` }]
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 3,
    name: "Dark Caverns",
    difficulty: 3,
    enemyDeck: [
      { ...HERO_DATABASE[3], level: 2 },
      { ...HERO_DATABASE[4], level: 1 }, // Fire Archer
      { ...HERO_DATABASE[5], level: 1 }, // Crystal Wizard
    ],
    rewards: { 
      coins: 200, 
      experience: 100,
      cards: [{ ...HERO_DATABASE[4], id: `fire-archer-reward-${Date.now()}` }]
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 4,
    name: "Ancient Ruins",
    difficulty: 4,
    enemyDeck: [
      { ...HERO_DATABASE[5], level: 2 },
      { ...HERO_DATABASE[6], level: 1 }, // Shadow Assassin
      { ...HERO_DATABASE[7], level: 1 }, // Dragon Knight
    ],
    rewards: { 
      coins: 300, 
      experience: 150,
      cards: [{ ...HERO_DATABASE[6], id: `shadow-assassin-reward-${Date.now()}` }]
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 5,
    name: "Dragon's Lair",
    difficulty: 5,
    enemyDeck: [
      { ...HERO_DATABASE[7], level: 3 },
      { ...HERO_DATABASE[8], level: 2 }, // Phoenix Guardian
    ],
    rewards: { 
      coins: 500, 
      experience: 250,
      cards: [{ ...HERO_DATABASE[7], id: `dragon-knight-reward-${Date.now()}` }]
    },
    unlocked: false,
    completed: false,
  },
  {
    id: 6,
    name: "Cosmic Battlefield",
    difficulty: 6,
    enemyDeck: [
      { ...HERO_DATABASE[8], level: 3 },
      { ...HERO_DATABASE[9], level: 1 }, // Cosmic Destroyer
    ],
    rewards: { 
      coins: 1000, 
      experience: 500,
      cards: [{ ...HERO_DATABASE[9], id: `cosmic-destroyer-reward-${Date.now()}` }]
    },
    unlocked: false,
    completed: false,
  }
];

export function generateEndlessCampaign(level: number): CampaignLevel {
  const difficulty = Math.min(level, 10);
  const enemyCount = Math.min(Math.floor(level / 2) + 2, 5);
  
  const enemyDeck: HeroCard[] = [];
  for (let i = 0; i < enemyCount; i++) {
    const randomHero = HERO_DATABASE[Math.floor(Math.random() * HERO_DATABASE.length)];
    enemyDeck.push({
      ...randomHero,
      level: Math.max(1, level - 2 + Math.floor(Math.random() * 3)),
      id: `${randomHero.id}-endless-${level}-${i}`
    });
  }

  return {
    id: level,
    name: `Endless Battle ${level}`,
    difficulty,
    enemyDeck,
    rewards: {
      coins: 50 + (level * 25),
      experience: 25 + (level * 15),
      ...(level % 5 === 0 && {
        cards: [{ 
          ...HERO_DATABASE[Math.floor(Math.random() * HERO_DATABASE.length)],
          id: `endless-reward-${level}-${Date.now()}`
        }]
      })
    },
    unlocked: true,
    completed: false,
  };
}