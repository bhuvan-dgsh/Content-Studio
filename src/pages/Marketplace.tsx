import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Search, Mic, Heart, Bell, ChevronRight, ShieldCheck, MapPin,
  Sparkles, PlusCircle, Building2, Shield, Droplets, Package,
  Stethoscope, User, MessageSquare, ArrowRight, ThumbsUp, X, Check, Award
} from 'lucide-react';
import { Listing, CategoryType, ActionType } from '../types';
import { ListingCard } from '../components/ListingCard';
import { CategoryActionModal } from '../components/CategoryActionModal';
import { EmiCalculatorModal } from '../components/EmiCalculatorModal';

interface MarketplaceProps {
  listings: Listing[];
  onOpenWizard: () => void;
  onAddInquiry: (inquiryData: any) => Promise<void>;
  onOpenCategoriesModal?: () => void;
  selectedCategory: CategoryType | 'all';
  setSelectedCategory: (cat: CategoryType | 'all') => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (sub: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  listings,
  onOpenWizard,
  onAddInquiry,
  onOpenCategoriesModal,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  sortBy,
  setSortBy,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxDistance, setMaxDistance] = useState<number>(100);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  const navigate = useNavigate();

  // Active modals
  const [activeModalAction, setActiveModalAction] = useState<ActionType | null>(null);
  const [activeListingForModal, setActiveListingForModal] = useState<Listing | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState<boolean>(false);

  // EMI Modal
  const [emiPrice, setEmiPrice] = useState<number>(0);
  const [emiTitle, setEmiTitle] = useState<string>('');
  const [isEmiModalOpen, setIsEmiModalOpen] = useState<boolean>(false);

  // Scheme Modal
  const [activeSchemeModal, setActiveSchemeModal] = useState<string | null>(null);

  // Doctor Consult Modal
  const [activeDoctorModal, setActiveDoctorModal] = useState<any | null>(null);

  // Filter public approved listings
  const publicListings = listings.filter((l) => l.status === 'approved');

