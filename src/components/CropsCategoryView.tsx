import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Search, Filter, Sparkles, ChevronRight,
  TrendingUp, TrendingDown, Plus, CheckCircle2, ShoppingCart,
  Bell, BarChart3, ShieldCheck, X, RefreshCw, ArrowUpRight
} from 'lucide-react';
import { Listing } from '../types';
import { ListingCard } from './ListingCard';

interface CropsCategoryViewProps {
  listings: Listing[];
  onOpenSellWizard?: () => void;
}

// 15 Subcategories matching the exact screenshot
const CROP_SUBCATEGORIES = [
  { id: 'cereals', name: 'Cereals', icon: '🌾', count: 142 },
  { id: 'pulses', name: 'Pulses', icon: '🫘', count: 98 },
  { id: 'oilseeds', name: 'Oilseeds', icon: '🌻', count: 64 },
  { id: 'commercial', name: 'Commercial Crops', icon: '🎋', count: 52 },
  { id: 'plantation', name: 'Plantation Crops', icon: '☕', count: 41 },
  { id: 'spices', name: 'Spices & Condiments', icon: '🌶️', count: 87 },
  { id: 'vegetables', name: 'Vegetables', icon: '🥦', count: 215 },
  { id: 'fruits', name: 'Fruits', icon: '🍎', count: 180 },
  { id: 'flowers', name: 'Flowers', icon: '💐', count: 38 },
  { id: 'medicinal', name: 'Medicinal & Aromatic', icon: '🌿', count: 29 },
  { id: 'fodder', name: 'Fodder Crops', icon: '🌱', count: 45 },
  { id: 'mushroom', name: 'Mushroom Farming', icon: '🍄', count: 22 },
  { id: 'horticulture', name: 'Horticulture', icon: '🍃', count: 36 },
  { id: 'organic', name: 'Organic Crops', icon: '🛡️', count: 110, isOrganic: true },
  { id: 'others', name: 'Others', icon: '🟢', count: 19 },
];

// Live Mandi Overview Items with historical graph data points
interface MarketItem {
  id: string;
  cropName: string;
  variety: string;
  currentPrice: number;
  unit: string;
  changePct: number;
  isPositive: boolean;
  history: number[]; // 7-day price points for chart
  predictedPrice15Days: number;
  predictedChangePct: number;
  bestTimeToSell: string;
  mandis: { name: string; state: string; price: number; arrival: string }[];
}

