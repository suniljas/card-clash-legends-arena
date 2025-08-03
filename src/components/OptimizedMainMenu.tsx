"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const rarityStyles = {
  Common: { color: "gray", icon: "⬤" },
  Rare: { color: "blue", icon: "⬤" },
  Epic: { color: "purple", icon: "⬤" },
  Legendary: { color: "yellow", icon: "⬤" },
};

const Collection = ({ cards }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCards = cards.filter((card) => {
    const matchesFilter = filter === "All" || card.rarity === filter;
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 overflow-x-auto">
          {['All', 'Common', 'Rare', 'Epic', 'Legendary'].map((rarity) => (
            <Button
              key={rarity}
              variant={filter === rarity ? "default" : "outline"}
              onClick={() => setFilter(rarity)}
              className={cn("min-w-[80px]", filter === rarity && `border-${rarityStyles[rarity]?.color}`)}
            >
              {rarityStyles[rarity]?.icon && (
                <span className={`text-${rarityStyles[rarity].color} mr-1`}>{rarityStyles[rarity].icon}</span>
              )}
              {rarity}
            </Button>
          ))}
        </div>
        <Input
          type="text"
          placeholder="Search cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredCards.map((card) => (
          <motion.div
            key={card.id}
            layoutId={`card-${card.id}`}
            onClick={() => handleCardClick(card)}
            className="cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="w-full h-48 object-cover"
                />
              </CardContent>
              <div className="p-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold truncate">{card.name}</h3>
                  <Badge variant="outline" className={`text-${rarityStyles[card.rarity].color}`}>
                    {card.rarity}
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={`card-${selectedCard.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-11/12 max-w-md p-6 relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => setSelectedCard(null)}
              >
                <X className="w-5 h-5" />
              </Button>
              <img
                src={selectedCard.imageUrl}
                alt={selectedCard.name}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-bold mb-2">{selectedCard.name}</h2>
              <Badge variant="outline" className={`text-${rarityStyles[selectedCard.rarity].color}`}>{selectedCard.rarity}</Badge>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{selectedCard.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Collection;
