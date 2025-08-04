import { useState } from 'react';
import { HeroCard as HeroCardType, Rarity } from '@/types/game';
import { OptimizedGameCard, OptimizedCardGrid } from '@/components/OptimizedCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmptyCollection } from '@/components/ui/empty-state';
import { ArrowLeft, Search, Filter, Star, Trophy, Sparkles, Shield, Zap, Heart, Swords, TrendingUp, TrendingDown, BarChart3, BookOpen, Crown, Target, Users, ChevronDown, SortAsc, SortDesc, Plus, Settings, Award, Gift, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CollectionProps {
  collection: HeroCardType[];
  onBack: () => void;
  onCardSelect?: (card: HeroCardType) => void;
  userDecks?: Array<{ id: string; name: string; cards: string[] }>;
  onAddToDeck?: (cardId: string, deckId: string) => void;
  onUpgradeCard?: (cardId: string) => void;
}

type SortOption = 'name' | 'rarity' | 'attack' | 'defense' | 'level' | 'collected';
type SortDirection = 'asc' | 'desc';

interface FilterState {
  rarity: Rarity | 'all';
  collected: 'all' | 'collected' | 'uncollected';
  position: 'all' | 'front' | 'center' | 'flank';
}

// Enhanced rarity configuration with premium visual effects
const rarityConfig = {
  common: {
    color: 'text-slate-400',
    bgColor: 'from-slate-600/30 to-slate-500/20',
    borderColor: 'border-slate-500/50',
    glowColor: 'shadow-slate-500/30',
    ringColor: 'ring-slate-500/40',
    icon: Shield,
    particleColor: '#64748b'
  },
  uncommon: {
    color: 'text-green-400',
    bgColor: 'from-green-600/30 to-emerald-500/20',
    borderColor: 'border-green-500/50',
    glowColor: 'shadow-green-500/30',
    ringColor: 'ring-green-500/40',
    icon: Star,
    particleColor: '#10b981'
  },
  rare: {
    color: 'text-blue-400',
    bgColor: 'from-blue-600/30 to-cyan-500/20',
    borderColor: 'border-blue-500/50',
    glowColor: 'shadow-blue-500/30',
    ringColor: 'ring-blue-500/40',
    icon: Zap,
    particleColor: '#3b82f6'
  },
  epic: {
    color: 'text-purple-400',
    bgColor: 'from-purple-600/30 to-violet-500/20',
    borderColor: 'border-purple-500/50',
    glowColor: 'shadow-purple-500/30',
    ringColor: 'ring-purple-500/40',
    icon: Crown,
    particleColor: '#8b5cf6'
  },
  legend: {
    color: 'text-amber-400',
    bgColor: 'from-amber-600/30 to-yellow-500/20',
    borderColor: 'border-amber-500/50',
    glowColor: 'shadow-amber-500/30',
    ringColor: 'ring-amber-500/40',
    icon: Trophy,
    particleColor: '#f59e0b'
  },
  'ultra-legend': {
    color: 'text-pink-400',
    bgColor: 'from-pink-600/30 to-rose-500/20',
    borderColor: 'border-pink-500/50',
    glowColor: 'shadow-pink-500/30',
    ringColor: 'ring-pink-500/40',
    icon: Sparkles,
    particleColor: '#ec4899'
  }
};

// Position configuration for strategic gameplay
const positionConfig = {
  front: { icon: Shield, color: 'text-red-400', name: 'Frontline' },
  center: { icon: Heart, color: 'text-blue-400', name: 'Center' },
  flank: { icon: Swords, color: 'text-green-400', name: 'Flank' }
};

// Sort options configuration
const sortOptions: Array<{ value: SortOption; label: string; icon: any }> = [
  { value: 'name', label: 'Name', icon: BarChart3 },
  { value: 'rarity', label: 'Rarity', icon: Star },
  { value: 'attack', label: 'Attack', icon: Swords },
  { value: 'defense', label: 'Defense', icon: Shield },
  { value: 'level', label: 'Level', icon: TrendingUp },
  { value: 'collected', label: 'Collected', icon: Users }
];

// Enhanced animated progress bar component with milestone indicators
const ProgressBar = ({ current, max, label, color = "blue", showMilestones = false }: {
  current: number;
  max: number;
  label: string;
  color?: string;
  showMilestones?: boolean;
}) => {
  const percentage = Math.min((current / max) * 100, 100);
  const milestones = showMilestones ? [25, 50, 75, 100] : [];
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="text-sm text-slate-400">{current}/{max}</span>
      </div>
      <div className="relative w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-400 rounded-full shadow-lg relative overflow-hidden`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        
        {/* Milestone markers */}
        {milestones.map((milestone) => (
          <div
            key={milestone}
            className="absolute top-0 bottom-0 w-0.5 bg-slate-300/50"
            style={{ left: `${milestone}%` }}
          />
        ))}
      </div>
    </div>
  );
};

