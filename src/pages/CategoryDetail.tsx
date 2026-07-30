import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, Search, Sparkles, ChevronRight,
  ShieldCheck, CheckCircle2, Heart
} from 'lucide-react';
import { Listing } from '../types';
import { ListingCard } from '../components/ListingCard';
import { CropsCategoryView } from '../components/CropsCategoryView';

interface CategoryDetailProps {
  listings: Listing[];
  onOpenSellWizard?: (draft?: Partial<Listing>) => void;
}

// Category Normalizer Helper
export function normalizeCategory(catId?: string): string {
  if (!catId) return 'cattle';
  const c = catId.toLowerCase();
  if (['cattle', 'cows', 'cow', 'livestock', 'dairy', 'buffaloes', 'bulls', 'calves'].includes(c)) return 'cattle';
  if (['equipment', 'farm_equipment', 'machinery', 'tractors', 'harvesters'].includes(c)) return 'equipment';
  if (['crops', 'grains', 'harvest', 'vegetables', 'fruits'].includes(c)) return 'crops';
  if (['seeds', 'seed'].includes(c)) return 'seeds';
  if (['poultry', 'chicks'].includes(c)) return 'poultry';
  if (['fisheries', 'fish', 'aqua'].includes(c)) return 'fisheries';
  if (['pets', 'dogs', 'animals'].includes(c)) return 'pets';
  if (['lands', 'farmlands', 'farm_land', 'land'].includes(c)) return 'lands';
  if (['fertilizer', 'fertilisers', 'agri_shops', 'shops'].includes(c)) return 'fertilizer';
  if (['veterinary', 'vet', 'doctors'].includes(c)) return 'veterinary';
  if (['labour', 'labor', 'workers'].includes(c)) return 'labour';
  if (['farm_loans', 'loans', 'insurance', 'finance'].includes(c)) return 'farm_loans';
  return c;
}

// Subcategory Alias & Keyword Matcher
function matchesSubcategory(listing: Listing, subId: string): boolean {
  if (!subId) return true;
  const subLower = subId.toLowerCase();
  const titleLower = listing.title.toLowerCase();
  const subcatLower = listing.subcategory.toLowerCase();
  const descLower = listing.description.toLowerCase();

  if (subcatLower.includes(subLower) || titleLower.includes(subLower) || descLower.includes(subLower)) {
    return true;
  }

  const KEYWORD_MAP: Record<string, string[]> = {
    cows: ['cow', 'cows', 'gir', 'sahiwal', 'hf', 'jersey', 'tharparkar', 'red sindhi', 'dairy'],
    buffaloes: ['buffalo', 'murrah', 'jafrabadi', 'surti', 'bhadawari', 'mehsani'],
    bulls: ['bull', 'sire', 'ox', 'nandi'],
    calves: ['calf', 'calves', 'baby'],
    sheep: ['sheep', 'marwari sheep', 'lamb', 'ram'],
    goats: ['goat', 'jamnapari', 'barbari', 'sirohi', 'buck'],
    tractors: ['tractor', 'john deere', 'swaraj', 'sonalika', 'mahindra', '4wd'],
    harvesters: ['harvester', 'combine'],
    rotavators: ['rotavator', 'shaktiman', 'tiller'],
    cultivators: ['cultivator', 'plough', 'plow'],
    sprayers: ['sprayer', 'drone', 'battery'],
    chicks: ['chick', 'chicks', 'poultry', 'kadaknath', 'layer', 'broiler'],
    freshwater: ['rohu', 'catla', 'fish', 'freshwater', 'fingerling'],
    organic: ['organic', 'vermicompost', 'compost', 'ghee', 'bio', 'manure'],
    cereals: ['rice', 'wheat', 'maize', 'corn', 'basmati', 'grain'],
    hybrid: ['hybrid', 'seed', 'maize'],
    agricultural: ['acre', 'land', 'farmland', 'terrain', 'soil'],
    doctors: ['doctor', 'vet', 'veterinary', 'vaccination'],
    drivers: ['driver', 'tractor driver', 'operator', 'labour', 'worker'],
    loans: ['loan', 'credit', 'kisan', 'insurance', 'kcc'],
  };

  const keywords = KEYWORD_MAP[subLower];
  if (keywords) {
    return keywords.some(
      (kw) => titleLower.includes(kw) || subcatLower.includes(kw) || descLower.includes(kw)
    );
  }

  return false;
}

