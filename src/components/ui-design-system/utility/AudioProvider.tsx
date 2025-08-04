// Enhanced Audio Provider
// Comprehensive audio system for UI feedback, music, and game sounds

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Howl, Howler } from 'howler';

type AudioSettings = {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  isMuted: boolean;
  isMusicMuted: boolean;
  isSfxMuted: boolean;
  isVoiceMuted: boolean;
  enableHaptics: boolean;
  audioQuality: 'low' | 'medium' | 'high';
};

type SoundCategory = 'ui' | 'game' | 'music' | 'voice' | 'ambient';

type SoundEffect = {
  id: string;
  category: SoundCategory;
  src: string[];
  volume?: number;
  loop?: boolean;
  sprite?: Record<string, [number, number]>;
  preload?: boolean;
};

type AudioProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
  enablePreloading?: boolean;
  audioEffects?: SoundEffect[];
};

type AudioProviderState = {
  settings: AudioSettings;
  updateSettings: (settings: Partial<AudioSettings>) => void;
  playSound: (soundId: string, options?: { volume?: number; loop?: boolean; sprite?: string }) => void;
  stopSound: (soundId: string) => void;
  pauseSound: (soundId: string) => void;
  resumeSound: (soundId: string) => void;
  stopAllSounds: () => void;
  pauseAllSounds: () => void;
  resumeAllSounds: () => void;
  preloadSound: (soundId: string) => Promise<void>;
  isLoaded: (soundId: string) => boolean;
  isPlaying: (soundId: string) => boolean;
  setMasterVolume: (volume: number) => void;
  toggleMute: () => void;
  hapticFeedback: (pattern?: number | number[]) => void;
};

// Default audio settings
const defaultSettings: AudioSettings = {
  masterVolume: 0.8,
  musicVolume: 0.6,
  sfxVolume: 0.8,
  voiceVolume: 1.0,
  isMuted: false,
  isMusicMuted: false,
  isSfxMuted: false,
  isVoiceMuted: false,
  enableHaptics: true,
  audioQuality: 'medium',
};

// Default UI sound effects (these would be actual audio files in production)
const defaultSoundEffects: SoundEffect[] = [
  // UI Sounds
  {
    id: 'button-click',
    category: 'ui',
    src: ['/sounds/ui/button-click.wav', '/sounds/ui/button-click.mp3'],
    volume: 0.6,
    preload: true,
  },
  {
    id: 'button-hover',
    category: 'ui',
    src: ['/sounds/ui/button-hover.wav', '/sounds/ui/button-hover.mp3'],
    volume: 0.4,
    preload: true,
  },
  {
    id: 'card-flip',
    category: 'ui',
    src: ['/sounds/ui/card-flip.wav', '/sounds/ui/card-flip.mp3'],
    volume: 0.7,
    preload: true,
  },
  {
    id: 'notification',
    category: 'ui',
    src: ['/sounds/ui/notification.wav', '/sounds/ui/notification.mp3'],
    volume: 0.8,
    preload: true,
  },
  {
    id: 'success',
    category: 'ui',
    src: ['/sounds/ui/success.wav', '/sounds/ui/success.mp3'],
    volume: 0.9,
    preload: true,
  },
  {
    id: 'error',
    category: 'ui',
    src: ['/sounds/ui/error.wav', '/sounds/ui/error.mp3'],
    volume: 0.8,
    preload: true,
  },
  {
    id: 'modal-open',
    category: 'ui',
    src: ['/sounds/ui/modal-open.wav', '/sounds/ui/modal-open.mp3'],
    volume: 0.5,
    preload: true,
  },
  {
    id: 'modal-close',
    category: 'ui',
    src: ['/sounds/ui/modal-close.wav', '/sounds/ui/modal-close.mp3'],
    volume: 0.5,
    preload: true,
  },
  
  // Game Sounds
  {
    id: 'card-draw',
    category: 'game',
    src: ['/sounds/game/card-draw.wav', '/sounds/game/card-draw.mp3'],
    volume: 0.8,
    preload: true,
  },
  {
    id: 'card-play',
    category: 'game',
    src: ['/sounds/game/card-play.wav', '/sounds/game/card-play.mp3'],
    volume: 0.9,
    preload: true,
  },
  {
    id: 'spell-cast',
    category: 'game',
    src: ['/sounds/game/spell-cast.wav', '/sounds/game/spell-cast.mp3'],
    volume: 1.0,
    preload: true,
  },
  {
    id: 'battle-hit',
    category: 'game',
    src: ['/sounds/game/battle-hit.wav', '/sounds/game/battle-hit.mp3'],
    volume: 0.9,
    preload: true,
  },
  {
    id: 'victory',
    category: 'game',
    src: ['/sounds/game/victory.wav', '/sounds/game/victory.mp3'],
    volume: 1.0,
    preload: true,
  },
  {
    id: 'defeat',
    category: 'game',
    src: ['/sounds/game/defeat.wav', '/sounds/game/defeat.mp3'],
    volume: 1.0,
    preload: true,
  },
  
  // Music
  {
    id: 'menu-music',
    category: 'music',
    src: ['/sounds/music/menu-theme.mp3'],
    volume: 0.4,
    loop: true,
    preload: false,
  },
  {
    id: 'battle-music',
    category: 'music',
    src: ['/sounds/music/battle-theme.mp3'],
    volume: 0.5,
    loop: true,
    preload: false,
  },
];

