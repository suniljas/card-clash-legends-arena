export type WildcardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Wildcard {
  id: string;
  rarity: WildcardRarity;
  type: 'card' | 'champion';
  createdAt: Date;
  usedAt?: Date;
}

export interface CraftingMaterial {
  shards: number;
  wildcardEssence: number;
}

export interface DustingValue {
  common: number;
  rare: number;
  epic: number;
  legendary: number;
}

export interface WildcardCost {
  common: { shards: 100, wildcardEssence: 0 };
  rare: { shards: 300, wildcardEssence: 10 };
  epic: { shards: 800, wildcardEssence: 25 };
  legendary: { shards: 2000, wildcardEssence: 50 };
}

export class EthicalEconomySystem {
  private craftingMaterials: CraftingMaterial = {
    shards: 0,
    wildcardEssence: 0
  };

  private wildcards: Wildcard[] = [];

  // Dusting values for different rarities
  private readonly DUSTING_VALUES: DustingValue = {
    common: 10,
    rare: 30,
    epic: 80,
    legendary: 200
  };

  // Wildcard crafting costs
  private readonly WILDCARD_COSTS: WildcardCost = {
    common: { shards: 100, wildcardEssence: 0 },
    rare: { shards: 300, wildcardEssence: 10 },
    epic: { shards: 800, wildcardEssence: 25 },
    legendary: { shards: 2000, wildcardEssence: 50 }
  };

  dustCard(cardId: string, rarity: WildcardRarity): boolean {
    const dustValue = this.DUSTING_VALUES[rarity];
    
    this.craftingMaterials.shards += dustValue;
    
    // Legendary cards also give wildcard essence
    if (rarity === 'legendary') {
      this.craftingMaterials.wildcardEssence += 5;
    } else if (rarity === 'epic') {
      this.craftingMaterials.wildcardEssence += 2;
    }

    return true;
  }

  canCraftWildcard(rarity: WildcardRarity, type: 'card' | 'champion' = 'card'): boolean {
    const cost = this.WILDCARD_COSTS[rarity];
    
    return this.craftingMaterials.shards >= cost.shards && 
           this.craftingMaterials.wildcardEssence >= cost.wildcardEssence;
  }

  craftWildcard(rarity: WildcardRarity, type: 'card' | 'champion' = 'card'): Wildcard | null {
    if (!this.canCraftWildcard(rarity, type)) {
      return null;
    }

    const cost = this.WILDCARD_COSTS[rarity];
    
    // Deduct materials
    this.craftingMaterials.shards -= cost.shards;
    this.craftingMaterials.wildcardEssence -= cost.wildcardEssence;

    // Create wildcard
    const wildcard: Wildcard = {
      id: `wildcard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      rarity,
      type,
      createdAt: new Date()
    };

    this.wildcards.push(wildcard);
    return wildcard;
  }

  redeemWildcard(wildcardId: string, targetCardId: string): boolean {
    const wildcardIndex = this.wildcards.findIndex(w => w.id === wildcardId && !w.usedAt);
    
    if (wildcardIndex === -1) {
      return false;
    }

    // Mark wildcard as used
    this.wildcards[wildcardIndex].usedAt = new Date();
    
    return true;
  }

  getAvailableWildcards(): Wildcard[] {
    return this.wildcards.filter(w => !w.usedAt);
  }

  getCraftingMaterials(): CraftingMaterial {
    return { ...this.craftingMaterials };
  }

  addShards(amount: number): void {
    this.craftingMaterials.shards += amount;
  }

  addWildcardEssence(amount: number): void {
    this.craftingMaterials.wildcardEssence += amount;
  }

  // Battle Pass and Store integration
  purchaseWildcard(rarity: WildcardRarity, paymentType: 'gems' | 'coins'): Wildcard | null {
    // Direct purchase prices (higher than crafting to encourage gameplay)
    const prices = {
      gems: { common: 50, rare: 150, epic: 400, legendary: 1000 },
      coins: { common: 500, rare: 1500, epic: 4000, legendary: 10000 }
    };

    // This would integrate with the existing gem/coin system
    // For now, just create the wildcard
    const wildcard: Wildcard = {
      id: `purchased-wildcard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      rarity,
      type: 'card',
      createdAt: new Date()
    };

    this.wildcards.push(wildcard);
    return wildcard;
  }

  // Weekly Vault integration - automatic wildcard rewards
  grantWeeklyVaultWildcards(vaultLevel: number): Wildcard[] {
    const rewards: Wildcard[] = [];

    // Progressive wildcard rewards based on vault level
    if (vaultLevel >= 5) {
      rewards.push(this.createRewardWildcard('common'));
    }
    if (vaultLevel >= 10) {
      rewards.push(this.createRewardWildcard('rare'));
    }
    if (vaultLevel >= 15) {
      rewards.push(this.createRewardWildcard('epic'));
    }
    if (vaultLevel >= 20) {
      rewards.push(this.createRewardWildcard('legendary'));
    }

    this.wildcards.push(...rewards);
    return rewards;
  }

  private createRewardWildcard(rarity: WildcardRarity): Wildcard {
    return {
      id: `reward-wildcard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      rarity,
      type: 'card',
      createdAt: new Date()
    };
  }

  // Duplicate protection system
  handleDuplicateCard(cardId: string, rarity: WildcardRarity): CraftingMaterial {
    // When player gets a duplicate, automatically convert to materials
    const materials = {
      shards: this.DUSTING_VALUES[rarity],
      wildcardEssence: rarity === 'legendary' ? 5 : rarity === 'epic' ? 2 : 0
    };

    this.craftingMaterials.shards += materials.shards;
    this.craftingMaterials.wildcardEssence += materials.wildcardEssence;

    return materials;
  }

  // Statistics for LiveOps
  getEconomyStats() {
    return {
      totalShards: this.craftingMaterials.shards,
      totalWildcardEssence: this.craftingMaterials.wildcardEssence,
      availableWildcards: this.getAvailableWildcards().length,
      wildcardsByRarity: {
        common: this.getAvailableWildcards().filter(w => w.rarity === 'common').length,
        rare: this.getAvailableWildcards().filter(w => w.rarity === 'rare').length,
        epic: this.getAvailableWildcards().filter(w => w.rarity === 'epic').length,
        legendary: this.getAvailableWildcards().filter(w => w.rarity === 'legendary').length
      },
      usedWildcards: this.wildcards.filter(w => w.usedAt).length
    };
  }
}