// Faction Road and Weekly Vault progression system
import { Faction, Rarity } from './CardSystem';

// Re-export for component use
export { Faction } from './CardSystem';

export interface FactionRoad {
  faction: Faction;
  level: number;
  experience: number;
  experienceToNext: number;
  rewards: RoadReward[];
}

export interface RoadReward {
  level: number;
  type: 'card' | 'capsule' | 'shards' | 'champion';
  cardId?: string;
  quantity: number;
  claimed: boolean;
}

export interface WeeklyVault {
  level: number;
  experience: number;
  experienceToNext: number;
  chests: VaultChest[];
  bonusChests: VaultChest[];
}

export interface VaultChest {
  type: 'common' | 'rare' | 'epic' | 'champion';
  guaranteed: boolean;
  contents: VaultReward[];
}

export interface VaultReward {
  type: 'card' | 'shards' | 'cosmetic';
  cardId?: string;
  quantity: number;
  rarity?: Rarity;
}

export interface DailyQuest {
  id: string;
  description: string;
  progress: number;
  target: number;
  reward: number; // XP amount
  completed: boolean;
  faction?: Faction;
}

export class ProgressionSystem {
  private factionRoads: Map<Faction, FactionRoad> = new Map();
  private weeklyVault: WeeklyVault;
  private dailyQuests: DailyQuest[] = [];
  private craftingShards: number = 0;

  constructor() {
    this.initializeFactionRoads();
    this.initializeWeeklyVault();
    this.generateDailyQuests();
  }

  private initializeFactionRoads(): void {
    Object.values(Faction).forEach(faction => {
      const road: FactionRoad = {
        faction,
        level: 1,
        experience: 0,
        experienceToNext: 1000,
        rewards: this.generateFactionRewards(faction)
      };
      this.factionRoads.set(faction, road);
    });
  }

  private generateFactionRewards(faction: Faction): RoadReward[] {
    const rewards: RoadReward[] = [];
    
    // Generate 20 levels of rewards per faction
    for (let level = 1; level <= 20; level++) {
      if (level % 5 === 0) {
        // Every 5th level: Champion card
        rewards.push({
          level,
          type: 'champion',
          cardId: this.getChampionForFaction(faction),
          quantity: 1,
          claimed: false
        });
      } else if (level % 3 === 0) {
        // Every 3rd level: Rare capsule
        rewards.push({
          level,
          type: 'capsule',
          quantity: 1,
          claimed: false
        });
      } else {
        // Regular levels: Specific faction cards or shards
        rewards.push({
          level,
          type: level % 2 === 0 ? 'shards' : 'card',
          cardId: level % 2 === 1 ? this.getRandomFactionCard(faction) : undefined,
          quantity: level % 2 === 0 ? 100 : 1,
          claimed: false
        });
      }
    }
    
    return rewards;
  }

  private initializeWeeklyVault(): void {
    this.weeklyVault = {
      level: 1,
      experience: 0,
      experienceToNext: 2000,
      chests: [],
      bonusChests: []
    };
  }

  private generateDailyQuests(): void {
    const questTemplates = [
      { description: "Win 3 games", target: 3, reward: 1000 },
      { description: "Play 10 Fire cards", target: 10, reward: 800, faction: Faction.FIRE },
      { description: "Play 10 Shadow cards", target: 10, reward: 800, faction: Faction.SHADOW },
      { description: "Play 10 Nature cards", target: 10, reward: 800, faction: Faction.NATURE },
      { description: "Deal 20 damage to the enemy Nexus", target: 20, reward: 1200 },
      { description: "Summon 15 allies", target: 15, reward: 1000 },
      { description: "Level up a Champion", target: 1, reward: 1500 }
    ];

    // Generate 3 random daily quests
    const selectedQuests = questTemplates
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    this.dailyQuests = selectedQuests.map((template, index) => ({
      id: `daily_${Date.now()}_${index}`,
      description: template.description,
      progress: 0,
      target: template.target,
      reward: template.reward,
      completed: false,
      faction: template.faction
    }));
  }

  // Progression methods
  addFactionExperience(faction: Faction, amount: number): boolean {
    const road = this.factionRoads.get(faction);
    if (!road) return false;

    road.experience += amount;
    
    // Check for level up
    while (road.experience >= road.experienceToNext && road.level < 20) {
      road.experience -= road.experienceToNext;
      road.level++;
      road.experienceToNext = this.calculateNextLevelXP(road.level);
      
      // Unlock reward for this level
      const reward = road.rewards.find(r => r.level === road.level);
      if (reward && !reward.claimed) {
        this.claimFactionReward(faction, road.level);
      }
    }

    return true;
  }

