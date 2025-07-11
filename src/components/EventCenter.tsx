import { useState, useEffect } from 'react';
import { GameEvent, ACTIVE_EVENTS, generateRandomEvent } from '@/data/events';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calendar, Trophy, Gift, Coins, Gem, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EventCenterProps {
  gameStats: any;
  onBack: () => void;
  onJoinEvent: (eventId: string) => void;
  onClaimReward: (eventId: string) => void;
}

export function EventCenter({ gameStats, onBack, onJoinEvent, onClaimReward }: EventCenterProps) {
  const [events, setEvents] = useState<GameEvent[]>(ACTIVE_EVENTS);
  const [joinedEvents, setJoinedEvents] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    // Generate new random events periodically
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance to generate new event
        const newEvent = generateRandomEvent();
        setEvents(prev => [...prev, newEvent]);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const timeDiff = endTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) return 'Expired';
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getEventIcon = (type: GameEvent['type']) => {
    switch (type) {
      case 'tournament': return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'special_pack': return <Gift className="w-5 h-5 text-purple-500" />;
      case 'double_rewards': return <Coins className="w-5 h-5 text-green-500" />;
      case 'arena_challenge': return <Trophy className="w-5 h-5 text-red-500" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const canJoinEvent = (event: GameEvent) => {
    if (!event.requirements) return true;
    
    const { minLevel, completedCampaigns } = event.requirements;
    
    if (minLevel && gameStats.campaignProgress < minLevel) return false;
    if (completedCampaigns && gameStats.campaignProgress < completedCampaigns) return false;
    
    return true;
  };

  const handleJoinEvent = (event: GameEvent) => {
    if (!canJoinEvent(event)) {
      const requirements = event.requirements;
      let message = 'You don\'t meet the requirements to join this event.';
      
      if (requirements?.minLevel) {
        message = `You need to reach campaign level ${requirements.minLevel}`;
      }
      
      toast({
        title: "Cannot Join Event",
        description: message,
        variant: "destructive"
      });
      return;
    }

    setJoinedEvents(prev => new Set([...prev, event.id]));
    onJoinEvent(event.id);
    
    toast({
      title: "Event Joined!",
      description: `You've joined ${event.name}`,
    });
  };

  const activeEvents = events.filter(event => {
    const now = new Date();
    return event.isActive && event.endTime > now;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">🎉 Event Center</h1>
          <p className="text-muted-foreground">Join limited-time events for exclusive rewards</p>
        </div>
      </div>

      {/* Active Events */}
      <div className="space-y-6">
        {activeEvents.map((event) => {
          const timeRemaining = formatTimeRemaining(event.endTime);
          const isExpired = timeRemaining === 'Expired';
          const hasJoined = joinedEvents.has(event.id);
          const canJoin = canJoinEvent(event);
          
          return (
            <Card key={event.id} className={`p-6 ${isExpired ? 'opacity-50' : ''}`}>
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Event Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start gap-3">
                    {getEventIcon(event.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{event.name}</h3>
                        <Badge 
                          variant={event.type === 'tournament' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {event.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{event.description}</p>
                      
                      {/* Time Remaining */}
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        <span className={isExpired ? 'text-red-500' : 'text-foreground'}>
                          {isExpired ? 'Event Expired' : `Ends in ${timeRemaining}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  {event.requirements && (
                    <div className="text-sm space-y-1">
                      <p className="font-medium">Requirements:</p>
                      {event.requirements.minLevel && (
                        <p className={`${gameStats.campaignProgress >= event.requirements.minLevel ? 'text-green-500' : 'text-red-500'}`}>
                          • Campaign Level {event.requirements.minLevel}+
                        </p>
                      )}
                      {event.requirements.completedCampaigns && (
                        <p className={`${gameStats.campaignProgress >= event.requirements.completedCampaigns ? 'text-green-500' : 'text-red-500'}`}>
                          • Complete {event.requirements.completedCampaigns} campaigns
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Rewards & Actions */}
                <div className="lg:w-80 space-y-4">
                  {/* Rewards */}
                  <Card className="p-4 bg-muted/50">
                    <h4 className="font-semibold mb-3">Event Rewards</h4>
                    <div className="space-y-2">
                      {event.rewards.coins && (
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-game-coins" />
                          <span>{event.rewards.coins.toLocaleString()} Coins</span>
                        </div>
                      )}
                      {event.rewards.gems && (
                        <div className="flex items-center gap-2">
                          <Gem className="w-4 h-4 text-game-gems" />
                          <span>{event.rewards.gems.toLocaleString()} Gems</span>
                        </div>
                      )}
                      {event.rewards.cards && (
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-purple-500" />
                          <span>{event.rewards.cards.length} Exclusive Cards</span>
                        </div>
                      )}
                      {event.rewards.specialPack && (
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-purple-500" />
                          <span>Special Card Pack</span>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Action Button */}
                  <div className="space-y-2">
                    {!hasJoined && !isExpired && (
                      <Button 
                        onClick={() => handleJoinEvent(event)}
                        disabled={!canJoin}
                        className="w-full"
                      >
                        {canJoin ? 'Join Event' : 'Requirements Not Met'}
                      </Button>
                    )}
                    
                    {hasJoined && !isExpired && (
                      <div className="space-y-2">
                        <Badge variant="outline" className="w-full justify-center py-2">
                          Event Joined ✓
                        </Badge>
                        <Progress value={65} className="w-full" />
                        <p className="text-xs text-center text-muted-foreground">
                          Progress: 65% Complete
                        </p>
                      </div>
                    )}
                    
                    {isExpired && (
                      <Button disabled className="w-full">
                        Event Expired
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {activeEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-lg font-semibold mb-2">No active events</h3>
          <p className="text-muted-foreground">Check back later for new events!</p>
        </div>
      )}
    </div>
  );
}