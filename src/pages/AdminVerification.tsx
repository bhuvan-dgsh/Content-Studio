import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert, CheckCircle2, XCircle, Sparkles, MapPin, Tag,
  FileText, ShieldCheck, Eye, RefreshCw
} from 'lucide-react';
import { Listing } from '../types';

interface AdminVerificationProps {
  listings: Listing[];
  onApproveListing: (id: string) => void;
  onRejectListing: (id: string, reason: string) => void;
  onSeedPendingListing: () => void;
}

export const AdminVerification: React.FC<AdminVerificationProps> = ({
  listings,
  onApproveListing,
  onRejectListing,
  onSeedPendingListing,
}) => {
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const pendingListings = listings.filter(
    (l) => l.status === 'pending_verification' || l.status === 'admin_review'
  );

  const handleConfirmReject = (id: string) => {
    if (!rejectionReason.trim()) {
      alert('Please enter a rejection reason for the seller.');
      return;
    }
    onRejectListing(id, rejectionReason);
    setRejectingId(null);
    setRejectionReason('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Banner */}
      <div className="p-6 bg-gradient-to-r from-amber-900 via-amber-800 to-zinc-900 text-white rounded-3xl border border-amber-700/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-amber-500/20 border border-amber-400/30 text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Admin Review Panel (bhuvangowdan71@gmail.com)</span>
          </div>
          <h1 className="text-2xl font-black">
            Verification Queue ({pendingListings.length} Pending)
          </h1>
          <p className="text-xs text-amber-100/80 mt-1">
            Review submitted listings, verify photo authenticity, APMC market price alignment, and grant public approval.
          </p>
        </div>

        <button
          onClick={onSeedPendingListing}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-md"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Simulate New Pending Submission</span>
        </button>
      </div>

      {/* Queue List */}
      {pendingListings.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            Verification Queue is Clean!
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            All submitted listings have been audited and verified. You can simulate a new submission using the button above.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingListings.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm space-y-5"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {item.category === 'crops' ? '🌾' : item.category === 'cattle' ? '🐄' : item.category === 'fisheries' ? '🐟' : item.category === 'equipment' ? '🚜' : '🏞️'}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Submitted by: <strong>{item.sellerName}</strong> ({item.sellerRole}) • Location: {item.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-extrabold uppercase tracking-wider">
                    Pending Verification
                  </span>
                </div>
              </div>

              {/* Body Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                {/* Photo & Specs */}
                <div className="lg:col-span-4 space-y-3">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-44 object-cover rounded-2xl border border-zinc-200 dark:border-zinc-800"
                  />
                  <div className="flex justify-between font-bold text-sm text-emerald-600">
                    <span>Ask Price: ₹{item.price}/{item.unit}</span>
                    <span>Qty: {item.quantityAvailable}</span>
                  </div>
                </div>

                {/* AI Audit & Documents */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="p-4 bg-emerald-950 text-white rounded-2xl border border-emerald-500/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center space-x-1">
                        <Sparkles className="w-4 h-4" />
                        <span>AI Audit Score: {item.aiVerificationScore}/100</span>
                      </span>
                      <span className="text-[10px] text-emerald-300 bg-emerald-900 px-2 py-0.5 rounded">
                        Automated Heuristic Passed
                      </span>
                    </div>
                    <p className="text-xs text-emerald-100 leading-relaxed">
                      {item.aiVerificationSummary}
                    </p>
                  </div>

                  {/* Certifications & Specs */}
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-2">
                    <span className="font-bold text-zinc-700 dark:text-zinc-300 block">
                      Attached Lab / Govt Certifications:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {item.certifications.map((c) => (
                        <span key={c} className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-semibold">
                          ✓ {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  Ref ID: <code>{item.id}</code>
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => setRejectingId(rejectingId === item.id ? null : item.id)}
                    className="px-4 py-2 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-bold text-xs rounded-xl flex items-center space-x-1 transition"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject / Request Edits</span>
                  </button>

                  <button
                    onClick={() => onApproveListing(item.id)}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Make Public</span>
                  </button>
                </div>
              </div>

              {/* Rejection input box */}
              {rejectingId === item.id && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 rounded-2xl space-y-3">
                  <label className="block text-xs font-bold text-rose-900 dark:text-rose-200">
                    Specify Rejection / Revision Reason for Seller
                  </label>
                  <textarea
                    rows={2}
                    placeholder="E.g., Please re-upload clearer photos of cattle ear tag / attach Soil Health Card..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-zinc-800 text-xs"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setRejectingId(null)}
                      className="px-3 py-1.5 text-xs text-zinc-600 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleConfirmReject(item.id)}
                      className="px-4 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-lg"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
