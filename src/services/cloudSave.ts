import { doc, setDoc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { HeroCard, PlayerDeck, GameStats } from '@/types/game';

export interface CloudSaveData {
  collection: HeroCard[];
  currentDeck: PlayerDeck;
  gameStats: GameStats;
  lastSaved: any;
  version: number;
}

const COLLECTION_NAME = 'userGameData';
const CURRENT_VERSION = 1;

export class CloudSaveService {
  private unsubscribe: (() => void) | null = null;

  async saveToCloud(data: Omit<CloudSaveData, 'lastSaved' | 'version'>): Promise<void> {
    if (!auth) throw new Error('Firebase auth not initialized');
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const cloudData: CloudSaveData = {
      ...data,
      lastSaved: serverTimestamp(),
      version: CURRENT_VERSION
    };

    const userDocRef = doc(db, COLLECTION_NAME, user.uid);
    await setDoc(userDocRef, cloudData);
  }

  async loadFromCloud(): Promise<CloudSaveData | null> {
    if (!auth) return null;
    const user = auth.currentUser;
    if (!user) return null;

    const userDocRef = doc(db, COLLECTION_NAME, user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      return docSnap.data() as CloudSaveData;
    }
    return null;
  }

  subscribeToCloudChanges(callback: (data: CloudSaveData | null) => void): void {
    if (!auth) return;
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, COLLECTION_NAME, user.uid);
    this.unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data() as CloudSaveData);
      } else {
        callback(null);
      }
    });
  }

  unsubscribeFromCloudChanges(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  mergeLocalAndCloudData(localData: Omit<CloudSaveData, 'lastSaved' | 'version'>, cloudData: CloudSaveData): CloudSaveData {
    // Simple merge strategy: prefer cloud data but merge collections
    const mergedCollection = this.mergeCollections(localData.collection, cloudData.collection);
    
    return {
      collection: mergedCollection,
      currentDeck: cloudData.currentDeck, // Prefer cloud deck
      gameStats: {
        ...cloudData.gameStats,
        // Take the maximum values for currencies and progress
        coins: Math.max(localData.gameStats.coins, cloudData.gameStats.coins),
        gems: Math.max(localData.gameStats.gems, cloudData.gameStats.gems),
        campaignProgress: Math.max(localData.gameStats.campaignProgress, cloudData.gameStats.campaignProgress),
        totalCards: Math.max(localData.gameStats.totalCards, cloudData.gameStats.totalCards),
        totalBattles: Math.max(localData.gameStats.totalBattles, cloudData.gameStats.totalBattles),
        pvpWins: Math.max(localData.gameStats.pvpWins, cloudData.gameStats.pvpWins),
        pvpLosses: Math.max(localData.gameStats.pvpLosses, cloudData.gameStats.pvpLosses)
      },
      lastSaved: cloudData.lastSaved,
      version: cloudData.version
    };
  }

  private mergeCollections(localCollection: HeroCard[], cloudCollection: HeroCard[]): HeroCard[] {
    const mergedMap = new Map<string, HeroCard>();
    
    // Add all cloud cards first
    cloudCollection.forEach(card => {
      mergedMap.set(card.id, card);
    });
    
    // Add local cards that don't exist in cloud or have higher level/experience
    localCollection.forEach(localCard => {
      const cloudCard = mergedMap.get(localCard.id);
      if (!cloudCard || localCard.level > cloudCard.level || 
          (localCard.level === cloudCard.level && localCard.experience > cloudCard.experience)) {
        mergedMap.set(localCard.id, localCard);
      }
    });
    
    return Array.from(mergedMap.values());
  }
}

export const cloudSaveService = new CloudSaveService();