// Animated circular progress ring for rarity stats
const AnimatedProgressRing = ({ progress, size = 60, strokeWidth = 4, color = "#3b82f6" }: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="drop-shadow-sm"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-slate-300">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export function Collection({ collection, onBack, onCardSelect, userDecks = [], onAddToDeck, onUpgradeCard }: CollectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    rarity: 'all',
    collected: 'all',
    position: 'all'
  });
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedCard, setSelectedCard] = useState<HeroCardType | null>(null);
  const [showLore, setShowLore] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Convert HeroCard to OptimizedGameCard format
  const convertToOptimizedCard = (heroCard: HeroCardType) => ({
    id: heroCard.id,
    name: heroCard.name,
    artwork: heroCard.imageUrl || '/placeholder.svg',
    attack: heroCard.baseAttack || 0,
    health: heroCard.baseHP || 0,
    cost: heroCard.level || 1,
    rarity: heroCard.rarity === 'legend' ? 'legendary' as const : heroCard.rarity as "common" | "rare" | "epic" | "legendary",
    faction: "guardians" as const,
    description: heroCard.abilityDescription || ''
  });

  // Enhanced search suggestions
  const updateSearchSuggestions = (term: string) => {
    if (term.length > 1) {
      const suggestions = collection
        .filter(card => card.name.toLowerCase().includes(term.toLowerCase()))
        .map(card => card.name)
        .slice(0, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  // Enhanced filtering and sorting
  const sortCards = (cards: HeroCardType[]) => {
    return [...cards].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rarity':
          const rarityOrder = Object.values(Rarity);
          comparison = rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
          break;
        case 'attack':
          comparison = (a.baseAttack || 0) - (b.baseAttack || 0);
          break;
        case 'defense':
          comparison = (a.baseHP || 0) - (b.baseHP || 0);
          break;
        case 'level':
          comparison = a.level - b.level;
          break;
        case 'collected':
          comparison = Number(a.unlocked) - Number(b.unlocked);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const filteredCollection = sortCards(collection.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = filters.rarity === 'all' || card.rarity === filters.rarity;
    const matchesCollected = filters.collected === 'all' || 
      (filters.collected === 'collected' && card.unlocked) ||
      (filters.collected === 'uncollected' && !card.unlocked);
    
    return matchesSearch && matchesRarity && matchesCollected;
  }));

  const rarityStats = Object.values(Rarity).reduce((stats, rarity) => {
    const total = collection.filter(card => card.rarity === rarity).length;
    const collected = collection.filter(card => card.rarity === rarity && card.unlocked).length;
    stats[rarity] = { total, collected, percentage: total > 0 ? (collected / total) * 100 : 0 };
    return stats;
  }, {} as Record<Rarity, { total: number; collected: number; percentage: number }>);

  const totalCards = collection.length;
  const collectedCards = collection.filter(card => card.unlocked).length;
  const collectionProgress = (collectedCards / totalCards) * 100;

  // Milestone calculations
  const nextMilestone = [25, 50, 75, 100, 150, 200].find(milestone => collectedCards < milestone) || 200;
  const milestoneProgress = (collectedCards / nextMilestone) * 100;

  return (
    <motion.div 
      className="container mx-auto px-6 py-8 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Enhanced Header with better spacing and visual hierarchy */}
      <motion.div 
        className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="btn-modern-secondary group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </Button>
        
        <div className="flex-1">
          <h1 className="gradient-text text-4xl font-bold font-fantasy">
            Hero Collection
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-slate-300">
              {collectedCards} of {totalCards} heroes collected ({collectionProgress.toFixed(1)}%)
            </p>
            <Badge className="bg-gradient-to-r from-amber-500/20 to-amber-400/20 text-amber-300 border-amber-400/30">
              Level {Math.floor(collectedCards / 10) + 1}
            </Badge>
          </div>
        </div>
        
        {/* Collection Progress - Enhanced for mobile */}
        <motion.div 
          className="w-full lg:min-w-80"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="modern-card p-4">
            <ProgressBar 
              current={collectedCards} 
              max={nextMilestone} 
              label={`Next Milestone: ${nextMilestone} Heroes`}
              color="amber" 
              showMilestones={true}
            />
            <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
              <Gift className="w-3 h-3" />
              Unlock reward at milestone
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Enhanced Rarity Stats with Circular Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="modern-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="gradient-text font-bold text-xl">
              Rarity Collection Progress
            </h3>
            <Badge className="bg-gradient-to-r from-purple-500/20 to-purple-400/20 text-purple-300 border-purple-400/30">
              <Award className="w-3 h-3 mr-1" />
              {Object.values(rarityStats).filter(stat => stat.percentage === 100).length} Complete Sets
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(rarityStats).map(([rarity, stats], index) => {
              const config = rarityConfig[rarity as keyof typeof rarityConfig];
              const Icon = config?.icon || Star;
              
              return (
                <motion.div
                  key={rarity}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <Card className={cn(
                    'p-4 text-center bg-gradient-to-br backdrop-blur-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden',
                    config?.bgColor || 'from-slate-600/20 to-slate-500/20',
                    config?.borderColor || 'border-slate-500/50',
                    config?.glowColor
                  )}>
                    {/* Animated background particles */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`absolute w-1 h-1 rounded-full bg-current opacity-60`}
                          style={{ color: config?.particleColor }}
                          animate={{
                            x: [0, 50, 0],
                            y: [0, -30, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.5,
                          }}
                        />
                      ))}
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Icon className={`w-5 h-5 ${config?.color || 'text-slate-400'}`} />
                        <span className={`text-sm font-medium capitalize ${config?.color || 'text-slate-400'}`}>
                          {rarity.replace('-', ' ')}
                        </span>
                      </div>
                      
                      <div className="flex justify-center mb-3">
                        <AnimatedProgressRing 
                          progress={stats.percentage}
                          size={50}
                          color={config?.particleColor}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <div className={`text-lg font-bold ${config?.color || 'text-slate-400'}`}>
                          {stats.collected}/{stats.total}
                        </div>
                        {stats.percentage === 100 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex justify-center"
                          >
                            <Badge className="text-xs bg-gradient-to-r from-amber-500/20 to-amber-400/20 text-amber-300 border-amber-400/30">
                              <Crown className="w-3 h-3 mr-1" />
                              Complete
                            </Badge>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Enhanced Search and Filters */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="modern-card p-6">
          {/* Search Bar with Suggestions */}
          <div className="relative mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search heroes by name, ability, or lore..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  updateSearchSuggestions(e.target.value);
                }}
                onFocus={() => updateSearchSuggestions(searchTerm)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="pl-12 pr-4 py-3 bg-slate-800/50 border-slate-600/50 focus:border-amber-400/50 transition-all duration-300 text-lg"
              />
            </div>
            
            {/* Search Suggestions */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 z-50 mt-2"
                >
                  <Card className="py-2 bg-slate-800/95 backdrop-blur-sm border-slate-600/50 shadow-xl">
                    {searchSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setSearchTerm(suggestion);
                          setShowSuggestions(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-slate-700/50 transition-colors text-slate-300 hover:text-white"
                      >
                        <Search className="w-4 h-4 inline mr-2 text-slate-500" />
                        {suggestion}
                      </button>
                    ))}
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filter Pills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rarity Filter */}
            <div>
              <Label className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Rarity
              </Label>
              <div className="flex flex-wrap gap-2">
                {(['all', ...Object.values(Rarity)] as const).map((rarity) => {
                  const config = rarity !== 'all' ? rarityConfig[rarity as keyof typeof rarityConfig] : null;
                  const isSelected = filters.rarity === rarity;
                  const Icon = config?.icon || Star;
                  
                  return (
                    <motion.div
                      key={rarity}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilters(prev => ({ ...prev, rarity }))}
                        className={cn(
                          'capitalize transition-all duration-300 relative overflow-hidden',
                          isSelected && rarity !== 'all' ? 
                            `bg-gradient-to-r ${config?.bgColor} ${config?.borderColor} ${config?.color} shadow-lg ${config?.glowColor}` :
                            isSelected ?
                              'bg-gradient-to-r from-amber-500/20 to-amber-400/20 text-amber-300 border-amber-400/50' :
                              'bg-slate-800/50 border-slate-600/50 hover:border-slate-500/60 text-slate-300 hover:text-white'
                        )}
                      >
                        {rarity !== 'all' && <Icon className="w-3 h-3 mr-1" />}
                        {rarity.replace('-', ' ')}
                        {isSelected && rarity !== 'all' && (
                          <motion.div
                            className="absolute inset-0 bg-white/10 rounded"
                            animate={{ opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Collection Status Filter */}
            <div>
              <Label className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Collection Status
              </Label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'collected', 'uncollected'] as const).map((status) => {
                  const isSelected = filters.collected === status;
                  
                  return (
                    <motion.div
                      key={status}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilters(prev => ({ ...prev, collected: status }))}
                        className={cn(
                          'capitalize transition-all duration-300',
                          isSelected ?
                            'bg-gradient-to-r from-blue-500/20 to-blue-400/20 text-blue-300 border-blue-400/50' :
                            'bg-slate-800/50 border-slate-600/50 hover:border-slate-500/60 text-slate-300 hover:text-white'
                        )}
                      >
                        {status === 'collected' && <Star className="w-3 h-3 mr-1" />}
                        {status === 'uncollected' && <Target className="w-3 h-3 mr-1" />}
                        {status.replace('-', ' ')}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <Label className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Sort By
              </Label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="appearance-none bg-slate-800/50 border border-slate-600/50 rounded-md px-3 py-2 pr-8 text-sm text-slate-300 focus:border-amber-400/50 transition-colors"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="bg-slate-800/50 border-slate-600/50 hover:border-slate-500/60 text-slate-300 hover:text-white"
                >
                  {sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Showing {filteredCollection.length} of {totalCards} heroes</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-green-400" />
                  {collectedCards} collected
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-orange-400" />
                  {totalCards - collectedCards} remaining
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Collection Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <OptimizedCardGrid
          cards={filteredCollection.map(convertToOptimizedCard)}
          onCardSelect={(cardId) => {
            const heroCard = filteredCollection.find(c => c.id === cardId);
            if (heroCard) {
              setSelectedCard(heroCard);
              onCardSelect?.(heroCard);
            }
          }}
          selectedCards={selectedCard ? [selectedCard.id] : []}
          maxVisible={100}
        />
      </motion.div>

      {/* Enhanced Empty State */}
      <AnimatePresence>
        {filteredCollection.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-16"
          >
            <EmptyCollection
              title={searchTerm ? "No matching heroes found" : "No heroes match your filters"}
              description={searchTerm ? 
                `No heroes match "${searchTerm}". Try a different search term or clear filters.` :
                collection.length === 0 ?
                  "Start your adventure by opening card packs from the shop!" :
                  "Try adjusting your filters to see more heroes."
              }
              action={collection.length === 0 ? {
                label: "Visit Shop",
                onClick: () => {/* Navigate to shop */},
                variant: "primary"
              } : {
                label: "Clear Filters",
                onClick: () => {
                  setFilters({ rarity: 'all', collected: 'all', position: 'all' });
                  setSearchTerm('');
                },
                variant: "secondary"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Card Details Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <Card className="bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-md border border-slate-600/50 shadow-2xl">
                <div className="p-6">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full bg-gradient-to-br ${rarityConfig[selectedCard.rarity as keyof typeof rarityConfig]?.bgColor || 'from-slate-600/20 to-slate-500/20'} ${rarityConfig[selectedCard.rarity as keyof typeof rarityConfig]?.ringColor} ring-2`}>
                        {(() => {
                          const config = rarityConfig[selectedCard.rarity as keyof typeof rarityConfig];
                          const IconComponent = config?.icon;
                          return IconComponent ? <IconComponent className={`w-6 h-6 ${config?.color}`} /> : null;
                        })()}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-200 mb-1">{selectedCard.name}</h2>
                        <div className="flex items-center gap-3">
                          <Badge className={`capitalize ${rarityConfig[selectedCard.rarity as keyof typeof rarityConfig]?.color} ${rarityConfig[selectedCard.rarity as keyof typeof rarityConfig]?.borderColor}`}>
                            {selectedCard.rarity.replace('-', ' ')}
                          </Badge>
                          <Badge variant="outline" className="text-slate-400 border-slate-600">
                            Level {selectedCard.level}
                          </Badge>
                          {selectedCard.unlocked && (
                            <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                              <Star className="w-3 h-3 mr-1" />
                              Collected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCard(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Card Image and Stats */}
                    <div>
                      <Card className="p-4 bg-slate-800/50 border-slate-700/50 mb-4">
                        <div className="aspect-[3/4] bg-slate-700/50 rounded-lg mb-4 flex items-center justify-center">
                          {selectedCard.imageUrl ? (
                            <img 
                              src={selectedCard.imageUrl} 
                              alt={selectedCard.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-slate-500 text-center">
                              <User className="w-16 h-16 mx-auto mb-2" />
                              <p>No image available</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Combat Stats */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Swords className="w-4 h-4 text-red-400" />
                              <span className="text-sm text-slate-400">Attack</span>
                            </div>
                            <div className="text-xl font-bold text-red-400">{selectedCard.baseAttack}</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Shield className="w-4 h-4 text-blue-400" />
                              <span className="text-sm text-slate-400">Health</span>
                            </div>
                            <div className="text-xl font-bold text-blue-400">{selectedCard.baseHP}</div>
                          </div>
                        </div>
                      </Card>

                      {/* Deck Usage */}
                      {userDecks.length > 0 && (
                        <Card className="p-4 bg-slate-800/50 border-slate-700/50">
                          <h4 className="font-medium text-slate-300 mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Used in Decks
                          </h4>
                          {userDecks.filter(deck => deck.cards.includes(selectedCard.id)).length > 0 ? (
                            <div className="space-y-2">
                              {userDecks.filter(deck => deck.cards.includes(selectedCard.id)).map(deck => (
                                <Badge key={deck.id} variant="outline" className="mr-2">
                                  {deck.name}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500">Not used in any deck</p>
                          )}
                        </Card>
                      )}
                    </div>

                    {/* Card Details */}
                    <div className="space-y-4">
                      {/* Ability Description */}
                      {selectedCard.abilityDescription && (
                        <Card className="p-4 bg-slate-800/50 border-slate-700/50">
                          <h4 className="font-medium text-slate-300 mb-3 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-purple-400" />
                            {selectedCard.abilityName || 'Special Ability'}
                          </h4>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {selectedCard.abilityDescription}
                          </p>
                        </Card>
                      )}

                      {/* Experience Progress */}
                      {selectedCard.unlocked && (
                        <Card className="p-4 bg-slate-800/50 border-slate-700/50">
                          <h4 className="font-medium text-slate-300 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            Experience Progress
                          </h4>
                          <ProgressBar 
                            current={selectedCard.experience || 0} 
                            max={selectedCard.experienceToNext || 100} 
                            label="Experience to Next Level" 
                            color="green" 
                          />
                        </Card>
                      )}

                      {/* Hero Lore */}
                      <Card className="p-4 bg-slate-800/50 border-slate-700/50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-slate-300 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-amber-400" />
                            Hero Lore
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowLore(!showLore)}
                            className="text-amber-400 hover:text-amber-300"
                          >
                            {showLore ? 'Hide' : 'Show'}
                          </Button>
                        </div>
                        <AnimatePresence>
                          {showLore && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <p className="text-sm text-slate-300 leading-relaxed italic">
                                {/* Placeholder lore - in real app this would come from data */}
                                "A legendary warrior who emerged from the ancient battlefields, {selectedCard.name} carries the wisdom of countless victories and the scars of noble defeats. Their presence on the battlefield inspires allies and strikes fear into the hearts of enemies."
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {selectedCard.unlocked && onAddToDeck && (
                          <Button
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
                            onClick={() => {/* Add to deck functionality */}}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Deck
                          </Button>
                        )}
                        
                        {selectedCard.unlocked && onUpgradeCard && (
                          <Button
                            variant="outline"
                            className="flex-1 border-amber-400/50 text-amber-300 hover:bg-amber-400/10"
                            onClick={() => onUpgradeCard(selectedCard.id)}
                          >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Upgrade
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600/50 text-slate-300 hover:text-white"
                          onClick={() => {/* Share functionality */}}
                        >
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}