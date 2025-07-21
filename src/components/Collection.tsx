import { HeroCard as HeroCardType } from '@/types/game';
import { EnhancedCollectionManager } from './EnhancedCollectionManager';

interface CollectionProps {
  collection: HeroCardType[];
  onBack: () => void;
  onCardSelect?: (card: HeroCardType) => void;
}

export function Collection({ collection, onBack, onCardSelect }: CollectionProps) {
  return (
    <EnhancedCollectionManager
      collection={collection}
      onBack={onBack}
      onCardSelect={onCardSelect}
      mode="collection"
    />
  );
}