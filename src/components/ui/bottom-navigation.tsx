import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface BottomNavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  badge?: number;
}

interface BottomNavigationProps {
  items: BottomNavigationItem[];
  className?: string;
}

export function BottomNavigation({ items, className }: BottomNavigationProps) {
  return (
    <motion.div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-gradient-to-t from-slate-900/95 to-slate-800/90",
        "backdrop-blur-lg border-t border-slate-700/50",
        "shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.3)]",
        "sm:hidden", // Only show on mobile
        className
      )}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={item.onClick}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-3",
                "transition-all duration-200 ease-out",
                "hover:bg-slate-700/50 active:scale-95",
                item.isActive 
                  ? "bg-gradient-to-t from-blue-600/20 to-purple-600/20 text-blue-300" 
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              <div className="relative">
                <motion.div
                  animate={item.isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "w-6 h-6 flex items-center justify-center",
                    item.isActive && "text-blue-400"
                  )}
                >
                  {item.icon}
                </motion.div>
                
                {/* Badge for notifications */}
                {item.badge && item.badge > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </motion.div>
                )}
              </div>
              
              <span className={cn(
                "text-xs font-medium",
                item.isActive ? "text-blue-300" : "text-slate-400"
              )}>
                {item.label}
              </span>
            </Button>
          </motion.div>
        ))}
      </div>
      
      {/* Active indicator */}
      <motion.div
        className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        animate={{
          x: items.findIndex(item => item.isActive) * (100 / items.length) + '%',
          width: (100 / items.length) + '%'
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

// Hook for managing bottom navigation state
export function useBottomNavigation(currentPage: string) {
  const [activeTab, setActiveTab] = React.useState(currentPage);

  React.useEffect(() => {
    setActiveTab(currentPage);
  }, [currentPage]);

  return { activeTab, setActiveTab };
}