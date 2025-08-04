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
    <DynamicBackground variant="menu" intensity="medium">
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="p-8 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-md border border-slate-700/50 shadow-2xl relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-amber-400 rounded-full"
                  animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 1.5,
                  }}
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${30 + i * 20}%`,
                  }}
                />
              ))}
            </div>

            {/* Logo and Header */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="mb-6 flex justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="relative">
                  <motion.img 
                    src={premiumLogo} 
                    alt="Card Clash: Legends Arena" 
                    className="h-16 w-auto object-contain filter drop-shadow-xl"
                    animate={{ 
                      filter: [
                        'drop-shadow(0 0 10px rgba(245, 158, 11, 0.4))',
                        'drop-shadow(0 0 20px rgba(245, 158, 11, 0.7))',
                        'drop-shadow(0 0 10px rgba(245, 158, 11, 0.4))'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* Logo glow effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 rounded-full blur-xl" 
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
              
              <motion.h2 
                className="text-3xl font-bold mb-2 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 bg-clip-text text-transparent font-fantasy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {isLogin ? 'Welcome Back, Champion!' : 'Join the Arena!'}
              </motion.h2>
              
              <motion.p 
                className="text-slate-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {isLogin ? 'Continue your legendary journey' : 'Begin your epic adventure in the arena'}
              </motion.p>

              {/* Decorative elements */}
              <div className="flex justify-center items-center gap-4 mt-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </motion.div>
                <Crown className="w-5 h-5 text-amber-400" />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </motion.div>
              </div>
            </motion.div>

            {/* Social Login Buttons */}
            <motion.div 
              className="space-y-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                variant="outline"
                className="w-full bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/60 hover:border-slate-500/60 transition-all duration-300 group"
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
                className="w-full bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/60 hover:border-slate-500/60 transition-all duration-300 group"
                onClick={() => handleSocialLogin('facebook')}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </Button>

              <Button
                variant="outline"
                className="w-full bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/60 hover:border-slate-500/60 transition-all duration-300 group"
                onClick={() => handleSocialLogin('apple')}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C8.396 0 8.013.024 6.624.096 5.237.168 4.322.404 3.51.763c-.875.394-1.621.923-2.36 1.662C.41 3.165-.12 3.911-.514 4.786-.873 5.598-1.109 6.513-1.181 7.9-.253 9.289-.229 9.672-.229 13.293s-.024 4.004.096 5.393c.072 1.387.308 2.302.667 3.114.394.875.923 1.621 1.662 2.36.739.739 1.485 1.268 2.36 1.662.812.359 1.727.595 3.114.667 1.389.072 1.772.096 5.393.096s4.004-.024 5.393-.096c1.387-.072 2.302-.308 3.114-.667.875-.394 1.621-.923 2.36-1.662.739-.739 1.268-1.485 1.662-2.36.359-.812.595-1.727.667-3.114.072-1.389.096-1.772.096-5.393s-.024-4.004-.096-5.393c-.072-1.387-.308-2.302-.667-3.114a6.578 6.578 0 0 0-1.662-2.36C18.981.923 18.235.394 17.36 0 16.548-.359 15.633-.595 14.246-.667 12.857-.739 12.474-.763 8.853-.763s-4.004.024-5.393.096zm-.717 1.442h.718c3.136 0 3.464.011 4.69.072 1.131.05 1.747.234 2.157.388.542.21.93.462 1.337.869.407.407.659.795.869 1.337.154.41.338 1.026.388 2.157.061 1.226.072 1.554.072 4.69s-.011 3.464-.072 4.69c-.05 1.131-.234 1.747-.388 2.157-.21.542-.462.93-.869 1.337-.407.407-.795.659-1.337.869-.41.154-1.026.338-2.157.388-1.226.061-1.554.072-4.69.072s-3.464-.011-4.69-.072c-1.131-.05-1.747-.234-2.157-.388a3.61 3.61 0 0 1-1.337-.869 3.61 3.61 0 0 1-.869-1.337c-.154-.41-.338-1.026-.388-2.157-.061-1.226-.072-1.554-.072-4.69s.011-3.464.072-4.69c.05-1.131.234-1.747.388-2.157.21-.542.462-.93.869-1.337a3.61 3.61 0 0 1 1.337-.869c.41-.154 1.026-.338 2.157-.388 1.074-.048 1.49-.06 4.69-.06l.045.03zm0 2.452a4.108 4.108 0 1 0 0 8.215 4.108 4.108 0 0 0 0-8.215zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334zm5.23-.247a.96.96 0 1 1-1.92 0 .96.96 0 0 1 1.92 0z"/>
                </svg>
                Continue with Apple
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Separator className="mb-6 bg-slate-600/50" />
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
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold py-3 transition-all duration-300 shadow-lg hover:shadow-amber-500/25 group"
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

            {/* Footer decorative elements */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-slate-600">
              <Sword className="w-3 h-3" />
              <span className="text-xs">Legends are forged here</span>
              <Sword className="w-3 h-3 transform scale-x-[-1]" />
            </div>
          </Card>
        </motion.div>
      </div>
    </DynamicBackground>
  );
}