import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { NewCampaign } from './pages/NewCampaign';
import { CampaignDetails } from './pages/CampaignDetails';
import { History } from './pages/History';
import { Admin } from './pages/Admin';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ThemeProvider } from './components/ThemeContext';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            lastLogin: serverTimestamp()
          }, { merge: true });
        } catch (error) {
          console.error("Error saving user data:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center transition-colors duration-200">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-24 h-24 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mb-8 relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles size={48} />
          </motion.div>
          
          {/* Pulsing ring effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl border-2 border-emerald-500/20 dark:border-emerald-500/30"
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight"
        >
          ContentStudio AI
        </motion.h1>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {user ? (
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="new" element={<NewCampaign />} />
              <Route path="history" element={<History />} />
              <Route path="campaign/:id" element={<CampaignDetails />} />
              {user.email === 'bhuvangowdan71@gmail.com' && (
                <Route path="admin" element={<Admin />} />
              )}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
