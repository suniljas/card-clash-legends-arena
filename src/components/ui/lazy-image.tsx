import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  threshold?: number;
  fadeInDuration?: number;
  blurAmount?: number;
}

export function LazyImage({
  src,
  alt,
  placeholder,
  className,
  onLoad,
  onError,
  threshold = 0.1,
  fadeInDuration = 0.3,
  blurAmount = 20
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      { threshold }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden", className)}>
      {/* Placeholder or blur effect */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center"
          style={{
            backdropFilter: `blur(${blurAmount}px)`,
          }}
        >
          {placeholder ? (
            <img
              src={placeholder}
              alt=""
              className="w-full h-full object-cover opacity-50"
            />
          ) : (
            <div className="w-8 h-8 border-2 border-slate-600 border-t-slate-400 rounded-full animate-spin" />
          )}
        </div>
      )}

      {/* Main image */}
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          className={cn("w-full h-full object-cover", isLoaded ? "opacity-100" : "opacity-0")}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: fadeInDuration }}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Failed to load image</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Progressive image loading with multiple quality levels
interface ProgressiveImageProps {
  src: string;
  lowQualitySrc?: string;
  alt: string;
  className?: string;
  sizes?: string;
  srcSet?: string;
}

export function ProgressiveImage({
  src,
  lowQualitySrc,
  alt,
  className,
  sizes,
  srcSet
}: ProgressiveImageProps) {
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Low quality placeholder */}
      {lowQualitySrc && (
        <img
          src={lowQualitySrc}
          alt=""
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            isHighQualityLoaded ? "opacity-0" : "opacity-100",
            "filter blur-sm"
          )}
        />
      )}

      {/* High quality image */}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isHighQualityLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setIsHighQualityLoaded(true)}
      />
    </div>
  );
}

// Image preloader hook
export function useImagePreloader(imageSources: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = imageSources.map((src) => {
        return new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => {
              const newSet = new Set(prev);
              newSet.add(src);
              return newSet;
            });
            resolve(src);
          };
          img.onerror = () => reject(src);
          img.src = src;
        });
      });

      try {
        await Promise.allSettled(imagePromises);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
      }
    };

    if (imageSources.length > 0) {
      preloadImages();
    }
  }, [imageSources]);

  useEffect(() => {
    setLoadingProgress((loadedImages.size / imageSources.length) * 100);
  }, [loadedImages.size, imageSources.length]);

  return {
    loadedImages,
    loadingProgress,
    isComplete: loadedImages.size === imageSources.length
  };
}

// Optimized card image component
interface CardImageProps {
  src?: string;
  alt: string;
  className?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legend' | 'ultra-legend';
  isLoading?: boolean;
}

export function CardImage({ 
  src, 
  alt, 
  className, 
  rarity = 'common',
  isLoading = false 
}: CardImageProps) {
  const [imageError, setImageError] = useState(false);

  const rarityOverlays = {
    common: 'from-slate-500/10 to-slate-600/20',
    uncommon: 'from-green-500/10 to-green-600/20',
    rare: 'from-blue-500/10 to-blue-600/20',
    epic: 'from-purple-500/10 to-purple-600/20',
    legend: 'from-amber-500/10 to-amber-600/20',
    'ultra-legend': 'from-pink-500/10 to-pink-600/20'
  };

  if (isLoading) {
    return (
      <div className={cn("relative overflow-hidden bg-slate-800", className)}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-600 border-t-slate-400 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!src || imageError) {
    return (
      <div className={cn("relative overflow-hidden bg-slate-800", className)}>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <div className="text-4xl mb-2">🃏</div>
            <div className="text-xs">No Image</div>
          </div>
        </div>
        {/* Rarity overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t",
          rarityOverlays[rarity]
        )} />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <LazyImage
        src={src}
        alt={alt}
        className="w-full h-full"
        onError={() => setImageError(true)}
        threshold={0.1}
      />
      
      {/* Rarity overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t pointer-events-none",
        rarityOverlays[rarity]
      )} />
      
      {/* Holographic effect for high rarities */}
      {(rarity === 'legend' || rarity === 'ultra-legend') && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      )}
    </div>
  );
}

// Image optimization utilities
export const imageUtils = {
  // Generate optimized image URLs
  getOptimizedUrl: (originalUrl: string, width: number, quality = 80): string => {
    // This would integrate with your image optimization service
    // For now, just return the original URL
    return originalUrl;
  },

  // Generate responsive image srcSet
  generateSrcSet: (baseUrl: string, sizes: number[]): string => {
    return sizes
      .map(size => `${imageUtils.getOptimizedUrl(baseUrl, size)} ${size}w`)
      .join(', ');
  },

  // Get appropriate image size based on container
  getOptimalSize: (containerWidth: number, devicePixelRatio = window.devicePixelRatio): number => {
    return Math.ceil(containerWidth * devicePixelRatio);
  },

  // Preload critical images
  preloadCriticalImages: (urls: string[]): Promise<void[]> => {
    const preloadPromises = urls.map(url => {
      return new Promise<void>((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        link.onload = () => resolve();
        link.onerror = () => reject();
        document.head.appendChild(link);
      });
    });

    return Promise.all(preloadPromises);
  }
};