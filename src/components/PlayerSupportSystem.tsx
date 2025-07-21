import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  HelpCircle, 
  MessageSquare, 
  Flag, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ExternalLink,
  Phone,
  Mail
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'open' | 'pending' | 'resolved';
  createdAt: Date;
  description: string;
}

interface PlayerReport {
  id: string;
  reportedPlayer: string;
  reason: string;
  description: string;
  matchId?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  submittedAt: Date;
}

const FAQ_ITEMS = [
  {
    question: "How do I get more cards?",
    answer: "You can get new cards by opening card packs from the shop, completing campaign missions, or participating in events and challenges."
  },
  {
    question: "What are Gems and how do I earn them?",
    answer: "Gems are premium currency used to purchase special packs and items. You can earn them through daily quests, achievements, or purchase them directly."
  },
  {
    question: "How does the ranking system work?",
    answer: "Your rank is determined by your performance in ranked PvP matches. Win games to gain rank points and climb the ladder."
  },
  {
    question: "Can I trade cards with other players?",
    answer: "Yes! Use the Marketplace to trade cards with other players. Some cards may have trading restrictions."
  },
  {
    question: "Why can't I connect to the game?",
    answer: "Check your internet connection and ensure the game servers are online. If problems persist, contact support."
  }
];

export function PlayerSupportSystem({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('faq');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [reports, setReports] = useState<PlayerReport[]>([]);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    description: ''
  });
  const [newReport, setNewReport] = useState({
    playerName: '',
    reason: '',
    description: '',
    matchId: ''
  });

  const { toast } = useToast();

  const submitTicket = () => {
    if (!newTicket.subject || !newTicket.category || !newTicket.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const ticket: SupportTicket = {
      id: `ticket-${Date.now()}`,
      subject: newTicket.subject,
      category: newTicket.category,
      status: 'open',
      createdAt: new Date(),
      description: newTicket.description
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({ subject: '', category: '', description: '' });
    
    toast({
      title: "Ticket Submitted",
      description: "Your support request has been submitted. We'll respond within 24 hours.",
    });
  };

  const submitReport = () => {
    if (!newReport.playerName || !newReport.reason) {
      toast({
        title: "Missing Information",
        description: "Please provide the player name and reason for reporting.",
        variant: "destructive"
      });
      return;
    }

    const report: PlayerReport = {
      id: `report-${Date.now()}`,
      reportedPlayer: newReport.playerName,
      reason: newReport.reason,
      description: newReport.description,
      matchId: newReport.matchId,
      status: 'pending',
      submittedAt: new Date()
    };

    setReports([report, ...reports]);
    setNewReport({ playerName: '', reason: '', description: '', matchId: '' });
    
    toast({
      title: "Report Submitted",
      description: "Thank you for your report. Our moderation team will review it promptly.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'resolved' ? 'default' : status === 'pending' ? 'secondary' : 'outline';
    return <Badge variant={variant}>{status}</Badge>;
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Help & Support
            </h1>
            <p className="text-muted-foreground">Get help and report issues</p>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Support
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Report
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {FAQ_ITEMS.map((item, index) => (
                  <div key={index} className="border-b border-border pb-4 last:border-0">
                    <h3 className="font-semibold mb-2">{item.question}</h3>
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Server Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">All systems operational</span>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Status Page
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Support Ticket</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={newTicket.category} onValueChange={(value) => setNewTicket({...newTicket, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="payment">Payment Problem</SelectItem>
                        <SelectItem value="account">Account Issue</SelectItem>
                        <SelectItem value="gameplay">Gameplay Question</SelectItem>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Please provide detailed information about your issue..."
                      rows={4}
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    />
                  </div>

                  <Button onClick={submitTicket} className="w-full">
                    Submit Ticket
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Support Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  {tickets.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No support tickets submitted yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {tickets.map((ticket) => (
                        <div key={ticket.id} className="border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-sm">{ticket.subject}</h3>
                            {getStatusBadge(ticket.status)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {ticket.createdAt.toLocaleDateString()} • {ticket.category}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="report" className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Use this form to report players for inappropriate behavior or cheating. 
                False reports may result in penalties to your account.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Report a Player</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="playerName">Player Name *</Label>
                    <Input
                      id="playerName"
                      placeholder="Enter the player's name"
                      value={newReport.playerName}
                      onChange={(e) => setNewReport({...newReport, playerName: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="reason">Reason *</Label>
                    <Select value={newReport.reason} onValueChange={(value) => setNewReport({...newReport, reason: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason for report" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cheating">Cheating/Hacking</SelectItem>
                        <SelectItem value="toxic">Toxic Behavior</SelectItem>
                        <SelectItem value="harassment">Harassment</SelectItem>
                        <SelectItem value="inappropriate-name">Inappropriate Name</SelectItem>
                        <SelectItem value="spam">Spamming</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="matchId">Match ID (Optional)</Label>
                    <Input
                      id="matchId"
                      placeholder="Enter match ID if applicable"
                      value={newReport.matchId}
                      onChange={(e) => setNewReport({...newReport, matchId: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="reportDescription">Additional Details</Label>
                    <Textarea
                      id="reportDescription"
                      placeholder="Provide any additional context..."
                      rows={3}
                      value={newReport.description}
                      onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                    />
                  </div>

                  <Button onClick={submitReport} className="w-full">
                    Submit Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  {reports.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No player reports submitted yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {reports.map((report) => (
                        <div key={report.id} className="border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-sm">{report.reportedPlayer}</h3>
                            {getStatusBadge(report.status)}
                          </div>
                          <p className="text-xs text-muted-foreground capitalize">
                            {report.reason} • {report.submittedAt.toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Email Support</p>
                      <p className="text-sm text-muted-foreground">support@cardclash.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Live Chat</p>
                      <p className="text-sm text-muted-foreground">Available 9 AM - 6 PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">Community Discord</p>
                      <p className="text-sm text-muted-foreground">Join our community server</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Technical Issues:</span>
                    <span className="text-sm font-semibold">24-48 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Payment Issues:</span>
                    <span className="text-sm font-semibold">12-24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Player Reports:</span>
                    <span className="text-sm font-semibold">1-3 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">General Questions:</span>
                    <span className="text-sm font-semibold">24-72 hours</span>
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