const LIVE_MARKET_ITEMS: MarketItem[] = [
  {
    id: 'paddy',
    cropName: 'Paddy (Common)',
    variety: 'Grade A Sona Masoori',
    currentPrice: 1870,
    unit: 'Quintal',
    changePct: 2.4,
    isPositive: true,
    history: [1810, 1825, 1830, 1845, 1850, 1862, 1870],
    predictedPrice15Days: 1960,
    predictedChangePct: 4.8,
    bestTimeToSell: 'Next 10-14 days (Festival demand peak)',
    mandis: [
      { name: 'Bengaluru APMC', state: 'Karnataka', price: 1890, arrival: '450 Quintals' },
      { name: 'Raichur Mandi', state: 'Karnataka', price: 1865, arrival: '1,200 Quintals' },
      { name: 'Nizamabad APMC', state: 'Telangana', price: 1875, arrival: '800 Quintals' },
      { name: 'Khanna APMC', state: 'Punjab', price: 1880, arrival: '2,100 Quintals' },
    ]
  },
  {
    id: 'wheat',
    cropName: 'Wheat',
    variety: 'Sharbati / Lok-1',
    currentPrice: 2125,
    unit: 'Quintal',
    changePct: 1.3,
    isPositive: true,
    history: [2080, 2090, 2085, 2100, 2110, 2118, 2125],
    predictedPrice15Days: 2210,
    predictedChangePct: 4.0,
    bestTimeToSell: 'Next 7-10 days',
    mandis: [
      { name: 'Khanna APMC', state: 'Punjab', price: 2140, arrival: '3,400 Quintals' },
      { name: 'Indore Mandi', state: 'Madhya Pradesh', price: 2120, arrival: '1,800 Quintals' },
      { name: 'Hapur APMC', state: 'Uttar Pradesh', price: 2115, arrival: '1,100 Quintals' },
    ]
  },
  {
    id: 'maize',
    cropName: 'Maize',
    variety: 'Yellow Hybrid',
    currentPrice: 1680,
    unit: 'Quintal',
    changePct: -0.6,
    isPositive: false,
    history: [1710, 1700, 1695, 1690, 1685, 1682, 1680],
    predictedPrice15Days: 1740,
    predictedChangePct: 3.5,
    bestTimeToSell: 'Hold for 2-3 weeks (Poultry feed demand rising)',
    mandis: [
      { name: 'Davanagere APMC', state: 'Karnataka', price: 1690, arrival: '950 Quintals' },
      { name: 'Guntur Mandi', state: 'Andhra Pradesh', price: 1675, arrival: '1,400 Quintals' },
    ]
  },
  {
    id: 'toor',
    cropName: 'Toor Dal',
    variety: 'Maruti / Red Tur',
    currentPrice: 7250,
    unit: 'Quintal',
    changePct: 3.1,
    isPositive: true,
    history: [6980, 7020, 7080, 7120, 7180, 7210, 7250],
    predictedPrice15Days: 7600,
    predictedChangePct: 4.8,
    bestTimeToSell: 'Sell Now or within 5 days',
    mandis: [
      { name: 'Gulbarga (Kalaburagi) APMC', state: 'Karnataka', price: 7300, arrival: '1,600 Quintals' },
      { name: 'Latur Mandi', state: 'Maharashtra', price: 7220, arrival: '2,200 Quintals' },
    ]
  },
  {
    id: 'cotton',
    cropName: 'Cotton',
    variety: 'Long Staple 29mm',
    currentPrice: 6850,
    unit: 'Quintal',
    changePct: 1.8,
    isPositive: true,
    history: [6700, 6720, 6760, 6790, 6810, 6830, 6850],
    predictedPrice15Days: 7100,
    predictedChangePct: 3.6,
    bestTimeToSell: 'Next 10 days',
    mandis: [
      { name: 'Rajkot APMC', state: 'Gujarat', price: 6890, arrival: '1,900 Quintals' },
      { name: 'Warangal Mandi', state: 'Telangana', price: 6830, arrival: '1,100 Quintals' },
    ]
  },
  {
    id: 'chana',
    cropName: 'Chana (Gram)',
    variety: 'Desi Chana',
    currentPrice: 5400,
    unit: 'Quintal',
    changePct: 0.9,
    isPositive: true,
    history: [5320, 5340, 5350, 5370, 5380, 5390, 5400],
    predictedPrice15Days: 5620,
    predictedChangePct: 4.0,
    bestTimeToSell: 'Hold for 10 days',
    mandis: [
      { name: 'Bikaner APMC', state: 'Rajasthan', price: 5420, arrival: '2,500 Quintals' },
      { name: 'Indore Mandi', state: 'Madhya Pradesh', price: 5390, arrival: '1,600 Quintals' },
    ]
  },
  {
    id: 'mustard',
    cropName: 'Mustard',
    variety: '42% Oil Content',
    currentPrice: 5650,
    unit: 'Quintal',
    changePct: -1.1,
    isPositive: false,
    history: [5750, 5720, 5700, 5680, 5670, 5660, 5650],
    predictedPrice15Days: 5880,
    predictedChangePct: 4.1,
    bestTimeToSell: 'Hold for 2 weeks',
    mandis: [
      { name: 'Bharatpur Mandi', state: 'Rajasthan', price: 5670, arrival: '3,100 Quintals' },
      { name: 'Jaipur APMC', state: 'Rajasthan', price: 5640, arrival: '1,900 Quintals' },
    ]
  },
  {
    id: 'sugarcane',
    cropName: 'Sugarcane',
    variety: 'Co 0238',
    currentPrice: 3150,
    unit: 'Ton',
    changePct: 0.5,
    isPositive: true,
    history: [3120, 3130, 3130, 3140, 3145, 3148, 3150],
    predictedPrice15Days: 3250,
    predictedChangePct: 3.1,
    bestTimeToSell: 'Mills active - Immediate delivery',
    mandis: [
      { name: 'Muzaffarnagar APMC', state: 'Uttar Pradesh', price: 3160, arrival: '5,000 Tons' },
      { name: 'Kolhapur Mandi', state: 'Maharashtra', price: 3145, arrival: '4,200 Tons' },
    ]
  },
];

