import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { useGameAudioSystem } from '@/hooks/useHowlerAudio';
import { 
  Zap, 
  Shield, 
  Sword, 
  Heart, 
  Star, 
  Eye, 
  Clock, 
  Target, 
  Layers,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActionStackItem {
  id: string;
  type: 'spell' | 'ability' | 'summon' | 'attack';
  name: string;
  source: string;
  target?: string;
  cost: number;
  description: string;
  canRespond: boolean;
}

interface EnhancedUISystemProps {
  gameState: any;
  onPlayCard: (cardId: string) => void;
  onPassPriority: () => void;
  onEndTurn: () => void;
}

export const EnhancedUISystem: React.FC<EnhancedUISystemProps> = ({
  gameState,
  onPlayCard,
  onPassPriority,
  onEndTurn
}) => {
  const audioSystem = useGameAudioSystem();
  const [actionStack, setActionStack] = useState<ActionStackItem[]>([]);
  const [showGraveyard, setShowGraveyard] = useState(false);
  const [showOpponentHistory, setShowOpponentHistory] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Enhanced card inspection with detailed tooltips
  const renderCardTooltip = (cardId: string) => {
    const card = getCardData(cardId);
    if (!card || hoveredCard !== cardId) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        className="absolute z-50 pointer-events-none"
        style={{
          left: '50%',
          top: '-100%',
          transform: 'translateX(-50%)'
        }}
      >
        <Card className="w-80 bg-black/95 border-purple-400 shadow-2xl backdrop-blur">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white">{card.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {card.faction}
                </Badge>
                <Badge variant={card.rarity === 'Legendary' ? "default" : "secondary"}>
                  {card.rarity}
                </Badge>
              </div>
            </div>
            
            <div className="text-sm text-gray-300 mb-3 leading-relaxed">
              {card.description}
            </div>
            
            {card.keywords.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-purple-300 mb-1">Keywords:</h4>
                <div className="space-y-1">
                  {card.keywords.map(keyword => (
                    <div key={keyword} className="text-xs">
                      <span className="font-semibold text-yellow-400">{keyword}:</span>
                      <span className="text-gray-400 ml-1">{getKeywordDescription(keyword)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-semibold">{card.cost}</span>
                </div>
                {card.attack !== undefined && (
                  <div className="flex items-center gap-1">
                    <Sword className="w-4 h-4 text-red-400" />
                    <span className="text-white font-semibold">{card.attack}</span>
                  </div>
                )}
                {card.health !== undefined && (
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-green-400" />
                    <span className="text-white font-semibold">{card.health}</span>
                  </div>
                )}
              </div>
            </div>
            
            {card.lore && (
              <div className="mt-3 pt-3 border-t border-gray-600">
                <p className="text-xs text-gray-400 italic">"{card.lore}"</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  // Enhanced Action Stack Display
  const renderActionStack = () => {
    if (actionStack.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40"
      >
        <Card className="bg-black/95 border-yellow-400 shadow-2xl backdrop-blur min-w-96">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Action Stack</h3>
              </div>
              <Badge variant="outline" className="border-yellow-400">
                {actionStack.length} Action{actionStack.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            <div className="space-y-2 mb-4">
              {actionStack.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border ${
                    index === actionStack.length - 1 
                      ? 'bg-yellow-900/30 border-yellow-400' 
                      : 'bg-gray-800/50 border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                        #{actionStack.length - index}
                      </span>
                      <h4 className="font-semibold text-white">{action.name}</h4>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {action.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-2">{action.description}</p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Source: {action.source}</span>
                    {action.target && (
                      <span className="text-gray-400">Target: {action.target}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={onPassPriority}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Pass Priority
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-yellow-400 text-yellow-400"
              >
                <Eye className="w-4 h-4 mr-2" />
                Watch
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  // Enhanced Graveyard Display
  const renderGraveyard = () => {
    if (!showGraveyard) return null;

    const graveyardCards = ['destroyed_unit_1', 'used_spell_1', 'defeated_champion_1']; // Mock data

    return (
      <motion.div
        initial={{ opacity: 0, x: -300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -300 }}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-30 w-80"
      >
        <Card className="bg-black/95 border-purple-400 shadow-2xl backdrop-blur max-h-96">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Graveyard</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowGraveyard(false)}
                className="text-gray-400"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {graveyardCards.map((cardId, index) => (
                <motion.div
                  key={cardId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-2 rounded bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="w-10 h-14 bg-gradient-to-b from-gray-600 to-gray-800 rounded flex items-center justify-center text-xs">
                    💀
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Destroyed Unit</p>
                    <p className="text-xs text-gray-400">Turn {index + 1}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  // Enhanced Turn Timer
  const renderTurnTimer = () => {
    const timeRemaining = 90; // Mock time in seconds
    const totalTime = 90;
    const percentage = (timeRemaining / totalTime) * 100;

    return (
      <div className="flex items-center gap-2 bg-black/50 px-3 py-2 rounded-full border border-white/20">
        <Clock className="w-4 h-4 text-white" />
        <div className="w-20">
          <Progress 
            value={percentage} 
            className={`h-2 ${percentage < 20 ? 'animate-pulse' : ''}`}
          />
        </div>
        <span className={`text-sm font-semibold ${percentage < 20 ? 'text-red-400' : 'text-white'}`}>
          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </span>
      </div>
    );
  };

  // Enhanced Mana Display with Spell Mana
  const renderEnhancedManaDisplay = () => {
    const { playerMana, playerSpellMana, maxMana } = gameState;
    
    return (
      <div className="flex items-center gap-4">
        {/* Regular Mana */}
        <div className="flex items-center gap-2 bg-blue-900/50 px-3 py-2 rounded-full border border-blue-400/30">
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-blue-300">{playerMana}/{maxMana}</span>
          <div className="flex gap-1">
            {Array.from({ length: maxMana }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < playerMana ? 'bg-blue-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Spell Mana */}
        {playerSpellMana > 0 && (
          <div className="flex items-center gap-2 bg-purple-900/50 px-3 py-2 rounded-full border border-purple-400/30">
            <Star className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-purple-300">{playerSpellMana}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Action Stack Overlay */}
      <AnimatePresence>
        {actionStack.length > 0 && renderActionStack()}
      </AnimatePresence>

      {/* Graveyard Panel */}
      <AnimatePresence>
        {renderGraveyard()}
      </AnimatePresence>

      {/* Enhanced Game State Display */}
      <div className="py-4 px-6 bg-black/50 backdrop-blur border-y border-white/20">
        <div className="flex justify-between items-center">
          {/* Turn Information */}
          <div className="flex items-center gap-4">
            <div className="text-white">
              <div className="text-sm opacity-80">Round {gameState.roundNumber}</div>
              <div className="text-xl font-bold flex items-center gap-2">
                {gameState.currentTurn === 'player' ? (
                  <>
                    <Star className="w-5 h-5 text-yellow-400" />
                    Your Turn
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 text-red-400" />
                    Opponent's Turn
                  </>
                )}
              </div>
            </div>
            {renderTurnTimer()}
          </div>
          
          {/* Mana Display */}
          {renderEnhancedManaDisplay()}
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Graveyard Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGraveyard(!showGraveyard)}
              className="border-purple-400 text-purple-300"
            >
              <Target className="w-4 h-4 mr-2" />
              Graveyard
            </Button>
            
            {/* History Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOpponentHistory(!showOpponentHistory)}
              className="border-gray-400 text-gray-300"
            >
              <Eye className="w-4 h-4 mr-2" />
              History
            </Button>
            
            {/* End Turn */}
            <Button 
              size="sm"
              onClick={onEndTurn}
              disabled={gameState.currentTurn !== 'player'}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              End Turn
            </Button>
          </div>
        </div>
        
        {/* Stack Indicator */}
        {actionStack.length > 0 && (
          <div className="mt-3 p-2 bg-yellow-900/20 border border-yellow-400 rounded">
            <div className="flex items-center justify-between">
              <div className="text-yellow-300 text-sm font-semibold">
                Actions on Stack: {actionStack.length}
              </div>
              <Button 
                size="sm" 
                variant="outline"
                className="border-yellow-400 text-yellow-400"
              >
                View Details
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Card Tooltips */}
      <AnimatePresence>
        {hoveredCard && renderCardTooltip(hoveredCard)}
      </AnimatePresence>
    </div>
  );
};

// Helper functions
function getCardData(cardId: string) {
  // Mock card data - replace with actual database
  return {
    name: 'Sample Card',
    cost: 3,
    attack: 2,
    health: 3,
    faction: 'Mystic',
    rarity: 'Common',
    keywords: ['Quick Strike'],
    description: 'A versatile unit that excels in early game combat.',
    lore: 'Forged in the fires of ancient magic, this warrior stands ready.'
  };
}

function getKeywordDescription(keyword: string): string {
  const descriptions = {
    'Quick Strike': 'Strikes before the opponent when attacking',
    'Guard': 'Enemies must attack this unit first',
    'Stealth': 'Cannot be targeted by spells or abilities',
    'Regeneration': 'Heals 1 health at the start of each turn'
  };
  return descriptions[keyword] || 'Unknown keyword';
}