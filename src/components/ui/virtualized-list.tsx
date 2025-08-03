import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VirtualizedGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  itemsPerRow: number;
  gap?: number;
  className?: string;
  overscan?: number;
}

export function VirtualizedGrid<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  itemsPerRow,
  gap = 16,
  className,
  overscan = 3
}: VirtualizedGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const { visibleItems, totalHeight, offsetY } = useMemo(() => {
    const rowHeight = itemHeight + gap;
    const totalRows = Math.ceil(items.length / itemsPerRow);
    const containerRows = Math.ceil(containerHeight / rowHeight);
    
    const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const endRow = Math.min(totalRows, startRow + containerRows + overscan * 2);
    
    const visibleStartIndex = startRow * itemsPerRow;
    const visibleEndIndex = Math.min(items.length, endRow * itemsPerRow);
    
    const visibleItems = items.slice(visibleStartIndex, visibleEndIndex).map((item, index) => ({
      item,
      index: visibleStartIndex + index,
      row: Math.floor((visibleStartIndex + index) / itemsPerRow),
      col: (visibleStartIndex + index) % itemsPerRow
    }));

    return {
      visibleItems,
      totalHeight: totalRows * rowHeight,
      offsetY: startRow * rowHeight
    };
  }, [items, itemHeight, itemsPerRow, gap, scrollTop, containerHeight, overscan]);

  return (
    <div
      ref={scrollElementRef}
      className={cn("overflow-auto", className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            display: 'grid',
            gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
            gap: `${gap}px`,
            padding: `${gap}px`
          }}
        >
          {visibleItems.map(({ item, index }) => (
            <div key={index} style={{ height: itemHeight }}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Infinite scroll component
interface InfiniteScrollProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  hasMore: boolean;
  loadMore: () => void;
  loader?: React.ReactNode;
  threshold?: number;
  className?: string;
}

export function InfiniteScroll<T>({
  items,
  renderItem,
  hasMore,
  loadMore,
  loader,
  threshold = 200,
  className
}: InfiniteScrollProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          await loadMore();
          setIsLoading(false);
        }
      },
      { rootMargin: `${threshold}px` }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadMore, threshold, isLoading]);

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={index}>
          {renderItem(item, index)}
        </div>
      ))}
      
      {hasMore && (
        <div ref={observerRef} className="flex justify-center py-4">
          {loader || (
            <div className="flex items-center gap-2 text-slate-400">
              <div className="w-4 h-4 border-2 border-slate-600 border-t-slate-400 rounded-full animate-spin" />
              Loading more...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Masonry layout with performance optimizations
interface MasonryLayoutProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  columnWidth: number;
  gap?: number;
  className?: string;
}

export function MasonryLayout<T>({
  items,
  renderItem,
  columnWidth,
  gap = 16,
  className
}: MasonryLayoutProps<T>) {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const columns = Math.floor(containerWidth / (columnWidth + gap)) || 1;
  const actualColumnWidth = (containerWidth - (columns - 1) * gap) / columns;

  const columnItems = useMemo(() => {
    const cols: T[][] = Array.from({ length: columns }, () => []);
    
    items.forEach((item, index) => {
      const shortestColumn = cols.reduce((acc, col, colIndex) => 
        col.length < cols[acc].length ? colIndex : acc, 0
      );
      cols[shortestColumn].push(item);
    });

    return cols;
  }, [items, columns]);

  return (
    <div ref={containerRef} className={cn("flex gap-4", className)}>
      {columnItems.map((columnItems, columnIndex) => (
        <div
          key={columnIndex}
          className="flex flex-col gap-4"
          style={{ width: actualColumnWidth }}
        >
          {columnItems.map((item, itemIndex) => {
            const globalIndex = columnItems.slice(0, itemIndex).length + 
              columnItems.slice(0, columnIndex).reduce((acc, col) => acc + col.length, 0);
            
            return (
              <motion.div
                key={globalIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: globalIndex * 0.05 }}
              >
                {renderItem(item, globalIndex)}
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Performance monitoring for large lists
export function usePerformanceMonitor(threshold = 16.67) { // 60fps = 16.67ms per frame
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    frameDrops: 0,
    averageRenderTime: 0
  });

  const renderTimes = useRef<number[]>([]);
  const startTime = useRef<number>(0);

  const startMeasure = useCallback(() => {
    startTime.current = performance.now();
  }, []);

  const endMeasure = useCallback(() => {
    const renderTime = performance.now() - startTime.current;
    renderTimes.current.push(renderTime);
    
    // Keep only last 100 measurements
    if (renderTimes.current.length > 100) {
      renderTimes.current.shift();
    }

    const averageRenderTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;
    const frameDrops = renderTimes.current.filter(time => time > threshold).length;

    setMetrics({
      renderTime,
      frameDrops,
      averageRenderTime
    });

    // Warn about performance issues
    if (renderTime > threshold * 2) {
      console.warn(`Slow render detected: ${renderTime.toFixed(2)}ms`);
    }
  }, [threshold]);

  return { metrics, startMeasure, endMeasure };
}

// Optimized card grid specifically for the card game
interface OptimizedCardGridProps<T> {
  cards: T[];
  renderCard: (card: T, index: number) => React.ReactNode;
  className?: string;
  enableVirtualization?: boolean;
  containerHeight?: number;
  cardHeight?: number;
  cardsPerRow?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export function OptimizedCardGrid<T>({
  cards,
  renderCard,
  className,
  enableVirtualization = false,
  containerHeight = 600,
  cardHeight = 280,
  cardsPerRow = { mobile: 2, tablet: 3, desktop: 4 }
}: OptimizedCardGridProps<T>) {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const { metrics, startMeasure, endMeasure } = usePerformanceMonitor();

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) setScreenSize('mobile');
      else if (width < 1024) setScreenSize('tablet');
      else setScreenSize('desktop');
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const currentCardsPerRow = cardsPerRow[screenSize];

  useEffect(() => {
    startMeasure();
    return () => endMeasure();
  }, [cards.length, startMeasure, endMeasure]);

  if (enableVirtualization && cards.length > 50) {
    return (
      <VirtualizedGrid
        items={cards}
        renderItem={renderCard}
        itemHeight={cardHeight}
        containerHeight={containerHeight}
        itemsPerRow={currentCardsPerRow}
        className={className}
      />
    );
  }

  return (
    <div className={cn(
      "grid gap-4 auto-rows-max",
      `grid-cols-${cardsPerRow.mobile} md:grid-cols-${cardsPerRow.tablet} lg:grid-cols-${cardsPerRow.desktop}`,
      className
    )}>
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.02 }}
        >
          {renderCard(card, index)}
        </motion.div>
      ))}
      
      {/* Performance metrics (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
          <div>Render: {metrics.renderTime.toFixed(1)}ms</div>
          <div>Avg: {metrics.averageRenderTime.toFixed(1)}ms</div>
          <div>Drops: {metrics.frameDrops}</div>
        </div>
      )}
    </div>
  );
}