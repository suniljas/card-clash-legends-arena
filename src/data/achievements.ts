import { Achievement, AchievementCategory, AchievementRarity } from '@/types/achievements';

export const ACHIEVEMENTS_DATABASE: Achievement[] = [
  // Collection Achievements
  {
    id: 'first_card',
    title: 'Card Collector',
    description: 'Collect your first card',
    icon: '🎴',
    category: AchievementCategory.COLLECTION,
    rarity: AchievementRarity.COMMON,
    criteria: { type: 'count', target: 1 },
    reward: { coins: 100 },
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'card_master',
    title: 'Card Master',
    description: 'Collect 50 unique cards',
    icon: '🏆',
    category: AchievementCategory.COLLECTION,
    rarity: AchievementRarity.EPIC,
    criteria: { type: 'count', target: 50 },
    reward: { gems: 100, cardPacks: 3 },
    unlocked: false,
    progress: 0,
    maxProgress: 50
  },
  {
    id: 'legendary_collector',
    title: 'Legendary Collector',
    description: 'Collect 5 legendary cards',
    icon: '✨',
    category: AchievementCategory.COLLECTION,
    rarity: AchievementRarity.LEGENDARY,
    criteria: { type: 'collection', target: 5, condition: 'legendary' },
    reward: { gems: 500, title: 'Legend Hunter' },
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },

  // Battle Achievements
  {
    id: 'first_victory',
    title: 'First Victory',
    description: 'Win your first battle',
    icon: '⚔️',
    category: AchievementCategory.BATTLE,
    rarity: AchievementRarity.COMMON,
    criteria: { type: 'single', target: 1 },
    reward: { coins: 200 },
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'battle_veteran',
    title: 'Battle Veteran',
    description: 'Complete 100 battles',
    icon: '🛡️',
    category: AchievementCategory.BATTLE,
    rarity: AchievementRarity.RARE,
    criteria: { type: 'count', target: 100 },
    reward: { gems: 200, cardPacks: 2 },
    unlocked: false,
    progress: 0,
    maxProgress: 100
  },

  // Campaign Achievements
  {
    id: 'campaign_starter',
    title: 'Campaign Starter',
    description: 'Complete your first campaign level',
    icon: '🗺️',
    category: AchievementCategory.CAMPAIGN,
    rarity: AchievementRarity.COMMON,
    criteria: { type: 'single', target: 1 },
    reward: { coins: 150 },
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'campaign_hero',
    title: 'Campaign Hero',
    description: 'Reach campaign level 20',
    icon: '👑',
    category: AchievementCategory.CAMPAIGN,
    rarity: AchievementRarity.EPIC,
    criteria: { type: 'count', target: 20 },
    reward: { gems: 300, cardPacks: 5 },
    unlocked: false,
    progress: 0,
    maxProgress: 20
  },

  // PvP Achievements
  {
    id: 'pvp_debut',
    title: 'PvP Debut',
    description: 'Win your first PvP match',
    icon: '⚡',
    category: AchievementCategory.PVP,
    rarity: AchievementRarity.COMMON,
    criteria: { type: 'single', target: 1 },
    reward: { coins: 250 },
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'pvp_champion',
    title: 'PvP Champion',
    description: 'Win 50 PvP matches',
    icon: '🏅',
    category: AchievementCategory.PVP,
    rarity: AchievementRarity.EPIC,
    criteria: { type: 'count', target: 50 },
    reward: { gems: 400, title: 'Arena Champion' },
    unlocked: false,
    progress: 0,
    maxProgress: 50
  },
  {
    id: 'win_streak',
    title: 'Unstoppable',
    description: 'Win 10 matches in a row',
    icon: '🔥',
    category: AchievementCategory.PVP,
    rarity: AchievementRarity.LEGENDARY,
    criteria: { type: 'streak', target: 10 },
    reward: { gems: 1000, cardPacks: 10, title: 'Unstoppable Force' },
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },

  // Special Achievements
  {
    id: 'early_adopter',
    title: 'Early Adopter',
    description: 'Play during the beta period',
    icon: '🌟',
    category: AchievementCategory.SPECIAL,
    rarity: AchievementRarity.LEGENDARY,
    criteria: { type: 'single', target: 1 },
    reward: { gems: 500, title: 'Beta Legend' },
    unlocked: false,
    progress: 0,
    maxProgress: 1
  }
];