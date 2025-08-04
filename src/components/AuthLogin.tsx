import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, User, LogIn, Sparkles, Crown, Shield, Sword } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { DynamicBackground } from './DynamicBackground';
import premiumLogo from '@/assets/game-logo-premium.png';

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
    <DynamicBackground variant="mystical" intensity="high">
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        {/* Premium floating particles with enhanced glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full shadow-glow"
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 2, 0.5]
              }}
              transition={{
                duration: 6 + Math.random() * 6,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: 'blur(0.5px)',
              }}
            />
          ))}
        </div>

        {/* Premium cosmic background overlay */}
        <div className="absolute inset-0 bg-gradient-mystical opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="p-10 bg-gradient-premium backdrop-blur-lg border border-primary/30 shadow-premium relative overflow-hidden group">
            {/* Premium card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Ornate corner decorations */}
            <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-primary/40" />
            <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-primary/40" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-primary/40" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-primary/40" />
            
            {/* Inner glow frame */}
            <div className="absolute inset-[1px] border border-primary/20 rounded-lg pointer-events-none" />
            {/* Premium floating runes */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  animate={{
                    rotate: [0, 360],
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.2, 0.6, 0.2]
                  }}
                  transition={{
                    duration: 8 + i * 2,
                    repeat: Infinity,
                    delay: i * 1.2,
                    ease: "easeInOut"
                  }}
                  style={{
                    left: `${15 + i * 15}%`,
                    top: `${20 + (i % 2) * 60}%`,
                  }}
                >
                  <div className="w-3 h-3 border border-primary/30 transform rotate-45 bg-gradient-to-br from-primary/20 to-accent/20" />
                </motion.div>
              ))}
            </div>

            {/* Premium Logo and Header */}
            <motion.div 
              className="text-center mb-10 relative z-10"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div 
                className="mb-8 flex justify-center"
                initial={{ scale: 0.6, opacity: 0, rotateY: 180 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ duration: 1.2, delay: 0.3, type: "spring", stiffness: 100 }}
              >
                <div className="relative">
                  {/* Premium logo container with multiple glow layers */}
                  <div className="relative p-4">
                    <motion.img 
                      src={premiumLogo} 
                      alt="Card Clash: Legends Arena" 
                      className="h-20 w-auto object-contain relative z-10"
                      animate={{ 
                        filter: [
                          'drop-shadow(0 0 15px hsl(var(--primary) / 0.5))',
                          'drop-shadow(0 0 25px hsl(var(--primary) / 0.8))',
                          'drop-shadow(0 0 15px hsl(var(--primary) / 0.5))'
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    {/* Multi-layered glow effects */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-radial from-primary/30 via-primary/10 to-transparent rounded-full blur-2xl" 
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.4, 0.8, 0.4]
                      }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    <motion.div 
                      className="absolute inset-0 bg-gradient-conic from-accent/20 via-primary/20 to-accent/20 rounded-full blur-xl" 
                      animate={{
                        rotate: [0, 360],
                        scale: [0.8, 1.2, 0.8],
                        opacity: [0.2, 0.5, 0.2]
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </div>
              </motion.div>
              
              <motion.h1 
                className="text-4xl font-bold mb-3 font-display bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {isLogin ? 'Return to Glory' : 'Forge Your Legend'}
              </motion.h1>
              
              <motion.p 
                className="text-muted-foreground text-lg font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {isLogin ? 'The arena awaits your return, champion' : 'Step into the realm of eternal battles'}
              </motion.p>

              {/* Premium decorative elements */}
              <motion.div 
                className="flex justify-center items-center gap-6 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <motion.div
                  className="relative"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 text-primary" />
                  <motion.div 
                    className="absolute inset-0 w-5 h-5 text-primary/50"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                </motion.div>
                
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    filter: [
                      'drop-shadow(0 0 5px hsl(var(--primary) / 0.5))',
                      'drop-shadow(0 0 15px hsl(var(--primary) / 0.8))',
                      'drop-shadow(0 0 5px hsl(var(--primary) / 0.5))'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Crown className="w-8 h-8 text-primary" />
                </motion.div>
                
                <motion.div
                  className="relative"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 text-primary" />
                  <motion.div 
                    className="absolute inset-0 w-5 h-5 text-primary/50"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Premium Social Login Buttons */}
            <motion.div 
              className="space-y-4 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full btn-modern-secondary group relative overflow-hidden"
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full btn-modern-secondary group relative overflow-hidden"
                onClick={() => handleSocialLogin('facebook')}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="relative mb-8"
            >
              <Separator className="bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-card px-3 text-xs text-muted-foreground font-medium">
                OR CONTINUE WITH
              </div>
            </motion.div>

            {/* Email/Password Form */}
            <motion.form 
              onSubmit={handleEmailAuth} 
              className="space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="name" className="text-slate-300 font-medium">Display Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your champion name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 bg-slate-800/50 border-slate-600/50 focus:border-amber-400/50 text-slate-200 placeholder:text-slate-500 transition-all duration-300"
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600/50 focus:border-amber-400/50 text-slate-200 placeholder:text-slate-500 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600/50 focus:border-amber-400/50 text-slate-200 placeholder:text-slate-500 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full font-semibold group relative overflow-hidden"
                disabled={loading}
              >
                {loading ? (
                  <motion.div 
                    className="flex items-center"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Shield className="w-4 h-4 mr-2 animate-spin" />
                    Entering the arena...
                  </motion.div>
                ) : (
                  <div className="flex items-center">
                    <LogIn className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    {isLogin ? "Enter the Arena" : "Join the Battle"}
                  </div>
                )}
              </Button>
            </motion.form>

            {/* Toggle Login/Register */}
            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-slate-400 hover:text-amber-400 transition-colors duration-300 text-sm"
              >
                {isLogin ? "Don't have an account? Join the arena" : "Already a champion? Sign in here"}
              </button>
            </motion.div>

            {/* Premium footer decorative elements */}
            <motion.div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-3 text-muted-foreground/60"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <motion.div
                animate={{ rotate: [0, 15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sword className="w-4 h-4" />
              </motion.div>
              <span className="text-xs font-medium tracking-wider">WHERE LEGENDS ARE BORN</span>
              <motion.div
                animate={{ rotate: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                <Sword className="w-4 h-4 transform scale-x-[-1]" />
              </motion.div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </DynamicBackground>
  );
}