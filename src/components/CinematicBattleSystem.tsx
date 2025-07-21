import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { useGameAudioSystem } from '@/hooks/useHowlerAudio';
import { Zap, Shield, Sword, Heart, Star, Crown, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicBattleSystemProps {
  onBattleEnd: (victory: boolean) => void;
  playerDeck: any[];
  opponentDeck: any[];
}

interface BattleAnimation {
  type: 'card-play' | 'attack' | 'spell' | 'champion-levelup' | 'nexus-damage';
  cardId?: string;
  targetId?: string;
  damage?: number;
  isPlayerAction: boolean;
}

interface ImpactFrame {
  type: 'zoom-in' | 'screen-shake' | 'slow-motion';
  duration: number;
  intensity: number;
}

export const CinematicBattleSystem: React.FC<CinematicBattleSystemProps> = ({
  onBattleEnd,
  playerDeck,
  opponentDeck
}) => {
  const audioSystem = useGameAudioSystem();
  
  // Enhanced state management
  const [gameState, setGameState] = useState({
    playerHand: ['flame_mage_champion', 'shadow_assassin_champion'],
    opponentHand: ['tree_guardian_champion'],
    playerBoard: [],
    opponentBoard: [],
    playerMana: 1,
    playerNexusHealth: 20,
    opponentNexusHealth: 20,
    currentTurn: 'player',
    roundNumber: 1
  });

  const [battleAnimation, setBattleAnimation] = useState<BattleAnimation | null>(null);
  const [impactFrame, setImpactFrame] = useState<ImpactFrame | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [environmentState, setEnvironmentState] = useState({
    atmosphere: 'neutral',
    particleEffects: [],
    cameraZoom: 1,
    backgroundShift: 0
  });

  // Cinematic camera controls
  const triggerImpactFrame = useCallback((type: ImpactFrame['type'], duration = 1000, intensity = 1) => {
    setImpactFrame({ type, duration, intensity });
    setTimeout(() => setImpactFrame(null), duration);
  }, []);

  // Enhanced card play with animations and sounds
  const handleCardPlay = useCallback((cardId: string) => {
    setBattleAnimation({
      type: 'card-play',
      cardId,
      isPlayerAction: true
    });

    // Enhanced audio feedback
    audioSystem.playCardPlay();
    
    // Check if it's a legendary card for special treatment
    const card = getCardData(cardId);
    if (card?.rarity === 'Legendary') {
      triggerImpactFrame('zoom-in', 2000, 1.5);
      audioSystem.playLegendaryDrop();
      
      // Update environment for legendary play
      setEnvironmentState(prev => ({
        ...prev,
        atmosphere: 'legendary',
        particleEffects: [...prev.particleEffects, 'golden-particles']
      }));
    }

    // Clear animation after duration
    setTimeout(() => setBattleAnimation(null), 1500);
    setSelectedCard(null);
  }, [audioSystem, triggerImpactFrame]);

  // Dynamic environment effects
  useEffect(() => {
    // Update background based on game state
    const updateEnvironment = () => {
      if (gameState.playerNexusHealth <= 5 || gameState.opponentNexusHealth <= 5) {
        setEnvironmentState(prev => ({
          ...prev,
          atmosphere: 'critical',
          backgroundShift: 0.3
        }));
      } else if (gameState.roundNumber >= 8) {
        setEnvironmentState(prev => ({
          ...prev,
          atmosphere: 'intense',
          backgroundShift: 0.2
        }));
      }
    };

    updateEnvironment();
  }, [gameState]);

  // Enhanced card rendering with animations
  const renderEnhancedCard = (cardId: string, isOpponent = false, position = { x: 0, y: 0 }) => {
    const card = getCardData(cardId);
    if (!card) return null;

    const isAnimating = battleAnimation?.cardId === cardId;
    const isLegendary = card.rarity === 'Legendary';

    return (
      <motion.div
        key={cardId}
        initial={{ scale: 0.8, opacity: 0, rotateY: 180 }}
        animate={{ 
          scale: isAnimating ? 1.2 : 1, 
          opacity: 1, 
          rotateY: 0,
          z: isAnimating ? 100 : 0
        }}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3, type: "spring" }}
        className={`relative cursor-pointer ${isOpponent ? 'rotate-180' : ''}`}
        onClick={() => !isOpponent && setSelectedCard(cardId)}
      >
        <Card className={`
          w-28 h-40 p-3 transition-all duration-300
          ${selectedCard === cardId ? 'ring-4 ring-primary shadow-xl' : ''}
          ${isLegendary ? 'bg-gradient-to-b from-yellow-100 to-amber-200 border-2 border-yellow-400' : ''}
          ${isAnimating ? 'shadow-2xl animate-pulse' : ''}
        `}>
          {/* Legendary Crown */}
          {isLegendary && (
            <Crown className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-pulse" />
          )}
          
          {/* Mana Cost */}
          <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
            ${isLegendary ? 'bg-gradient-to-b from-purple-500 to-purple-700 text-white' : 'bg-primary text-primary-foreground'}
          `}>
            {card.cost}
          </div>
          
          {/* Card Art Area */}
          <div className="h-16 bg-gradient-to-b from-blue-200 to-blue-400 rounded mb-2 flex items-center justify-center">
            <div className="text-2xl">⚔️</div>
          </div>
          
          {/* Card Name */}
          <div className="text-xs font-bold text-center mb-1 line-clamp-2">
            {card.name}
          </div>
          
          {/* Faction & Rarity */}
          <div className="flex justify-between items-center mb-1">
            <Badge variant="secondary" className="text-xs">
              {card.faction}
            </Badge>
            <Badge variant={isLegendary ? "default" : "outline"} className="text-xs">
              {card.rarity}
            </Badge>
          </div>
          
          {/* Keywords */}
          {card.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {card.keywords.slice(0, 2).map(keyword => (
                <Badge key={keyword} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Stats */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Sword className="w-3 h-3 text-red-500" />
              <span className="text-xs font-bold">{card.attack}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-green-500" />
              <span className="text-xs font-bold">{card.health}</span>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  // Battlefield environment with dynamic effects
  const renderBattlefield = () => {
    const atmosphereClasses = {
      neutral: 'from-blue-900 via-purple-900 to-blue-900',
      intense: 'from-red-900 via-orange-900 to-red-900',
      critical: 'from-black via-red-900 to-black animate-pulse',
      legendary: 'from-yellow-900 via-amber-900 to-yellow-900'
    };

    return (
      <div className={`h-screen flex flex-col bg-gradient-to-b transition-all duration-1000 ${atmosphereClasses[environmentState.atmosphere]}`}>
        {/* Particle Effects */}
        <AnimatePresence>
          {environmentState.particleEffects.map((effect, index) => (
            <motion.div
              key={`${effect}-${index}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Golden particles for legendary plays */}
              {effect === 'golden-particles' && (
                <div className="absolute inset-0">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                      initial={{ 
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        opacity: 0
                      }}
                      animate={{
                        y: -100,
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 0.1,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Impact Frame Effects */}
        <AnimatePresence>
          {impactFrame && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none z-50"
            >
              {impactFrame.type === 'zoom-in' && (
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: impactFrame.intensity }}
                  transition={{ duration: impactFrame.duration / 1000 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <div className="text-6xl font-bold text-yellow-400 animate-pulse">
                    ⭐ LEGENDARY! ⭐
                  </div>
                </motion.div>
              )}
              
              {impactFrame.type === 'screen-shake' && (
                <motion.div
                  animate={{ 
                    x: [-10, 10, -10, 10, 0],
                    y: [-5, 5, -5, 5, 0]
                  }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-red-500/20"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Battle Area */}
        {renderMainBattleArea()}
      </div>
    );
  };

  const renderMainBattleArea = () => (
    <>
      {/* Opponent Area */}
      <div className="flex-1 p-4 border-b border-white/20">
        <div className="flex justify-center gap-2 mb-4">
          {gameState.opponentHand.map((cardId, index) => (
            <Card key={index} className="w-20 h-28 bg-gradient-to-b from-red-900 to-red-700 rotate-180" />
          ))}
        </div>
        
        <div className="flex justify-center gap-2 mb-4 min-h-[120px] bg-white/5 rounded-lg p-2 border border-white/10">
          {gameState.opponentBoard.map(cardId => renderEnhancedCard(cardId, true))}
        </div>
      </div>

      {/* Center - Enhanced Game State */}
      <div className="py-4 px-6 bg-black/50 backdrop-blur border-y border-white/20">
        <div className="flex justify-between items-center">
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
          
          {/* Enhanced Mana Display */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-900/50 px-3 py-1 rounded-full">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-blue-300">{gameState.playerMana}/10</span>
            </div>
            
            {/* Nexus Health */}
            <div className="flex items-center gap-2 bg-green-900/50 px-3 py-1 rounded-full">
              <Heart className="w-4 h-4 text-green-400" />
              <span className="font-bold text-green-300">{gameState.playerNexusHealth}</span>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="bg-white/10 border-white/20">
            End Turn
          </Button>
        </div>
      </div>

      {/* Player Area */}
      <div className="flex-1 p-4">
        {/* Player Board */}
        <div className="flex justify-center gap-2 mb-4 min-h-[120px] bg-white/5 rounded-lg p-2 border border-white/10">
          {gameState.playerBoard.map(cardId => renderEnhancedCard(cardId))}
          {gameState.playerBoard.length === 0 && (
            <div className="flex items-center justify-center text-white/50 text-sm">
              Deploy your units here
            </div>
          )}
        </div>
        
        {/* Enhanced Player Hand */}
        <div className="flex justify-center gap-2">
          {gameState.playerHand.map(cardId => renderEnhancedCard(cardId))}
        </div>
      </div>

      {/* Selected Card Actions */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur p-4 rounded-lg border border-white/20"
          >
            <div className="flex gap-3">
              <Button 
                size="sm" 
                onClick={() => handleCardPlay(selectedCard)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Play Card
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setSelectedCard(null)}
                className="border-white/20"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return renderBattlefield();
};

// Mock card data - in real implementation, this would come from your card database
function getCardData(cardId: string) {
  const cardDatabase = {
    'flame_mage_champion': {
      name: 'Flame Mage',
      cost: 3,
      attack: 2,
      health: 3,
      faction: 'Mystic',
      rarity: 'Champion',
      keywords: ['Quick Strike']
    },
    'shadow_assassin_champion': {
      name: 'Shadow Assassin',
      cost: 2,
      attack: 3,
      health: 1,
      faction: 'Shadow',
      rarity: 'Champion',
      keywords: ['Stealth']
    },
    'tree_guardian_champion': {
      name: 'Ancient Guardian',
      cost: 5,
      attack: 1,
      health: 8,
      faction: 'Nature',
      rarity: 'Legendary',
      keywords: ['Guard', 'Regeneration']
    }
  };
  
  return cardDatabase[cardId];
}