// Sparkline SVG Component
function SparklineChart({ data, isPositive }: { data: number[]; isPositive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 140;
  const height = 32;
  const padding = 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;
  const color = isPositive ? '#16a34a' : '#ef4444';
  const gradientId = `grad-${Math.random().toString(36).substring(2, 8)}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-8 overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradientId})`} />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const CropsCategoryView: React.FC<CropsCategoryViewProps> = ({
  listings,
  onOpenSellWizard,
}) => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedMarketItem, setSelectedMarketItem] = useState<MarketItem | null>(null);
  const [showMarketModal, setShowMarketModal] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '1Y'>('30D');

  // Filter listings
  const cropListings = listings.filter((l) => {
    const c = l.category.toLowerCase();
    const isCrop = ['crops', 'grains', 'harvest', 'vegetables', 'fruits'].includes(c);
    if (!isCrop) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = l.title.toLowerCase().includes(q);
      const matchSub = l.subcategory.toLowerCase().includes(q);
      const matchDesc = l.description.toLowerCase().includes(q);
      if (!matchTitle && !matchSub && !matchDesc) return false;
    }

    if (selectedSubcategory) {
      const sub = selectedSubcategory.toLowerCase();
      const matchSub = l.subcategory.toLowerCase().includes(sub) || l.title.toLowerCase().includes(sub);
      if (!matchSub) return false;
    }

    return true;
  });

  const handleOpenMarketItem = (item: MarketItem) => {
    setSelectedMarketItem(item);
    setShowMarketModal(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-24">
      
      {/* 1. TOP HEADER BAR */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 sticky top-0 z-40 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-zinc-700 dark:text-zinc-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-base shadow-xs">
              🌱
            </div>
            <div>
              <h1 className="text-sm font-black text-emerald-950 dark:text-white leading-tight flex items-center space-x-1">
                <span>Farmora</span>
              </h1>
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 block -mt-0.5">
                AI Powered Agriculture
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/marketplace')}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 relative transition"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center">
              3
            </span>
          </button>
          <button className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 relative transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-900" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4 space-y-6">

        {/* 2. HERO BANNER SECTION */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50 via-emerald-100/60 to-teal-50 dark:from-emerald-950/80 dark:via-emerald-900/40 dark:to-teal-950/80 border border-emerald-200/80 dark:border-emerald-800/60 p-5 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Title & Subtitle */}
            <div className="md:col-span-7 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                Crops
              </h2>
              <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-300 leading-snug max-w-sm">
                Buy, sell and discover quality crops from trusted farmers
              </p>

              {/* 3 Action Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {/* Pill 1: Market Prices */}
                <button
                  onClick={() => {
                    setSelectedMarketItem(LIVE_MARKET_ITEMS[0]);
                    setShowMarketModal(true);
                  }}
                  className="px-3 py-2 rounded-2xl bg-white dark:bg-zinc-800/90 border border-emerald-200 dark:border-emerald-700/60 shadow-xs hover:border-emerald-500 transition flex items-center space-x-2 text-xs font-bold text-zinc-800 dark:text-zinc-100"
                >
                  <div className="w-6 h-6 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs">
                    <BarChart3 className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[11px] font-extrabold leading-tight">Market Prices</span>
                    <span className="block text-[9px] font-medium text-emerald-600 dark:text-emerald-400">Live updates</span>
                  </div>
                </button>

                {/* Pill 2: AI Price Predictor */}
                <button
                  onClick={() => {
                    setSelectedMarketItem(LIVE_MARKET_ITEMS[0]);
                    setShowMarketModal(true);
                  }}
                  className="px-3 py-2 rounded-2xl bg-white dark:bg-zinc-800/90 border border-emerald-200 dark:border-emerald-700/60 shadow-xs hover:border-emerald-500 transition flex items-center space-x-2 text-xs font-bold text-zinc-800 dark:text-zinc-100"
                >
                  <div className="w-6 h-6 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xs">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[11px] font-extrabold leading-tight">AI Price Predictor</span>
                    <span className="block text-[9px] font-medium text-teal-600 dark:text-teal-400">Best time to sell</span>
                  </div>
                </button>

                {/* Pill 3: Sell Your Crop */}
                <button
                  onClick={onOpenSellWizard}
                  className="px-3 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition flex items-center space-x-2 text-xs font-black"
                >
                  <div className="w-6 h-6 rounded-xl bg-white/20 flex items-center justify-center text-xs">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[11px] font-extrabold leading-tight">Sell Your Crop</span>
                    <span className="block text-[9px] font-medium text-amber-100">List in 2 mins</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Banner Artwork on right */}
            <div className="md:col-span-5 relative flex items-center justify-center pt-2 md:pt-0">
              <div className="w-full h-36 sm:h-44 rounded-2xl overflow-hidden shadow-md relative bg-gradient-to-r from-emerald-800 to-teal-900 border border-emerald-300/40">
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
                  alt="Harvest Crops Basket"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                  <div className="flex items-center space-x-2 text-white text-xs font-black">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-[10px] uppercase font-black">
                      MSP Verified
                    </span>
                    <span>Fresh Seasonal Harvest</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. SEARCH & FILTER BAR */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search crops, varieties, etc."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-600 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-zinc-400 hover:text-zinc-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => {
              // Toggle filter modal or reset subcategory
              if (selectedSubcategory) setSelectedSubcategory('');
            }}
            className="px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-xs shadow-md transition flex items-center space-x-2 shrink-0"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* 4. EXPLORE BY CATEGORY GRID */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-zinc-900 dark:text-white">
              Explore by Category
            </h3>
            <button
              onClick={() => setSelectedSubcategory('')}
              className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 15 Subcategory Cards Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {CROP_SUBCATEGORIES.map((cat) => {
              const isSelected = selectedSubcategory.toLowerCase() === cat.id.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedSubcategory(isSelected ? '' : cat.id)}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1.5 relative overflow-hidden ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'bg-white dark:bg-zinc-900/80 border-zinc-200/80 dark:border-zinc-800 hover:border-emerald-300'
                  }`}
                >
                  {cat.isOrganic && (
                    <span className="absolute top-1 right-1 text-[8px] font-extrabold uppercase bg-emerald-600 text-white px-1 rounded-full">
                      Organic
                    </span>
                  )}
                  <div className="w-10 h-10 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center text-xl shadow-2xs">
                    {cat.icon}
                  </div>
                  <span className="text-[11px] font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. LIVE MARKET OVERVIEW (CRUCIAL GRAPH SECTION) */}
        <div className="space-y-3 p-4 rounded-3xl bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 dark:from-emerald-950/30 dark:via-zinc-900 dark:to-teal-950/30 border border-emerald-200/60 dark:border-emerald-800/40 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-base">
                🌱
              </div>
              <div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center space-x-1.5">
                  <span>Live Market Overview</span>
                </h3>
                <p className="text-[10px] text-zinc-500 font-medium">Real-time Mandi price trends & APMC benchmarks</p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedMarketItem(LIVE_MARKET_ITEMS[0]);
                setShowMarketModal(true);
              }}
              className="text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-0.5"
            >
              <span>View All Prices</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Horizontally Scrollable Mandi Price Graph Cards */}
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none pt-1">
            {LIVE_MARKET_ITEMS.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenMarketItem(item)}
                className="w-48 sm:w-52 shrink-0 p-3.5 rounded-2xl bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700/80 shadow-xs hover:border-emerald-500 cursor-pointer transition space-y-2 group"
              >
                {/* Header: Name & Change Badge */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-black text-zinc-900 dark:text-white group-hover:text-emerald-600 transition truncate max-w-[110px]">
                      {item.cropName}
                    </h4>
                    <span className="text-[9px] text-zinc-400 font-medium block truncate max-w-[110px]">
                      {item.variety}
                    </span>
                  </div>

                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black flex items-center space-x-0.5 shrink-0 ${
                    item.isPositive
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {item.isPositive ? (
                      <TrendingUp className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-rose-600" />
                    )}
                    <span>{item.isPositive ? '▲' : '▼'} {item.changePct}%</span>
                  </span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline space-x-1">
                  <span className="text-sm font-black text-zinc-900 dark:text-white">
                    ₹{item.currentPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-bold">
                    / {item.unit}
                  </span>
                </div>

                {/* Live Sparkline Graph */}
                <div className="pt-1">
                  <SparklineChart data={item.history} isPositive={item.isPositive} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. WANT TO SELL YOUR CROP BANNER */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-sm z-10">
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-extrabold">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Buyers Only</span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight">
              Want to sell your crop?
            </h3>
            <p className="text-xs text-emerald-200 font-medium">
              Reach thousands of buyers across India with instant Mandi payout.
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenSellWizard}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl shadow-md transition flex items-center space-x-2"
              >
                <span>Sell Now</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-emerald-400/30 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=400"
              alt="Farmer with crop"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 7. FILTERED LISTINGS GRID */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white">
              Available Crops Listings ({cropListings.length})
            </h3>
            {selectedSubcategory && (
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                Subcategory: {selectedSubcategory}
              </span>
            )}
          </div>

          {cropListings.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3">
              <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                No active crop listings found under this filter.
              </p>
              <button
                onClick={() => {
                  setSelectedSubcategory('');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cropListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 8. LIVE MARKET PRICES & AI PREDICTOR MODAL */}
      <AnimatePresence>
        {showMarketModal && selectedMarketItem && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-5 space-y-5 shadow-2xl my-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm font-black">
                    🌱
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white leading-none">
                      Live Mandi Price & AI Predictor
                    </h3>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      Verified APMC Real-time Feed
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowMarketModal(false)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Crop Selector Tabs */}
              <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
                {LIVE_MARKET_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedMarketItem(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition ${
                      selectedMarketItem.id === item.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {item.cropName}
                  </button>
                ))}
              </div>

              {/* Selected Crop Price Big Banner */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                    {selectedMarketItem.variety}
                  </span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-2xl font-black text-zinc-900 dark:text-white">
                      ₹{selectedMarketItem.currentPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-zinc-500">
                      / {selectedMarketItem.unit}
                    </span>
                  </div>
                </div>

                <div className={`px-2.5 py-1 rounded-full text-xs font-black flex items-center space-x-1 ${
                  selectedMarketItem.isPositive
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {selectedMarketItem.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{selectedMarketItem.isPositive ? '▲' : '▼'} {selectedMarketItem.changePct}%</span>
                </div>
              </div>

              {/* Interactive Graph Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-zinc-900 dark:text-white">
                    Historical Trend Chart
                  </span>

                  <div className="flex bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-xl text-[10px] font-bold">
                    {(['7D', '30D', '1Y'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTimeframe(t)}
                        className={`px-2.5 py-1 rounded-lg transition ${
                          timeframe === t ? 'bg-white dark:bg-zinc-700 shadow-2xs font-black text-emerald-600' : 'text-zinc-500'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-inner">
                  <SparklineChart data={selectedMarketItem.history} isPositive={selectedMarketItem.isPositive} />
                  <div className="flex justify-between text-[9px] font-bold text-zinc-400 mt-2">
                    <span>7 Days Ago: ₹{selectedMarketItem.history[0]}</span>
                    <span>3 Days Ago: ₹{selectedMarketItem.history[3]}</span>
                    <span className="text-emerald-600">Today: ₹{selectedMarketItem.currentPrice}</span>
                  </div>
                </div>
              </div>

              {/* AI PRICE PREDICTOR BOX */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white space-y-2.5 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-black text-emerald-300">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>AI Market Predictor</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-400/30">
                    94% Confidence
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-800/80">
                  <div>
                    <span className="text-[10px] text-zinc-300 font-medium">15-Day Target Rate</span>
                    <span className="block text-sm font-black text-emerald-300">
                      ₹{selectedMarketItem.predictedPrice15Days.toLocaleString()} / {selectedMarketItem.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-300 font-medium">Projected Gain</span>
                    <span className="block text-sm font-black text-emerald-400">
                      +{selectedMarketItem.predictedChangePct}% Increase
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-800/40 rounded-xl border border-emerald-500/30 text-xs leading-relaxed font-medium text-emerald-100">
                  💡 <strong>Recommendation:</strong> {selectedMarketItem.bestTimeToSell}
                </div>
              </div>

              {/* APMC Mandi Breakdown Table */}
              <div className="space-y-2">
                <span className="text-xs font-black text-zinc-900 dark:text-white">
                  Regional APMC Mandi Rates
                </span>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden text-xs">
                  {selectedMarketItem.mandis.map((m, idx) => (
                    <div key={idx} className="p-3 bg-white dark:bg-zinc-900 flex items-center justify-between">
                      <div>
                        <h5 className="font-extrabold text-zinc-900 dark:text-white">{m.name}</h5>
                        <span className="text-[10px] text-zinc-400">{m.state} • Arrival: {m.arrival}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">₹{m.price}</span>
                        <span className="block text-[9px] text-zinc-400 font-medium">/ {selectedMarketItem.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action button */}
              <button
                onClick={() => {
                  setShowMarketModal(false);
                  if (onOpenSellWizard) onOpenSellWizard();
                }}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>List Your Crop at Peak Price</span>
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
