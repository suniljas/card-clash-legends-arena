import { CampaignInstance, CampaignParticipant, HeroCard, Rarity, BattleResult } from '@/types/game';
import { EPIC_HEROES_DATABASE } from '@/data/epicHeroes';

export class CampaignSystem {
  private static instances: Map<number, CampaignInstance[]> = new Map();

  // Create or join a campaign instance
  static joinCampaignLevel(levelId: number, playerId: string, playerName: string): CampaignInstance {
    if (!this.instances.has(levelId)) {
      this.instances.set(levelId, []);
    }

    const levelInstances = this.instances.get(levelId)!;
    
    // Find an active instance with space
    let activeInstance = levelInstances.find(
      instance => instance.status === 'active' && instance.participants.length < instance.maxParticipants
    );

    // Create new instance if none available
    if (!activeInstance) {
      activeInstance = {
        id: `campaign-${levelId}-${Date.now()}`,
        levelId,
        participants: [],
        maxParticipants: 100,
        status: 'active',
        createdAt: new Date()
      };
      levelInstances.push(activeInstance);
    }

    // Check if player already in this instance
    const existingParticipant = activeInstance.participants.find(p => p.playerId === playerId);
    if (existingParticipant) {
      return activeInstance;
    }

    return activeInstance;
  }

  // Complete campaign level and distribute rewards
  static completeCampaignLevel(
    instanceId: string, 
    playerId: string, 
    playerName: string, 
    levelId: number
  ): BattleResult {
    const levelInstances = this.instances.get(levelId) || [];
    const instance = levelInstances.find(i => i.id === instanceId);
    
    if (!instance) {
      throw new Error('Campaign instance not found');
    }

    // Generate rewards
    const coinsEarned = this.calculateCoinsReward(levelId);
    const cardsEarned = this.calculateCardRewards(instance, playerId);
    
    // Add participant
    const participant: CampaignParticipant = {
      id: `participant-${Date.now()}`,
      playerId,
      playerName,
      completedAt: new Date(),
      cardsEarned,
      coinsEarned
    };

    instance.participants.push(participant);

    // Check if instance is full
    if (instance.participants.length >= instance.maxParticipants) {
      instance.status = 'completed';
    }

    return {
      victory: true,
      experienceGained: levelId * 50,
      coinsEarned,
      cardsEarned,
      survivingCards: [] // Will be set by caller
    };
  }

  // Calculate guaranteed coin rewards per level
  private static calculateCoinsReward(levelId: number): number {
    return 100 + (levelId * 25); // Base 100 + 25 per level
  }

  // Calculate card rewards based on distribution percentages
  private static calculateCardRewards(instance: CampaignInstance, playerId: string): HeroCard[] {
    const participantIndex = instance.participants.length;
    const totalParticipants = instance.maxParticipants;

    // Card drop distribution:
    // 5% (5 players) get Common
    // 3% (3 players) get Uncommon  
    // 2% (2 players) get Rare
    // 1% (1 player) gets Legendary

    const distribution = [
      { percentage: 5, rarity: Rarity.COMMON, count: 5 },
      { percentage: 3, rarity: Rarity.UNCOMMON, count: 3 },
      { percentage: 2, rarity: Rarity.RARE, count: 2 },
      { percentage: 1, rarity: Rarity.LEGEND, count: 1 }
    ];

    // Determine if this player gets a card based on their participation order
    const rewards: HeroCard[] = [];
    
    // Simple distribution: first X players get the cards
    let currentIndex = 0;
    for (const dist of distribution) {
      if (participantIndex >= currentIndex && participantIndex < currentIndex + dist.count) {
        const availableCards = EPIC_HEROES_DATABASE.filter(card => 
          card.rarity === dist.rarity
        );
        
        if (availableCards.length > 0) {
          const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
          rewards.push({ ...randomCard });
        }
        break;
      }
      currentIndex += dist.count;
    }

    return rewards;
  }

  // Get campaign statistics
  static getCampaignStats(levelId: number): {
    totalInstances: number;
    totalParticipants: number;
    completedInstances: number;
  } {
    const instances = this.instances.get(levelId) || [];
    
    return {
      totalInstances: instances.length,
      totalParticipants: instances.reduce((sum, instance) => sum + instance.participants.length, 0),
      completedInstances: instances.filter(i => i.status === 'completed').length
    };
  }
}