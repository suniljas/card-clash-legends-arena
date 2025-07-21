import { HeroCard } from '@/types/game';

export type LaneType = 'melee' | 'ranged';
export type BoardPosition = {
  lane: LaneType;
  index: number;
};

export interface PositionalKeyword {
  guard: boolean;        // Can block any attacker, regardless of lane
  flank: boolean;        // Can attack units in the adjacent lane
  artillery: boolean;    // Can attack opponent directly from back lane if front empty
  formation: boolean;    // Gains bonus when adjacent to same tribe
}

export interface PositionalCard extends HeroCard {
  manaCost: number;      // Add missing mana cost property
  faction: string;       // Add missing faction property
  keywords: PositionalKeyword;
  preferredLane?: LaneType;
  adjacencyBonus?: {
    attack: number;
    health: number;
    condition: 'same-tribe' | 'any-ally';
  };
}

export interface BattleLane {
  type: LaneType;
  playerCards: PositionalCard[];
  enemyCards: PositionalCard[];
  maxSize: number;
}

export interface PositionalBattlefield {
  playerLanes: {
    melee: BattleLane;
    ranged: BattleLane;
  };
  enemyLanes: {
    melee: BattleLane;
    ranged: BattleLane;
  };
}

export class PositionalCombatSystem {
  private battlefield: PositionalBattlefield;

  constructor() {
    this.battlefield = {
      playerLanes: {
        melee: { type: 'melee', playerCards: [], enemyCards: [], maxSize: 4 },
        ranged: { type: 'ranged', playerCards: [], enemyCards: [], maxSize: 3 }
      },
      enemyLanes: {
        melee: { type: 'melee', playerCards: [], enemyCards: [], maxSize: 4 },
        ranged: { type: 'ranged', playerCards: [], enemyCards: [], maxSize: 3 }
      }
    };
  }

  canPlayCard(card: PositionalCard, lane: LaneType, position: number): boolean {
    const targetLane = this.battlefield.playerLanes[lane];
    
    // Check if lane has space
    if (targetLane.playerCards.length >= targetLane.maxSize) {
      return false;
    }

    // Check if position is valid
    if (position < 0 || position > targetLane.playerCards.length) {
      return false;
    }

    return true;
  }

  playCard(card: PositionalCard, lane: LaneType, position: number): boolean {
    if (!this.canPlayCard(card, lane, position)) {
      return false;
    }

    const targetLane = this.battlefield.playerLanes[lane];
    targetLane.playerCards.splice(position, 0, card);
    
    // Apply formation bonuses
    this.updateFormationBonuses();
    
    return true;
  }

  getValidTargets(attackingCard: PositionalCard, attackerLane: LaneType): PositionalCard[] {
    const targets: PositionalCard[] = [];
    
    // Melee lane units can attack enemy melee units directly
    if (attackerLane === 'melee') {
      targets.push(...this.battlefield.enemyLanes.melee.enemyCards);
      
      // If no enemy melee units, can attack ranged units
      if (this.battlefield.enemyLanes.melee.enemyCards.length === 0) {
        targets.push(...this.battlefield.enemyLanes.ranged.enemyCards);
      }
    }
    
    // Ranged units can only attack enemy melee units (unless they have artillery)
    if (attackerLane === 'ranged') {
      if (attackingCard.keywords.artillery && this.battlefield.enemyLanes.melee.enemyCards.length === 0) {
        // Artillery can attack opponent directly if no front line
        // This would target the opponent's health directly
      } else {
        targets.push(...this.battlefield.enemyLanes.melee.enemyCards);
      }
    }
    
    // Flank ability allows attacking adjacent lanes
    if (attackingCard.keywords.flank) {
      if (attackerLane === 'melee') {
        targets.push(...this.battlefield.enemyLanes.ranged.enemyCards);
      } else {
        targets.push(...this.battlefield.enemyLanes.melee.enemyCards);
      }
    }

    return targets;
  }

  canBlockAttack(attacker: PositionalCard, defender: PositionalCard): boolean {
    // Guard units can block any attack
    if (defender.keywords.guard) {
      return true;
    }

    // Normal blocking rules based on lanes
    return this.getValidTargets(attacker, this.getCardLane(attacker)).includes(defender);
  }

  private getCardLane(card: PositionalCard): LaneType {
    // Find which lane the card is in
    for (const laneType of ['melee', 'ranged'] as LaneType[]) {
      if (this.battlefield.playerLanes[laneType].playerCards.includes(card) ||
          this.battlefield.enemyLanes[laneType].enemyCards.includes(card)) {
        return laneType;
      }
    }
    return 'melee'; // Default fallback
  }

  private updateFormationBonuses(): void {
    // Update bonuses for cards with formation keyword
    for (const laneType of ['melee', 'ranged'] as LaneType[]) {
      const lane = this.battlefield.playerLanes[laneType];
      
      lane.playerCards.forEach((card, index) => {
        if (card.keywords.formation && card.adjacencyBonus) {
          const adjacentCards = this.getAdjacentCards(card, laneType, index);
          const bonusCount = this.countValidAdjacent(card, adjacentCards);
          
          // Apply formation bonus
          card.baseAttack += card.adjacencyBonus.attack * bonusCount;
          card.baseHP += card.adjacencyBonus.health * bonusCount;
        }
      });
    }
  }

  private getAdjacentCards(card: PositionalCard, lane: LaneType, index: number): PositionalCard[] {
    const laneCards = this.battlefield.playerLanes[lane].playerCards;
    const adjacent: PositionalCard[] = [];
    
    // Left adjacent
    if (index > 0) {
      adjacent.push(laneCards[index - 1]);
    }
    
    // Right adjacent  
    if (index < laneCards.length - 1) {
      adjacent.push(laneCards[index + 1]);
    }
    
    return adjacent;
  }

  private countValidAdjacent(card: PositionalCard, adjacentCards: PositionalCard[]): number {
    if (!card.adjacencyBonus) return 0;
    
    return adjacentCards.filter(adjacent => {
      if (card.adjacencyBonus!.condition === 'any-ally') {
        return true;
      }
      if (card.adjacencyBonus!.condition === 'same-tribe') {
        return adjacent.faction === card.faction;
      }
      return false;
    }).length;
  }

  getBattlefield(): PositionalBattlefield {
    return { ...this.battlefield };
  }

  resetBattlefield(): void {
    this.battlefield = {
      playerLanes: {
        melee: { type: 'melee', playerCards: [], enemyCards: [], maxSize: 4 },
        ranged: { type: 'ranged', playerCards: [], enemyCards: [], maxSize: 3 }
      },
      enemyLanes: {
        melee: { type: 'melee', playerCards: [], enemyCards: [], maxSize: 4 },
        ranged: { type: 'ranged', playerCards: [], enemyCards: [], maxSize: 3 }
      }
    };
  }
}