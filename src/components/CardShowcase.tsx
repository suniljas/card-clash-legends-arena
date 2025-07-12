import React from 'react';
import { LORCardEnhanced } from './LORCardEnhanced';
import { Rarity, HeroCard } from '@/types/game';

const demoHeroes: HeroCard[] = [
  {
    id: '1',
    name: 'Fire Warrior',
    rarity: Rarity.COMMON,
    baseAttack: 3,
    baseHP: 4,
    level: 1,
    experience: 0,
    experienceToNext: 100,
    unlocked: true
  },
  {
    id: '2',
    name: 'Water Mage',
    rarity: Rarity.UNCOMMON,
    baseAttack: 4,
    baseHP: 3,
    level: 2,
    experience: 50,
    experienceToNext: 150,
    unlocked: true
  },
  {
    id: '3',
    name: 'Storm Knight',
    rarity: Rarity.RARE,
    baseAttack: 5,
    baseHP: 5,
    level: 3,
    experience: 100,
    experienceToNext: 200,
    abilityName: 'Lightning Strike',
    abilityDescription: 'Deal 2 damage to all enemies',
    unlocked: true
  },
  {
    id: '4',
    name: 'Shadow Assassin',
    rarity: Rarity.EPIC,
    baseAttack: 6,
    baseHP: 4,
    level: 4,
    experience: 150,
    experienceToNext: 250,
    abilityName: 'Stealth',
    abilityDescription: 'Cannot be targeted for 1 turn',
    unlocked: true
  },
  {
    id: '5',
    name: 'Golden Dragon',
    rarity: Rarity.LEGEND,
    baseAttack: 8,
    baseHP: 8,
    level: 5,
    experience: 200,
    experienceToNext: 300,
    abilityName: 'Dragon Breath',
    abilityDescription: 'Deal 4 damage to all enemies',
    unlocked: true
  },
  {
    id: '6',
    name: 'Divine Phoenix',
    rarity: Rarity.ULTRA_LEGEND,
    baseAttack: 10,
    baseHP: 10,
    level: 6,
    experience: 250,
    experienceToNext: 400,
    abilityName: 'Rebirth',
    abilityDescription: 'Revive with full health when defeated',
    unlocked: true
  }
];

export function CardShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">
            Card Clash: Legends Arena
          </h1>
          <h2 className="text-2xl font-semibold mb-6 text-white">
            Enhanced LoR-Style Cards Showcase
          </h2>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Experience the premium card design inspired by Legends of Runeterra. 
            Each card features enhanced visual effects, holographic overlays, and dynamic animations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 max-w-7xl mx-auto">
          {demoHeroes.map((hero) => (
            <div key={hero.id} className="flex justify-center">
              <LORCardEnhanced
                hero={hero}
                size="medium"
                isAnimated={true}
                isHoverable={true}
                showRarityGlow={true}
                onClick={() => console.log(`Clicked on ${hero.name}`)}
              />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6 text-gradient-gold">
            Card Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-600">
              <div className="text-blue-400 text-2xl mb-3">✨</div>
              <h4 className="font-bold text-white mb-2">Holographic Effects</h4>
              <p className="text-slate-300 text-sm">
                Premium cards feature dynamic holographic overlays that respond to hover interactions.
              </p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-600">
              <div className="text-purple-400 text-2xl mb-3">⚡</div>
              <h4 className="font-bold text-white mb-2">Energy Glow</h4>
              <p className="text-slate-300 text-sm">
                Each rarity has unique energy field effects that pulse and glow based on card power.
              </p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-600">
              <div className="text-amber-400 text-2xl mb-3">💎</div>
              <h4 className="font-bold text-white mb-2">Element Icons</h4>
              <p className="text-slate-300 text-sm">
                Cards automatically display element icons based on hero names (Fire, Water, Wind, etc.).
              </p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-600">
              <div className="text-pink-400 text-2xl mb-3">🌟</div>
              <h4 className="font-bold text-white mb-2">Floating Particles</h4>
              <p className="text-slate-300 text-sm">
                High-rarity cards feature animated floating particles that enhance the mystical feel.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6 text-gradient-legendary">
            Rarity System
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-300">Common & Uncommon</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">Subtle glow effects</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300 text-sm">Basic animations</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-slate-300">Rare & Epic</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-300 text-sm">Enhanced glow effects</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-300 text-sm">Holographic overlays</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-slate-300">Legendary & Ultra Legendary</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-300 text-sm">Divine glow effects</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-300 text-sm">Floating particles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}