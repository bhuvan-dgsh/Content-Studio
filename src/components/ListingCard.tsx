import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ShieldCheck, MapPin, Star, Sparkles, MessageSquare, Tag, Phone,
  Calendar, FileText, Calculator, Video, Eye, Heart
} from 'lucide-react';
import { Listing, CategoryType, ActionType } from '../types';

interface ListingCardProps {
  listing: Listing;
  onOpenActionModal?: (action: ActionType, listing: Listing) => void;
  onOpenEmiModal?: (price: number, title: string) => void;
  isOwnerView?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onOpenActionModal,
  onOpenEmiModal,
  isOwnerView = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(listing.isFavorite || false);

  const getCategoryIcon = (category: CategoryType) => {
    switch (category) {
      case 'crops': return '🌾';
      case 'cattle': return '🐄';
      case 'fisheries': return '🐟';
      case 'equipment': return '🚜';
      case 'lands': return '🏞️';
      case 'seeds': return '🌱';
      case 'poultry': return '🐔';
      case 'dairy': return '🥛';
      case 'fertilizer': return '🧪';
      default: return '🚜';
    }
  };

  const getWhatsAppUrl = () => {
    const cleanPhone = (listing.sellerPhone || '919814012345').replace(/\D/g, '');
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(`Hi ${listing.sellerName}, I am interested in your listing "${listing.title}" on Farmora.`)}`;
  };

  const getPrimaryActionButtons = (): { label: string; action: ActionType; icon: any; color: string }[] => {
    switch (listing.category) {
      case 'crops':
        return [
          { label: 'WhatsApp', action: 'chat_farmer', icon: MessageSquare, color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
          { label: 'Negotiate', action: 'negotiate_price', icon: Tag, color: 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700' },
        ];
      case 'cattle':
        return [
          { label: 'WhatsApp', action: 'chat_seller', icon: MessageSquare, color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
          { label: 'Call Seller', action: 'call_seller', icon: Phone, color: 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700' },
        ];
      case 'fisheries':
        return [
          { label: 'WhatsApp', action: 'chat_seller', icon: MessageSquare, color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
          { label: 'Live Video', action: 'request_live_video', icon: Video, color: 'bg-indigo-600 hover:bg-indigo-700 text-white' },
        ];
      case 'equipment':
        return [
          { label: 'WhatsApp', action: 'contact_dealer', icon: MessageSquare, color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
          { label: 'Request Quote', action: 'request_quote', icon: FileText, color: 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700' },
        ];
      case 'lands':
        return [
          { label: 'WhatsApp', action: 'contact_owner', icon: MessageSquare, color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
          { label: 'Schedule Visit', action: 'schedule_site_visit', icon: Calendar, color: 'bg-amber-600 hover:bg-amber-700 text-white' },
        ];
      default:
        return [
          { label: 'WhatsApp', action: 'chat_seller', icon: MessageSquare, color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
          { label: 'Call Seller', action: 'call_seller', icon: Phone, color: 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700' },
        ];
    }
  };

  const actions = getPrimaryActionButtons();

  const specValues = listing.specifications
    ? Object.values(listing.specifications).slice(0, 3).join(' • ')
    : '';

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Image Banner Container */}
        <div className="relative h-52 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <img
            src={listing.images[0] || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800'}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Top Overlay Badges */}
          <div className="absolute top-3 left-3 flex items-center space-x-1.5 flex-wrap gap-y-1">
            {listing.badge === 'FEATURED' && (
              <span className="bg-amber-400 text-amber-950 font-black text-[10px] px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow">
                FEATURED
              </span>
            )}
            {listing.badge === 'ELITE' && (
              <span className="bg-blue-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow">
                ELITE
              </span>
            )}
            <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center space-x-1">
              <span>{getCategoryIcon(listing.category)}</span>
              <span className="capitalize">{listing.subcategory}</span>
            </span>
          </div>

          {/* Favorite Heart Button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:text-rose-600 shadow transition"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>

          {/* Floating Call Button on image bottom right */}
          <button
            onClick={() => onOpenActionModal && onOpenActionModal('call_seller', listing)}
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:bg-emerald-700 transition"
            title="Quick Call Seller"
          >
            <Phone className="w-4 h-4" />
          </button>

          {/* AI Score Badge bottom left */}
          <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 px-2 py-0.5 rounded-md text-[10px] font-bold">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>AI Audit {listing.aiVerificationScore}%</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2.5">
          {/* Price & Unit */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-extrabold text-zinc-900 dark:text-white">
                ₹ {listing.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-zinc-500 font-medium">
                / {listing.unit}
              </span>
            </div>

            {/* Equipment EMI Trigger */}
            {listing.category === 'equipment' && onOpenEmiModal && (
              <button
                onClick={() => onOpenEmiModal(listing.price, listing.title)}
                className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition flex items-center space-x-1"
              >
                <Calculator className="w-3 h-3" />
                <span>Calc EMI</span>
              </button>
            )}
          </div>

          {/* Title */}
          <Link
            to={`/listing/${listing.id}`}
            className="block group"
          >
            <h3 className="text-sm font-black text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-1 uppercase tracking-tight transition-colors">
              {listing.title}
            </h3>
          </Link>

          {/* Specification Attributes */}
          {specValues && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium truncate">
              {specValues}
            </p>
          )}

          {/* Location & Time Stamp */}
          <div className="flex items-center space-x-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider pt-1 border-t border-zinc-100 dark:border-zinc-800">
            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">{listing.location}</span>
            <span>•</span>
            <span className="shrink-0">{listing.postedAgo || 'TODAY'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="p-4 pt-0 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {actions.map((act) => {
            const Icon = act.icon;
            if (act.label === 'WhatsApp') {
              return (
                <a
                  key={act.action}
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition ${act.color}`}
                >
                  <Icon className="w-3.5 h-3.5 fill-white text-white" />
                  <span>WhatsApp</span>
                </a>
              );
            }
            return (
              <button
                key={act.action}
                onClick={() => onOpenActionModal && onOpenActionModal(act.action, listing)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition ${act.color}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Details Link */}
        <Link
          to={`/listing/${listing.id}`}
          className="w-full py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-[11px] font-bold flex items-center justify-center space-x-1 transition"
        >
          <Eye className="w-3 h-3" />
          <span>View Detailed Trust Profile</span>
        </Link>
      </div>
    </motion.div>
  );
};
