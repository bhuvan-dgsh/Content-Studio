import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck, Clock, CheckCircle2, AlertCircle, PlusCircle,
  FileEdit, RefreshCw, Sparkles, Trash2, Tag, ChevronRight
} from 'lucide-react';
import { Listing, VerificationStatus } from '../types';
import { ListingCard } from '../components/ListingCard';

interface SellerHubProps {
  listings: Listing[];
  onOpenWizard: (draft?: Partial<Listing>) => void;
  onResubmitListing: (id: string) => void;
}

export const SellerHub: React.FC<SellerHubProps> = ({
  listings,
  onOpenWizard,
  onResubmitListing,
}) => {
  const [activeTab, setActiveTab] = useState<VerificationStatus | 'all'>('all');

  const sellerListings = listings; // show user listings

  const filtered = sellerListings.filter((l) => {
    if (activeTab === 'all') return true;
    return l.status === activeTab;
  });

  const getTabCount = (status: VerificationStatus | 'all') => {
    if (status === 'all') return sellerListings.length;
    return sellerListings.filter((l) => l.status === status).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Seller Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            BG
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white">
                Bhuvan Gowda's Seller Hub
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                Verified Farmer
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Manage listings, check AI verification status, and resubmit rejected items.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenWizard()}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Item</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All Listings' },
          { id: 'approved', label: 'Approved & Public' },
          { id: 'pending_verification', label: 'Pending Verification' },
          { id: 'admin_review', label: 'Admin Review' },
          { id: 'rejected', label: 'Needs Revision / Rejected' },
          { id: 'draft', label: 'Drafts' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const count = getTabCount(tab.id as any);
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border flex items-center space-x-2 ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-emerald-400'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                isActive ? 'bg-emerald-700 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Listing Cards List */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <Clock className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            No listings found in status "{activeTab}"
          </h3>
          <button
            onClick={() => onOpenWizard()}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
          >
            Create New Listing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="space-y-3">
              <ListingCard listing={item} isOwnerView={true} />

              {/* Status & Action Footer */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-xs space-y-2">
                {item.status === 'pending_verification' && (
                  <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 font-semibold">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>In AI & Admin Verification Queue (Est. 1-2 hours)</span>
                  </div>
                )}

                {item.status === 'approved' && (
                  <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                    <span className="flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Public & Live on Marketplace</span>
                    </span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded font-bold">
                      AI Score: {item.aiVerificationScore}%
                    </span>
                  </div>
                )}

                {item.status === 'rejected' && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1.5 text-rose-600 dark:text-rose-400 font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Revision Required by Admin</span>
                    </div>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800">
                      Reason: {item.rejectionReason || 'Please upload official Soil Health Card / Veterinary Certificate to confirm quality.'}
                    </p>
                    <button
                      onClick={() => onResubmitListing(item.id)}
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition flex items-center justify-center space-x-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Edit & Resubmit to Queue</span>
                    </button>
                  </div>
                )}

                {item.status === 'draft' && (
                  <button
                    onClick={() => onOpenWizard(item)}
                    className="w-full py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-1"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Resume Wizard</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
