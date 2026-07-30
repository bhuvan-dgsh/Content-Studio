import React, { useState } from 'react';
import { X, ChevronRight, SlidersHorizontal, ArrowUpDown, Filter, Sparkles } from 'lucide-react';
import { CategoryType } from '../types';

interface SubCategoryItem {
  id: CategoryType;
  name: string;
  subcategories: string[];
  bannerDesc: string;
  img: string;
}

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: CategoryType | 'all';
  onApplyCategoryFilter?: (catId: CategoryType | 'all', sub?: string, sort?: string) => void;
}

export const CATEGORY_DEFINITIONS: SubCategoryItem[] = [
  {
    id: 'cattle',
    name: 'Cattle',
    subcategories: ['Sheep', 'Cows', 'Buffaloes', 'Bulls', 'Goat', 'Pig', 'Horse', 'Camel', 'Others'],
    bannerDesc: 'Buy & sell healthy cows, buffaloes, goats, sheep, and livestock with verified health records.',
    img: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'poultry',
    name: 'Poultry',
    subcategories: ['Commercial Layers', 'Broilers', 'Others'],
    bannerDesc: 'High-quality chicks, layers, broilers, and poultry equipment from certified farms.',
    img: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'fisheries',
    name: 'Fisheries',
    subcategories: ['Freshwater Fish', 'Marine Fish', 'Shrimp', 'Crab', 'Others'],
    bannerDesc: 'Freshwater fish seeds, shrimp larvae, and marine harvest directly from local aquaculture.',
    img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'pets',
    name: 'Pets',
    subcategories: ['Dogs', 'Cats', 'Birds', 'Aquarium', 'Others'],
    bannerDesc: 'Farm pets, guard dogs, song birds, and aquarium setups with health passports.',
    img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'crops',
    name: 'Crops',
    subcategories: ['Cereals', 'Pulses', 'Commercial Crops', 'Spices & Condiments', 'Vegetables', 'Fruits', 'Flowers', 'Others'],
    bannerDesc: 'Fresh farm harvest including grains, pulses, fruits, and organic vegetables at direct MSP prices.',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'equipment',
    name: 'Farm Equipment',
    subcategories: ['Tractors', 'Harvesters', 'Cultivators', 'Drone Sprayers', 'Machines', 'Pump', 'Others'],
    bannerDesc: 'Buy or rent heavy farm machinery, tractors, harvesters, and solar pumps with EMI.',
    img: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'lands',
    name: 'Farm Lands',
    subcategories: ['Agricultural Land', 'Dairy Farms', 'Poultry Farms', 'Fish Farms', 'Others'],
    bannerDesc: 'Verified fertile agricultural land, dairy plots, and fish ponds with clean legal title deeds.',
    img: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'agri_shops',
    name: 'Agri Shops',
    subcategories: ['Feed', 'Seed', 'Organic', 'Fertiliser', 'Farm Equipment', 'Others'],
    bannerDesc: 'Quality animal feed, bio-fertilizers, organic pesticides, and seed stores nearby.',
    img: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'veterinary',
    name: 'Veterinary',
    subcategories: ['Veterinary Doctors', 'Vaccination', 'Animal Medicines', 'Deworming', 'Pet Clinic', 'Others'],
    bannerDesc: 'Doorstep veterinary doctors, artificial insemination, vaccinations, and livestock medicine.',
    img: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'labour',
    name: 'Labour',
    subcategories: ['Farm Workers', 'Tractor Drivers', 'Harvest Labour', 'Dairy Workers', 'Others'],
    bannerDesc: 'Hire experienced farm hands, skilled tractor operators, and seasonal harvesting labor.',
    img: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'farm_loans',
    name: 'Farm Loans',
    subcategories: ['Crop Insurance', 'Livestock Insurance', 'Poultry Insurance', 'Equipment Insurance', 'Others'],
    bannerDesc: 'Government subsidized crop insurance, livestock cattle loans, and Kisan credit access.',
    img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=200',
  },
];

