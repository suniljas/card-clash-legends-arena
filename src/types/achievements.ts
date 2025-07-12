export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  criteria: AchievementCriteria;
  reward: AchievementReward;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export enum AchievementCategory {
  COLLECTION = 'collection',
  BATTLE = 'battle',
  CAMPAIGN = 'campaign',
  PVP = 'pvp',
  SOCIAL = 'social',
  SPECIAL = 'special'
}

export enum AchievementRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export interface AchievementCriteria {
  type: 'count' | 'streak' | 'single' | 'collection';
  target: number;
  condition?: string;
}

export interface AchievementReward {
  coins?: number;
  gems?: number;
  cardPacks?: number;
  title?: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  value: number;
  rank: number;
  lastUpdated: Date;
}

export interface Leaderboard {
  id: string;
  name: string;
  description: string;
  category: LeaderboardCategory;
  entries: LeaderboardEntry[];
  lastUpdated: Date;
}

export enum LeaderboardCategory {
  PVP_WINS = 'pvp_wins',
  CAMPAIGN_PROGRESS = 'campaign_progress',
  COLLECTION_SIZE = 'collection_size',
  TOTAL_BATTLES = 'total_battles',
  WIN_STREAK = 'win_streak',
  GEMS_EARNED = 'gems_earned'
}