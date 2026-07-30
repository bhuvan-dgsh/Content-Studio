import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Clock, CheckCircle2, User, MapPin, Tag, Truck, Calendar, Phone } from 'lucide-react';
import { ActionInquiry } from '../types';

interface InquiriesHubProps {
  inquiries: ActionInquiry[];
}

export const InquiriesHub: React.FC<InquiriesHubProps> = ({ inquiries }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white">
              My Action Inquiries & Negotiations
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Track direct buyer-seller messages, price counter-offers, sample requests, and farm visit schedules.
            </p>
          </div>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <MessageSquare className="w-8 h-8 text-zinc-400 mx-auto" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            No active inquiries yet
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Browse listings on the marketplace and click "WhatsApp", "Negotiate Price", or "Request Sample" to start a direct inquiry.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <motion.div
              key={inq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-extrabold capitalize">
                    {inq.actionLabel}
                  </span>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    {inq.listingTitle}
                  </h3>
                </div>

                <span className="text-[11px] text-zinc-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-600 dark:text-zinc-300">
                <div className="space-y-1">
                  <p>• <strong>Seller:</strong> {inq.sellerName}</p>
                  <p>• <strong>Buyer Phone:</strong> {inq.buyerPhone}</p>
                  {inq.details.proposedPrice && (
                    <p className="text-emerald-600 font-bold">
                      • Proposed Counter Offer: ₹{inq.details.proposedPrice} ({inq.details.quantity || 'Bulk'})
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  {inq.details.preferredDate && (
                    <p>• <strong>Scheduled Visit:</strong> {inq.details.preferredDate} ({inq.details.preferredTime})</p>
                  )}
                  {inq.details.deliveryAddress && (
                    <p>• <strong>Sample / Transport Address:</strong> {inq.details.deliveryAddress}</p>
                  )}
                  {inq.details.message && (
                    <p className="italic text-zinc-500 bg-zinc-50 dark:bg-zinc-800/60 p-2 rounded-lg">
                      "{inq.details.message}"
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
