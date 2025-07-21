import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Book, Crown, Scroll, Star, Lock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoreEntry {
  id: string;
  title: string;
  category: 'champion' | 'faction' | 'region' | 'event' | 'artifact';
  content: string;
  unlocked: boolean;
  unlockCondition: string;
  relatedEntries: string[];
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  faction?: string;
}

interface LoreCodexProps {
  onBack: () => void;
  unlockedLore: string[];
  onUnlockLore: (loreId: string) => void;
}

const LORE_DATABASE: LoreEntry[] = [
  {
    id: 'mystic_origins',
    title: 'Origins of the Mystic Order',
    category: 'faction',
    content: `In the ancient times, when magic flowed freely through the realm, a group of scholars and mages united under a common goal: to preserve and protect the arcane knowledge of the world. They formed the Mystic Order, a faction dedicated to understanding the deepest mysteries of magic and reality itself.

The Order's founding principle was that knowledge should be shared responsibly. They believed that magic, while powerful, must be wielded with wisdom and restraint. Their libraries contain tomes that span millennia, documenting every spell, every ritual, and every magical phenomenon ever discovered.

The Mystic Sanctuary, their floating citadel, serves as both a beacon of learning and a fortress against those who would abuse magical power. From its crystal spires, the Order's most skilled mages watch over the realm, ready to intervene when the balance of magic is threatened.

Notable members include the Flame Mage, master of elemental fire magic, and the Arcane Scholar, keeper of forbidden knowledge. Each member undergoes decades of training, learning not just to cast spells, but to understand the very nature of magical energy itself.`,
    unlocked: false,
    unlockCondition: 'Play 10 Mystic faction cards',
    relatedEntries: ['flame_mage_legend', 'arcane_scholar_tale'],
    rarity: 'Rare',
    faction: 'Mystic'
  },
  {
    id: 'shadow_brotherhood',
    title: 'The Shadow Brotherhood',
    category: 'faction',
    content: `Born from necessity in the darkest hour of the realm's history, the Shadow Brotherhood operates from the spaces between light and darkness. They are not evil, as many believe, but rather the necessary guardians of secrets too dangerous for the light of day.

During the Great Purge, when magical practitioners were hunted and killed, the Brotherhood provided sanctuary for those who wielded shadow magic. They developed techniques for moving unseen, striking without warning, and vanishing without a trace. Their methods may seem cruel, but they serve to protect the innocent and eliminate true threats to the realm.

The Brotherhood's code is simple: "In shadow, we find truth. In silence, we find strength. In secrecy, we find freedom." They operate through a network of safe houses, hidden passages, and loyal contacts throughout the realm. Their assassins are trained from childhood in the arts of stealth, poison, and psychological warfare.

The Shadow Assassin, one of their most elite operatives, embodies their philosophy perfectly. Swift, silent, and deadly, they strike at corruption wherever it may hide, ensuring that those who would exploit the weak face justice in the darkness.`,
    unlocked: false,
    unlockCondition: 'Win 5 battles using Shadow faction cards',
    relatedEntries: ['shadow_assassin_legend', 'great_purge_event'],
    rarity: 'Rare',
    faction: 'Shadow'
  },
  {
    id: 'nature_guardians',
    title: 'Guardians of the Ancient Forest',
    category: 'faction',
    content: `Long before the first cities were built, before magic was codified into schools and orders, the Ancient Forest existed in perfect harmony. Its trees have stood for thousands of years, their roots interconnected in a vast network of consciousness that spans the entire woodland realm.

The Nature Guardians are not a faction in the traditional sense, but rather the living embodiment of the forest's will. They include ancient treants, wise druids, mystical beasts, and spirits of the wood. Each Guardian is connected to the forest's collective memory, able to draw upon millennia of wisdom and power.

The Ancient Guardian, eldest among the protectors, has witnessed the rise and fall of entire civilizations. Its bark bears the scars of countless battles fought to defend the natural world from those who would exploit or destroy it. Despite its peaceful nature, the Guardian's wrath is terrible to behold when the forest is threatened.

The Guardians' magic is different from that of other factions - it flows directly from the earth itself, drawing power from the deep roots and ancient stones. They can accelerate growth, commune with animals, and even awaken the trees themselves to defend their home. Their philosophy centers on balance, regeneration, and the eternal cycle of life and death.`,
    unlocked: false,
    unlockCondition: 'Collect 15 Nature faction cards',
    relatedEntries: ['ancient_guardian_legend', 'forest_awakening_event'],
    rarity: 'Epic',
    faction: 'Nature'
  },
  {
    id: 'flame_mage_legend',
    title: 'The Last Flame Keeper',
    category: 'champion',
    content: `Born in the volcanic city of Pyrrhia, the Flame Mage discovered their gift at an early age when they accidentally summoned fire to defend their family from bandits. Recognizing the child's potential, the Mystic Order took them in and began their training in the ancient arts of flame magic.

Under the tutelage of Master Ignitus, the Flame Mage learned to control not just the physical aspects of fire, but its spiritual essence as well. They discovered that true flame magic isn't about destruction, but about transformation - the ability to burn away impurities and forge something new from the ashes.

The Flame Mage's defining moment came during the Siege of the Crystal Tower, when shadow creatures threatened to overwhelm the Mystic Sanctuary. Standing alone against the horde, they channeled the eternal flame - a legendary technique that burns with the heat of creation itself. The resulting conflagration not only destroyed the attackers but purified the very air around the sanctuary.

Now serving as the Order's primary battle mage, the Flame Mage continues to seek deeper understanding of their art. They believe that somewhere in the ancient texts lies the secret to the Original Flame - the first fire that sparked life itself into existence.`,
    unlocked: false,
    unlockCondition: 'Win a battle with Flame Mage as the last unit standing',
    relatedEntries: ['mystic_origins', 'crystal_tower_siege'],
    rarity: 'Legendary',
    faction: 'Mystic'
  },
  {
    id: 'shadow_assassin_legend',
    title: 'Whispers in the Dark',
    category: 'champion',
    content: `Identity unknown. Origins shrouded in mystery. The Shadow Assassin appears in the Brotherhood's records only as a series of completed missions and eliminated targets. Some say they were once a member of the royal guard, driven to the shadows by corruption in the court. Others believe they are a spirit of vengeance, given form by the collective anger of the oppressed.

What is known is this: the Shadow Assassin's blade has never failed to find its mark. They move through the world like a whisper of wind, striking without warning and vanishing without a trace. Their techniques are said to be impossible - walking through solid walls, becoming one with darkness itself, and striking from distances that should be unreachable.

The Assassin's code is carved into the stone of every Brotherhood safe house: "I am the blade in the darkness, the justice that comes for the unjust, the final shadow that falls upon the corrupt." They take no pleasure in killing, viewing each mission as a necessary duty to protect the innocent from those who would exploit them.

Recent reports suggest the Shadow Assassin may be seeking something beyond mere assassination contracts - ancient texts speak of a Shadow Crown, an artifact that could either save the Brotherhood or destroy it entirely.`,
    unlocked: false,
    unlockCondition: 'Execute 20 stealth attacks with Shadow Assassin',
    relatedEntries: ['shadow_brotherhood', 'shadow_crown_artifact'],
    rarity: 'Legendary',
    faction: 'Shadow'
  },
  {
    id: 'ancient_guardian_legend',
    title: 'The Eternal Sentinel',
    category: 'champion',
    content: `Before the great cities, before the wars of magic, before even the first humans set foot in the realm, the Ancient Guardian stood watch. Its roots run deeper than any mountain, its branches reach higher than any tower, and its memory encompasses the entire history of the world.

The Guardian remembers the first spark of magic, the coming of consciousness to the forest, and the delicate balance that must be maintained for all life to flourish. It has seen heroes rise and fall, empires crumble to dust, and seasons turn for thousands of years. Through it all, the Guardian has remained steadfast in its duty to protect the natural world.

Its power is not flashy or dramatic like that of other champions. Instead, it draws from the deep wellsprings of life itself - the slow, patient strength of growing things, the regenerative power of the earth, and the ancient wisdom of trees that have weathered every storm. When the Guardian fights, the very forest fights alongside it, with roots that can crack stone and branches that can turn aside the sharpest blade.

The Guardian speaks rarely, and only to those it deems worthy. Its words carry the weight of millennia, and those who earn its counsel often find themselves changed by the experience. It sees not just what is, but what could be - the potential for growth and renewal that exists in all living things.`,
    unlocked: false,
    unlockCondition: 'Keep Ancient Guardian alive for 10 consecutive turns',
    relatedEntries: ['nature_guardians', 'forest_awakening_event'],
    rarity: 'Legendary',
    faction: 'Nature'
  },
  {
    id: 'crystal_tower_siege',
    title: 'The Siege of the Crystal Tower',
    category: 'event',
    content: `The Crystal Tower has stood for over a millennium as the heart of the Mystic Order's power. Its crystalline structure amplifies magical energy, allowing the Order's most powerful spells to reach across vast distances. But this same power made it a target during the War of Shadows.

Shadow creatures, drawn by the tower's magical resonance, began manifesting around the Sanctuary in unprecedented numbers. At first, they were mere nuisances - small wisps and shadow sprites that could be easily dispelled. But as the days passed, larger and more dangerous entities began to appear.

The siege began in earnest when a Shadow Lord, a creature of pure darkness and malice, materialized at the tower's base. It commanded an army of shadow wraiths, each one capable of draining the life force from anyone it touched. The Order's defenses, designed to repel physical attacks, were nearly useless against these incorporeal foes.

As the shadows began to climb the tower itself, threatening to corrupt its crystal heart, the Flame Mage made their legendary stand. Channeling the eternal flame, they created a barrier of pure fire that the shadows could not pass. The battle raged for three days and nights, with the Flame Mage maintaining the barrier through sheer force of will.

When dawn broke on the fourth day, the Shadow Lord and its army had been utterly destroyed, banished back to the void from whence they came. The Crystal Tower stood intact, but the event marked a turning point in the realm's history - the first time that the forces of shadow had directly challenged the established magical orders.`,
    unlocked: false,
    unlockCondition: 'Complete Path of Legends Chapter 3',
    relatedEntries: ['flame_mage_legend', 'mystic_origins'],
    rarity: 'Epic'
  }
];

