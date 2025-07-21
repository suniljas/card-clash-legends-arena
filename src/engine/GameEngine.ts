// Core game engine - pure TypeScript logic separated from React components
export interface GameState {
  currentPlayer: 'player' | 'opponent';
  actionToken: 'player' | 'opponent';
  turnPhase: 'mulligan' | 'planning' | 'action' | 'reaction' | 'end';
  roundNumber: number;
  playerMana: number;
  playerSpellMana: number;
  opponentMana: number;
  opponentSpellMana: number;
  maxMana: number;
  playerHand: string[];
  opponentHand: string[];
  playerBoard: BoardCard[];
  opponentBoard: BoardCard[];
  stack: StackAction[];
  playerChampions: ChampionCard[];
  opponentChampions: ChampionCard[];
}

export interface BoardCard {
  id: string;
  cardId: string;
  attack: number;
  health: number;
  maxHealth: number;
  canAttack: boolean;
  summoned: boolean;
  keywords: string[];
}

export interface ChampionCard {
  id: string;
  name: string;
  level: number;
  levelUpCondition: string;
  levelUpProgress: number;
  levelUpTarget: number;
  isLeveledUp: boolean;
}

export interface StackAction {
  id: string;
  type: 'spell' | 'ability' | 'attack';
  source: string;
  target?: string;
  resolved: boolean;
}

export class GameEngine {
  private state: GameState;
  private listeners: ((state: GameState) => void)[] = [];

  constructor(initialState: GameState) {
    this.state = { ...initialState };
  }

  // Core game flow methods
  startTurn(): void {
    this.state.roundNumber++;
    this.refillMana();
    this.drawCard();
    this.resetAttacks();
    this.checkChampionLevelUps();
    this.notifyListeners();
  }

  private refillMana(): void {
    // Increase max mana up to 10
    if (this.state.maxMana < 10) {
      this.state.maxMana++;
    }
    
    // Convert up to 3 unspent mana to spell mana
    const currentPlayer = this.state.currentPlayer;
    const unspentMana = currentPlayer === 'player' ? 
      this.state.maxMana - this.state.playerMana : 
      this.state.maxMana - this.state.opponentMana;
    
    const spellManaToAdd = Math.min(3, unspentMana);
    
    if (currentPlayer === 'player') {
      this.state.playerMana = this.state.maxMana;
      this.state.playerSpellMana = Math.min(3, this.state.playerSpellMana + spellManaToAdd);
    } else {
      this.state.opponentMana = this.state.maxMana;
      this.state.opponentSpellMana = Math.min(3, this.state.opponentSpellMana + spellManaToAdd);
    }
  }

  // Action/Reaction system
  playCard(cardId: string, target?: string): boolean {
    const action: StackAction = {
      id: `action_${Date.now()}`,
      type: 'spell',
      source: cardId,
      target,
      resolved: false
    };
    
    this.state.stack.push(action);
    this.passPriority();
    return true;
  }

  passPriority(): void {
    if (this.state.stack.length === 0) {
      // No actions on stack, switch action token
      this.state.actionToken = this.state.actionToken === 'player' ? 'opponent' : 'player';
      this.state.turnPhase = 'action';
    } else {
      // Actions on stack, allow reactions
      this.state.turnPhase = 'reaction';
      this.state.currentPlayer = this.state.currentPlayer === 'player' ? 'opponent' : 'player';
    }
    this.notifyListeners();
  }

  resolveStack(): void {
    // Resolve actions in reverse order (last in, first out)
    while (this.state.stack.length > 0) {
      const action = this.state.stack.pop()!;
      this.resolveAction(action);
    }
    this.state.turnPhase = 'action';
    this.notifyListeners();
  }

  private resolveAction(action: StackAction): void {
    // Implement action resolution logic
    console.log(`Resolving action: ${action.type} from ${action.source}`);
  }

  // Champion level-up system
  private checkChampionLevelUps(): void {
    [...this.state.playerChampions, ...this.state.opponentChampions].forEach(champion => {
      if (!champion.isLeveledUp && champion.levelUpProgress >= champion.levelUpTarget) {
        this.levelUpChampion(champion);
      }
    });
  }

  private levelUpChampion(champion: ChampionCard): void {
    champion.isLeveledUp = true;
    champion.level++;
    // Trigger level-up animation and transformation
    console.log(`${champion.name} leveled up!`);
  }

  // Utility methods
  private drawCard(): void {
    if (this.state.currentPlayer === 'player' && this.state.playerHand.length < 10) {
      // Draw logic
    }
  }

  private resetAttacks(): void {
    [...this.state.playerBoard, ...this.state.opponentBoard].forEach(card => {
      card.canAttack = !card.summoned;
      card.summoned = false;
    });
  }

  // State management
  getState(): GameState {
    return { ...this.state };
  }

  subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}