// Subcategory sets per main category
const CATEGORY_CONFIGS: Record<string, {
  name: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  badges?: string[];
  aiTitle: string;
  aiDesc: string;
  subcategories: { id: string; name: string; icon: string }[];
}> = {
  cattle: {
    name: 'Cattle & Livestock',
    heroTitle: 'Healthy Cattle\nBetter Farming',
    heroSubtitle: 'Buy, Sell & Connect with verified livestock farmers',
    heroImage: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=1200',
    badges: ['Verified Health Records', 'FMD Vaccinated', 'Direct Farm Visit'],
    aiTitle: 'AI Cattle Advisor',
    aiDesc: 'Get AI insights on breed health, milk yield, fodder diet & market prices.',
    subcategories: [
      { id: 'cows', name: 'Cows (Dairy)', icon: '🐄' },
      { id: 'buffaloes', name: 'Buffaloes', icon: '🐃' },
      { id: 'bulls', name: 'Bulls', icon: '🐂' },
      { id: 'calves', name: 'Calves', icon: '🐮' },
      { id: 'sheep', name: 'Sheep', icon: '🐑' },
      { id: 'goats', name: 'Goats', icon: '🐐' },
      { id: 'exotic', name: 'Exotic Breeds', icon: '🐄' },
      { id: 'indigenous', name: 'Desi Breeds', icon: '🐄' },
    ],
  },
  equipment: {
    name: 'Farm Equipment',
    heroTitle: 'Right Equipment,\nBetter Yields',
    heroSubtitle: 'Buy, Sell & Rent heavy farm machinery and tools',
    heroImage: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&q=80&w=1200',
    badges: ['RTO Clear Paperwork', 'Verified Mechanics', 'Easy EMI Finance'],
    aiTitle: 'AI Equipment Advisor',
    aiDesc: 'Get AI advice on tractor HP requirements, fuel economy & maintenance logs.',
    subcategories: [
      { id: 'tractors', name: 'Tractors', icon: '🚜' },
      { id: 'harvesters', name: 'Harvesters', icon: '🌾' },
      { id: 'rotavators', name: 'Rotavators', icon: '⚙️' },
      { id: 'cultivators', name: 'Cultivators', icon: '🚜' },
      { id: 'sprayers', name: 'Sprayers', icon: '💦' },
      { id: 'tillers', name: 'Power Tillers', icon: '🚜' },
    ],
  },
  crops: {
    name: 'Crops & Harvest',
    heroTitle: 'Fresh Harvest\nDirect From Farms',
    heroSubtitle: 'Buy & sell grains, pulses, fruits and vegetables direct at MSP',
    heroImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
    badges: ['Direct Farm Price', 'Organic Lab Certified', 'Bulk Freight'],
    aiTitle: 'AI Crop Price Advisor',
    aiDesc: 'Track live Mandi prices, seasonal trends & buyer demand in your area.',
    subcategories: [
      { id: 'cereals', name: 'Cereals & Grains', icon: '🌾' },
      { id: 'pulses', name: 'Pulses & Dal', icon: '🫘' },
      { id: 'vegetables', name: 'Vegetables', icon: '🥦' },
      { id: 'fruits', name: 'Fresh Fruits', icon: '🍎' },
    ],
  },
  seeds: {
    name: 'Seeds & Propagation',
    heroTitle: 'High Germination\nQuality Seeds',
    heroSubtitle: 'Government certified hybrid & organic seeds for all seasons',
    heroImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1200',
    badges: ['95%+ Germination', 'Drought Resistant', 'Certified Batches'],
    aiTitle: 'AI Seed Selection Assistant',
    aiDesc: 'Find the ideal seed variety based on soil type, rainfall and climate.',
    subcategories: [
      { id: 'hybrid', name: 'Hybrid Seeds', icon: '🌱' },
      { id: 'organic', name: 'Organic Seeds', icon: '🌿' },
      { id: 'vegetable_seeds', name: 'Vegetable Seeds', icon: '🥦' },
    ],
  },
  fertilizer: {
    name: 'Fertilisers & Agri-Shops',
    heroTitle: 'Soil Nutrition\nMaximum Yield',
    heroSubtitle: 'Organic compost, bio-fertilizers and crop protection near you',
    heroImage: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=1200',
    badges: ['Bio Certified', 'NPK Enriched', 'Bulk Discounts'],
    aiTitle: 'AI Soil Health Advisor',
    aiDesc: 'Calculate exact NPK dosages and soil organic matter requirements.',
    subcategories: [
      { id: 'organic', name: 'Organic Compost', icon: '🪱' },
      { id: 'bio', name: 'Bio Fertilizers', icon: '🧪' },
      { id: 'feed', name: 'Animal Feed', icon: '🌾' },
    ],
  },
  poultry: {
    name: 'Poultry Farming',
    heroTitle: 'Healthy Chicks\nHigh Productivity',
    heroSubtitle: 'Quality chicks, layers, broilers and organic poultry feed',
    heroImage: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=1200',
    badges: ['Vaccinated Chicks', 'High Immunity', 'Marek Tested'],
    aiTitle: 'AI Poultry Doctor',
    aiDesc: 'Get advice on vaccination schedules, temperature control and bird feed.',
    subcategories: [
      { id: 'chicks', name: 'Chicks', icon: '🐣' },
      { id: 'layers', name: 'Egg Layers', icon: '🥚' },
      { id: 'broilers', name: 'Broilers', icon: '🐔' },
    ],
  },
  fisheries: {
    name: 'Fisheries & Aquaculture',
    heroTitle: 'Quality Fish Seeds\nHigh Survival Rate',
    heroSubtitle: 'Freshwater fingerlings, shrimp larvae and pond equipment',
    heroImage: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=1200',
    badges: ['Oxygen Packed', 'Hatchery Tested', '95%+ Survival'],
    aiTitle: 'AI Aqua Expert',
    aiDesc: 'Analyze pond pH, dissolved oxygen requirements and fish stocking density.',
    subcategories: [
      { id: 'freshwater', name: 'Freshwater Fish', icon: '🐟' },
      { id: 'fingerlings', name: 'Fingerlings', icon: '🐠' },
    ],
  },
  lands: {
    name: 'Farm Lands',
    heroTitle: 'Fertile Farmlands\nClear Title Deeds',
    heroSubtitle: 'Agricultural land, dairy plots and fish ponds with water access',
    heroImage: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200',
    badges: ['RTC Deeds Clear', 'Water & Power Ready', 'Soil Lab Tested'],
    aiTitle: 'AI Land Valuer',
    aiDesc: 'Check land valuation, water table depth and agricultural zone status.',
    subcategories: [
      { id: 'agricultural', name: 'Agricultural Land', icon: '🏞️' },
    ],
  },
  veterinary: {
    name: 'Veterinary Services',
    heroTitle: 'Doorstep Vet Care\nFor Your Livestock',
    heroSubtitle: 'Certified doctors, vaccination drives and artificial insemination',
    heroImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200',
    badges: ['Licensed Vets', '24/7 Emergency', 'Home Visit'],
    aiTitle: 'AI Vet Symptoms Checker',
    aiDesc: 'Describe animal symptoms to receive emergency first-aid recommendations.',
    subcategories: [
      { id: 'doctors', name: 'Veterinary Vets', icon: '🩺' },
    ],
  },
  labour: {
    name: 'Farm Labour & Workers',
    heroTitle: 'Skilled Labour\nFor Every Season',
    heroSubtitle: 'Tractor operators, harvest crews and experienced dairy hands',
    heroImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1200',
    badges: ['Aadhar Verified', 'Experienced Operators', 'Daily Wage Teams'],
    aiTitle: 'AI Work Estimator',
    aiDesc: 'Calculate required worker headcount and estimated hours for harvesting.',
    subcategories: [
      { id: 'drivers', name: 'Tractor Drivers', icon: '🚜' },
    ],
  },
  farm_loans: {
    name: 'Farm Loans & Insurance',
    heroTitle: 'Subsidized Credit\n& Crop Cover',
    heroSubtitle: 'NABARD livestock loans, Kisan credit card and government schemes',
    heroImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200',
    badges: ['4% Subsidized Rate', 'Zero Processing Fee', 'NABARD Approved'],
    aiTitle: 'AI Scheme Eligibility Checker',
    aiDesc: 'Calculate interest subsidies and check PM-Kisan & loan eligibility.',
    subcategories: [
      { id: 'loans', name: 'Livestock Loans', icon: '💳' },
    ],
  },
  pets: {
    name: 'Farm Pets & Dogs',
    heroTitle: 'Guard Dogs & Pets\nFor Your Farm',
    heroSubtitle: 'K9 line German Shepherds, farm guard dogs and healthy pets',
    heroImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=1200',
    badges: ['Microchipped', 'Vaccinated', 'KCI Registered'],
    aiTitle: 'AI Pet & K9 Advisor',
    aiDesc: 'Get guidance on guard dog training, diet and farm security setup.',
    subcategories: [
      { id: 'dogs', name: 'Guard Dogs', icon: '🐕' },
    ],
  },
};

