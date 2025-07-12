import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.994cfffa0d8e4a948c58725d5a05f780',
  appName: 'Card Clash: Legends Arena',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: "https://994cfffa-0d8e-4a94-8c58-725d5a05f780.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#220a4d",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#220a4d',
      overlaysWebView: false,
    },
    Haptics: {
      enabled: true,
    },
    App: {
      preventOverlayDismissal: true,
      backgroundColor: '#220a4d',
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true,
      accessoryBarVisible: false,
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    Device: {
      enabled: true,
    },
    Network: {
      enabled: true,
    },
    ScreenOrientation: {
      lock: 'portrait',
    },
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#220a4d',
    captureInput: true,
    webContentsDebuggingEnabled: false,
    minWebViewVersion: 55,
    appendUserAgent: 'CardClash/1.0.0',
    // Google Play Store optimizations
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keyPassword: undefined,
    },
    // Security settings
    cleartextTrafficPermitted: false,
    // App signing for Google Play Store
    signingConfig: {
      storeFile: undefined,
      storePassword: undefined,
      keyAlias: undefined,
      keyPassword: undefined,
    },
  },
  ios: {
    backgroundColor: '#220a4d',
    contentInset: 'automatic',
    allowsLinkPreview: false,
    scrollEnabled: true,
    // iOS specific optimizations
    scheme: 'cardclash',
    // App Store optimizations
    buildOptions: {
      teamId: undefined,
      provisioningProfile: undefined,
    },
  },
  // PWA configuration for web deployment
  pwa: {
    name: 'Card Clash: Legends Arena',
    shortName: 'Card Clash',
    description: 'Premium mobile card battle game inspired by Legends of Runeterra',
    themeColor: '#220a4d',
    backgroundColor: '#220a4d',
    display: 'standalone',
    orientation: 'portrait',
    scope: '/',
    startUrl: '/',
    icons: [
      {
        src: 'assets/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
      },
      {
        src: 'assets/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: 'assets/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
      },
      {
        src: 'assets/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: 'assets/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
      },
      {
        src: 'assets/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'assets/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: 'assets/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
};

export default config;