  addVaultExperience(amount: number): void {
    this.weeklyVault.experience += amount;
    
    while (this.weeklyVault.experience >= this.weeklyVault.experienceToNext) {
      this.weeklyVault.experience -= this.weeklyVault.experienceToNext;
      this.weeklyVault.level++;
      this.weeklyVault.experienceToNext = this.calculateVaultNextLevelXP(this.weeklyVault.level);
      
      // Add chest for this level
      this.addVaultChest();
    }
  }

  private addVaultChest(): void {
    const level = this.weeklyVault.level;
    let chestType: 'common' | 'rare' | 'epic' | 'champion';
    
    if (level % 10 === 0) chestType = 'champion';
    else if (level % 5 === 0) chestType = 'epic';
    else if (level % 3 === 0) chestType = 'rare';
    else chestType = 'common';

    const chest: VaultChest = {
      type: chestType,
      guaranteed: level % 5 === 0,
      contents: this.generateChestContents(chestType)
    };

    this.weeklyVault.chests.push(chest);
  }

  private generateChestContents(chestType: string): VaultReward[] {
    // Generate appropriate rewards based on chest type
    const contents: VaultReward[] = [];
    
    switch (chestType) {
      case 'champion':
        contents.push({ type: 'card', quantity: 1, rarity: Rarity.EPIC });
        contents.push({ type: 'shards', quantity: 500 });
        break;
      case 'epic':
        contents.push({ type: 'card', quantity: 1, rarity: Rarity.RARE });
        contents.push({ type: 'shards', quantity: 300 });
        break;
      case 'rare':
        contents.push({ type: 'card', quantity: 2, rarity: Rarity.UNCOMMON });
        contents.push({ type: 'shards', quantity: 150 });
        break;
      default:
        contents.push({ type: 'card', quantity: 3, rarity: Rarity.COMMON });
        contents.push({ type: 'shards', quantity: 100 });
    }
    
    return contents;
  }

  // Crafting system
  craftCard(cardId: string, cost: number): boolean {
    if (this.craftingShards >= cost) {
      this.craftingShards -= cost;
      return true;
    }
    return false;
  }

  addShards(amount: number): void {
    this.craftingShards += amount;
  }

  // Quest system
  updateQuestProgress(questType: string, amount: number = 1, faction?: Faction): void {
    this.dailyQuests.forEach(quest => {
      if (quest.completed) return;
      
      let shouldUpdate = false;
      
      if (questType === 'win' && quest.description.includes('Win')) {
        shouldUpdate = true;
      } else if (questType === 'play_card' && quest.description.includes('Play') && quest.faction === faction) {
        shouldUpdate = true;
      } else if (questType === 'damage' && quest.description.includes('damage')) {
        shouldUpdate = true;
      } else if (questType === 'summon' && quest.description.includes('Summon')) {
        shouldUpdate = true;
      } else if (questType === 'level_up' && quest.description.includes('Level up')) {
        shouldUpdate = true;
      }
      
      if (shouldUpdate) {
        quest.progress = Math.min(quest.progress + amount, quest.target);
        if (quest.progress >= quest.target && !quest.completed) {
          quest.completed = true;
          this.addVaultExperience(quest.reward);
        }
      }
    });
  }

  // Utility methods
  private calculateNextLevelXP(level: number): number {
    return 1000 + (level - 1) * 200;
  }

  private calculateVaultNextLevelXP(level: number): number {
    return 2000 + (level - 1) * 300;
  }

  private getChampionForFaction(faction: Faction): string {
    const championMap = {
      [Faction.FIRE]: 'flame_mage_champion',
      [Faction.SHADOW]: 'shadow_assassin_champion',
      [Faction.NATURE]: 'tree_guardian_champion',
      [Faction.LIGHT]: 'flame_mage_champion', // Placeholder
      [Faction.VOID]: 'shadow_assassin_champion' // Placeholder
    };
    return championMap[faction];
  }

  private getRandomFactionCard(faction: Faction): string {
    // Return a random card ID for the faction
    return `${faction}_card_${Math.floor(Math.random() * 10) + 1}`;
  }

  private claimFactionReward(faction: Faction, level: number): void {
    const road = this.factionRoads.get(faction);
    if (!road) return;
    
    const reward = road.rewards.find(r => r.level === level);
    if (reward && !reward.claimed) {
      reward.claimed = true;
      
      if (reward.type === 'shards') {
        this.addShards(reward.quantity);
      }
      // Handle other reward types...
    }
  }

  // Getters
  getFactionRoad(faction: Faction): FactionRoad | undefined {
    return this.factionRoads.get(faction);
  }

  getWeeklyVault(): WeeklyVault {
    return this.weeklyVault;
  }

  getDailyQuests(): DailyQuest[] {
    return this.dailyQuests;
  }

  getCraftingShards(): number {
    return this.craftingShards;
  }
}