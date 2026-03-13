import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { Sparkles, AlertCircle, Loader2 } from 'lucide-react';

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
      <div className="max-w-md w-full bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-800 text-center">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Sparkles size={32} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">ContentStudio AI</h1>
        <p className="text-zinc-400 mb-8">Turn long-form content into viral social media assets in seconds.</p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-left flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <button
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
        </button>

        <p className="mt-6 text-xs text-zinc-500 leading-relaxed">
          Having trouble on mobile? Open this link directly in <strong>Chrome</strong> or <strong>Safari</strong> rather than an in-app browser.
        </p>
      </div>
    </div>
  );
}