  let filteredListings = publicListings.filter((l) => {
    if (selectedCategory !== 'all' && l.category !== selectedCategory) return false;
    if (verifiedOnly && !l.sellerVerified) return false;
    if (l.distanceKm > maxDistance) return false;

    if (selectedSubcategory && selectedSubcategory !== 'all') {
      const sub = selectedSubcategory.toLowerCase();
      const matchSub = l.subcategory.toLowerCase().includes(sub);
      const matchTitle = l.title.toLowerCase().includes(sub);
      const matchDesc = l.description.toLowerCase().includes(sub);
      if (!matchSub && !matchTitle && !matchDesc) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = l.title.toLowerCase().includes(q);
      const matchLoc = l.location.toLowerCase().includes(q);
      const matchSub = l.subcategory.toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchSub) return false;
    }

    if (sortBy === 'below_50k') return l.price <= 50000;
    if (sortBy === '50k_1l') return l.price >= 50000 && l.price <= 100000;
    if (sortBy === '1l_2l') return l.price >= 100000 && l.price <= 200000;

    return true;
  });

  if (sortBy === 'price_low_high') {
    filteredListings.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_high_low') {
    filteredListings.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'sort_age') {
    filteredListings.sort((a, b) => a.price - b.price);
  }

  const handleOpenActionModal = (action: ActionType, listing: Listing) => {
    setActiveModalAction(action);
    setActiveListingForModal(listing);
    setIsActionModalOpen(true);
  };

  const handleOpenEmiModal = (price: number, title: string) => {
    setEmiPrice(price);
    setEmiTitle(title);
    setIsEmiModalOpen(true);
  };

  // 8 Categories matching screenshot grid
  const categoryGrid = [
    {
      id: 'cattle',
      name: 'Livestock',
      img: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'crops',
      name: 'Crops',
      img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'seeds',
      name: 'Seeds',
      img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'equipment',
      name: 'Equipment',
      img: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'lands',
      name: 'Farm Land',
      img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'poultry',
      name: 'Poultry',
      img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'dairy',
      name: 'Dairy',
      img: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'fertilizer',
      name: 'Fertilizer',
      img: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=400',
    },
  ];

  // Doctors
  const doctors = [
    {
      id: 'doc-1',
      name: 'Dr. Ananya Sharma',
      role: 'Livestock Vet Specialist',
      experience: '12 yrs exp',
      rating: '4.9 ★',
      status: 'Available Now',
      img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    },
    {
      id: 'doc-2',
      name: 'Dr. Rajesh Kumar',
      role: 'Crop & Agronomy Expert',
      experience: '15 yrs exp',
      rating: '4.8 ★',
      status: 'Video Call',
      img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    },
    {
      id: 'doc-3',
      name: 'Dr. Suresh Patil',
      role: 'Soil & Veterinary Surgeon',
      experience: '10 yrs exp',
      rating: '5.0 ★',
      status: 'Book Consult',
      img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-24">
      {/* Search Bar & Action Badges Header */}
      <div className="flex items-center space-x-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search 'Livestock', 'Sahiwal Cow', 'Tractors', or 'Seeds'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-medium text-zinc-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <Mic className="w-5 h-5 text-emerald-600 absolute right-3.5 top-3 cursor-pointer hover:scale-110 transition" />
        </div>

        {/* Wishlist Heart Icon */}
        <button className="relative p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
          <Heart className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
            2
          </span>
        </button>

        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
            1
          </span>
        </button>
      </div>

      {/* Hero Banner Carousel ("Sell Direct to Buyers") */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 text-white p-6 sm:p-8 shadow-xl border border-emerald-700/50">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200")',
          }}
        />
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Farmers & Dealers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight">
            Sell Direct to Buyers
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            List your crops & livestock with zero commission this month. Reach thousands of verified buyers directly.
          </p>

          <div className="pt-2 flex items-center space-x-4">
            <button
              onClick={onOpenWizard}
              className="px-5 py-2.5 bg-white text-emerald-950 font-black text-xs rounded-xl hover:bg-emerald-50 transition shadow-lg flex items-center space-x-1.5"
            >
              <span>Start Selling</span>
              <ChevronRight className="w-4 h-4 text-emerald-800" />
            </button>
          </div>

          {/* Carousel Slider Indicators */}
          <div className="pt-4 flex items-center space-x-1.5">
            <div className="w-6 h-1.5 rounded-full bg-emerald-400" />
            <div className="w-2 h-1.5 rounded-full bg-white/40" />
            <div className="w-2 h-1.5 rounded-full bg-white/40" />
          </div>
        </div>
      </div>

      {/* Browse Categories Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">
            Browse Categories
          </h2>
          <button
            onClick={onOpenCategoriesModal || (() => setSelectedCategory('all'))}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categoryGrid.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                navigate(`/category/${cat.id}`);
              }}
              className={`flex flex-col items-center space-y-2 p-2.5 rounded-2xl border transition group ${
                selectedCategory === cat.id
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 shadow-md'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 hover:border-emerald-500/50'
              }`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-sm group-hover:scale-105 transition-transform">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 text-center line-clamp-1">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Fresh Recommendations Section (directly after categories) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-black text-zinc-900 dark:text-white">
              Fresh recommendations
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold">
              {filteredListings.length} items
            </span>
          </div>

          {/* Distance & Verification toggles */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center space-x-1 border ${
                verifiedOnly
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Only</span>
            </button>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {(selectedCategory !== 'all' || selectedSubcategory !== 'all' || sortBy !== 'default') && (
          <div className="flex flex-wrap items-center gap-2 p-2.5 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 text-xs">
            <span className="font-extrabold text-emerald-900 dark:text-emerald-300">Active Filters:</span>

            {selectedCategory !== 'all' && (
              <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-700 capitalize">
                Category: {selectedCategory}
              </span>
            )}

            {selectedSubcategory && selectedSubcategory !== 'all' && (
              <span className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white font-bold shadow-xs">
                Subcategory: {selectedSubcategory}
              </span>
            )}

            {sortBy !== 'default' && (
              <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold border border-zinc-300 dark:border-zinc-700">
                Sort: {sortBy.replace('_', ' ')}
              </span>
            )}

            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubcategory('all');
                setSortBy('default');
              }}
              className="ml-auto px-2.5 py-1 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold hover:bg-rose-200 transition flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}

        {/* Product Grid */}
        {filteredListings.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              No approved listings found in this filter
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Try clicking "View All" or adjusting your search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onOpenActionModal={handleOpenActionModal}
                onOpenEmiModal={handleOpenEmiModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bank & Schemes Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-zinc-900 dark:text-white">
              Bank & Schemes
            </h2>
            <p className="text-xs text-zinc-500 font-medium">
              Loans, subsidies, and government schemes for farmers.
            </p>
          </div>
          <button
            onClick={() => setActiveSchemeModal('all')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Featured PM-KISAN Banner Card */}
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-black text-emerald-950 dark:text-emerald-300">
                  PM-KISAN
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-200">
                  Government
                </span>
              </div>
              <p className="text-xs text-emerald-900 dark:text-emerald-200/90 font-medium mt-0.5">
                Check installment status and eligibility.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveSchemeModal('PM-KISAN')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1 shrink-0"
          >
            <span>Check Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Scheme Action Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveSchemeModal('KCC Loan')}
            className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-emerald-500 transition text-left space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white group-hover:text-emerald-600">
                KCC Loan
              </h4>
              <p className="text-[10px] text-zinc-500 line-clamp-1">Up to ₹3L at 4% interest</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSchemeModal('Crop Insurance')}
            className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-emerald-500 transition text-left space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white group-hover:text-emerald-600">
                Crop Insurance
              </h4>
              <p className="text-[10px] text-zinc-500 line-clamp-1">PM Fasal Bima Yojana</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSchemeModal('Solar Pumps')}
            className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-emerald-500 transition text-left space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white group-hover:text-emerald-600">
                Solar Pumps
              </h4>
              <p className="text-[10px] text-zinc-500 line-clamp-1">PM-KUSUM 90% Subsidy</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSchemeModal('Cold Storage')}
            className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-emerald-500 transition text-left space-y-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white group-hover:text-emerald-600">
                Cold Storage
              </h4>
              <p className="text-[10px] text-zinc-500 line-clamp-1">AIF Infra Subsidy</p>
            </div>
          </button>
        </div>
      </div>

      {/* Doctor Consultant Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-zinc-900 dark:text-white">
              Doctor Consultant
            </h2>
            <p className="text-xs text-zinc-500 font-medium">
              Book verified vets and crop experts for instant advice.
            </p>
          </div>
          <button
            onClick={() => setActiveDoctorModal(doctors[0])}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex items-center justify-between space-x-3"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={doc.img}
                  alt={doc.name}
                  className="w-12 h-12 rounded-2xl object-cover shrink-0"
                />
                <div>
                  <h4 className="text-xs font-black text-zinc-900 dark:text-white">
                    {doc.name}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-medium">{doc.role}</p>
                  <p className="text-[10px] text-amber-600 font-extrabold mt-0.5">
                    {doc.experience} • {doc.rating}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveDoctorModal(doc)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-sm transition shrink-0"
              >
                {doc.status}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Farmer Community Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-zinc-900 dark:text-white">
              Farmer Community
            </h2>
            <p className="text-xs text-zinc-500 font-medium">
              Share harvest updates, ask questions, and learn from farmers near you.
            </p>
          </div>
          <button className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-0.5">
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  RK
                </div>
                <div>
                  <span className="font-extrabold text-zinc-900 dark:text-white">Rajesh Kumar</span>
                  <span className="text-[10px] text-zinc-400 block">Harvest Update • Ludhiana</span>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md">
                Wheat
              </span>
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300">
              Harvested 40 Quintals of organic HD-2967 wheat today. Grain density is excellent! Direct buyer contact open.
            </p>
            <div className="flex items-center space-x-4 text-[11px] text-zinc-500 pt-1 font-semibold">
              <span className="flex items-center space-x-1">
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>48 Likes</span>
              </span>
              <span className="flex items-center space-x-1">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                <span>12 Comments</span>
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                  PS
                </div>
                <div>
                  <span className="font-extrabold text-zinc-900 dark:text-white">Priya Sharma</span>
                  <span className="text-[10px] text-zinc-400 block">Crop Tips • Karnal</span>
                </div>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-md">
                Organic
              </span>
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300">
              Tips for monsoon Basmati nursery management: ensure sub-surface drainage to protect roots from waterlogging.
            </p>
            <div className="flex items-center space-x-4 text-[11px] text-zinc-500 pt-1 font-semibold">
              <span className="flex items-center space-x-1">
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>23 Likes</span>
              </span>
              <span className="flex items-center space-x-1">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                <span>8 Comments</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Livestock, Poultry & Dairy Category Showcase */}
      <div className="space-y-4 pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-zinc-900 dark:text-white">
              Livestock, Poultry & Dairy Specials
            </h2>
            <p className="text-xs text-zinc-500 font-medium">
              Direct farm listings for Cattle, Poultry breeds, and Dairy produce.
            </p>
          </div>
          <button
            onClick={() => setSelectedCategory('cattle')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-0.5"
          >
            <span>Explore Cattle</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {publicListings
            .filter((l) => ['cattle', 'poultry', 'dairy'].includes(l.category))
            .slice(0, 3)
            .map((listing) => (
              <ListingCard
                key={`showcase-${listing.id}`}
                listing={listing}
                onOpenActionModal={handleOpenActionModal}
                onOpenEmiModal={handleOpenEmiModal}
              />
            ))}
        </div>
      </div>

      {/* Action Modals */}
      {activeListingForModal && (
        <CategoryActionModal
          isOpen={isActionModalOpen}
          onClose={() => setIsActionModalOpen(false)}
          listing={activeListingForModal}
          actionType={activeModalAction}
          onSubmitInquiry={onAddInquiry}
        />
      )}

      <EmiCalculatorModal
        isOpen={isEmiModalOpen}
        onClose={() => setIsEmiModalOpen(false)}
        equipmentPrice={emiPrice}
        equipmentTitle={emiTitle}
      />

      {/* Scheme Modal */}
      {activeSchemeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-6 h-6 text-emerald-600" />
                <h3 className="text-base font-black text-zinc-900 dark:text-white">
                  {activeSchemeModal} Verification
                </h3>
              </div>
              <button
                onClick={() => setActiveSchemeModal(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Verify your Aadhaar or Kisan Credit Card registration to access direct government subsidies, zero interest loan quotes, and installment tracking.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Aadhaar Number / Farmer ID
              </label>
              <input
                type="text"
                placeholder="XXXX-XXXX-XXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-mono focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <button
              onClick={() => {
                alert(`Query submitted for ${activeSchemeModal}. Our agricultural desk will notify you via SMS.`);
                setActiveSchemeModal(null);
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow transition"
            >
              Verify Eligibility Instant
            </button>
          </div>
        </div>
      )}

      {/* Doctor Modal */}
      {activeDoctorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={activeDoctorModal.img}
                  alt={activeDoctorModal.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-sm font-black text-zinc-900 dark:text-white">
                    {activeDoctorModal.name}
                  </h3>
                  <p className="text-[10px] text-zinc-500">{activeDoctorModal.role}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveDoctorModal(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
              <div className="flex items-center space-x-1 font-bold">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Verified Agricultural Council Expert</span>
              </div>
              <p className="text-[11px] opacity-90">
                Direct consultation for cattle disease diagnosis, soil health cards, and crop pest management.
              </p>
            </div>

            <button
              onClick={() => {
                alert(`Connecting video call session with ${activeDoctorModal.name}...`);
                setActiveDoctorModal(null);
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow transition flex items-center justify-center space-x-1.5"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Start Instant Video Consultation</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
