import { EnhancedMainMenu } from './EnhancedMainMenu';

interface MainMenuProps {
  onNavigate: (page: string) => void;
  user?: { email: string; name: string; provider: string } | null;
  onLogout?: () => void;
  gameStats?: {
    coins: number;
    gems: number;
    campaignProgress: number;
    pvpWins: number;
    totalCards: number;
  };
}

export function MainMenu({ onNavigate, user, onLogout, gameStats }: MainMenuProps) {
  return (
    <EnhancedMainMenu 
      onNavigate={onNavigate}
      user={user}
      onLogout={onLogout}
      gameStats={gameStats}
    />
  );
}