import { MarketListing, HeroCard, EditionType } from '@/types/game';

export class MarketplaceSystem {
  private static listings: MarketListing[] = [];
  private static nextId = 1;

  // List a card for sale
  static listCard(
    card: HeroCard, 
    price: number, 
    sellerName: string
  ): MarketListing {
    const listing: MarketListing = {
      id: `listing-${this.nextId++}`,
      card: { ...card },
      price,
      currency: 'gems',
      seller: sellerName,
      timeRemaining: 24 * 60 * 60, // 24 hours in seconds
      listedAt: new Date()
    };

    this.listings.push(listing);
    return listing;
  }

  // Buy a card from marketplace
  static buyCard(listingId: string, buyerName: string): HeroCard | null {
    const listingIndex = this.listings.findIndex(l => l.id === listingId);
    
    if (listingIndex === -1) {
      return null;
    }

    const listing = this.listings[listingIndex];
    this.listings.splice(listingIndex, 1);
    
    return { ...listing.card };
  }

  // Get all active listings
  static getActiveListings(): MarketListing[] {
    // Remove expired listings
    const now = Date.now();
    this.listings = this.listings.filter(listing => {
      const listedTime = listing.listedAt.getTime();
      const elapsed = (now - listedTime) / 1000;
      return elapsed < listing.timeRemaining;
    });

    return [...this.listings];
  }

  // Search listings by card name and edition
  static searchListings(cardName?: string, edition?: EditionType): MarketListing[] {
    let filtered = this.getActiveListings();

    if (cardName) {
      filtered = filtered.filter(listing => 
        listing.card.name.toLowerCase().includes(cardName.toLowerCase())
      );
    }

    if (edition) {
      filtered = filtered.filter(listing => 
        listing.card.edition === edition
      );
    }

    return filtered;
  }

  // Get listings by rarity
  static getListingsByRarity(rarity: string): MarketListing[] {
    return this.getActiveListings().filter(listing => 
      listing.card.rarity === rarity
    );
  }

  // Validate card matching for marketplace
  static cardsMatch(card1: HeroCard, card2: HeroCard): boolean {
    return card1.name === card2.name && 
           card1.edition === card2.edition;
  }

  // Get price statistics for a card
  static getCardPriceStats(cardName: string, edition: EditionType): {
    averagePrice: number;
    lowestPrice: number;
    highestPrice: number;
    totalListings: number;
  } {
    const relevantListings = this.listings.filter(listing => 
      listing.card.name === cardName && listing.card.edition === edition
    );

    if (relevantListings.length === 0) {
      return {
        averagePrice: 0,
        lowestPrice: 0,
        highestPrice: 0,
        totalListings: 0
      };
    }

    const prices = relevantListings.map(l => l.price);
    
    return {
      averagePrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      lowestPrice: Math.min(...prices),
      highestPrice: Math.max(...prices),
      totalListings: relevantListings.length
    };
  }

  // Initialize with some mock listings
  static initializeMockListings(): void {
    // Add some sample listings for demonstration
    const mockCards: HeroCard[] = [
      {
        id: 'dark-knight-premium-market',
        name: 'Dark Knight',
        edition: EditionType.PREMIUM,
        rarity: 'common' as any,
        baseAttack: 144,
        baseHP: 192,
        level: 1,
        experience: 0,
        experienceToNext: 100,
        unlocked: true
      },
      {
        id: 'flame-mage-special-market',
        name: 'Flame Mage',
        edition: EditionType.SPECIAL,
        rarity: 'rare' as any,
        baseAttack: 300,
        baseHP: 210,
        level: 1,
        experience: 0,
        experienceToNext: 200,
        unlocked: true
      }
    ];

    mockCards.forEach((card, index) => {
      this.listCard(card, 500 + (index * 300), `Player${index + 1}`);
    });
  }
}

// Initialize mock listings
MarketplaceSystem.initializeMockListings();