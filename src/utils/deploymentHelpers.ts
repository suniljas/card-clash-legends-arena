// Deployment and mobile optimization utilities

export const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isMobile = () => {
  return isAndroid() || isIOS() || window.innerWidth <= 768;
};

export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches;
};

export const getDeviceInfo = () => {
  return {
    isAndroid: isAndroid(),
    isIOS: isIOS(),
    isMobile: isMobile(),
    isPWA: isPWA(),
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1,
    userAgent: navigator.userAgent
  };
};

export const optimizeForDevice = () => {
  const device = getDeviceInfo();
  
  // Disable animations on lower-end devices
  if (device.pixelRatio < 2 && device.isMobile) {
    document.documentElement.style.setProperty('--transition-smooth', 'none');
  }
  
  // Adjust viewport for mobile
  if (device.isMobile) {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }
  }
  
  return device;
};

export const preloadGameAssets = async () => {
  const criticalAssets = [
    // Sounds
    '/sounds/card-play.mp3',
    '/sounds/card-draw.mp3',
    '/sounds/victory.mp3',
    '/sounds/defeat.mp3',
    '/sounds/legendary-drop.mp3',
    '/sounds/pack-open.mp3',
    '/sounds/battle-start.mp3',
    
    // Images (if they exist)
    '/assets/game-logo.jpg',
    '/assets/app-icon.png'
  ];

  const loadPromises = criticalAssets.map(asset => {
    return new Promise<void>((resolve) => {
      if (asset.endsWith('.mp3') || asset.endsWith('.wav')) {
        const audio = new Audio();
        audio.addEventListener('canplaythrough', () => resolve(), { once: true });
        audio.addEventListener('error', () => resolve(), { once: true }); // Don't fail on missing audio
        audio.src = asset;
        audio.load();
      } else {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Don't fail on missing images
        img.src = asset;
      }
    });
  });

  await Promise.allSettled(loadPromises);
};

export const setupPerformanceMonitoring = () => {
  // Monitor FPS for performance optimization
  let lastTime = performance.now();
  let frameCount = 0;
  let fps = 60;

  const measureFPS = () => {
    const now = performance.now();
    frameCount++;
    
    if (now - lastTime >= 1000) {
      fps = Math.round((frameCount * 1000) / (now - lastTime));
      frameCount = 0;
      lastTime = now;
      
      // Automatically reduce quality if FPS drops below 30
      if (fps < 30) {
        document.documentElement.classList.add('low-performance');
      } else {
        document.documentElement.classList.remove('low-performance');
      }
    }
    
    requestAnimationFrame(measureFPS);
  };

  requestAnimationFrame(measureFPS);
  
  return {
    getFPS: () => fps
  };
};

export const handleAppInstallPrompt = () => {
  let deferredPrompt: any;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  return {
    canInstall: () => !!deferredPrompt,
    showInstallPrompt: async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        return outcome;
      }
      return null;
    }
  };
};

export const initializeApp = async () => {
  console.log('🎮 Initializing Card Clash for deployment...');
  
  // Optimize for current device
  const deviceInfo = optimizeForDevice();
  console.log('📱 Device info:', deviceInfo);
  
  // Setup performance monitoring
  const performanceMonitor = setupPerformanceMonitoring();
  console.log('📊 Performance monitoring enabled');
  
  // Setup install prompt handling
  const installHandler = handleAppInstallPrompt();
  console.log('📲 Install prompt handler setup');
  
  // Preload critical assets
  await preloadGameAssets();
  console.log('🎨 Critical assets preloaded');
  
  // Setup error handling
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });
  
  console.log('✅ App initialization complete - Ready for deployment!');
  
  return {
    deviceInfo,
    performanceMonitor,
    installHandler
  };
};