export const CategoryDetail: React.FC<CategoryDetailProps> = ({ listings, onOpenSellWizard }) => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const normKey = normalizeCategory(categoryId);

  if (normKey === 'crops') {
    return (
      <CropsCategoryView
        listings={listings}
        onOpenSellWizard={() => onOpenSellWizard?.({ category: 'crops' })}
      />
    );
  }

  const config = CATEGORY_CONFIGS[normKey] || CATEGORY_CONFIGS['cattle'];

  const [selectedSub, setSelectedSub] = useState<string>('');
  const [aiAdvisorModal, setAiAdvisorModal] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  // Filter listings
  const filteredListings = listings.filter((l) => {
    const listNormCat = normalizeCategory(l.category);
    const isCatMatch = listNormCat === normKey;

    const isSubMatch = matchesSubcategory(l, selectedSub);

    return isCatMatch && isSubMatch;
  });

  const handleAskAiAdvisor = () => {
    setLoadingAi(true);
    setTimeout(() => {
      setAiResponse(
        `Farmora AI Advisor for ${config.name}: Recommended best practice for ${
          selectedSub || 'your needs'
        }: Ensure verified health logs, direct seller communication, and clean documentation. Price trends show steady value for high-rated listings in your region.`
      );
      setLoadingAi(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      
      {/* 1. Top Header Bar */}
      <div className="bg-emerald-900 text-white px-4 py-3.5 sticky top-0 z-40 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-full hover:bg-emerald-800 transition text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base sm:text-lg font-black tracking-wide">
            {config.name}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-emerald-800 transition">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-5 space-y-6">
        
        {/* 2. Main Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden min-h-48 sm:min-h-56 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-lg p-6 flex flex-col justify-center">
          <img
            src={config.heroImage}
            alt={config.name}
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-overlay"
          />
          <div className="relative z-10 max-w-sm space-y-2">
            <h2 className="text-xl sm:text-2xl font-black leading-tight tracking-tight whitespace-pre-line">
              {config.heroTitle}
            </h2>
            <p className="text-xs text-emerald-200 font-medium leading-relaxed">
              {config.heroSubtitle}
            </p>

            {config.badges && config.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {config.badges.map((b, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/40 text-[10px] font-extrabold text-emerald-200 flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{b}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. Subcategories Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white">
              {config.name} Subcategories
            </h3>
            {selectedSub && (
              <button
                onClick={() => setSelectedSub('')}
                className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
            {config.subcategories.map((sub) => {
              const isSelected = selectedSub === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSub(isSelected ? '' : sub.id)}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1.5 ${
                    isSelected
                      ? 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-emerald-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl shadow-xs">
                    {sub.icon}
                  </div>
                  <span className="text-[11px] font-extrabold text-zinc-900 dark:text-zinc-200 leading-tight">
                    {sub.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. AI Advisor Banner */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between shadow-xs">
          <div className="space-y-2 max-w-xs sm:max-w-md">
            <div>
              <h4 className="text-xs sm:text-sm font-black text-emerald-950 dark:text-emerald-200 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{config.aiTitle}</span>
              </h4>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-400 mt-0.5 leading-relaxed">
                {config.aiDesc}
              </p>
            </div>
            <button
              onClick={() => setAiAdvisorModal(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition"
            >
              Get Advice
            </button>
          </div>

          <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center text-4xl">
            {normKey === 'equipment' ? '🚜🤖' : '🐄🤖'}
          </div>
        </div>

        {/* 5. Active Listings Grid */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-zinc-900 dark:text-white">
              Available Listings ({filteredListings.length})
            </h3>
            {selectedSub && (
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                Filtered: {selectedSub}
              </span>
            )}
          </div>

          {filteredListings.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-3">
              <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                No active listings found under this filter.
              </p>
              <button
                onClick={() => setSelectedSub('')}
                className="px-4 py-2 bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md"
              >
                Show All {config.name}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* AI Advisor Modal */}
      {aiAdvisorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{config.aiTitle}</span>
              </h3>
              <button onClick={() => setAiAdvisorModal(false)} className="text-xs font-bold text-zinc-400">
                ✕
              </button>
            </div>

            <textarea
              rows={3}
              placeholder="Ask anything about breeds, pricing, fuel, feed or disease prevention..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full p-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium bg-zinc-50 dark:bg-zinc-800"
            />

            {aiResponse && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-900 dark:text-emerald-200 rounded-xl leading-relaxed">
                {aiResponse}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setAiAdvisorModal(false)}
                className="w-1/2 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-xl"
              >
                Close
              </button>
              <button
                onClick={handleAskAiAdvisor}
                disabled={loadingAi}
                className="w-1/2 py-2.5 bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md"
              >
                {loadingAi ? 'Analyzing...' : 'Get AI Advice'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
