import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/config/firebase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gem, CreditCard, Zap, Crown, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FirebaseGemPurchaseProps {
  onPurchaseGems: (amount: number) => void;
  onClose: () => void;
  userId?: string;
}

export function FirebaseGemPurchase({ onPurchaseGems, onClose, userId }: FirebaseGemPurchaseProps) {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const gemPackages = [
    {
      id: 'starter',
      gems: 100,
      price: 99, // cents
      bonus: 0,
      icon: Gem,
      gradient: 'from-blue-500 to-blue-600',
      popular: false
    },
    {
      id: 'premium',
      gems: 500,
      price: 499, // cents
      bonus: 50,
      icon: Zap,
      gradient: 'from-purple-500 to-purple-600',
      popular: true
    },
    {
      id: 'legendary',
      gems: 1200,
      price: 999, // cents
      bonus: 200,
      icon: Star,
      gradient: 'from-amber-500 to-amber-600',
      popular: false
    },
    {
      id: 'ultimate',
      gems: 2500,
      price: 1999, // cents
      bonus: 500,
      icon: Crown,
      gradient: 'from-pink-500 to-pink-600',
      popular: false
    }
  ];

  const handlePurchase = async (gemPackage: typeof gemPackages[0]) => {
    if (!userId) {
      toast({
        title: "Login Required",
        description: "Please sign in to purchase gems",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    
    try {
      // Call Firebase function to create Stripe checkout session
      const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
      const result = await createCheckoutSession({
        priceId: gemPackage.id,
        userId: userId,
        gems: gemPackage.gems + gemPackage.bonus,
        amount: gemPackage.price
      });

      const { sessionUrl } = result.data as { sessionUrl: string };
      
      // Redirect to Stripe Checkout
      window.open(sessionUrl, '_blank');
      
      toast({
        title: "Redirecting to Payment",
        description: "Complete your purchase in the new tab",
      });
      
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Purchase Failed",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold mb-2">💎 Gem Store</h2>
        <p className="text-muted-foreground">
          Purchase gems to unlock premium packs and exclusive content
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-6">
        {gemPackages.map((pkg) => {
          const IconComponent = pkg.icon;
          
          return (
            <Card
              key={pkg.id}
              className={`relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105 ${
                pkg.popular ? 'ring-2 ring-primary' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-xs font-bold text-center py-1">
                  MOST POPULAR
                </div>
              )}
              
              <div className={`absolute inset-0 bg-gradient-to-br ${pkg.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
              
              <div className={`relative z-10 p-6 text-center ${pkg.popular ? 'pt-8' : ''}`}>
                <div className="mb-4 flex justify-center">
                  <div className={`p-4 rounded-full bg-gradient-to-br ${pkg.gradient}`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-2xl font-bold flex items-center justify-center gap-1">
                    <Gem className="w-5 h-5 text-primary" />
                    {pkg.gems.toLocaleString()}
                  </div>
                  {pkg.bonus > 0 && (
                    <Badge variant="secondary" className="mt-1">
                      +{pkg.bonus} Bonus!
                    </Badge>
                  )}
                </div>

                <div className="text-xl font-bold text-primary mb-4">
                  ${(pkg.price / 100).toFixed(2)}
                </div>

                <Button
                  className="w-full"
                  disabled={processing || !userId}
                  onClick={() => handlePurchase(pkg)}
                  variant={pkg.popular ? "default" : "outline"}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {processing ? "Processing..." : "Purchase"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {!userId && (
        <Card className="p-4 max-w-md mx-auto mb-6 border-destructive">
          <div className="text-center text-destructive">
            <h4 className="font-semibold mb-2">🔒 Sign In Required</h4>
            <p className="text-sm">Please sign in to purchase gems and sync your progress across devices.</p>
          </div>
        </Card>
      )}

      <Card className="p-4 max-w-2xl mx-auto mb-6">
        <h4 className="font-semibold mb-2">💡 Gem Benefits</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Premium card packs with guaranteed rare+ cards</li>
          <li>• Exclusive legendary and ultra-legend packs</li>
          <li>• Special event entries and tournaments</li>
          <li>• Cosmetic upgrades and card backs</li>
          <li>• Fast-track campaign progression</li>
        </ul>
      </Card>

      <div className="text-center">
        <Button variant="ghost" onClick={onClose}>
          Maybe Later
        </Button>
      </div>
    </div>
  );
}