const initialState: AudioProviderState = {
  settings: defaultSettings,
  updateSettings: () => null,
  playSound: () => null,
  stopSound: () => null,
  pauseSound: () => null,
  resumeSound: () => null,
  stopAllSounds: () => null,
  pauseAllSounds: () => null,
  resumeAllSounds: () => null,
  preloadSound: async () => {},
  isLoaded: () => false,
  isPlaying: () => false,
  setMasterVolume: () => null,
  toggleMute: () => null,
  hapticFeedback: () => null,
};

const AudioProviderContext = createContext<AudioProviderState>(initialState);

export function AudioProvider({
  children,
  storageKey = 'card-clash-audio',
  enablePreloading = true,
  audioEffects = defaultSoundEffects,
}: AudioProviderProps) {
  const [settings, setSettings] = useState<AudioSettings>(defaultSettings);
  const soundsRef = useRef<Map<string, Howl>>(new Map());
  const loadingRef = useRef<Set<string>>(new Set());

  // Load saved settings
  useEffect(() => {
    const savedSettings = localStorage.getItem(storageKey);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.warn('Failed to parse audio settings:', error);
      }
    }
  }, [storageKey]);

  // Update Howler global volume when settings change
  useEffect(() => {
    const effectiveVolume = settings.isMuted ? 0 : settings.masterVolume;
    Howler.volume(effectiveVolume);
  }, [settings.masterVolume, settings.isMuted]);

  // Preload sounds
  useEffect(() => {
    if (!enablePreloading) return;

    audioEffects.forEach(effect => {
      if (effect.preload) {
        preloadSound(effect.id);
      }
    });
  }, [audioEffects, enablePreloading]);

  const updateSettings = (newSettings: Partial<AudioSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const getEffectiveVolume = (category: SoundCategory, baseVolume: number = 1) => {
    let categoryVolume = 1;
    let categoryMuted = false;

    switch (category) {
      case 'music':
        categoryVolume = settings.musicVolume;
        categoryMuted = settings.isMusicMuted;
        break;
      case 'ui':
      case 'game':
        categoryVolume = settings.sfxVolume;
        categoryMuted = settings.isSfxMuted;
        break;
      case 'voice':
        categoryVolume = settings.voiceVolume;
        categoryMuted = settings.isVoiceMuted;
        break;
      case 'ambient':
        categoryVolume = settings.musicVolume * 0.7; // Ambient sounds are quieter
        categoryMuted = settings.isMusicMuted;
        break;
    }

    if (settings.isMuted || categoryMuted) return 0;
    return baseVolume * categoryVolume * settings.masterVolume;
  };

  const preloadSound = async (soundId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (soundsRef.current.has(soundId) || loadingRef.current.has(soundId)) {
        resolve();
        return;
      }

      const effect = audioEffects.find(e => e.id === soundId);
      if (!effect) {
        reject(new Error(`Sound effect ${soundId} not found`));
        return;
      }

      loadingRef.current.add(soundId);

      try {
        const howl = new Howl({
          src: effect.src,
          volume: getEffectiveVolume(effect.category, effect.volume),
          loop: effect.loop || false,
          sprite: effect.sprite,
          preload: true,
          onload: () => {
            loadingRef.current.delete(soundId);
            resolve();
          },
          onloaderror: (id, error) => {
            loadingRef.current.delete(soundId);
            console.warn(`Failed to load sound ${soundId}:`, error);
            reject(error);
          },
        });

        soundsRef.current.set(soundId, howl);
      } catch (error) {
        loadingRef.current.delete(soundId);
        reject(error);
      }
    });
  };

  const playSound = (
    soundId: string, 
    options: { volume?: number; loop?: boolean; sprite?: string } = {}
  ) => {
    let howl = soundsRef.current.get(soundId);
    
    if (!howl) {
      const effect = audioEffects.find(e => e.id === soundId);
      if (!effect) {
        console.warn(`Sound effect ${soundId} not found`);
        return;
      }

      howl = new Howl({
        src: effect.src,
        volume: getEffectiveVolume(effect.category, options.volume || effect.volume),
        loop: options.loop !== undefined ? options.loop : effect.loop || false,
        sprite: effect.sprite,
      });

      soundsRef.current.set(soundId, howl);
    } else {
      // Update volume for existing sound
      const effect = audioEffects.find(e => e.id === soundId);
      if (effect) {
        howl.volume(getEffectiveVolume(effect.category, options.volume || effect.volume));
      }
    }

    if (options.sprite) {
      howl.play(options.sprite);
    } else {
      howl.play();
    }
  };

  const stopSound = (soundId: string) => {
    const howl = soundsRef.current.get(soundId);
    if (howl) {
      howl.stop();
    }
  };

  const pauseSound = (soundId: string) => {
    const howl = soundsRef.current.get(soundId);
    if (howl) {
      howl.pause();
    }
  };

  const resumeSound = (soundId: string) => {
    const howl = soundsRef.current.get(soundId);
    if (howl && !howl.playing()) {
      howl.play();
    }
  };

  const stopAllSounds = () => {
    Howler.stop();
  };

  const pauseAllSounds = () => {
    soundsRef.current.forEach(howl => howl.pause());
  };

  const resumeAllSounds = () => {
    soundsRef.current.forEach(howl => {
      if (!howl.playing()) {
        howl.play();
      }
    });
  };

  const isLoaded = (soundId: string): boolean => {
    const howl = soundsRef.current.get(soundId);
    return howl ? howl.state() === 'loaded' : false;
  };

  const isPlaying = (soundId: string): boolean => {
    const howl = soundsRef.current.get(soundId);
    return howl ? howl.playing() : false;
  };

  const setMasterVolume = (volume: number) => {
    updateSettings({ masterVolume: Math.max(0, Math.min(1, volume)) });
  };

  const toggleMute = () => {
    updateSettings({ isMuted: !settings.isMuted });
  };

  const hapticFeedback = (pattern: number | number[] = 50) => {
    if (!settings.enableHaptics || !('vibrate' in navigator)) return;
    
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundsRef.current.forEach(howl => howl.unload());
      soundsRef.current.clear();
    };
  }, []);

  const value: AudioProviderState = {
    settings,
    updateSettings,
    playSound,
    stopSound,
    pauseSound,
    resumeSound,
    stopAllSounds,
    pauseAllSounds,
    resumeAllSounds,
    preloadSound,
    isLoaded,
    isPlaying,
    setMasterVolume,
    toggleMute,
    hapticFeedback,
  };

  return (
    <AudioProviderContext.Provider value={value}>
      {children}
    </AudioProviderContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioProviderContext);

  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }

  return context;
};

