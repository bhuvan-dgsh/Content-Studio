import { useEffect, useState } from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { Sparkles, AlertCircle } from 'lucide-react';

export function Login() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for redirect result when the page loads
    getRedirectResult(auth).catch((err) => {
      console.error('Redirect login error:', err);
      if (err.message.includes('missing initial state') || err.message.includes('storage-partitioned')) {
        setError('Your browser is blocking cross-site tracking, which prevents login. Please disable "Prevent Cross-Site Tracking" in your Safari/Browser settings, or try using a different browser like Chrome.');
      } else {
        setError(err.message || 'An error occurred during login.');
      }
    });
  }, []);

  const handleLogin = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      // Use popup in iframe (AI Studio preview), redirect on direct visits (mobile/desktop)
      const isIframe = window !== window.parent;
      if (isIframe) {
        await signInWithPopup(auth, provider);
      } else {
        await signInWithRedirect(auth, provider);
      }
    } catch (err: any) {
      console.error('Login failed', err);
      setError(err.message || 'Failed to open login popup. Please allow popups for this site.');
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
          className="w-full bg-white text-zinc-900 font-semibold py-4 px-6 rounded-xl hover:bg-zinc-100 transition-colors flex items-center justify-center gap-3"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
