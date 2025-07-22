import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

// Enhanced Card Types
export interface GameCardProps {
  card?: {
    id: string
    name: string
    artwork: string
    attack: number
    health: number
    cost: number
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    faction: 'flames' | 'depths' | 'guardians' | 'void'
    description: string
    keywords?: string[]
    flavorText?: string
  }
  isSelected?: boolean
  isHovered?: boolean
  size?: 'small' | 'medium' | 'large' | 'detail'
  interactive?: boolean
  glowEffect?: boolean
  onCardSelect?: (cardId: string) => void
  onCardHover?: (cardId: string | null) => void
  className?: string
}

// Particle Component for Card Effects
const CardParticles: React.FC<{ faction: string; active: boolean }> = ({ faction, active }) => {
  if (!active) return null
  
  const particleCount = 20
  const particles = Array.from({ length: particleCount }, (_, i) => i)
  
  const factionColors = {
    flames: '#f59e0b',
    depths: '#3b82f6', 
    guardians: '#22c55e',
    void: '#a855f7'
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
      {particles.map(i => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ 
            background: factionColors[faction as keyof typeof factionColors] || '#f59e0b',
            boxShadow: `0 0 6px ${factionColors[faction as keyof typeof factionColors] || '#f59e0b'}`
          }}
          initial={{
            x: '50%',
            y: '50%',
            scale: 0,
            opacity: 0
          }}
          animate={{
            x: `${50 + (Math.random() - 0.5) * 200}%`,
            y: `${50 + (Math.random() - 0.5) * 200}%`,
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            delay: i * 0.05,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )
}

// Enhanced Game Card Component
const GameCard = React.forwardRef<HTMLDivElement, GameCardProps>(
  ({ 
    className, 
    card, 
    isSelected = false, 
    size = 'medium',
    interactive = true,
    glowEffect = false,
    onCardSelect,
    onCardHover
  }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    const [showParticles, setShowParticles] = useState(false)

    const handleMouseEnter = () => {
      if (interactive) {
        setIsHovered(true)
        onCardHover?.(card?.id || null)
        if (card?.rarity === 'legendary' || card?.rarity === 'epic') {
          setShowParticles(true)
        }
      }
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      onCardHover?.(null)
      setShowParticles(false)
    }

    const handleClick = () => {
      if (interactive && card?.id) {
        onCardSelect?.(card.id)
      }
    }

    const sizeClasses = {
      small: 'w-24 h-32 text-xs',
      medium: 'w-32 h-44 text-sm', 
      large: 'w-40 h-56 text-base',
      detail: 'w-64 h-80 text-lg'
    }

    const factionGradients = {
      flames: 'from-orange-600 via-red-500 to-yellow-500',
      depths: 'from-blue-600 via-cyan-500 to-indigo-500', 
      guardians: 'from-green-600 via-emerald-500 to-lime-500',
      void: 'from-purple-600 via-violet-500 to-fuchsia-500'
    }

    const rarityBorders = {
      common: 'border-gray-400',
      rare: 'border-blue-400 shadow-blue-400/20',
      epic: 'border-purple-400 shadow-purple-400/20', 
      legendary: 'border-yellow-400 shadow-yellow-400/30'
    }

    if (!card) {
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-lg border-2 border-dashed border-gray-600 bg-gray-800/50 backdrop-blur-sm",
            sizeClasses[size],
            "flex items-center justify-center text-gray-400",
            className
          )}
        >
          <span>Empty Slot</span>
        </div>
      )
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative rounded-lg border-2 overflow-hidden cursor-pointer transition-all duration-300",
          "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
          sizeClasses[size],
          rarityBorders[card.rarity],
          factionGradients[card.faction] && `bg-gradient-to-br ${factionGradients[card.faction]}`,
          isSelected && "ring-4 ring-white/50 scale-105",
          isHovered && "scale-105 -translate-y-2",
          glowEffect && "shadow-2xl",
          interactive && "hover:shadow-2xl",
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        whileHover={interactive ? { 
          scale: 1.05, 
          y: -8,
          rotateX: 5,
          transition: { duration: 0.3, ease: "easeOut" }
        } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        style={{
          transformStyle: 'preserve-3d',
          perspective: 1000
        }}
      >
        {/* Holographic Border Effect */}
        {(card.rarity === 'legendary' || card.rarity === 'epic') && (
          <motion.div 
            className="absolute inset-0 rounded-lg"
            style={{
              background: `conic-gradient(
                from 0deg,
                transparent,
                ${card.rarity === 'legendary' ? '#fbbf24' : '#a855f7'},
                transparent,
                ${card.rarity === 'legendary' ? '#f59e0b' : '#8b5cf6'},
                transparent
              )`,
              padding: '2px',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'xor' as any
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Card Artwork Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ 
            backgroundImage: `url(${card.artwork})`,
            filter: 'brightness(0.7) contrast(1.1)'
          }}
        />

        {/* Gradient Overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"
        )} />

        {/* Faction Accent */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-1",
          `bg-gradient-to-r ${factionGradients[card.faction]}`
        )} />

        {/* Mana Cost */}
        <motion.div 
          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm border-2 border-blue-300"
          whileHover={{ scale: 1.1 }}
        >
          {card.cost}
        </motion.div>

        {/* Attack/Health Stats */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between">
          <motion.div 
            className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-red-500 to-red-700 rounded border-2 border-red-300 text-white font-bold text-xs"
            whileHover={{ scale: 1.1 }}
          >
            {card.attack}
          </motion.div>
          <motion.div 
            className="flex items-center justify-center w-7 h-7 bg-gradient-to-br from-green-500 to-green-700 rounded border-2 border-green-300 text-white font-bold text-xs"
            whileHover={{ scale: 1.1 }}
          >
            {card.health}
          </motion.div>
        </div>

        {/* Card Name */}
        <div className="absolute bottom-8 left-2 right-2">
          <h4 className="text-white font-bold text-center drop-shadow-lg">
            {card.name}
          </h4>
        </div>

        {/* Keywords */}
        {card.keywords && card.keywords.length > 0 && (
          <div className="absolute top-12 left-2 right-2 flex flex-wrap gap-1">
            {card.keywords.map((keyword, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-black/70 text-white text-xs rounded-full border border-white/30"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* Rarity Gem */}
        <motion.div 
          className={cn(
            "absolute top-2 right-2 w-6 h-6 rounded-full border-2",
            card.rarity === 'legendary' && "bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300",
            card.rarity === 'epic' && "bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300",
            card.rarity === 'rare' && "bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300",
            card.rarity === 'common' && "bg-gradient-to-br from-gray-400 to-gray-600 border-gray-300"
          )}
          whileHover={{ rotate: 180, scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Hover Description Overlay */}
        <AnimatePresence>
          {isHovered && size !== 'small' && (
            <motion.div
              className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col justify-center p-3 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-white text-center text-xs leading-relaxed mb-2">
                {card.description}
              </p>
              {card.flavorText && (
                <p className="text-gray-300 text-center text-xs italic">
                  "{card.flavorText}"
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Particle Effects */}
        <CardParticles faction={card.faction} active={showParticles} />

        {/* Selection Glow */}
        {isSelected && (
          <motion.div 
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              boxShadow: `0 0 30px ${factionGradients[card.faction]?.includes('orange') ? '#f59e0b' : 
                          factionGradients[card.faction]?.includes('blue') ? '#3b82f6' :
                          factionGradients[card.faction]?.includes('green') ? '#22c55e' : '#a855f7'}`
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>
    )
  }
)

GameCard.displayName = "GameCard"

// Enhanced Card Collection Grid
const CardCollection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    cards: GameCardProps['card'][]
    selectedCards?: string[]
    onCardSelect?: (cardId: string) => void
    size?: GameCardProps['size']
    maxColumns?: number
  }
>(({ className, cards, selectedCards = [], onCardSelect, size = 'medium', maxColumns = 4, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid gap-4 p-4",
      maxColumns === 1 ? "grid-cols-1" :
      maxColumns === 2 ? "grid-cols-1 sm:grid-cols-2" :
      maxColumns === 3 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" :
      maxColumns === 4 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" :
      maxColumns === 5 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" :
      "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
      className
    )}
    {...props}
  >
    {cards.map((card, index) => (
      <motion.div
        key={card?.id || index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
      >
        <GameCard
          card={card}
          size={size}
          isSelected={selectedCards.includes(card?.id || '')}
          onCardSelect={onCardSelect}
          glowEffect={selectedCards.includes(card?.id || '')}
        />
      </motion.div>
    ))}
  </div>
))

CardCollection.displayName = "CardCollection"

// Battlefield Lane Component
const BattlefieldLane = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    cards: (GameCardProps['card'] | null)[]
    maxSlots: number
    laneType: 'melee' | 'ranged'
    faction?: string
    onCardDrop?: (index: number, card: GameCardProps['card']) => void
  }
>(({ className, cards, maxSlots, laneType, faction, onCardDrop, ...props }, ref) => {
  const slots = Array.from({ length: maxSlots }, (_, i) => cards[i] || null)
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    try {
      const cardData = e.dataTransfer.getData("application/json")
      if (cardData && onCardDrop) {
        const card = JSON.parse(cardData) as GameCardProps['card']
        onCardDrop(index, card)
      }
    } catch (error) {
      console.error('Error parsing dropped card data:', error)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative p-4 rounded-lg border-2 border-dashed min-h-[200px]",
        laneType === 'melee' ? "border-red-500/50 bg-red-900/20" : "border-blue-500/50 bg-blue-900/20",
        "backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <h3 className="absolute -top-3 left-4 bg-gray-900 px-3 py-1 rounded text-sm font-semibold text-white">
        {laneType === 'melee' ? '⚔️ Melee Lane' : '🏹 Ranged Lane'}
      </h3>
      
      <div className="grid grid-cols-4 gap-3 mt-4">
        {slots.map((card, index) => (
          <div
            key={index}
            className="relative min-h-[180px] rounded-lg border-2 border-dashed border-gray-600 bg-gray-800/30 flex items-center justify-center transition-colors hover:border-gray-500 hover:bg-gray-700/30"
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
            onDragEnter={(e) => {
              e.preventDefault()
              e.currentTarget.classList.add('border-blue-400', 'bg-blue-900/20')
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              e.currentTarget.classList.remove('border-blue-400', 'bg-blue-900/20')
            }}
          >
            {card ? (
              <GameCard card={card} size="medium" />
            ) : (
              <span className="text-gray-400 text-sm">Empty</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
})

BattlefieldLane.displayName = "BattlefieldLane"

// Legacy Card Components (Enhanced)
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  // Separate motion props from HTML props
  const { onDrag, onDragStart, onDragEnd, onAnimationStart, onAnimationEnd, ...htmlProps } = props as any;
  
  return (
    <motion.div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-lg backdrop-blur-sm",
        "bg-gradient-to-br from-gray-900/90 to-gray-800/90",
        "border-gray-700/50",
        className
      )}
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      {...htmlProps}
    />
  );
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 relative overflow-hidden", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-none tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-300 leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 border-t border-gray-700/50", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  GameCard,
  CardCollection,
  BattlefieldLane
}