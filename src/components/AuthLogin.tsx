import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, User, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthLoginProps {
  onLogin: (userData: { email: string; name: string; provider: string }) => void;
  onClose: () => void;
}

export function AuthLogin({ onLogin, onClose }: AuthLoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        email,
        name: isLogin ? email.split('@')[0] : name,
        provider: 'email'
      };
      
      onLogin(userData);
      
      toast({
        title: isLogin ? "Login Successful!" : "Account Created!",
        description: `Welcome ${userData.name}!`,
      });
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    
    try {
      // Simulate social login
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const userData = {
        email: `user@${provider}.com`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        provider
      };
      
      onLogin(userData);
      
      toast({
        title: "Login Successful!",
        description: `Welcome back!`,
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">
            {isLogin ? 'Welcome Back!' : 'Join the Arena!'}
          </h2>
          <p className="text-muted-foreground">
            {isLogin ? 'Sign in to continue your journey' : 'Create your account to start playing'}
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('facebook')}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('apple')}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C8.396 0 8.013.024 6.624.096 5.237.168 4.322.404 3.51.763c-.875.394-1.621.923-2.36 1.662C.41 3.165-.12 3.911-.514 4.786-.873 5.598-1.109 6.513-1.181 7.9-.253 9.289-.229 9.672-.229 13.293s-.024 4.004.096 5.393c.072 1.387.308 2.302.667 3.114.394.875.923 1.621 1.662 2.36.739.739 1.485 1.268 2.36 1.662.812.359 1.727.595 3.114.667 1.389.072 1.772.096 5.393.096s4.004-.024 5.393-.096c1.387-.072 2.302-.308 3.114-.667.875-.394 1.621-.923 2.36-1.662.739-.739 1.268-1.485 1.662-2.36.359-.812.595-1.727.667-3.114.072-1.389.096-1.772.096-5.393s-.024-4.004-.096-5.393c-.072-1.387-.308-2.302-.667-3.114a6.578 6.578 0 0 0-1.662-2.36C18.981.923 18.235.394 17.36 0 16.548-.359 15.633-.595 14.246-.667 12.857-.739 12.474-.763 8.853-.763s-4.004.024-5.393.096zm-.717 1.442h.718c3.136 0 3.464.011 4.69.072 1.131.05 1.747.234 2.157.388.542.21.93.462 1.337.869.407.407.659.795.869 1.337.154.41.338 1.026.388 2.157.061 1.226.072 1.554.072 4.69s-.011 3.464-.072 4.69c-.05 1.131-.234 1.747-.388 2.157-.21.542-.462.93-.869 1.337-.407.407-.795.659-1.337.869-.41.154-1.026.338-2.157.388-1.226.061-1.554.072-4.69.072s-3.464-.011-4.69-.072c-1.131-.05-1.747-.234-2.157-.388a3.61 3.61 0 0 1-1.337-.869 3.61 3.61 0 0 1-.869-1.337c-.154-.41-.338-1.026-.388-2.157-.061-1.226-.072-1.554-.072-4.69s.011-3.464.072-4.69c.05-1.131.234-1.747.388-2.157.21-.542.462-.93.869-1.337a3.61 3.61 0 0 1 1.337-.869c.41-.154 1.026-.338 2.157-.388 1.074-.048 1.49-.06 4.69-.06l.045.03zm0 2.452a4.108 4.108 0 1 0 0 8.215 4.108 4.108 0 0 0 0-8.215zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334zm5.23-.247a.96.96 0 1 1-1.92 0 .96.96 0 0 1 1.92 0z"/>
            </svg>
            Continue with Apple
          </Button>
        </div>

        <Separator className="mb-6" />

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            <LogIn className="w-4 h-4 mr-2" />
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </Button>
        </div>

        <div className="mt-4 text-center">
          <Button variant="ghost" onClick={onClose}>
            Play as Guest
          </Button>
        </div>
      </Card>
    </div>
  );
}