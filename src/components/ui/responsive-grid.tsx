import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ResponsiveGridProps {
  children: React.ReactNode[];
  className?: string;
  minItemWidth?: number;
  gap?: number;
  itemHeight?: number;
  enableVirtualization?: boolean;
  containerHeight?: number;
}

export function ResponsiveGrid({
  children,
  className,
  minItemWidth = 200,
  gap = 16,
  itemHeight = 280,
  enableVirtualization = false,
  containerHeight = 600
}: ResponsiveGridProps) {
  // Calculate grid columns based on container width
  const gridStyle = useMemo(() => {
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`,
      gap: `${gap}px`,
      width: '100%'
    };
  }, [minItemWidth, gap]);

  // Simple virtualization for large collections
  const virtualizedChildren = useMemo(() => {
    if (!enableVirtualization || children.length < 50) {
      return children;
    }

    // Calculate visible items based on container height
    const itemsPerRow = Math.floor((window.innerWidth - 32) / (minItemWidth + gap));
    const visibleRows = Math.ceil(containerHeight / (itemHeight + gap));
    const visibleItems = itemsPerRow * visibleRows * 2; // Show 2x for smooth scrolling

    return children.slice(0, visibleItems);
  }, [children, enableVirtualization, containerHeight, minItemWidth, gap, itemHeight]);

  if (enableVirtualization && children.length >= 50) {
    return (
      <div className={cn("overflow-auto", className)} style={{ height: containerHeight }}>
        <div style={gridStyle}>
          {virtualizedChildren.map((child, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {child}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={className}
      style={gridStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.05,
            ease: "easeOut"
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Mobile-optimized card grid with touch gestures
interface MobileCardGridProps {
  children: React.ReactNode[];
  className?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function MobileCardGrid({ 
  children, 
  className,
  onSwipeLeft,
  onSwipeRight 
}: MobileCardGridProps) {
  return (
    <motion.div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4",
        "touch-pan-y", // Allow vertical scrolling
        className
      )}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        const swipeThreshold = 50;
        if (info.offset.x > swipeThreshold && onSwipeRight) {
          onSwipeRight();
        } else if (info.offset.x < -swipeThreshold && onSwipeLeft) {
          onSwipeLeft();
        }
      }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.3, 
            delay: index * 0.02,
            ease: "easeOut"
          }}
          whileTap={{ scale: 0.95 }}
          className="touch-target" // Ensures minimum 44px touch target
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Staggered grid animation component
interface StaggeredGridProps {
  children: React.ReactNode[];
  className?: string;
  columns?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  staggerDelay?: number;
}

export function StaggeredGrid({
  children,
  className,
  columns = { default: 2, sm: 3, md: 4, lg: 5, xl: 6 },
  staggerDelay = 0.05
}: StaggeredGridProps) {
  const gridClasses = cn(
    `grid gap-4`,
    `grid-cols-${columns.default}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    className
  );

  return (
    <div className={gridClasses}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: index * staggerDelay,
            ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smooth feel
          }}
          whileHover={{ 
            y: -8, 
            transition: { duration: 0.2 } 
          }}
          whileTap={{ scale: 0.95 }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

// Masonry-style grid for variable height items
interface MasonryGridProps {
  children: React.ReactNode[];
  className?: string;
  columnWidth?: number;
  gap?: number;
}

export function MasonryGrid({
  children,
  className,
  columnWidth = 250,
  gap = 16
}: MasonryGridProps) {
  return (
    <div 
      className={cn("columns-fill", className)}
      style={{
        columnWidth: `${columnWidth}px`,
        columnGap: `${gap}px`,
        columnFill: 'balance'
      }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.03 }}
          className="break-inside-avoid mb-4"
          whileHover={{ scale: 1.02 }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}