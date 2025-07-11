import { doc, setDoc, getDoc, updateDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { Achievement, LeaderboardEntry, Leaderboard, LeaderboardCategory } from '@/types/achievements';
import { ACHIEVEMENTS_DATABASE } from '@/data/achievements';
import { GameStats, HeroCard, Rarity } from '@/types/game';

const ACHIEVEMENTS_COLLECTION = 'userAchievements';
const LEADERBOARDS_COLLECTION = 'leaderboards';
const USER_STATS_COLLECTION = 'userStats';

export class AchievementsService {
  
  async getUserAchievements(): Promise<Achievement[]> {
    const user = auth.currentUser;
    if (!user) return ACHIEVEMENTS_DATABASE;

    try {
      const userDocRef = doc(db, ACHIEVEMENTS_COLLECTION, user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        return ACHIEVEMENTS_DATABASE.map(achievement => ({
          ...achievement,
          unlocked: userData.unlockedAchievements?.includes(achievement.id) || false,
          unlockedAt: userData.achievementDates?.[achievement.id] || undefined,
          progress: userData.progress?.[achievement.id] || 0
        }));
      }
      
      return ACHIEVEMENTS_DATABASE;
    } catch (error) {
      console.error('Error loading achievements:', error);
      return ACHIEVEMENTS_DATABASE;
    }
  }

  async updateAchievementProgress(
    achievementId: string, 
    progress: number, 
    gameStats: GameStats, 
    collection: HeroCard[]
  ): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    try {
      const userDocRef = doc(db, ACHIEVEMENTS_COLLECTION, user.uid);
      const docSnap = await getDoc(userDocRef);
      
      const currentData = docSnap.exists() ? docSnap.data() : {
        unlockedAchievements: [],
        achievementDates: {},
        progress: {}
      };

      const achievement = ACHIEVEMENTS_DATABASE.find(a => a.id === achievementId);
      if (!achievement || currentData.unlockedAchievements?.includes(achievementId)) {
        return false;
      }

      const newProgress = Math.min(progress, achievement.maxProgress);
      currentData.progress = { ...currentData.progress, [achievementId]: newProgress };

      // Check if achievement is now complete
      if (newProgress >= achievement.maxProgress) {
        currentData.unlockedAchievements = [...(currentData.unlockedAchievements || []), achievementId];
        currentData.achievementDates = { 
          ...currentData.achievementDates, 
          [achievementId]: new Date()
        };

        await setDoc(userDocRef, currentData, { merge: true });
        
        // Award achievement rewards
        await this.awardAchievementRewards(achievement);
        return true;
      } else {
        await setDoc(userDocRef, currentData, { merge: true });
        return false;
      }
    } catch (error) {
      console.error('Error updating achievement progress:', error);
      return false;
    }
  }

  async checkAchievements(gameStats: GameStats, collection: HeroCard[]): Promise<string[]> {
    const newlyUnlocked: string[] = [];
    
    for (const achievement of ACHIEVEMENTS_DATABASE) {
      const progress = this.calculateAchievementProgress(achievement, gameStats, collection);
      const wasUnlocked = await this.updateAchievementProgress(achievement.id, progress, gameStats, collection);
      
      if (wasUnlocked) {
        newlyUnlocked.push(achievement.id);
      }
    }

    return newlyUnlocked;
  }

  private calculateAchievementProgress(achievement: Achievement, gameStats: GameStats, collection: HeroCard[]): number {
    switch (achievement.id) {
      case 'first_card':
      case 'card_master':
        return collection.length;
      
      case 'legendary_collector':
        return collection.filter(card => card.rarity === Rarity.ULTRA_LEGEND || card.rarity === Rarity.LEGEND).length;
      
      case 'first_victory':
      case 'battle_veteran':
        return gameStats.totalBattles;
      
      case 'campaign_starter':
      case 'campaign_hero':
        return gameStats.campaignProgress;
      
      case 'pvp_debut':
      case 'pvp_champion':
        return gameStats.pvpWins;
      
      case 'early_adopter':
        return 1; // Always available during beta
      
      default:
        return 0;
    }
  }

  private async awardAchievementRewards(achievement: Achievement): Promise<void> {
    // This would integrate with the game state to award rewards
    console.log(`Achievement unlocked: ${achievement.title}`, achievement.reward);
  }

  async updateLeaderboard(category: LeaderboardCategory, value: number, username: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userStatsRef = doc(db, USER_STATS_COLLECTION, user.uid);
      const leaderboardRef = doc(db, LEADERBOARDS_COLLECTION, category);

      // Update user stats
      await setDoc(userStatsRef, {
        userId: user.uid,
        username,
        [category]: value,
        lastUpdated: new Date()
      }, { merge: true });

      // Note: In a real implementation, you'd use Cloud Functions to maintain leaderboards
      // This is a simplified version for demo purposes
    } catch (error) {
      console.error('Error updating leaderboard:', error);
    }
  }

  async getLeaderboard(category: LeaderboardCategory, limitCount: number = 50): Promise<LeaderboardEntry[]> {
    try {
      const q = query(
        collection(db, USER_STATS_COLLECTION),
        orderBy(category, 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const entries: LeaderboardEntry[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          userId: data.userId,
          username: data.username || 'Anonymous',
          value: data[category] || 0,
          rank: entries.length + 1,
          lastUpdated: data.lastUpdated?.toDate() || new Date()
        });
      });

      return entries;
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      return [];
    }
  }
}

export const achievementsService = new AchievementsService();