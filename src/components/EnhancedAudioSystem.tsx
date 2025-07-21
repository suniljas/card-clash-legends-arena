import React, { useState, useEffect, createContext, useContext } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { useGameAudioSystem } from '@/hooks/useHowlerAudio';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Zap, 
  Settings,
  Play,
  Pause,
  SkipForward,
  RotateCcw
} from 'lucide-react';

interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  uiVolume: number;
  muteAll: boolean;
  dynamicMusic: boolean;
  spatialAudio: boolean;
  audioQuality: 'low' | 'medium' | 'high';
}

interface EnhancedAudioSystemProps {
  children: React.ReactNode;
}

interface AudioContextType {
  settings: AudioSettings;
  updateSettings: (settings: Partial<AudioSettings>) => void;
  playContextualMusic: (context: 'menu' | 'battle' | 'victory' | 'defeat') => void;
  playSpatialSFX: (soundId: string, position?: { x: number, y: number }) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within EnhancedAudioSystem');
  }
  return context;
};

export const EnhancedAudioSystem: React.FC<EnhancedAudioSystemProps> = ({ children }) => {
  const audioSystem = useGameAudioSystem();
  const [settings, setSettings] = useState<AudioSettings>({
    masterVolume: 70,
    musicVolume: 50,
    sfxVolume: 80,
    uiVolume: 60,
    muteAll: false,
    dynamicMusic: true,
    spatialAudio: false,
    audioQuality: 'high'
  });

  const [currentMusicContext, setCurrentMusicContext] = useState<string>('menu');
  const [musicPlaying, setMusicPlaying] = useState(false);

  // Update audio system when settings change
  useEffect(() => {
    const masterVol = settings.muteAll ? 0 : settings.masterVolume / 100;
    audioSystem.setMasterVolume(masterVol);
    
    if (settings.muteAll) {
      audioSystem.muteAll();
    } else {
      audioSystem.unmuteAll();
    }
  }, [settings, audioSystem]);

  const updateSettings = (newSettings: Partial<AudioSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Dynamic music system based on game context
  const playContextualMusic = (context: 'menu' | 'battle' | 'victory' | 'defeat') => {
    if (currentMusicContext === context && musicPlaying) return;
    
    // Fade out current music
    if (musicPlaying) {
      audioSystem.fadeOutMusic();
      setTimeout(() => {
        startNewMusic(context);
      }, 1000);
    } else {
      startNewMusic(context);
    }
  };

  const startNewMusic = (context: string) => {
    setCurrentMusicContext(context);
    
    // Start appropriate music based on context
    switch (context) {
      case 'battle':
        audioSystem.startBackgroundMusic();
        audioSystem.fadeInMusic();
        break;
      case 'victory':
        audioSystem.playVictory();
        break;
      case 'defeat':
        audioSystem.playDefeat();
        break;
      default:
        audioSystem.startBackgroundMusic();
        break;
    }
    
    setMusicPlaying(true);
  };

  // Spatial audio for battlefield positioning
  const playSpatialSFX = (soundId: string, position = { x: 0, y: 0 }) => {
    if (!settings.spatialAudio) {
      // Play normal sound
      switch (soundId) {
        case 'card-play':
          audioSystem.playCardPlay();
          break;
        case 'card-attack':
          audioSystem.playCardAttack();
          break;
        case 'ui-click':
          audioSystem.playUIClick();
          break;
        default:
          break;
      }
      return;
    }

    // Calculate spatial positioning
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const distance = Math.sqrt(
      Math.pow(position.x - centerX, 2) + Math.pow(position.y - centerY, 2)
    );
    const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
    const volume = Math.max(0.1, 1 - (distance / maxDistance));
    
    // Apply spatial volume and play sound
    switch (soundId) {
      case 'card-play':
        audioSystem.playCardPlay();
        break;
      case 'card-attack':
        audioSystem.playCardAttack();
        break;
      default:
        break;
    }
  };

  return (
    <AudioContext.Provider value={{
      settings,
      updateSettings,
      playContextualMusic,
      playSpatialSFX
    }}>
      {children}
    </AudioContext.Provider>
  );
};

// Audio Settings Panel Component
export const AudioSettingsPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { settings, updateSettings } = useAudioContext();
  const audioSystem = useGameAudioSystem();

  const testSound = (type: string) => {
    switch (type) {
      case 'ui':
        audioSystem.playUIClick();
        break;
      case 'sfx':
        audioSystem.playCardPlay();
        break;
      case 'music':
        audioSystem.startBackgroundMusic();
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-black/90 border-purple-400 shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Audio Settings
            </h2>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>

          <div className="space-y-6">
            {/* Master Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-300">Master Controls</h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <VolumeX className="w-5 h-5 text-gray-400" />
                  <span className="text-white">Mute All</span>
                </div>
                <Switch
                  checked={settings.muteAll}
                  onCheckedChange={(checked) => updateSettings({ muteAll: checked })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white">Master Volume</span>
                  <span className="text-gray-400">{settings.masterVolume}%</span>
                </div>
                <Slider
                  value={[settings.masterVolume]}
                  onValueChange={([value]) => updateSettings({ masterVolume: value })}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={settings.muteAll}
                />
              </div>
            </div>

            {/* Volume Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-300">Volume Controls</h3>
              
              {[
                { key: 'musicVolume', label: 'Music', icon: Music, test: 'music' },
                { key: 'sfxVolume', label: 'Sound Effects', icon: Zap, test: 'sfx' },
                { key: 'uiVolume', label: 'UI Sounds', icon: Volume2, test: 'ui' }
              ].map(({ key, label, icon: Icon, test }) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">{settings[key]}%</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testSound(test)}
                        className="text-xs"
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <Slider
                    value={[settings[key]]}
                    onValueChange={([value]) => updateSettings({ [key]: value })}
                    max={100}
                    step={1}
                    className="w-full"
                    disabled={settings.muteAll}
                  />
                </div>
              ))}
            </div>

            {/* Advanced Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-300">Advanced Settings</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white">Dynamic Music</span>
                  <p className="text-sm text-gray-400">Music adapts to game state</p>
                </div>
                <Switch
                  checked={settings.dynamicMusic}
                  onCheckedChange={(checked) => updateSettings({ dynamicMusic: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white">Spatial Audio</span>
                  <p className="text-sm text-gray-400">Positional sound effects</p>
                </div>
                <Switch
                  checked={settings.spatialAudio}
                  onCheckedChange={(checked) => updateSettings({ spatialAudio: checked })}
                />
              </div>

              <div className="space-y-2">
                <span className="text-white">Audio Quality</span>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map((quality) => (
                    <Button
                      key={quality}
                      size="sm"
                      variant={settings.audioQuality === quality ? "default" : "outline"}
                      onClick={() => updateSettings({ audioQuality: quality as any })}
                      className="capitalize"
                    >
                      {quality}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Music Player Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-300">Music Player</h3>
              
              <div className="flex items-center justify-between p-4 bg-purple-900/20 rounded-lg border border-purple-400/30">
                <div>
                  <p className="text-white font-semibold">Epic Battle Theme</p>
                  <p className="text-sm text-gray-400">Current Track</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Pause className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-4 border-t border-gray-600">
              <Button
                variant="outline"
                onClick={() => {
                  updateSettings({
                    masterVolume: 70,
                    musicVolume: 50,
                    sfxVolume: 80,
                    uiVolume: 60,
                    muteAll: false,
                    dynamicMusic: true,
                    spatialAudio: false,
                    audioQuality: 'high'
                  });
                }}
                className="w-full"
              >
                Reset to Defaults
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};