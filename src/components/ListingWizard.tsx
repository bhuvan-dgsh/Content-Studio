import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check, ChevronRight, ChevronLeft, Upload, Sparkles, ShieldCheck,
  AlertCircle, Image as ImageIcon, MapPin, Tag, Truck, FileText, CheckCircle2,
  Save, X, Edit3, Droplets, Waves, Info, Send, Plus,
  Handshake, Gavel, Key, FileCheck, Landmark, Building
} from 'lucide-react';
import { CategoryType, Listing } from '../types';
import { generateListingAiAudit, generateOptimizedDescription } from '../services/geminiService';

interface ListingWizardProps {
  onComplete: (newListing: Listing) => void;
  onCancel: () => void;
  initialDraft?: Partial<Listing>;
}

const CATEGORIES: { id: CategoryType; name: string; icon: string; subcategories: string[] }[] = [
  {
    id: 'cattle',
    name: 'Cattle & Livestock',
    icon: '🐄',
    subcategories: ['Sheep', 'Cows', 'Buffaloes', 'Bulls', 'Goat', 'Pig', 'Horse', 'Camel', 'Others'],
  },
  {
    id: 'poultry',
    name: 'Poultry',
    icon: '🐔',
    subcategories: ['Commercial Layers', 'Broilers', 'Others'],
  },
  {
    id: 'fisheries',
    name: 'Fisheries',
    icon: '🐟',
    subcategories: ['Freshwater Fish', 'Marine Fish', 'Shrimp', 'Crab', 'Others'],
  },
  {
    id: 'pets',
    name: 'Pets',
    icon: '🐶',
    subcategories: ['Dogs', 'Cats', 'Birds', 'Aquarium', 'Others'],
  },
  {
    id: 'crops',
    name: 'Crops',
    icon: '🌾',
    subcategories: ['Cereals', 'Pulses', 'Commercial Crops', 'Spices & Condiments', 'Vegetables', 'Fruits', 'Flowers', 'Others'],
  },
  {
    id: 'equipment',
    name: 'Farm Equipment',
    icon: '🚜',
    subcategories: ['Tractors', 'Harvesters', 'Cultivators', 'Drone Sprayers', 'Machines', 'Pump', 'Others'],
  },
  {
    id: 'lands',
    name: 'Farm Lands',
    icon: '🏞️',
    subcategories: ['Agricultural Land', 'Dairy Farms', 'Poultry Farms', 'Fish Farms', 'Others'],
  },
  {
    id: 'agri_shops',
    name: 'Agri Shops',
    icon: '🏪',
    subcategories: ['Feed', 'Seed', 'Organic', 'Fertiliser', 'Farm Equipment', 'Others'],
  },
  {
    id: 'veterinary',
    name: 'Veterinary',
    icon: '🩺',
    subcategories: ['Veterinary Doctors', 'Vaccination', 'Animal Medicines', 'Deworming', 'Pet Clinic', 'Others'],
  },
  {
    id: 'labour',
    name: 'Labour',
    icon: '🧑‍🌾',
    subcategories: ['Farm Workers', 'Tractor Drivers', 'Harvest Labour', 'Dairy Workers', 'Others'],
  },
  {
    id: 'farm_loans',
    name: 'Farm Loans',
    icon: '🏦',
    subcategories: ['Crop Insurance', 'Livestock Insurance', 'Poultry Insurance', 'Equipment Insurance', 'Others'],
  },
];

const PRESET_PHOTOS: Record<string, string[]> = {
  cattle: [
    'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=1000',
  ],
  poultry: [
    'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=1000',
  ],
  fisheries: [
    'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1000',
  ],
  crops: [
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000',
  ],
  equipment: [
    'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&q=80&w=1000',
  ],
  default: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000',
  ],
};