export const LoreCodex: React.FC<LoreCodexProps> = ({ onBack, unlockedLore, onUnlockLore }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLore, setSelectedLore] = useState<LoreEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categorizedLore = LORE_DATABASE.reduce((acc, entry) => {
    const isUnlocked = unlockedLore.includes(entry.id);
    if (!acc[entry.category]) acc[entry.category] = [];
    acc[entry.category].push({ ...entry, unlocked: isUnlocked });
    return acc;
  }, {} as Record<string, LoreEntry[]>);

  const getProgressByCategory = (category: string) => {
    const entries = categorizedLore[category] || [];
    const unlocked = entries.filter(entry => entry.unlocked).length;
    return (unlocked / entries.length) * 100;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      champion: Crown,
      faction: Star,
      region: Book,
      event: Scroll,
      artifact: Lock
    };
    return icons[category] || Book;
  };

  const filteredLore = selectedCategory === 'all' 
    ? LORE_DATABASE.filter(entry => 
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : (categorizedLore[selectedCategory] || []).filter(entry =>
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">📜 Lore Codex</h1>
            <p className="text-purple-300">Discover the rich history and legends of the realm</p>
          </div>
          <Button 
            onClick={onBack}
            variant="outline"
            className="border-purple-400 text-purple-300 hover:bg-purple-900"
          >
            Back to Menu
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search lore entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 bg-black/50 border border-purple-400 rounded-lg text-white placeholder-purple-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-black/50 border-purple-400">
              <CardHeader>
                <CardTitle className="text-purple-300">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant={selectedCategory === 'all' ? "default" : "ghost"}
                    className="w-full justify-between"
                    onClick={() => setSelectedCategory('all')}
                  >
                    <span>All Entries</span>
                    <Badge variant="secondary">{LORE_DATABASE.length}</Badge>
                  </Button>
                  
                  {Object.entries(categorizedLore).map(([category, entries]) => {
                    const Icon = getCategoryIcon(category);
                    const progress = getProgressByCategory(category);
                    const unlockedCount = entries.filter(e => e.unlocked).length;
                    
                    return (
                      <div key={category} className="space-y-2">
                        <Button
                          variant={selectedCategory === category ? "default" : "ghost"}
                          className="w-full justify-between"
                          onClick={() => setSelectedCategory(category)}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span className="capitalize">{category}s</span>
                          </div>
                          <Badge variant="secondary">
                            {unlockedCount}/{entries.length}
                          </Badge>
                        </Button>
                        <Progress value={progress} className="h-1" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Panel */}
          <div className="lg:col-span-2">
            {selectedLore ? (
              /* Detailed Lore View */
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-black/50 border-purple-400">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl text-white flex items-center gap-3">
                          {React.createElement(getCategoryIcon(selectedLore.category), { className: "w-6 h-6" })}
                          {selectedLore.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="capitalize">
                            {selectedLore.category}
                          </Badge>
                          <Badge 
                            variant={selectedLore.rarity === 'Legendary' ? "default" : "secondary"}
                            className={selectedLore.rarity === 'Legendary' ? "bg-yellow-600" : ""}
                          >
                            {selectedLore.rarity}
                          </Badge>
                          {selectedLore.faction && (
                            <Badge variant="secondary">
                              {selectedLore.faction}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        onClick={() => setSelectedLore(null)}
                        className="text-purple-300"
                      >
                        ← Back
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedLore.unlocked ? (
                      <div className="space-y-4">
                        <div className="prose prose-invert max-w-none">
                          <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                            {selectedLore.content}
                          </div>
                        </div>
                        
                        {selectedLore.relatedEntries.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-purple-300 mb-2">Related Entries</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedLore.relatedEntries.map(relatedId => {
                                const related = LORE_DATABASE.find(l => l.id === relatedId);
                                if (!related) return null;
                                const isUnlocked = unlockedLore.includes(relatedId);
                                
                                return (
                                  <Button
                                    key={relatedId}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => isUnlocked && setSelectedLore(related)}
                                    disabled={!isUnlocked}
                                    className="border-purple-400"
                                  >
                                    {isUnlocked ? related.title : `🔒 ${related.title}`}
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Lock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">Entry Locked</h3>
                        <p className="text-gray-500 mb-4">{selectedLore.unlockCondition}</p>
                        <Progress value={0} className="max-w-xs mx-auto" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              /* Lore Entry List */
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredLore.map((entry, index) => {
                    const isUnlocked = entry.unlocked || unlockedLore.includes(entry.id);
                    
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                            isUnlocked 
                              ? 'bg-black/50 border-purple-400 hover:bg-purple-900/20' 
                              : 'bg-gray-900/50 border-gray-600'
                          }`}
                          onClick={() => setSelectedLore(entry)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {React.createElement(getCategoryIcon(entry.category), { 
                                  className: `w-5 h-5 ${isUnlocked ? 'text-purple-400' : 'text-gray-500'}` 
                                })}
                                <div>
                                  <h3 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                                    {isUnlocked ? entry.title : `🔒 ${entry.title}`}
                                  </h3>
                                  <p className={`text-sm ${isUnlocked ? 'text-purple-300' : 'text-gray-500'}`}>
                                    {isUnlocked ? entry.content.substring(0, 100) + '...' : entry.unlockCondition}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant={entry.rarity === 'Legendary' ? "default" : "secondary"}
                                  className={entry.rarity === 'Legendary' ? "bg-yellow-600" : ""}
                                >
                                  {entry.rarity}
                                </Badge>
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};