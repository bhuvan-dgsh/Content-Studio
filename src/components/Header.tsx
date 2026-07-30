import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sprout, PlusCircle, Store, ShieldCheck, MessageSquare,
  ShieldAlert, MapPin, ChevronDown, Check, User
} from 'lucide-react';

interface HeaderProps {
  onOpenWizard: () => void;
  pendingAdminCount?: number;
  currentLocation?: string;
  onSelectLocation?: (loc: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenWizard,
  pendingAdminCount = 1,
  currentLocation = 'Hebbal, Bengaluru',
  onSelectLocation
}) => {
  const location = useLocation();
  const [isLocDropdownOpen, setIsLocDropdownOpen] = useState(false);

  const locations = [
    'Hebbal, Bengaluru',
    'Ludhiana, Punjab',
    'Karnal, Haryana',
    'Indore, MP',
    'Nashik, Maharashtra',
    'Shimoga, Karnataka',
    'Anand, Gujarat',
    'Vijayawada, AP'
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Location */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-lg font-black tracking-tight text-emerald-950 dark:text-emerald-400">
                  Farmora
                </span>
              </div>
            </div>
          </Link>

          {/* Location Picker */}
          <div className="relative">
            <button
              onClick={() => setIsLocDropdownOpen(!isLocDropdownOpen)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="max-w-[110px] sm:max-w-none truncate">{currentLocation}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* Location Dropdown */}
            {isLocDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-50 space-y-0.5">
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase text-zinc-400 tracking-wider">
                  Select Location
                </div>
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      if (onSelectLocation) onSelectLocation(loc);
                      setIsLocDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs font-semibold flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-zinc-800 ${
                      currentLocation === loc ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <span>{loc}</span>
                    {currentLocation === loc && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-800/60 p-1 rounded-2xl border border-zinc-200/80 dark:border-zinc-700/80 text-xs font-bold">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
              isActive('/')
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Marketplace</span>
          </Link>

          <Link
            to="/seller-hub"
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
              isActive('/seller-hub')
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Seller Hub</span>
          </Link>

          <Link
            to="/inquiries"
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
              isActive('/inquiries')
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inquiries</span>
          </Link>

          <Link
            to="/admin"
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
              isActive('/admin')
                ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-amber-600'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Admin Queue</span>
            {pendingAdminCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center">
                {pendingAdminCount}
              </span>
            )}
          </Link>
          <Link
            to="/profile"
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
              isActive('/profile')
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-black shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Link>
        </nav>

        {/* Right CTA - Desktop Only */}
        <div className="hidden sm:flex items-center space-x-3">
          <Link
            to="/profile"
            className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            title="My Profile"
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
              alt="Avatar"
              className="w-7 h-7 rounded-full object-cover border border-emerald-600"
            />
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Ramesh</span>
          </Link>

          <button
            onClick={onOpenWizard}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Sell Item</span>
          </button>
        </div>
      </div>
    </header>
  );
};
