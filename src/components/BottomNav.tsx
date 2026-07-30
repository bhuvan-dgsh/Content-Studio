import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Plus, Users, User } from 'lucide-react';

interface BottomNavProps {
  onOpenWizard: () => void;
  onOpenCategories?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenWizard, onOpenCategories }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 py-2 px-6 shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center space-y-1 transition ${
            isActive('/') ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </Link>

        {/* Categories */}
        <button
          onClick={onOpenCategories}
          className="flex flex-col items-center space-y-1 text-zinc-500 hover:text-zinc-800 transition"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px]">Categories</span>
        </button>

        {/* Central Raised Sell Button */}
        <button
          onClick={onOpenWizard}
          className="-mt-5 w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 border-4 border-white dark:border-zinc-900 transition hover:scale-105"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Community */}
        <Link
          to="/community"
          className={`flex flex-col items-center space-y-1 transition ${
            isActive('/community') ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">Community</span>
        </Link>

        {/* Account / Customer Profile */}
        <Link
          to="/profile"
          className={`flex flex-col items-center space-y-1 transition ${
            isActive('/profile') ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Account</span>
        </Link>
      </div>
    </div>
  );
};
