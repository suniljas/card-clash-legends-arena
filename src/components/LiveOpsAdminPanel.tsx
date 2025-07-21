import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Calendar, DollarSign, Users, Settings, MessageSquare, Activity, Heart, TrendingUp, Award } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

interface PlayerSentiment {
  rating: number;
  feedback: string;
  category: 'balance' | 'fun' | 'monetization' | 'community';
  timestamp: Date;
}

interface GameEvent {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  type: 'legends-lab' | 'bonus-xp' | 'tournament' | 'shop-discount';
  config: Record<string, any>;
}

interface EconomySettings {
  shopPrices: Record<string, number>;
  bundleOffers: Array<{
    id: string;
    name: string;
    items: string[];
    originalPrice: number;
    discountPrice: number;
    isActive: boolean;
  }>;
  dailyRewards: Record<string, string>;
}

interface PlayerAccountData {
  playerId: string;
  email: string;
  level: number;
  gems: number;
  coins: number;
  collection: number;
  lastActive: Date;
  purchases: Array<{
    id: string;
    amount: number;
    date: Date;
  }>;
}

export function LiveOpsAdminPanel({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [economySettings, setEconomySettings] = useState<EconomySettings>({
    shopPrices: {
      'wildcard-common': 50,
      'wildcard-rare': 150,
      'wildcard-epic': 400,
      'wildcard-legendary': 1000,
      'shards-pack': 25
    },
    bundleOffers: [],
    dailyRewards: {
      'day-1': 'shards:100',
      'day-2': 'wildcard:common',
      'day-3': 'wildcardEssence:10'
    }
  });
  const [messageOfTheDay, setMessageOfTheDay] = useState('');
  const [playerSearchId, setPlayerSearchId] = useState('');
  const [playerData, setPlayerData] = useState<PlayerAccountData | null>(null);
  const [communitySpotlight, setCommunitySpotlight] = useState('');
  const [sentimentData, setSentimentData] = useState<PlayerSentiment[]>([]);
  const [gameToggles, setGameToggles] = useState({
    pvpEnabled: true,
    shopEnabled: true,
    legendsLabEnabled: true,
    pathOfLegendsEnabled: true,
    challengesEnabled: true,
    wildcardSystemEnabled: true
  });

  const gameStore = useGameStore();

  const createEvent = () => {
    const newEvent: GameEvent = {
      id: `event-${Date.now()}`,
      name: 'New Event',
      description: 'Event description',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      isActive: false,
      type: 'bonus-xp',
      config: { multiplier: 1.5 }
    };
    setEvents([...events, newEvent]);
  };

  const toggleEvent = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, isActive: !event.isActive }
        : event
    ));
  };

  const searchPlayer = () => {
    // Simulate player search
    if (playerSearchId) {
      setPlayerData({
        playerId: playerSearchId,
        email: 'player@example.com',
        level: 25,
        gems: 150,
        coins: 2500,
        collection: 45,
        lastActive: new Date(),
        purchases: [
          { id: 'purchase-1', amount: 9.99, date: new Date() }
        ]
      });
    }
  };

  const updateGameToggle = (toggle: keyof typeof gameToggles, value: boolean) => {
    setGameToggles(prev => ({ ...prev, [toggle]: value }));
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              LiveOps Admin Panel
            </h1>
            <p className="text-muted-foreground">Manage live game operations and player experience</p>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close Panel
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="economy" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Economy
            </TabsTrigger>
            <TabsTrigger value="players" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Players
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Community
            </TabsTrigger>
            <TabsTrigger value="toggles" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Toggles
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Event Management
                  <Button onClick={createEvent}>Create Event</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {events.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No events configured. Create your first event to get started.
                  </p>
                ) : (
                  events.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{event.name}</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={event.isActive ? 'default' : 'secondary'}>
                            {event.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {event.startDate.toLocaleDateString()} - {event.endDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Switch
                        checked={event.isActive}
                        onCheckedChange={() => toggleEvent(event.id)}
                      />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="economy" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ethical Economy Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(economySettings.shopPrices).map(([item, price]) => (
                    <div key={item} className="flex items-center justify-between">
                      <Label className="capitalize">{item.replace('-', ' ')}</Label>
                      <Input
                        type="number"
                        value={price}
                        onChange={(e) => setEconomySettings(prev => ({
                          ...prev,
                          shopPrices: {
                            ...prev.shopPrices,
                            [item]: parseInt(e.target.value) || 0
                          }
                        }))}
                        className="w-20"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Wildcard Economy Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Players:</span>
                      <span className="font-semibold">12,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Shards/Player:</span>
                      <span className="font-semibold">1,240</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wildcards Crafted Today:</span>
                      <span className="font-semibold">847</span>
                    </div>
                    <div className="flex justify-between">
                      <span>F2P Collection Rate:</span>
                      <span className="font-semibold text-green-600">87%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="players" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Player Account Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter Player ID or Email"
                    value={playerSearchId}
                    onChange={(e) => setPlayerSearchId(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={searchPlayer}>Search Player</Button>
                </div>

                {playerData && (
                  <div className="border rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold">Player Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Player ID:</Label>
                        <p className="font-mono text-sm">{playerData.playerId}</p>
                      </div>
                      <div>
                        <Label>Email:</Label>
                        <p className="text-sm">{playerData.email}</p>
                      </div>
                      <div>
                        <Label>Level:</Label>
                        <p className="text-sm">{playerData.level}</p>
                      </div>
                      <div>
                        <Label>Gems:</Label>
                        <p className="text-sm">{playerData.gems}</p>
                      </div>
                      <div>
                        <Label>Coins:</Label>
                        <p className="text-sm">{playerData.coins}</p>
                      </div>
                      <div>
                        <Label>Collection Size:</Label>
                        <p className="text-sm">{playerData.collection} cards</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">Grant Compensation</Button>
                      <Button size="sm" variant="outline">View Purchase History</Button>
                      <Button size="sm" variant="destructive">Suspend Account</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="toggles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Message of the Day</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter message to display to all players..."
                  value={messageOfTheDay}
                  onChange={(e) => setMessageOfTheDay(e.target.value)}
                  rows={4}
                />
                <Button>Update MOTD</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Notification title" />
                <Textarea placeholder="Notification message" rows={3} />
                <Button>Send to All Players</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Community Deck Spotlight
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Feature a creative community deck..."
                    value={communitySpotlight}
                    onChange={(e) => setCommunitySpotlight(e.target.value)}
                    rows={4}
                  />
                  <Button>Spotlight Deck</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Player Sentiment Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Fun Rating (This Week):</span>
                      <span className="font-semibold text-green-600">4.2/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Balance Satisfaction:</span>
                      <span className="font-semibold text-yellow-600">3.8/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Community Health:</span>
                      <span className="font-semibold text-green-600">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Most Loved Card:</span>
                      <span className="font-semibold">Crystal Wizard</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Proactive Generosity Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Grant Free Wildcards
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Bonus XP Weekend
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Appreciation Bundle
                  </Button>
                </div>
                <Alert>
                  <Heart className="h-4 w-4" />
                  <AlertDescription>
                    Last generosity action: Free Legendary Wildcard (Server Downtime) - 3 days ago
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="toggles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Feature Toggles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(gameToggles).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <div>
                      <Label className="capitalize">{feature.replace(/([A-Z])/g, ' $1').replace('Enabled', '')}</Label>
                      <p className="text-sm text-muted-foreground">
                        Toggle {feature.replace('Enabled', '')} functionality
                      </p>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(value) => updateGameToggle(feature as keyof typeof gameToggles, value)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Player Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>DAU:</span>
                      <span className="font-semibold">8,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MAU:</span>
                      <span className="font-semibold">45,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Retention (D1):</span>
                      <span className="font-semibold">72%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Retention (D7):</span>
                      <span className="font-semibold">35%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monetization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>ARPU:</span>
                      <span className="font-semibold">$0.19</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ARPPU:</span>
                      <span className="font-semibold">$8.45</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion:</span>
                      <span className="font-semibold">2.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LTV:</span>
                      <span className="font-semibold">$12.80</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Game Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Avg Session:</span>
                      <span className="font-semibold">18m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Win Rate:</span>
                      <span className="font-semibold">51%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Match Length:</span>
                      <span className="font-semibold">8m 30s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Drop Rate:</span>
                      <span className="font-semibold">3.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}