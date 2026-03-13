import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export function Login() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Force account selection to prevent auto-login loops
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Always use popup. Redirect is broken on cross-domain setups due to browser tracking prevention.
      await signInWithPopup(auth, provider);
      // If successful, onAuthStateChanged in App.tsx will handle the redirect
    } catch (err: any) {
      console.error('Login failed', err);
      setIsLoading(false);
      
      if (err.code === 'auth/popup-blocked') {
        setError('Login popup was blocked. Please allow popups for this site.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        // User closed it, no need for a scary error
        setError(null); 
      } else {
        setError('Login failed. If you are on mobile, please open this link directly in Chrome or Safari (not inside another app).');
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-800 text-center"
      >
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-6 relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles size={40} />
          </motion.div>
          
          <motion.div
            className="absolute inset-0 rounded-3xl border-2 border-emerald-500/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-white mb-2"
        >
          ContentStudio AI
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-zinc-400 mb-8"
        >
          Turn long-form content into viral social media assets in seconds.
        </motion.p>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-left flex items-start gap-3"
          >
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-white text-zinc-900 font-semibold py-4 px-6 rounded-xl hover:bg-zinc-100 transition-colors flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
          ) : (
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          )}
          {isLoading ? 'Connecting...' : 'Continue with Google'}
        </motion.button>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-xs text-zinc-500 leading-relaxed"
        >
          Having trouble on mobile? Open this link directly in <strong>Chrome</strong> or <strong>Safari</strong> rather than an in-app browser.
        </motion.p>
      </motion.div>
    </div>
  );
}
