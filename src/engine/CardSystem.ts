// Card definitions and logic system
export interface Card {
  id: string;
  name: string;
  cost: number;
  type: 'unit' | 'spell' | 'champion';
  faction: Faction;
  rarity: Rarity;
  edition: Edition;
  keywords: Keyword[];
  attack?: number;
  health?: number;
}

export interface ChampionCardDef extends Card {
  type: 'champion';
  levelUpCondition: LevelUpCondition;
  leveledUpForm: ChampionCardDef;
}

export enum Faction {
  FIRE = 'fire',
  SHADOW = 'shadow',
  NATURE = 'nature',
  LIGHT = 'light',
  VOID = 'void'
}

export enum Rarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  VERY_RARE = 'very-rare',
  EPIC = 'epic',
  LEGEND = 'legend',
  ULTRA_LEGEND = 'ultra-legend'
}

export enum Edition {
  NORMAL = 'normal',
  PREMIUM = 'premium',
  SPECIAL = 'special',
  LIMITED = 'limited'
}

export enum Keyword {
  FLYING = 'flying',
  GUARD = 'guard',
  QUICK_ATTACK = 'quick_attack',
  OVERWHELM = 'overwhelm',
  REGENERATION = 'regeneration',
  SPELL_SHIELD = 'spell_shield'
}

export interface LevelUpCondition {
  type: 'damage_dealt' | 'allies_summoned' | 'spells_cast' | 'attacks_made';
  target: number;
  description: string;
}

// Champion card definitions
export const CHAMPION_CARDS: ChampionCardDef[] = [
  {
    id: 'flame_mage_champion',
    name: 'Flame Mage',
    cost: 3,
    type: 'champion',
    faction: Faction.FIRE,
    rarity: Rarity.EPIC,
    edition: Edition.NORMAL,
    keywords: [Keyword.QUICK_ATTACK],
    attack: 3,
    health: 4,
    levelUpCondition: {
      type: 'damage_dealt',
      target: 10,
      description: "I've seen you deal 10+ damage to the enemy Nexus"
    },
    leveledUpForm: {
      id: 'flame_mage_leveled',
      name: 'Flame Archmage',
      cost: 3,
      type: 'champion',
      faction: Faction.FIRE,
      rarity: Rarity.EPIC,
      edition: Edition.NORMAL,
      keywords: [Keyword.QUICK_ATTACK, Keyword.OVERWHELM],
      attack: 5,
      health: 5,
      levelUpCondition: {
        type: 'damage_dealt',
        target: 10,
        description: "I've seen you deal 10+ damage to the enemy Nexus"
      },
      leveledUpForm: {} as ChampionCardDef // Prevent infinite recursion
    }
  },
  {
    id: 'shadow_assassin_champion',
    name: 'Shadow Assassin',
    cost: 2,
    type: 'champion',
    faction: Faction.SHADOW,
    rarity: Rarity.EPIC,
    edition: Edition.NORMAL,
    keywords: [Keyword.FLYING],
    attack: 2,
    health: 2,
    levelUpCondition: {
      type: 'attacks_made',
      target: 5,
      description: "I've attacked 5+ times"
    },
    leveledUpForm: {
      id: 'shadow_assassin_leveled',
      name: 'Shadow Master',
      cost: 2,
      type: 'champion',
      faction: Faction.SHADOW,
      rarity: Rarity.EPIC,
      edition: Edition.NORMAL,
      keywords: [Keyword.FLYING, Keyword.QUICK_ATTACK],
      attack: 4,
      health: 3,
      levelUpCondition: {
        type: 'attacks_made',
        target: 5,
        description: "I've attacked 5+ times"
      },
      leveledUpForm: {} as ChampionCardDef
    }
  },
  {
    id: 'tree_guardian_champion',
    name: 'Tree Guardian',
    cost: 4,
    type: 'champion',
    faction: Faction.NATURE,
    rarity: Rarity.EPIC,
    edition: Edition.NORMAL,
    keywords: [Keyword.GUARD, Keyword.REGENERATION],
    attack: 1,
    health: 6,
    levelUpCondition: {
      type: 'allies_summoned',
      target: 6,
      description: "I've seen you summon 6+ allies"
    },
    leveledUpForm: {
      id: 'tree_guardian_leveled',
      name: 'Ancient Treant',
      cost: 4,
      type: 'champion',
      faction: Faction.NATURE,
      rarity: Rarity.EPIC,
      edition: Edition.NORMAL,
      keywords: [Keyword.GUARD, Keyword.REGENERATION, Keyword.OVERWHELM],
      attack: 3,
      health: 8,
      levelUpCondition: {
        type: 'allies_summoned',
        target: 6,
        description: "I've seen you summon 6+ allies"
      },
      leveledUpForm: {} as ChampionCardDef
    }
  }
];

export class CardSystem {
  private cards: Map<string, Card> = new Map();

  constructor() {
    this.initializeCards();
  }

  private initializeCards(): void {
    // Add champion cards
    CHAMPION_CARDS.forEach(card => {
      this.cards.set(card.id, card);
      if (card.leveledUpForm.id) {
        this.cards.set(card.leveledUpForm.id, card.leveledUpForm);
      }
    });
  }

  getCard(id: string): Card | undefined {
    return this.cards.get(id);
  }

  getCardsByFaction(faction: Faction): Card[] {
    return Array.from(this.cards.values()).filter(card => card.faction === faction);
  }

  canPlayCard(card: Card, availableMana: number, spellMana: number): boolean {
    if (card.type === 'spell') {
      return card.cost <= availableMana + spellMana;
    }
    return card.cost <= availableMana;
  }

  getManaCost(card: Card, availableMana: number, spellMana: number): { normalMana: number; spellMana: number } {
    if (card.type === 'spell') {
      const spellManaUsed = Math.min(card.cost, spellMana);
      const normalManaUsed = card.cost - spellManaUsed;
      return { normalMana: normalManaUsed, spellMana: spellManaUsed };
    }
    return { normalMana: card.cost, spellMana: 0 };
  }
}