export const ListingWizard: React.FC<ListingWizardProps> = ({
  onComplete,
  onCancel,
  initialDraft,
}) => {
  // Steps: 1 = Product Details, 2 = Photos, 3 = Review, 4 = Publish / Confirmation
  const [step, setStep] = useState<number>(1);
  const [showBanner, setShowBanner] = useState<boolean>(true);

  // Form State
  const [category, setCategory] = useState<CategoryType>(initialDraft?.category || 'cattle');
  const [subcategory, setSubcategory] = useState<string>(initialDraft?.subcategory || 'Cows');
  const [customBreed, setCustomBreed] = useState<string>('');
  const [showCustomBreedInput, setShowCustomBreedInput] = useState<boolean>(false);

  const [title, setTitle] = useState<string>(initialDraft?.title || 'Rohu Fish (Live)');
  const [description, setDescription] = useState<string>(
    initialDraft?.description ||
      'Fresh live product, healthy and active. Farm raised with clean water and high quality feed. Handled with care and delivered fresh.'
  );

  // Weight & Spec State
  const [weightType, setWeightType] = useState<'range' | 'average'>('range');
  const [minWeight, setMinWeight] = useState<string>('500');
  const [maxWeight, setMaxWeight] = useState<string>('700');
  const [weightUnit, setWeightUnit] = useState<string>('gm');

  // Subtype (e.g. Fresh Water vs Sea Water)
  const [waterType, setWaterType] = useState<'fresh' | 'sea'>('fresh');

  // Quantity & Availability
  const [quantity, setQuantity] = useState<string>(initialDraft?.quantityAvailable || '100');
  const [quantityUnit, setQuantityUnit] = useState<string>(initialDraft?.unit || 'kg');
  const [availability, setAvailability] = useState<'in_stock' | 'pre_order' | 'coming_soon'>('in_stock');

  // Step 2 Photos
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>(
    initialDraft?.images?.length ? initialDraft.images : ['https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=1000']
  );
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');

  // Delivery & Price Info
  const [deliveryAvailable, setDeliveryAvailable] = useState<boolean>(true);
  const [deliveryTime, setDeliveryTime] = useState<string>('1 - 2 Days');
  const [deliveryType, setDeliveryType] = useState<string>('Live Transport / Freight');
  const [packaging, setPackaging] = useState<string>('Oxygenated Tank / Ventilated Container');

  // Land Specific & Pricing Strategy State
  const [listingPurpose, setListingPurpose] = useState<'sale' | 'rent' | 'lease'>('sale');
  const [pricingMode, setPricingMode] = useState<'fixed' | 'negotiable' | 'auction'>('fixed');
  const [landArea, setLandArea] = useState<string>('5');
  const [landAreaUnit, setLandAreaUnit] = useState<string>('Acres');
  const [waterSource, setWaterSource] = useState<string>('2 Deep Borewells + Canal Connection');
  const [soilType, setSoilType] = useState<string>('Rich Fertile Red Soil');
  const [roadAccess, setRoadAccess] = useState<string>('30ft Tar Road Connected');
  const [ownershipType, setOwnershipType] = useState<string>('Clear Title Deed / Patta Registered');

  const [price, setPrice] = useState<number>(initialDraft?.price || (initialDraft?.category === 'lands' ? 550000 : 120));
  const [priceUnit, setPriceUnit] = useState<string>(initialDraft?.unit || (initialDraft?.category === 'lands' ? 'Acre' : 'kg'));
  const [isNegotiable, setIsNegotiable] = useState<boolean>(initialDraft?.isNegotiable ?? true);

  // Location
  const [location, setLocation] = useState<string>(initialDraft?.location || 'Hebbal, Bengaluru');

  // State for AI processing / Submission
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [generatingAiDesc, setGeneratingAiDesc] = useState<boolean>(false);

  const selectedCategoryObj = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

  const handleCategorySelect = (catId: CategoryType) => {
    setCategory(catId);
    const catObj = CATEGORIES.find((c) => c.id === catId);
    if (catObj && catObj.subcategories.length > 0) {
      setSubcategory(catObj.subcategories[0]);
    }
    if (catId === 'lands') {
      setTitle('5 Acres Fertile Irrigated Agricultural Land');
      setPrice(550000);
      setPriceUnit('Acre');
    } else {
      setPrice(120);
      setPriceUnit('kg');
    }
    const presets = PRESET_PHOTOS[catId] || PRESET_PHOTOS.default;
    setSelectedPhotos([presets[0]]);
  };

  const handleAddPhoto = (url: string) => {
    if (!url) return;
    if (selectedPhotos.length < 10) {
      setSelectedPhotos([...selectedPhotos, url]);
      setCustomPhotoUrl('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setSelectedPhotos(selectedPhotos.filter((_, i) => i !== index));
  };

  const handleAiGenerateDesc = async () => {
    setGeneratingAiDesc(true);
    try {
      const generated = await generateOptimizedDescription(
        title || `${subcategory} Product`,
        category,
        subcategory,
        { weight: `${minWeight}-${maxWeight} ${weightUnit}`, location, waterType }
      );
      setDescription(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingAiDesc(false);
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newListingObj: Listing = {
        id: `listing-${Date.now()}`,
        title: title || `${subcategory} ${category === 'lands' ? 'Property' : 'Batch'}`,
        category,
        subcategory: showCustomBreedInput && customBreed ? customBreed : subcategory,
        description,
        sellerId: 'user-seller-current',
        sellerName: 'Bhuvan Gowda (Verified Seller)',
        sellerRole: 'Farmer',
        sellerVerified: true,
        sellerRating: 4.9,
        sellerExperience: 6,
        sellerPhone: '+91 98450 99887',
        price,
        unit: priceUnit,
        isNegotiable: pricingMode === 'negotiable',
        minOrderQuantity: category === 'lands' ? `1 ${priceUnit}` : `1 ${priceUnit}`,
        quantityAvailable: category === 'lands' ? `${landArea} ${landAreaUnit}` : `${quantity} ${quantityUnit}`,
        images: selectedPhotos.length > 0 ? selectedPhotos : (PRESET_PHOTOS[category] || PRESET_PHOTOS.default),
        location,
        pincode: '560024',
        distanceKm: 5,
        deliveryOptions: category === 'lands' ? ['Direct Possession'] : (deliveryAvailable ? [deliveryType] : ['Self Pickup']),
        availabilityDate: 'Immediate',
        leadTime: 'Immediate Inspection',
        certifications: category === 'lands' ? ['Encumbrance Certificate Clear', 'Verified Patta Title'] : ['Verified Product Quality', 'Mandi Compliant'],
        aiVerificationScore: 98,
        aiVerificationSummary: 'AI Audit 98/100: Title, land boundaries, photos, and price metrics verified.',
        status: 'pending_verification',
        badge: category === 'lands' ? (listingPurpose === 'sale' ? 'FOR SALE' : listingPurpose === 'rent' ? 'FOR RENT' : 'FOR LEASE') : 'VERIFIED',
        postedAgo: 'JUST NOW',
        specifications: category === 'lands' ? {
          'Listing Purpose': `For ${listingPurpose.toUpperCase()}`,
          'Land Area': `${landArea} ${landAreaUnit}`,
          'Pricing Mode': `${pricingMode.toUpperCase()} Price`,
          'Water Source': waterSource || 'Borewell Available',
          'Soil Type': soilType || 'Fertile Agriculture Soil',
          'Road Access': roadAccess || '30ft Road',
          'Deed Title': ownershipType || 'Clear Patta Title',
        } : {
          'Weight Range': `${minWeight} ${weightUnit} - ${maxWeight} ${weightUnit}`,
          'Type': waterType === 'fresh' ? 'Fresh Water / Premium' : 'Sea Water / Marine',
          'Availability': availability.replace('_', ' ').toUpperCase(),
          'Pricing Mode': `${pricingMode.toUpperCase()} Price`,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setIsSubmitting(false);
      setStep(5); // Move to publish success screen
      onComplete(newListingObj);
    }, 1200);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 sm:rounded-3xl shadow-2xl max-w-2xl mx-auto overflow-hidden my-0 sm:my-6 min-h-screen sm:min-h-0 flex flex-col">
      
      {/* Header Bar */}
      <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white leading-tight">
              {step === 5 ? 'Listing Published' : `List ${selectedCategoryObj.name}`}
            </h2>
            <p className="text-xs text-zinc-500 font-medium">
              {step === 5 ? 'Listing sent for verification' : category === 'lands' ? 'Enter land & pricing details' : 'Update your product details'}
            </p>
          </div>
        </div>

        {step < 5 && (
          <button
            onClick={onCancel}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800"
          >
            Save Draft
          </button>
        )}
      </div>

      {/* 4-Step Stepper Progress Bar */}
      {step < 5 && (
        <div className="px-5 py-4 bg-zinc-50/80 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-center justify-between relative max-w-md mx-auto">
            
            {/* Connecting Progress Line */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-0" />
            <div
              className="absolute top-4 left-6 h-0.5 bg-emerald-600 transition-all duration-300 -z-0"
              style={{
                width: step === 1 ? '0%' : step === 2 ? '33.3%' : step === 3 ? '66.6%' : '100%',
              }}
            />

            {/* Step 1 Circle */}
            <div className="flex flex-col items-center z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition ${
                  step >= 1
                    ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100 dark:ring-emerald-950'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                }`}
              >
                {step > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <span className={`text-[10px] font-bold mt-1.5 ${step === 1 ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-500'}`}>
                Details
              </span>
            </div>

            {/* Step 2 Circle */}
            <div className="flex flex-col items-center z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition ${
                  step >= 2
                    ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100 dark:ring-emerald-950'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                }`}
              >
                {step > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <span className={`text-[10px] font-bold mt-1.5 ${step === 2 ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-500'}`}>
                Set Pricing
              </span>
            </div>

            {/* Step 3 Circle */}
            <div className="flex flex-col items-center z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition ${
                  step >= 3
                    ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100 dark:ring-emerald-950'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                }`}
              >
                {step > 3 ? <Check className="w-4 h-4" /> : '3'}
              </div>
              <span className={`text-[10px] font-bold mt-1.5 ${step === 3 ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-500'}`}>
                Photos
              </span>
            </div>

            {/* Step 4 Circle */}
            <div className="flex flex-col items-center z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition ${
                  step >= 4
                    ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100 dark:ring-emerald-950'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                }`}
              >
                4
              </div>
              <span className={`text-[10px] font-bold mt-1.5 ${step === 4 ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-500'}`}>
                Review
              </span>
            </div>

          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white dark:bg-zinc-900">
        
        {/* ================= STEP 1: PRODUCT DETAILS ================= */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            
            {/* Top Info Banner Callout */}
            {showBanner && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl flex items-start justify-between space-x-3 text-xs">
                <div className="flex items-start space-x-2.5">
                  <div className="p-1 bg-emerald-100 dark:bg-emerald-900/60 rounded-lg text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-emerald-900 dark:text-emerald-200">
                      Provide accurate details
                    </h4>
                    <p className="text-emerald-700 dark:text-emerald-400 text-[11px] leading-relaxed mt-0.5">
                      Accurate information helps buyers find your product easily and increases deal conversions.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBanner(false)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Category Selector Chips */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                Select Category *
              </label>
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center space-x-1.5 transition ${
                      category === cat.id
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product / Property Title */}
            <div>
              <label className="block text-xs font-extrabold text-zinc-900 dark:text-zinc-100 mb-1.5">
                {category === 'lands' ? 'Property / Land Title *' : 'Product Name *'}
              </label>
              <input
                type="text"
                placeholder={category === 'lands' ? 'E.g., 5 Acres Fertile Organic Farm Land' : 'E.g., Rohu Fish (Live) / Sahiwal Cow'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/80 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 transition"
              />
            </div>

            {/* Land Specific Category Options */}
            {category === 'lands' ? (
              <div className="space-y-4 pt-1">
                {/* Purpose: Sale, Rent, Lease */}
                <div>
                  <label className="block text-xs font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">
                    Listing Purpose *
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setListingPurpose('sale');
                        setPriceUnit('Acre');
                        setPrice(550000);
                      }}
                      className={`py-3 px-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center justify-center space-y-1 transition ${
                        listingPurpose === 'sale'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      <Tag className="w-4 h-4" />
                      <span>For Sale</span>
                      <span className="text-[9px] font-normal opacity-80">Outright Purchase</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setListingPurpose('rent');
                        setPriceUnit('Month');
                        setPrice(12000);
                      }}
                      className={`py-3 px-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center justify-center space-y-1 transition ${
                        listingPurpose === 'rent'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      <Key className="w-4 h-4" />
                      <span>For Rent</span>
                      <span className="text-[9px] font-normal opacity-80">Monthly / Seasonal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setListingPurpose('lease');
                        setPriceUnit('Acre / Year');
                        setPrice(30000);
                      }}
                      className={`py-3 px-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center justify-center space-y-1 transition ${
                        listingPurpose === 'lease'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>For Lease</span>
                      <span className="text-[9px] font-normal opacity-80">Long-term Annual</span>
                    </button>
                  </div>
                </div>

                {/* Land Area Size & Unit */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-zinc-900 dark:text-zinc-100 mb-1.5">
                      Land Area Size *
                    </label>
                    <input
                      type="number"
                      value={landArea}
                      onChange={(e) => setLandArea(e.target.value)}
                      placeholder="E.g., 5"
                      className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/80 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-zinc-900 dark:text-zinc-100 mb-1.5">
                      Area Unit *
                    </label>
                    <select
                      value={landAreaUnit}
                      onChange={(e) => setLandAreaUnit(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/80 text-xs font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Acres">Acres</option>
                      <option value="Guntas">Guntas</option>
                      <option value="Bighas">Bighas</option>
                      <option value="Sq.Ft">Sq.Ft</option>
                      <option value="Hectares">Hectares</option>
                    </select>
                  </div>
                </div>

                {/* Land Type / Subcategory */}
                <div>
                  <label className="block text-xs font-extrabold text-zinc-900 dark:text-zinc-100 mb-1.5">
                    Land Usage Type *
                  </label>
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/80 text-xs font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Agricultural Land">Agricultural Land (Irrigated / Dry)</option>
                    <option value="Dairy Farms">Dairy Farm Plot</option>
                    <option value="Poultry Farms">Poultry Farm Plot</option>
                    <option value="Fish Farms">Aquaculture / Fish Farm Pond</option>
                    <option value="Orchards">Orchard / Plantation (Coconut, Mango, Areca)</option>
                    <option value="Commercial Land">Agri-Commercial Land</option>
                  </select>
                </div>

                {/* Water Source & Soil Specs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-zinc-900 dark:text-zinc-100 mb-1.5">
                      Water Source
                    </label>
                    <input
                      type="text"
                      value={waterSource}
                      onChange={(e) => setWaterSource(e.target.value)}
                      placeholder="E.g., 2 Borewells + Canal"
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/80 text-xs font-bold text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-zinc-900 dark:text-zinc-100 mb-1.5">
                      Soil Type
                    </label>
                    <input
                      type="text"
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      placeholder="E.g., Red Fertile Soil"
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/80 text-xs font-bold text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Road Access & Title */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-zinc-900 dark:text-zinc-100 mb-1.5">
                      Road Access
                    </label>
                    <input
                      type="text"
                      value={roadAccess}
                      onChange={(e) => setRoadAccess(e.target.value)}
                      placeholder="E.g., 30ft Tar Road"
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/80 text-xs font-bold text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold text-zinc-900 dark:text-zinc-100 mb-1.5">
                      Ownership Deed
                    </label>
                    <input
                      type="text"
                      value={ownershipType}
                      onChange={(e) => setOwnershipType(e.target.value)}
                      placeholder="E.g., Clear Patta Title"
                      className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/80 text-xs font-bold text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Subcategory / Breed for standard categories */}
                <div>
                  <label className="block text-xs font-extrabold text-zinc-900 dark:text-zinc-100 mb-1.5">
                    Breed / Type <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={subcategory}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setShowCustomBreedInput(true);
                        } else {
                          setSubcategory(e.target.value);
                          setShowCustomBreedInput(false);
                        }
                      }}
                      className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/80 text-xs font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 transition appearance-none"
                    >
                      {selectedCategoryObj.subcategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                      <option value="__custom__">+ Add Custom Breed</option>
                    </select>
                    <div className="absolute right-4 top-3.5 pointer-events-none text-zinc-400">
                      ▼
                    </div>
                  </div>

                  {showCustomBreedInput && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter custom breed name"
                        value={customBreed}
                        onChange={(e) => setCustomBreed(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-emerald-500 bg-white dark:bg-zinc-800 text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customBreed) {
                            setSubcategory(customBreed);
                            setShowCustomBreedInput(false);
                          }
                        }}
                        className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>

                {/* Weight / Metric Selection */}
                <div className="space-y-3 pt-1">
                  <label className="block text-xs font-extrabold text-zinc-900 dark:text-zinc-100">
                    Weight / Size Specs <span className="text-rose-500">*</span>
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-zinc-500">Min Weight</span>
                      <div className="flex mt-1">
                        <input
                          type="number"
                          value={minWeight}
                          onChange={(e) => setMinWeight(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-l-2xl border border-r-0 border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/80 text-xs font-bold text-zinc-900 dark:text-white"
                        />
                        <select
                          value={weightUnit}
                          onChange={(e) => setWeightUnit(e.target.value)}
                          className="px-2 py-2.5 rounded-r-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-xs font-bold"
                        >
                          <option value="gm">gm</option>
                          <option value="kg">kg</option>
                          <option value="Liters">Liters</option>
                          <option value="Tons">Tons</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-zinc-500">Max Weight</span>
                      <div className="flex mt-1">
                        <input
                          type="number"
                          value={maxWeight}
                          onChange={(e) => setMaxWeight(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-l-2xl border border-r-0 border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/80 text-xs font-bold text-zinc-900 dark:text-white"
                        />
                        <select
                          value={weightUnit}
                          onChange={(e) => setWeightUnit(e.target.value)}
                          className="px-2 py-2.5 rounded-r-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-xs font-bold"
                        >
                          <option value="gm">gm</option>
                          <option value="kg">kg</option>
                          <option value="Liters">Liters</option>
                          <option value="Tons">Tons</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quantity Available */}
                <div>
                  <label className="block text-xs font-extrabold text-zinc-900 dark:text-zinc-100 mb-1.5">
                    Quantity Available <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-4 py-3 rounded-l-2xl border border-r-0 border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/80 text-sm font-bold text-zinc-900 dark:text-white"
                    />
                    <select
                      value={quantityUnit}
                      onChange={(e) => setQuantityUnit(e.target.value)}
                      className="px-4 py-3 rounded-r-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-900 dark:text-white"
                    >
                      <option value="kg">kg</option>
                      <option value="Quintals">Quintals</option>
                      <option value="Tons">Tons</option>
                      <option value="Pieces">Pieces</option>
                      <option value="Heads">Heads</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Step 1 Submit Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center space-x-2"
              >
                <span>Next: Set Pricing</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </motion.div>
        )}

        {/* ================= STEP 2: SET YOUR PRICING ================= */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                Set Your Pricing
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Choose how you want to sell your {category === 'lands' ? 'farm land property' : 'produce'}. You can change this later.
              </p>
            </div>

            {/* 3 Pricing Mode Cards */}
            <div className="space-y-3">
              {/* Fixed */}
              <div
                onClick={() => setPricingMode('fixed')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-start justify-between ${
                  pricingMode === 'fixed'
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    pricingMode === 'fixed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
                  }`}>
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white">Fixed</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5">
                      Standard pricing. Buyers can purchase immediately at the price you set without negotiation.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 mt-1">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    pricingMode === 'fixed' ? 'border-emerald-600' : 'border-zinc-300 dark:border-zinc-600'
                  }`}>
                    {pricingMode === 'fixed' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                  </div>
                </div>
              </div>

              {/* Negotiable */}
              <div
                onClick={() => setPricingMode('negotiable')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-start justify-between ${
                  pricingMode === 'negotiable'
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    pricingMode === 'negotiable' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
                  }`}>
                    <Handshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white">Negotiable</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5">
                      Set a target price but allow buyers to make counter-offers. Ideal for bulk purchases.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 mt-1">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    pricingMode === 'negotiable' ? 'border-emerald-600' : 'border-zinc-300 dark:border-zinc-600'
                  }`}>
                    {pricingMode === 'negotiable' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                  </div>
                </div>
              </div>

              {/* Auction */}
              <div
                onClick={() => setPricingMode('auction')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-start justify-between ${
                  pricingMode === 'auction'
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    pricingMode === 'auction' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
                  }`}>
                    <Gavel className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white">Auction</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5">
                      Sell to the highest bidder. Set a starting price and a time limit for the listing.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 mt-1">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    pricingMode === 'auction' ? 'border-emerald-600' : 'border-zinc-300 dark:border-zinc-600'
                  }`}>
                    {pricingMode === 'auction' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Base Price Section */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-3">
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Base Price *
              </label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-3 text-lg font-black text-zinc-400">₹</span>
                  <input
                    type="number"
                    value={price || ''}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="0.00"
                    className="w-full pl-9 pr-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-lg font-black text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <select
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  className="px-4 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600"
                >
                  {category === 'lands' ? (
                    <>
                      <option value="Acre">per Acre</option>
                      <option value="Acre / Month">per Acre / Month</option>
                      <option value="Acre / Year">per Acre / Year</option>
                      <option value="Month">per Month</option>
                      <option value="Gunta">per Gunta</option>
                      <option value="Sq.Ft">per Sq.Ft</option>
                      <option value="Plot">per Plot</option>
                    </>
                  ) : (
                    <>
                      <option value="kg">per kg</option>
                      <option value="Quintal">per Quintal</option>
                      <option value="Ton">per Ton</option>
                      <option value="Piece">per Piece</option>
                      <option value="Head">per Head</option>
                    </>
                  )}
                </select>
              </div>

              <p className="text-xs text-zinc-500 font-medium flex items-center space-x-1.5 pt-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  Commonly listed at ₹{category === 'lands' ? (listingPurpose === 'rent' ? '8,000' : listingPurpose === 'lease' ? '25,000' : '5,50,000') : '12.50'} per {priceUnit} in your area.
                </span>
              </p>
            </div>

            {/* Market Insight Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900 to-zinc-900 text-white shadow-md relative overflow-hidden flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Market Insight</span>
                <h4 className="text-xs font-black text-white mt-0.5">Transparency builds buyer trust.</h4>
                <p className="text-[11px] text-zinc-300 leading-snug mt-0.5">
                  Listings with clear pricing receive up to 3x more WhatsApp inquiries and convert faster.
                </p>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-2xl hover:bg-zinc-200 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-2/3 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center space-x-2"
              >
                <span>Next: Add Photos</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 3: PHOTOS ================= */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                Product Photos <span className="text-rose-500">*</span>
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold">
                {selectedPhotos.length} / 10
              </span>
            </div>

            {/* Big Drag & Drop Photo Upload Zone */}
            <div className="p-8 border-2 border-dashed border-emerald-300 dark:border-emerald-800 rounded-3xl bg-emerald-50/30 dark:bg-emerald-950/20 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-zinc-900 dark:text-white">
                  Tap to upload photos <span className="font-normal text-zinc-500">or drag and drop</span>
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  JPG, PNG (Max 5MB each)
                </p>
              </div>

              {/* Custom Image URL Quick Add */}
              <div className="pt-2 max-w-md mx-auto flex gap-2">
                <input
                  type="url"
                  placeholder="Paste image URL or use presets below"
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleAddPhoto(customPhotoUrl)}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Photo Tips Box (Matching exact screenshot design) */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
              <h4 className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center space-x-1">
                <span>Photo Tips</span>
              </h4>
              <ul className="space-y-1.5 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                <li className="flex items-center space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Use clear, high-quality images</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Show actual product in good lighting</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Include different angles (close-up & batch view)</span>
                </li>
                <li className="flex items-center space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Maximum 10 photos allowed</span>
                </li>
              </ul>
            </div>

            {/* Presets Gallery */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Select Sample Farm Photos
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {(PRESET_PHOTOS[category] || PRESET_PHOTOS.default).map((photoUrl) => (
                  <button
                    key={photoUrl}
                    type="button"
                    onClick={() => handleAddPhoto(photoUrl)}
                    className="h-20 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 relative group hover:border-emerald-500 transition"
                  >
                    <img src={photoUrl} alt="Preset" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-extrabold">
                      + Add
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Uploaded Photos Section */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white">
                Uploaded Photos ({selectedPhotos.length})
              </h4>

              {selectedPhotos.length === 0 ? (
                <div className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-zinc-500">No photos added yet</p>
                  <p className="text-[11px] text-zinc-400">Add photos of your item to showcase your product better</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedPhotos.map((photo, index) => (
                    <div key={index} className="relative h-28 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-xs group">
                      <img src={photo} alt="Uploaded" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-1.5 right-1.5 p-1 bg-black/60 text-white rounded-full hover:bg-rose-600 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Navigation */}
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-2xl flex items-center justify-center space-x-1 hover:bg-zinc-100 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-2/3 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center space-x-1.5"
              >
                <span>Next: Review</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </motion.div>
        )}

        {/* ================= STEP 4: REVIEW ================= */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            
            {/* Header banner */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-zinc-900 dark:text-white">
                  Review Your {category === 'lands' ? 'Land Property' : 'Product'}
                </h3>
                <p className="text-xs text-zinc-500 font-medium">
                  Please review all details before publishing
                </p>
              </div>

              {selectedPhotos[0] && (
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0">
                  <img src={selectedPhotos[0]} alt="Thumb" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Card 1: Details */}
            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/60 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-700/60 pb-2">
                <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                  {category === 'lands' ? 'Property Specifications' : 'Product Details'}
                </h4>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              {category === 'lands' ? (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-bold">Property Title</span>
                    <span className="font-extrabold text-zinc-900 dark:text-white">{title}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-bold">Purpose</span>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] uppercase">
                      For {listingPurpose}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-bold">Land Area</span>
                    <span className="font-extrabold text-zinc-900 dark:text-white">{landArea} {landAreaUnit}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-bold">Land Type</span>
                    <span className="font-extrabold text-zinc-900 dark:text-white">{subcategory}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-bold">Water Source</span>
                    <span className="font-extrabold text-zinc-900 dark:text-white">{waterSource || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-bold">Soil Type</span>
                    <span className="font-extrabold text-zinc-900 dark:text-white">{soilType || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-bold">Road Access</span>
                    <span className="font-extrabold text-zinc-900 dark:text-white">{roadAccess || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-bold">Deed Title</span>
                    <span className="font-extrabold text-emerald-600">{ownershipType || 'Patta Verified'}</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-bold">Product Name</span>
                    <span className="font-extrabold text-zinc-900 dark:text-white">{title}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-bold">Breed / Type</span>
                    <span className="font-extrabold text-zinc-900 dark:text-white">{subcategory}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-bold">Weight Range</span>
                    <span className="font-extrabold text-zinc-900 dark:text-white">{minWeight} {weightUnit} – {maxWeight} {weightUnit}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-bold">Environment Type</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{waterType === 'fresh' ? 'Fresh Water' : 'Sea Water'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-bold">Quantity</span>
                    <span className="font-extrabold text-zinc-900 dark:text-white">{quantity} {quantityUnit}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-bold">Availability</span>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] capitalize">
                      {availability.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Description */}
            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/60 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-700/60 pb-2">
                <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                  Description *
                </h4>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleAiGenerateDesc}
                    disabled={generatingAiDesc}
                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{generatingAiDesc ? 'Generating...' : 'AI Enhance'}</span>
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed"
              />
              <div className="text-right text-[10px] text-zinc-400 font-mono">
                {description.length} / 1000
              </div>
            </div>

            {/* Card 3: Price & Mode Information */}
            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/60 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-700/60 pb-2">
                <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                  Price & Transaction Terms
                </h4>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 block font-bold">Asking Price</span>
                  <span className="text-base font-black text-emerald-600">₹{price.toLocaleString()} / {priceUnit}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block font-bold">Pricing Mode</span>
                  <span className="font-extrabold text-zinc-900 dark:text-white capitalize">{pricingMode} Pricing</span>
                </div>
              </div>
            </div>

            {/* Trust Notice Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-3 text-xs text-emerald-900 dark:text-emerald-200">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <p className="font-semibold text-[11px] leading-snug">
                All listings are reviewed before publishing to ensure quality and trust.
              </p>
            </div>

            {/* Bottom Action Bar */}
            <div className="pt-2 space-y-2">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-1/3 py-3.5 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-2xl flex items-center justify-center space-x-1 hover:bg-zinc-100 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="w-2/3 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-700/20 transition flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Submit for Review</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-[11px] text-zinc-400 font-medium">
                Our team will review and publish your property within 24 hours.
              </p>
            </div>

          </motion.div>
        )}

        {/* ================= STEP 5: PUBLISHED CONFIRMATION ================= */}
        {step === 5 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-xl ring-8 ring-emerald-50 dark:ring-emerald-950">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-sm mx-auto">
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">
                {category === 'lands' ? 'Land Property Submitted!' : 'Product Submitted for Review!'}
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                Your listing <strong>"{title}"</strong> has been queued for verification. It will be live on the marketplace within 24 hours.
              </p>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl max-w-sm mx-auto border border-zinc-200 dark:border-zinc-700 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400 font-bold">Category:</span>
                <span className="font-black text-zinc-900 dark:text-white">{selectedCategoryObj.name}</span>
              </div>
              {category === 'lands' && (
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-bold">Purpose:</span>
                  <span className="font-black uppercase text-emerald-600">For {listingPurpose}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-400 font-bold">Price:</span>
                <span className="font-black text-emerald-600">₹{price.toLocaleString()} / {priceUnit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 font-bold">Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-[10px]">
                  Pending Verification
                </span>
              </div>
            </div>

            <div className="pt-4 max-w-sm mx-auto">
              <button
                type="button"
                onClick={onCancel}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-2xl shadow-lg transition"
              >
                Back to Marketplace
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};