export const CategoriesModal: React.FC<CategoriesModalProps> = ({
  isOpen,
  onClose,
  initialCategory,
  onApplyCategoryFilter,
}) => {
  const [activeTabId, setActiveTabId] = useState<CategoryType>('cattle');

  React.useEffect(() => {
    if (initialCategory && initialCategory !== 'all') {
      const found = CATEGORY_DEFINITIONS.find((c) => c.id === initialCategory);
      if (found) {
        setActiveTabId(found.id);
      } else if (initialCategory === 'livestock' as any) {
        setActiveTabId('cattle');
      }
    }
  }, [isOpen, initialCategory]);

  const activeCategory = CATEGORY_DEFINITIONS.find((c) => c.id === activeTabId) || CATEGORY_DEFINITIONS[0];

  if (!isOpen) return null;

  const handleSelect = (catId: CategoryType, sub?: string, sortVal?: string) => {
    if (onApplyCategoryFilter) {
      onApplyCategoryFilter(catId, sub, sortVal);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center sm:p-4">
      <div className="bg-white dark:bg-zinc-900 w-full sm:max-w-4xl h-[90vh] sm:h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900 shrink-0">
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center space-x-2">
              <span>Categories</span>
            </h2>
            <p className="text-xs text-zinc-500 font-medium">
              Explore livestock, crops, machinery, veterinary & farm services
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Split Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Category Sidebar */}
          <div className="w-28 sm:w-36 bg-emerald-50/40 dark:bg-zinc-950/70 border-r border-zinc-200/80 dark:border-zinc-800 overflow-y-auto py-2 space-y-1 shrink-0 scrollbar-none">
            {CATEGORY_DEFINITIONS.map((cat) => {
              const isActive = activeTabId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTabId(cat.id)}
                  className={`w-full flex flex-col sm:flex-row items-center sm:space-x-2 py-3 px-2 sm:px-3 text-left transition relative ${
                    isActive
                      ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 font-extrabold shadow-sm'
                      : 'text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/40'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1 bottom-1 w-1.5 bg-emerald-600 rounded-r-full" />
                  )}
                  <div className="w-10 h-10 sm:w-8 sm:h-8 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 mb-1 sm:mb-0 shadow-sm">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] sm:text-xs leading-tight text-center sm:text-left line-clamp-1">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Main Content Panel */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-white dark:bg-zinc-900">
            
            {/* Active Category Header Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-900 to-zinc-900 text-white shadow-xl relative overflow-hidden flex items-center justify-between">
              <div className="space-y-1.5 max-w-md z-10">
                <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                  <Sparkles className="w-3 h-3 mr-1" /> Verified Deals
                </div>
                <h3 className="text-lg font-black leading-tight text-white">
                  {activeCategory.name} Market
                </h3>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  {activeCategory.bannerDesc}
                </p>
                <button
                  onClick={() => handleSelect(activeCategory.id)}
                  className="mt-3 px-4 py-2 rounded-xl bg-white text-emerald-950 text-xs font-black hover:bg-emerald-50 transition shadow-md inline-flex items-center space-x-1.5"
                >
                  <span>Browse All {activeCategory.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg hidden sm:block shrink-0 z-10">
                <img src={activeCategory.img} alt={activeCategory.name} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Quick Sort Controls */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center space-x-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sort Options</span>
                </h4>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSelect(activeCategory.id, undefined, 'price_low_high')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-extrabold hover:bg-emerald-100 transition flex items-center space-x-1.5"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Price: Low to High</span>
                </button>

                <button
                  onClick={() => handleSelect(activeCategory.id, undefined, 'price_high_low')}
                  className="px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-extrabold hover:bg-emerald-50 transition flex items-center space-x-1.5 border border-zinc-200 dark:border-zinc-700"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Price: High to Low</span>
                </button>

                <button
                  onClick={() => handleSelect(activeCategory.id, undefined, 'sort_age')}
                  className="px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-extrabold hover:bg-emerald-50 transition flex items-center space-x-1.5 border border-zinc-200 dark:border-zinc-700"
                >
                  <span>Age: Youngest First</span>
                </button>
              </div>
            </div>

            {/* Subcategories Header & Interactive Chips */}
            <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-zinc-900 dark:text-white">
                  Subcategories ({activeCategory.subcategories.length})
                </h4>
                <span className="text-[11px] text-zinc-400">Click to view items</span>
              </div>

              {/* Interactive Subcategory Grid Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {activeCategory.subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => handleSelect(activeCategory.id, sub)}
                    className="p-3 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition flex items-center justify-between text-left group shadow-xs"
                  >
                    <div>
                      <span className="text-xs font-extrabold text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
                        {sub}
                      </span>
                      <p className="text-[10px] text-zinc-400">View listings</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
