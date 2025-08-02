import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Gem, CreditCard, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface GemStoreProps {
  onBack: () => void;
  userProfile: any;
  onGemsUpdated: () => void;
}

const GEM_PACKAGES = [
  { gems: 100, price: 0.99, bonus: 0, popular: false },
  { gems: 500, price: 4.99, bonus: 50, popular: false },
  { gems: 1200, price: 9.99, bonus: 200, popular: true },
  { gems: 2500, price: 19.99, bonus: 500, popular: false },
  { gems: 6000, price: 49.99, bonus: 1500, popular: false },
  { gems: 14000, price: 99.99, bonus: 4000, popular: false },
];

export const GemStore: React.FC<GemStoreProps> = ({ onBack, userProfile, onGemsUpdated }) => {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async (packageData: typeof GEM_PACKAGES[0]) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          gem_amount: packageData.gems + packageData.bonus,
          price_usd: Math.round(packageData.price * 100), // Convert to cents
        }
      });

      if (error) throw error;

      if (data.url) {
        // Open Stripe checkout in new tab
        window.open(data.url, '_blank');
        toast.success('Redirecting to payment...');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to start purchase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-slate-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">💎 Gem Store</h1>
            <p className="text-slate-400">Purchase gems with real money</p>
          </div>
          <div className="w-20" />
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full">
            <Gem className="h-5 w-5 text-purple-400" />
            <span className="text-white font-medium">Current: {userProfile?.gem_balance || 0} Gems</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {GEM_PACKAGES.map((pkg, index) => (
            <Card 
              key={index}
              className={`relative bg-slate-800/50 border-slate-700 ${
                pkg.popular ? 'ring-2 ring-purple-400' : ''
              }`}
            >
              {pkg.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-600">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-white text-2xl">
                  {pkg.gems.toLocaleString()} Gems
                </CardTitle>
                {pkg.bonus > 0 && (
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    +{pkg.bonus} Bonus!
                  </Badge>
                )}
              </CardHeader>
              
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-white mb-4">
                  ${pkg.price}
                </div>
                
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => handlePurchase(pkg)}
                  disabled={loading}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {loading ? 'Processing...' : 'Purchase'}
                </Button>
                
                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    Card
                  </div>
                  <div className="flex items-center gap-1">
                    <Smartphone className="w-4 h-4" />
                    Mobile
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-slate-400">
          <p>Secure payments powered by Stripe • No subscription fees</p>
          <p>Gems are virtual currency and have no real-world value</p>
        </div>
      </div>
    </div>
  );
};