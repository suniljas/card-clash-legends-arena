import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.994cfffa0d8e4a948c58725d5a05f780',
  appName: 'Legends Card Clash Arena',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: "https://994cfffa-0d8e-4a94-8c58-725d5a05f780.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#220a4d",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#220a4d',
    },
    Haptics: {},
    App: {
      preventOverlayDismissal: true,
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK',
      resizeOnFullScreen: true,
    },
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#220a4d',
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;