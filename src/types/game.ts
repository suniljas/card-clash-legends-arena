export enum Rarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  VERY_RARE = 'very-rare',
  EPIC = 'epic',
  LEGEND = 'legend',
  ULTRA_LEGEND = 'ultra-legend'
}

export enum EditionType {
  NORMAL = 'normal',
  PREMIUM = 'premium',
  SPECIAL = 'special',
  LIMITED = 'limited'
}

export interface HeroCard {
  id: string;
  name: string;
  rarity: Rarity;
  edition: EditionType;
  baseAttack: number;
  baseHP: number;
  currentHP?: number; // Added for battle tracking
  level: number;
  experience: number;
  experienceToNext: number;
  abilityName?: string;
  abilityDescription?: string;
  imageUrl?: string;
  unlocked: boolean;
}

export interface PlayerDeck {
  cards: HeroCard[];
  maxSize: number;
}

export interface GameStats {
  totalCards: number;
  totalBattles: number;
  campaignProgress: number;
  pvpWins: number;
  pvpLosses: number;
  coins: number;
  gems: number;
}

export interface BattleResult {
  victory: boolean;
  experienceGained: number;
  coinsEarned: number;
  cardsEarned: HeroCard[];
  survivingCards: HeroCard[];
}

export interface CampaignLevel {
  id: number;
  name: string;
  difficulty: number;
  enemyDeck: HeroCard[];
  rewards: {
    coins: number;
    experience: number;
    cards?: HeroCard[];
  };
  unlocked: boolean;
  completed: boolean;
}

export interface Opponent {
  name: string;
  deck: HeroCard[];
  difficulty: number;
  avatar?: string;
}

export interface Tournament {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  participants: number;
  maxParticipants: number;
  entryFee: number;
  prizes: {
    coins: number;
    cards: HeroCard[];
    gems: number;
  };
}

export interface MarketListing {
  id: string;
  card: HeroCard;
  price: number;
  currency: 'gems';
  seller: string;
  timeRemaining: number;
  listedAt: Date;
}

export interface CampaignParticipant {
  id: string;
  playerId: string;
  playerName: string;
  completedAt: Date;
  cardsEarned: HeroCard[];
  coinsEarned: number;
}

export interface CampaignInstance {
  id: string;
  levelId: number;
  participants: CampaignParticipant[];
  maxParticipants: number;
  status: 'active' | 'completed';
  createdAt: Date;
}

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

export interface Settings {
  musicVolume: number;
  soundVolume: number;
  haptics: boolean;
  language: string;
  accountProvider: 'google' | 'facebook' | 'none';
  isMusicMuted: boolean;
  isSoundMuted: boolean;
}