import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from './breadcrumb';

interface NavigationItem {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface EnhancedNavigationProps {
  onBack?: () => void;
  title?: string;
  subtitle?: string;
  breadcrumbs?: NavigationItem[];
  className?: string;
  showBackButton?: boolean;
  showBreadcrumbs?: boolean;
  rightContent?: React.ReactNode;
}

export function EnhancedNavigation({
  onBack,
  title,
  subtitle,
  breadcrumbs = [],
  className,
  showBackButton = true,
  showBreadcrumbs = true,
  rightContent
}: EnhancedNavigationProps) {
  return (
    <motion.div
      className={cn(
        "w-full bg-gradient-to-r from-slate-900/90 to-slate-800/80",
        "backdrop-blur-md border-b border-slate-700/50",
        "px-4 py-3 shadow-lg",
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left section with back button and navigation */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Enhanced Back Button */}
          {showBackButton && onBack && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className={cn(
                  "gap-2 px-3 py-2",
                  "bg-gradient-to-r from-slate-700/50 to-slate-600/50",
                  "hover:from-slate-600/60 hover:to-slate-500/60",
                  "border border-slate-600/50 hover:border-slate-500/60",
                  "text-slate-200 hover:text-white",
                  "transition-all duration-200 ease-out",
                  "shadow-md hover:shadow-lg",
                  "focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
                )}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Back</span>
              </Button>
            </motion.div>
          )}

          {/* Title and Breadcrumbs Section */}
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            {/* Breadcrumbs */}
            {showBreadcrumbs && breadcrumbs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Breadcrumb>
                  <BreadcrumbList className="text-xs">
                    {breadcrumbs.map((item, index) => (
                      <React.Fragment key={`breadcrumb-${index}`}>
                        <BreadcrumbItem>
                          {item.isActive ? (
                            <BreadcrumbPage className="text-blue-300 font-medium">
                              {item.label}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink
                              onClick={item.onClick}
                              className={cn(
                                "text-slate-400 hover:text-slate-200",
                                "cursor-pointer transition-colors duration-200",
                                item.onClick && "hover:underline"
                              )}
                            >
                              {index === 0 && (
                                <Home className="w-3 h-3 mr-1 inline" />
                              )}
                              {item.label}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </motion.div>
            )}

            {/* Main Title */}
            {title && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <h1 className={cn(
                  "text-lg sm:text-xl font-bold",
                  "bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent",
                  "truncate"
                )}>
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-slate-400 truncate">
                    {subtitle}
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Right content */}
        {rightContent && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="flex-shrink-0"
          >
            {rightContent}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Hook for managing navigation state
export function useNavigation() {
  const [navigationState, setNavigationState] = React.useState({
    title: '',
    subtitle: '',
    breadcrumbs: [] as NavigationItem[],
    showBackButton: true,
    showBreadcrumbs: true
  });

  const updateNavigation = React.useCallback((updates: Partial<typeof navigationState>) => {
    setNavigationState(prev => ({ ...prev, ...updates }));
  }, []);

  const goBack = React.useCallback(() => {
    window.history.back();
  }, []);

  return {
    navigationState,
    updateNavigation,
    goBack
  };
}