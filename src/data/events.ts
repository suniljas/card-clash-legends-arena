import { HeroCard, Rarity } from '@/types/game';
import { HERO_DATABASE } from './heroes';

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  type: 'tournament' | 'special_pack' | 'double_rewards' | 'arena_challenge';
  rewards: {
    coins?: number;
    gems?: number;
    cards?: HeroCard[];
    specialPack?: string;
  };
  requirements?: {
    minLevel?: number;
    completedCampaigns?: number;
  };
  isActive: boolean;
}

export const ACTIVE_EVENTS: GameEvent[] = [
  {
    id: 'starter-tournament',
    name: 'Beginner\'s Tournament',
    description: 'Compete with other new players for exclusive rewards!',
    startTime: new Date(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    type: 'tournament',
    rewards: {
      coins: 1000,
      gems: 100,
      cards: [
        { ...HERO_DATABASE.find(h => h.rarity === Rarity.EPIC)!, id: `tournament-reward-${Date.now()}` }
      ]
    },
    requirements: { minLevel: 1 },
    isActive: true,
  },
  {
    id: 'legendary-pack-event',
    name: 'Legendary Pack Weekend',
    description: 'Get guaranteed legendary cards in special packs!',
    startTime: new Date(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    type: 'special_pack',
    rewards: {
      specialPack: 'legendary-weekend-pack'
    },
    isActive: true,
  },
  {
    id: 'double-coin-event',
    name: 'Double Coin Campaign',
    description: 'Earn double coins from all campaign battles!',
    startTime: new Date(),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    type: 'double_rewards',
    rewards: {},
    isActive: true,
  }
];

export function generateRandomEvent(): GameEvent {
  const eventTypes = ['tournament', 'special_pack', 'double_rewards', 'arena_challenge'] as const;
  const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  const duration = Math.floor(Math.random() * 5) + 1; // 1-5 days
  
  const events: Record<typeof type, () => GameEvent> = {
    tournament: () => ({
      id: `tournament-${Date.now()}`,
      name: 'Hero Championship',
      description: 'Battle for ultimate glory and legendary rewards!',
      startTime: new Date(),
      endTime: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
      type: 'tournament',
      rewards: {
        coins: 500 + Math.floor(Math.random() * 1000),
        gems: 50 + Math.floor(Math.random() * 100),
        cards: [
          { ...HERO_DATABASE[Math.floor(Math.random() * HERO_DATABASE.length)], id: `event-reward-${Date.now()}` }
        ]
      },
      requirements: { minLevel: Math.floor(Math.random() * 5) + 1 },
      isActive: true,
    }),
    special_pack: () => ({
      id: `special-pack-${Date.now()}`,
      name: 'Rare Card Bonanza',
      description: 'Special packs with increased rare card chances!',
      startTime: new Date(),
      endTime: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
      type: 'special_pack',
      rewards: { specialPack: 'rare-bonanza-pack' },
      isActive: true,
    }),
    double_rewards: () => ({
      id: `double-rewards-${Date.now()}`,
      name: 'Double XP Weekend',
      description: 'Earn double experience from all battles!',
      startTime: new Date(),
      endTime: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
      type: 'double_rewards',
      rewards: {},
      isActive: true,
    }),
    arena_challenge: () => ({
      id: `arena-challenge-${Date.now()}`,
      name: 'Arena Master Challenge',
      description: 'Win 10 PvP battles for exclusive rewards!',
      startTime: new Date(),
      endTime: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
      type: 'arena_challenge',
      rewards: {
        coins: 2000,
        gems: 200,
        cards: [
          { ...HERO_DATABASE.find(h => h.rarity === Rarity.LEGEND)!, id: `arena-challenge-${Date.now()}` }
        ]
      },
      requirements: { minLevel: 3 },
      isActive: true,
    })
  };

  return events[type]();
}