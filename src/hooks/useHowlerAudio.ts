import { useRef, useCallback, useEffect } from 'react';
import { Howl, Howler } from 'howler';

interface AudioOptions {
  volume?: number;
  loop?: boolean;
  preload?: boolean;
  sprite?: { [key: string]: [number, number] };
}

export function useHowlerAudio(src: string | string[], options: AudioOptions = {}) {
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: Array.isArray(src) ? src : [src],
      volume: options.volume ?? 0.7,
      loop: options.loop ?? false,
      preload: options.preload ?? true,
      sprite: options.sprite,
      html5: true, // Use HTML5 Audio for better mobile support
      onload: () => {
        console.log(`Audio loaded: ${src}`);
      },
      onloaderror: (id, error) => {
        console.warn(`Audio load error for ${src}:`, error);
      },
      onplayerror: (id, error) => {
        console.warn(`Audio play error for ${src}:`, error);
        // Try to unlock audio context on mobile
        soundRef.current?.once('unlock', () => {
          soundRef.current?.play();
        });
      }
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [src, options.volume, options.loop, options.preload]);

  const play = useCallback((spriteId?: string) => {
    if (soundRef.current) {
      return soundRef.current.play(spriteId);
    }
    return null;
  }, []);

  const pause = useCallback((id?: number) => {
    if (soundRef.current) {
      soundRef.current.pause(id);
    }
  }, []);

  const stop = useCallback((id?: number) => {
    if (soundRef.current) {
      soundRef.current.stop(id);
    }
  }, []);

  const setVolume = useCallback((volume: number, id?: number) => {
    if (soundRef.current) {
      soundRef.current.volume(volume, id);
    }
  }, []);

  const fade = useCallback((from: number, to: number, duration: number, id?: number) => {
    if (soundRef.current) {
      soundRef.current.fade(from, to, duration, id);
    }
  }, []);

  return {
    play,
    pause,
    stop,
    setVolume,
    fade,
    isLoaded: () => soundRef.current?.state() === 'loaded'
  };
}

// Enhanced game audio hook with better sound management
export function useGameAudioSystem() {
  // Sound effects with audio sprites for better performance
  const cardSounds = useHowlerAudio(['/sounds/card-actions.webm', '/sounds/card-actions.mp3'], {
    volume: 0.6,
    sprite: {
      draw: [0, 500],
      play: [600, 400],
      attack: [1100, 600]
    }
  });

  const battleSounds = useHowlerAudio(['/sounds/battle-effects.webm', '/sounds/battle-effects.mp3'], {
    volume: 0.7,
    sprite: {
      start: [0, 1000],
      victory: [1200, 1500],
      defeat: [2800, 1200]
    }
  });

  const uiSounds = useHowlerAudio(['/sounds/ui-effects.webm', '/sounds/ui-effects.mp3'], {
    volume: 0.5,
    sprite: {
      click: [0, 200],
      hover: [300, 150],
      notification: [500, 800],
      packOpen: [1400, 1000],
      legendary: [2500, 1500]
    }
  });

  // Background music
  const backgroundMusic = useHowlerAudio(['/sounds/background-music.webm', '/sounds/background-music.mp3'], {
    volume: 0.3,
    loop: true
  });

  // Global audio settings
  const setMasterVolume = useCallback((volume: number) => {
    Howler.volume(volume);
  }, []);

  const muteAll = useCallback(() => {
    Howler.mute(true);
  }, []);

  const unmuteAll = useCallback(() => {
    Howler.mute(false);
  }, []);

  // Game-specific audio functions
  const playCardDraw = useCallback(() => cardSounds.play('draw'), [cardSounds]);
  const playCardPlay = useCallback(() => cardSounds.play('play'), [cardSounds]);
  const playCardAttack = useCallback(() => cardSounds.play('attack'), [cardSounds]);
  
  const playBattleStart = useCallback(() => battleSounds.play('start'), [battleSounds]);
  const playVictory = useCallback(() => battleSounds.play('victory'), [battleSounds]);
  const playDefeat = useCallback(() => battleSounds.play('defeat'), [battleSounds]);
  
  const playUIClick = useCallback(() => uiSounds.play('click'), [uiSounds]);
  const playUIHover = useCallback(() => uiSounds.play('hover'), [uiSounds]);
  const playNotification = useCallback(() => uiSounds.play('notification'), [uiSounds]);
  const playPackOpen = useCallback(() => uiSounds.play('packOpen'), [uiSounds]);
  const playLegendaryDrop = useCallback(() => uiSounds.play('legendary'), [uiSounds]);

  const startBackgroundMusic = useCallback(() => backgroundMusic.play(), [backgroundMusic]);
  const stopBackgroundMusic = useCallback(() => backgroundMusic.stop(), [backgroundMusic]);
  const fadeInMusic = useCallback(() => backgroundMusic.fade(0, 0.3, 2000), [backgroundMusic]);
  const fadeOutMusic = useCallback(() => backgroundMusic.fade(0.3, 0, 2000), [backgroundMusic]);

  return {
    // Card sounds
    playCardDraw,
    playCardPlay,
    playCardAttack,
    
    // Battle sounds
    playBattleStart,
    playVictory,
    playDefeat,
    
    // UI sounds
    playUIClick,
    playUIHover,
    playNotification,
    playPackOpen,
    playLegendaryDrop,
    
    // Background music
    startBackgroundMusic,
    stopBackgroundMusic,
    fadeInMusic,
    fadeOutMusic,
    
    // Global controls
    setMasterVolume,
    muteAll,
    unmuteAll
  };
}