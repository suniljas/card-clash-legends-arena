import { useEffect, useRef, useState } from 'react';

interface AudioOptions {
  volume?: number;
  loop?: boolean;
  preload?: boolean;
}

export function useAudio(src: string, options: AudioOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio(src);
    const audio = audioRef.current;
    
    audio.volume = options.volume ?? 0.7;
    audio.loop = options.loop ?? false;
    
    if (options.preload) {
      audio.preload = 'auto';
    }

    const handleCanPlay = () => setIsLoaded(true);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [src, options.volume, options.loop, options.preload]);

  const play = async () => {
    if (audioRef.current && isLoaded) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.warn('Audio play failed:', error);
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return { play, pause, stop, isPlaying, isLoaded };
}

export function useGameAudio() {
  const cardDraw = useAudio('/sounds/card-draw.mp3', { volume: 0.6, preload: true });
  const cardPlay = useAudio('/sounds/card-play.mp3', { volume: 0.5, preload: true });
  const battleStart = useAudio('/sounds/battle-start.mp3', { volume: 0.8, preload: true });
  const victory = useAudio('/sounds/victory.mp3', { volume: 0.7, preload: true });
  const defeat = useAudio('/sounds/defeat.mp3', { volume: 0.6, preload: true });
  const packOpen = useAudio('/sounds/pack-open.mp3', { volume: 0.8, preload: true });
  const legendaryDrop = useAudio('/sounds/legendary-drop.mp3', { volume: 0.9, preload: true });

  return {
    playCardDraw: cardDraw.play,
    playCardPlay: cardPlay.play,
    playBattleStart: battleStart.play,
    playVictory: victory.play,
    playDefeat: defeat.play,
    playPackOpen: packOpen.play,
    playLegendaryDrop: legendaryDrop.play,
  };
}