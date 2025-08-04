import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { FirebaseAuth } from './FirebaseAuth';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
];

export function Settings() {
  const { settings, updateSettings } = useGameState();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span>Music</span>
          <div className="flex items-center gap-2">
            <Switch
              checked={!settings.isMusicMuted}
              onCheckedChange={(v) => updateSettings({ isMusicMuted: !v })}
            />
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[settings.musicVolume]}
              onValueChange={([v]) => updateSettings({ musicVolume: v })}
              disabled={settings.isMusicMuted}
              className="w-32"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>Sound Effects</span>
          <div className="flex items-center gap-2">
            <Switch
              checked={!settings.isSoundMuted}
              onCheckedChange={(v) => updateSettings({ isSoundMuted: !v })}
            />
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[settings.soundVolume]}
              onValueChange={([v]) => updateSettings({ soundVolume: v })}
              disabled={settings.isSoundMuted}
              className="w-32"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>Haptics</span>
          <Switch
            checked={settings.haptics}
            onCheckedChange={(v) => updateSettings({ haptics: v })}
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Language</span>
          <select
            value={settings.language}
            onChange={e => updateSettings({ language: e.target.value })}
            className="border rounded px-2 py-1 bg-background"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span>Account</span>
          <div>
            {settings.accountProvider === 'none' ? (
              <Button onClick={() => setShowAuth(true)} size="sm">Bind Account</Button>
            ) : (
              <Button onClick={() => updateSettings({ accountProvider: 'none' })} size="sm" variant="destructive">Unlink</Button>
            )}
          </div>
        </div>
      </Card>
      {showAuth && (
        <FirebaseAuth
          onLogin={({ provider }) => {
            updateSettings({ accountProvider: provider as 'google' | 'facebook' | 'none' });
            setShowAuth(false);
          }}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}