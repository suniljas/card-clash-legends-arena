import { HeroCard } from '@/types/game';

export interface AIDecision {
  attackerIndex: number;
  targetIndex: number;
  reasoning: string;
}

export class BattleAI {
  // Advanced AI strategy for enemy bot
  static makeStrategicDecision(
    enemyCards: (HeroCard & { currentHP: number })[],
    playerCards: (HeroCard & { currentHP: number })[]
  ): AIDecision {
    const aliveEnemies = enemyCards
      .map((card, index) => ({ card, index }))
      .filter(({ card }) => card.currentHP > 0);
    
    const alivePlayers = playerCards
      .map((card, index) => ({ card, index }))
      .filter(({ card }) => card.currentHP > 0);

    if (aliveEnemies.length === 0 || alivePlayers.length === 0) {
      throw new Error('No valid cards for AI decision');
    }

    // AI Strategy Priority:
    // 1. Finish off low HP enemies (opportunistic)
    // 2. Target highest threat enemies
    // 3. Use strongest available attacker
    // 4. Preserve weak units

    let bestDecision: AIDecision | null = null;
    let bestScore = -1;

    for (const { card: attacker, index: attackerIndex } of aliveEnemies) {
      for (const { card: target, index: targetIndex } of alivePlayers) {
        const score = this.evaluateAttack(attacker, target, playerCards, enemyCards);
        
        if (score > bestScore) {
          bestScore = score;
          bestDecision = {
            attackerIndex,
            targetIndex,
            reasoning: this.generateReasoning(attacker, target, score)
          };
        }
      }
    }

    return bestDecision || {
      attackerIndex: aliveEnemies[0].index,
      targetIndex: alivePlayers[0].index,
      reasoning: 'Random attack as fallback'
    };
  }

  // Evaluate the strategic value of an attack
  private static evaluateAttack(
    attacker: HeroCard & { currentHP: number },
    target: HeroCard & { currentHP: number },
    allPlayerCards: (HeroCard & { currentHP: number })[],
    allEnemyCards: (HeroCard & { currentHP: number })[]
  ): number {
    let score = 0;
    const damage = attacker.baseAttack + (attacker.level * 10);

    // 1. Finishing blow bonus (high priority)
    if (target.currentHP <= damage) {
      score += 100; // High priority for eliminating enemies
    }

    // 2. Damage efficiency
    const damageRatio = Math.min(damage / target.currentHP, 1);
    score += damageRatio * 50;

    // 3. Target threat assessment
    const targetThreat = this.calculateThreat(target, allPlayerCards);
    score += targetThreat;

    // 4. Attacker preservation (avoid using weak units unless necessary)
    const attackerHealthRatio = attacker.currentHP / (attacker.baseHP + (attacker.level * 15));
    if (attackerHealthRatio < 0.3) {
      score -= 20; // Avoid using nearly dead units
    }

    // 5. Type advantage simulation (based on names/types)
    const typeBonus = this.calculateTypeAdvantage(attacker, target);
    score += typeBonus;

    // 6. Strategic positioning (target healers and support first)
    if (target.name.toLowerCase().includes('priest') || 
        target.name.toLowerCase().includes('healer') ||
        target.abilityDescription?.toLowerCase().includes('heal')) {
      score += 30; // Priority target
    }

    return score;
  }

  // Calculate threat level of enemy card
  private static calculateThreat(
    card: HeroCard & { currentHP: number },
    allCards: (HeroCard & { currentHP: number })[]
  ): number {
    let threat = 0;

    // Base threat from attack power
    threat += (card.baseAttack + (card.level * 10)) * 0.3;

    // Health factor
    const healthRatio = card.currentHP / (card.baseHP + (card.level * 15));
    threat += healthRatio * 20;

    // Special ability threat
    if (card.abilityDescription?.toLowerCase().includes('heal')) {
      threat += 25; // Healers are high priority
    }
    if (card.abilityDescription?.toLowerCase().includes('area') || 
        card.abilityDescription?.toLowerCase().includes('all')) {
      threat += 20; // AoE abilities are dangerous
    }

    return threat;
  }

  // Simulate type advantages (rock-paper-scissors style)
  private static calculateTypeAdvantage(
    attacker: HeroCard,
    target: HeroCard
  ): number {
    const attackerType = this.getCardType(attacker);
    const targetType = this.getCardType(target);

    const advantages: Record<string, string[]> = {
      'warrior': ['mage', 'archer'],
      'mage': ['priest', 'assassin'],
      'archer': ['priest', 'mage'],
      'priest': ['warrior', 'guardian'],
      'assassin': ['archer', 'priest'],
      'guardian': ['assassin', 'warrior']
    };

    if (advantages[attackerType]?.includes(targetType)) {
      return 15; // Type advantage bonus
    }
    if (advantages[targetType]?.includes(attackerType)) {
      return -10; // Type disadvantage penalty
    }

    return 0; // Neutral matchup
  }

  // Determine card type from name/description
  private static getCardType(card: HeroCard): string {
    const name = card.name.toLowerCase();
    const description = card.abilityDescription?.toLowerCase() || '';

    if (name.includes('warrior') || name.includes('knight') || name.includes('berserker')) {
      return 'warrior';
    }
    if (name.includes('mage') || name.includes('wizard') || name.includes('sorcerer')) {
      return 'mage';
    }
    if (name.includes('archer') || name.includes('ranger') || name.includes('hunter')) {
      return 'archer';
    }
    if (name.includes('priest') || name.includes('healer') || description.includes('heal')) {
      return 'priest';
    }
    if (name.includes('assassin') || name.includes('blade') || name.includes('shadow')) {
      return 'assassin';
    }
    if (name.includes('guardian') || name.includes('paladin') || name.includes('templar')) {
      return 'guardian';
    }

    return 'neutral';
  }

  // Generate human-readable reasoning for AI decisions
  private static generateReasoning(
    attacker: HeroCard,
    target: HeroCard,
    score: number
  ): string {
    const damage = attacker.baseAttack + (attacker.level * 10);
    
    if ((target.currentHP || target.baseHP) <= damage) {
      return `${attacker.name} targets ${target.name} for a finishing blow!`;
    }
    
    if (score > 60) {
      return `${attacker.name} focuses on high-priority target ${target.name}`;
    }
    
    if (target.name.toLowerCase().includes('priest') || 
        target.name.toLowerCase().includes('healer')) {
      return `${attacker.name} targets healer ${target.name} to prevent healing`;
    }
    
    return `${attacker.name} attacks ${target.name} tactically`;
  }

  // Get AI difficulty modifiers
  static getAIDifficultyModifiers(difficulty: number): {
    reactionTime: number;
    strategicAccuracy: number;
    targetingError: number;
  } {
    return {
      reactionTime: Math.max(1000, 3000 - (difficulty * 200)), // Faster reaction at higher difficulty
      strategicAccuracy: Math.min(0.9, 0.3 + (difficulty * 0.1)), // Better strategy at higher difficulty
      targetingError: Math.max(0.05, 0.3 - (difficulty * 0.05)) // Less randomness at higher difficulty
    };
  }
}