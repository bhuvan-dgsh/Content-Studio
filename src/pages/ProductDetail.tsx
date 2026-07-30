import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft, Heart, Share2, ShieldCheck, MapPin, CheckCircle2, MessageSquare,
  Phone, Sparkles, Check, Play, Award, Clock, TrendingUp, Zap, Disc, Sliders, Settings
} from 'lucide-react';
import { Listing, ActionType } from '../types';
import { CategoryActionModal } from '../components/CategoryActionModal';

interface ProductDetailProps {
  listings: Listing[];
  onAddInquiry: (inquiryData: any) => Promise<void>;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ listings, onAddInquiry }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const listing = listings.find((l) => l.id === id) || listings[0];

  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [showPriceTrend, setShowPriceTrend] = useState<boolean>(false);
  
  // Action Modal State
  const [activeModalAction, setActiveModalAction] = useState<ActionType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  if (!listing) {
    return (
      <div className="p-12 text-center text-zinc-500">
        Listing not found. <Link to="/" className="text-emerald-600 underline">Return home</Link>
      </div>
    );
  }

  const isEquipment = listing.category === 'equipment';
  const isCattle = listing.category === 'cattle';

  const galleryImages = listing.images?.length > 0 ? listing.images : [
    'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=1000',
  ];

  const currentPhoto = galleryImages[activePhotoIndex] || galleryImages[0];

  const handleOpenAction = (action: ActionType) => {
    setActiveModalAction(action);
    setIsModalOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">
      
      {/* 1. Header Bar (Dark Green matching screenshot 3) */}
      <div className="bg-emerald-900 text-white px-4 py-3.5 sticky top-0 z-40 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-full hover:bg-emerald-800 transition text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base sm:text-lg font-black tracking-wide">
            {isEquipment ? 'Farm Equipment Details' : isCattle ? 'Cattle Information Details' : 'Product Details'}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 rounded-full hover:bg-emerald-800 transition"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-emerald-800 transition relative"
          >
            <Share2 className="w-5 h-5 text-white" />
            {copiedShare && (
              <span className="absolute -bottom-7 right-0 text-[10px] bg-black text-white px-2 py-0.5 rounded shadow">
                Copied!
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-5">
        
        {/* 2. Main Gallery Hero & Thumbnails */}
        <div className="space-y-3">
          
          {/* Main Hero Image Frame */}
          <div className="relative h-72 sm:h-96 w-full bg-zinc-900 overflow-hidden shadow-md">
            <img
              src={currentPhoto}
              alt={listing.title}
              className="w-full h-full object-cover"
            />

            {/* Gallery Image Counter Badge Overlay (top right / bottom right as in screenshot) */}
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full font-mono">
              {activePhotoIndex + 1}/{galleryImages.length}
            </div>

            {/* Verified Listing Badge Overlay (top left) */}
            <div className="absolute top-3 left-3 bg-emerald-950/90 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-xs font-extrabold px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verified Listing</span>
            </div>
          </div>

          {/* Thumbnail Strip (With Video Thumb Indicator at the end) */}
          <div className="px-4 flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`w-16 h-16 rounded-2xl overflow-hidden border-2 shrink-0 transition relative ${
                  activePhotoIndex === idx
                    ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                    : 'border-zinc-200 dark:border-zinc-800 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                {idx === galleryImages.length - 1 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                    <Play className="w-4 h-4 fill-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

        </div>

        {/* 3. Title, Subtitle, Certified Badge, Price, Quick Action Buttons */}
        <div className="px-4 space-y-3">
          
          {/* Title + Certified Badge */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                {listing.title}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black flex items-center space-x-1 border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Certified</span>
              </span>
            </div>

            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {isEquipment
                ? `${listing.specifications?.['Horsepower'] || '55 HP'} • 4WD • ${listing.specifications?.['Model Year'] || '2021'} Model • Excellent Condition`
                : 'Healthy • 3rd Lactation • 15 Days Pregnant'}
            </p>
          </div>

          {/* Price & Quick Action Buttons (Matching Screenshot 3) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-emerald-800 dark:text-emerald-400">
                  ₹{listing.price.toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => setShowPriceTrend(!showPriceTrend)}
                  className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1 hover:bg-emerald-100 transition"
                >
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  <span>View Price Trend</span>
                </button>
              </div>

              <div className="flex items-center space-x-1 text-xs text-zinc-500 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{listing.location} • {listing.distanceKm || 15} km away</span>
              </div>
            </div>

            {/* Quick Action Buttons (WhatsApp / Call Seller) */}
            <div className="flex items-center space-x-2">
              <a
                href={`https://wa.me/${(listing.sellerPhone || '919814012345').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${listing.sellerName}, I am interested in your listing "${listing.title}" on Farmora.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center space-x-1.5 shadow-md transition"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white text-white" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`tel:${listing.sellerPhone}`}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs flex items-center space-x-1.5 shadow-md transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Seller</span>
              </a>
            </div>

          </div>

          {/* Price Trend Expandable Widget */}
          {showPriceTrend && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs">
              <h4 className="font-black text-emerald-950 dark:text-emerald-200 flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Fair Market Price Benchmark</span>
              </h4>
              <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
                Market average for <strong>{listing.title}</strong> is ₹7,50,000 – ₹8,20,000. Listed price ₹{listing.price.toLocaleString('en-IN')} is <strong>Fair & Competitive</strong> for 2021 model with 510 working hours.
              </p>
            </div>
          )}

          {/* 4. Four Stat Grid Boxes */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {isEquipment ? (
              <>
                <div className="p-3 rounded-2xl bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold block">Year</span>
                  <span className="text-xs font-black text-zinc-900 dark:text-white mt-0.5 block">
                    {listing.specifications?.['Model Year'] || '2021'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold block">Engine Power</span>
                  <span className="text-xs font-black text-zinc-900 dark:text-white mt-0.5 block">
                    {listing.specifications?.['Horsepower'] || '55 HP'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold block">Drive Type</span>
                  <span className="text-xs font-black text-zinc-900 dark:text-white mt-0.5 block">
                    {listing.specifications?.['Drive Type'] || '4WD'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold block">Working Hours</span>
                  <span className="text-xs font-black text-zinc-900 dark:text-white mt-0.5 block">
                    {listing.specifications?.['Working Hours'] || '510 hrs'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 rounded-2xl bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold block">Age</span>
                  <span className="text-xs font-black text-zinc-900 dark:text-white mt-0.5 block">
                    5 Years
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold block">Milk Yield</span>
                  <span className="text-xs font-black text-zinc-900 dark:text-white mt-0.5 block">
                    12–15 L/day
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold block">Breed</span>
                  <span className="text-xs font-black text-zinc-900 dark:text-white mt-0.5 block">
                    {listing.subcategory || 'Gir'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                  <span className="text-[10px] text-zinc-400 font-bold block">Weight</span>
                  <span className="text-xs font-black text-zinc-900 dark:text-white mt-0.5 block">
                    450 Kg
                  </span>
                </div>
              </>
            )}
          </div>

        </div>

        {/* 5. Equipment / Cattle Information Table Section */}
        <div className="px-4 space-y-3 pt-2">
          
          <h3 className="text-sm font-black text-zinc-900 dark:text-white">
            {isEquipment ? 'Equipment Information' : isCattle ? 'Cattle Information' : 'Product Information'}
          </h3>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800/80 overflow-hidden text-xs">
            
            {isEquipment ? (
              <>
                <div className="p-3.5 flex justify-between">
                  <span className="text-zinc-500 font-bold">Brand</span>
                  <span className="font-extrabold text-zinc-900 dark:text-white">John Deere</span>
                </div>

                <div className="p-3.5 flex justify-between">
                  <span className="text-zinc-500 font-bold">Model</span>
                  <span className="font-extrabold text-zinc-900 dark:text-white">5310</span>
                </div>

                <div className="p-3.5 flex justify-between">
                  <span className="text-zinc-500 font-bold">HP Category</span>
                  <span className="font-extrabold text-zinc-900 dark:text-white">55 HP</span>
                </div>

                <div className="p-3.5 flex justify-between">
                  <span className="text-zinc-500 font-bold">No. of Cylinders</span>
                  <span className="font-extrabold text-zinc-900 dark:text-white">3</span>
                </div>

                <div className="p-3.5 flex justify-between">
                  <span className="text-zinc-500 font-bold">Transmission</span>
                  <span className="font-extrabold text-zinc-900 dark:text-white">Collar Shift</span>
                </div>

                <div className="p-3.5 flex justify-between">
                  <span className="text-zinc-500 font-bold">Fuel Type</span>
                  <span className="font-extrabold text-zinc-900 dark:text-white">Diesel</span>
                </div>

                <div className="p-3.5 flex justify-between">
                  <span className="text-zinc-500 font-bold">Gear Box</span>
                  <span className="font-extrabold text-zinc-900 dark:text-white">12F + 4R</span>
                </div>

                <div className="p-3.5 flex justify-between">
                  <span className="text-zinc-500 font-bold">Lifting Capacity</span>
                  <span className="font-extrabold text-zinc-900 dark:text-white">2000 kg</span>
                </div>

                <div className="p-3.5 flex justify-between">
                  <span className="text-zinc-500 font-bold">Warranty</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">1 Year</span>
                </div>

                <div className="p-3.5 flex justify-between">
                  <span className="text-zinc-500 font-bold">Condition</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Excellent</span>
                </div>
              </>
            ) : (
              <>
                <div className="p-3.5 flex justify-between">
                  <span className="text-zinc-500 font-bold">Animal ID</span>
                  <span className="font-mono font-black text-zinc-900 dark:text-white">FMRA-CT-2024-5687</span>
                </div>

                <div className="p-3.5 flex justify-between">
                  <span className="text-zinc-500 font-bold">Gender</span>
                  <span className="font-extrabold text-zinc-900 dark:text-white">Female</span>
                </div>

                <div className="p-3.5 flex justify-between">
                  <span className="text-zinc-500 font-bold">Lactation</span>
                  <span className="font-extrabold text-zinc-900 dark:text-white">3rd Lactation</span>
                </div>

                <div className="p-3.5 flex justify-between">
                  <span className="text-zinc-500 font-bold">Health Status</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Healthy</span>
                </div>
              </>
            )}

          </div>

        </div>

        {/* 6. Feature Pills Row (Power Steering, Oil Immersed Brakes, Adjustable Seats, Dual Clutch) */}
        {isEquipment && (
          <div className="px-4 space-y-2 pt-1">
            <h3 className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider">
              Key Features & Specs
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Power Steering</span>
              </span>

              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center space-x-1.5">
                <Disc className="w-3.5 h-3.5 text-emerald-600" />
                <span>Oil Immersed Brakes</span>
              </span>

              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                <span>Adjustable Seats</span>
              </span>

              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center space-x-1.5">
                <Settings className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dual Clutch</span>
              </span>
            </div>
          </div>
        )}

        {/* 7. Seller Information Card (Matching Screenshot 3 bottom section) */}
        <div className="px-4 space-y-2 pt-2">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white">
            Seller Information
          </h3>

          <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                {listing.sellerName ? listing.sellerName.charAt(0) : 'K'}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white">
                    {listing.sellerName || 'Kamal Agro Traders'}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold flex items-center space-x-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified Seller</span>
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  ★ {listing.sellerRating || 4.7} (128 Reviews)
                </p>
              </div>
            </div>

            <button
              onClick={() => handleOpenAction(isEquipment ? 'contact_dealer' : isCattle ? 'chat_seller' : 'chat_farmer')}
              className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 font-extrabold text-xs transition shrink-0"
            >
              View Seller Profile
            </button>
          </div>
        </div>

        {/* 8. Seller Description */}
        <div className="px-4 space-y-2 pt-1">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white">
            Detailed Description
          </h3>
          <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {listing.description}
          </div>
        </div>

      </div>

      {/* 9. Bottom Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 p-3 shadow-2xl">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          
          <a
            href={`https://wa.me/${(listing.sellerPhone || '919814012345').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${listing.sellerName}, I am interested in your listing "${listing.title}" on Farmora.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl flex items-center justify-center space-x-1.5 shadow-md transition"
          >
            <MessageSquare className="w-4 h-4 fill-white text-white" />
            <span>WhatsApp</span>
          </a>

          <a
            href={`tel:${listing.sellerPhone}`}
            className="flex-1 py-3 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-black text-xs rounded-2xl flex items-center justify-center space-x-1.5 hover:bg-zinc-100 transition"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Call</span>
          </a>

          <button
            onClick={() => handleOpenAction(isEquipment ? 'request_quote' : isCattle ? 'make_offer' : 'negotiate_price')}
            className="flex-2 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center space-x-1"
          >
            <span>Make Offer</span>
          </button>

        </div>
      </div>

      {/* Category Action Modal */}
      {isModalOpen && activeModalAction && (
        <CategoryActionModal
          actionType={activeModalAction}
          listing={listing}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmitInquiry={onAddInquiry}
        />
      )}

    </div>
  );
};
