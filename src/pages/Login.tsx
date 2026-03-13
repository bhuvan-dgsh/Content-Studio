import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { Sparkles } from 'lucide-react';

export function Login() {
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed', error);
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