// Hook for UI sound effects
export const useUISound = () => {
  const { playSound, hapticFeedback } = useAudio();

  return {
    clickSound: () => {
      playSound('button-click');
      hapticFeedback(50);
    },
    hoverSound: () => playSound('button-hover'),
    successSound: () => {
      playSound('success');
      hapticFeedback([100, 50, 100]);
    },
    errorSound: () => {
      playSound('error');
      hapticFeedback([200, 100, 200]);
    },
    notificationSound: () => {
      playSound('notification');
      hapticFeedback(100);
    },
    cardFlipSound: () => playSound('card-flip'),
    modalOpenSound: () => playSound('modal-open'),
    modalCloseSound: () => playSound('modal-close'),
  };
};

// Hook for game sound effects
export const useGameSound = () => {
  const { playSound, hapticFeedback } = useAudio();

  return {
    cardDrawSound: () => playSound('card-draw'),
    cardPlaySound: () => {
      playSound('card-play');
      hapticFeedback(75);
    },
    spellCastSound: () => {
      playSound('spell-cast');
      hapticFeedback([50, 50, 100]);
    },
    battleHitSound: () => {
      playSound('battle-hit');
      hapticFeedback(150);
    },
    victorySound: () => {
      playSound('victory');
      hapticFeedback([200, 100, 200, 100, 300]);
    },
    defeatSound: () => {
      playSound('defeat');
      hapticFeedback([300, 200, 300]);
    },
  };
};

export type { AudioSettings, SoundCategory, SoundEffect, AudioProviderProps, AudioProviderState };