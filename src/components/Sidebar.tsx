import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, LogOut, X } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <div className="w-64 bg-zinc-900 text-white flex flex-col h-full">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-emerald-400">ContentStudio AI</h1>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        <NavLink
          to="/"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`
          }
        >
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </NavLink>
        
        <NavLink
          to="/new"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`
          }
        >
          <PlusCircle size={20} />
          <span className="font-medium">New Campaign</span>
        </NavLink>
        
        <NavLink
          to="/history"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`
          }
        >
          <History size={20} />
          <span className="font-medium">History</span>
        </NavLink>
      </nav>

      <div className="p-4">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
