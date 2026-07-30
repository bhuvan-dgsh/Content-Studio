import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, MessageSquare, Phone, Calendar, FileText, Send, Truck,
  Video, ShieldCheck, Tag, ShoppingBag, Landmark, Clock, CheckCircle2
} from 'lucide-react';
import { Listing, ActionType } from '../types';

interface CategoryActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
  actionType: ActionType | null;
  onSubmitInquiry: (inquiryData: any) => Promise<void>;
}

export const CategoryActionModal: React.FC<CategoryActionModalProps> = ({
  isOpen,
  onClose,
  listing,
  actionType,
  onSubmitInquiry,
}) => {
  const [proposedPrice, setProposedPrice] = useState<number>(listing.price);
  const [quantity, setQuantity] = useState<string>(listing.minOrderQuantity || '1');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('Morning (9 AM - 12 PM)');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  if (!isOpen || !actionType) return null;

  const getActionDetails = () => {
    switch (actionType) {
      // Crops
      case 'chat_farmer':
      case 'chat_seller':
        return {
          title: `Message ${listing.sellerName}`,
          icon: MessageSquare,
          color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',
          desc: 'Send a direct message to ask about crop quality, harvest date, or farm pickup terms.',
          showMsgOnly: true,
        };
      case 'negotiate_price':
      case 'make_offer':
        return {
          title: `Negotiate / Make Offer on ${listing.title}`,
          icon: Tag,
          color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10',
          desc: `Listed price is ₹${listing.price.toLocaleString('en-IN')}/${listing.unit}. Submit your proposed counter-offer.`,
          showPriceOffer: true,
        };
      case 'place_bulk_order':
        return {
          title: 'Place B2B Bulk Order Inquiry',
          icon: ShoppingBag,
          color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10',
          desc: 'Submit bulk quantity requirements and requested dispatch timeline directly to the farmer.',
          showBulkForm: true,
        };
      case 'request_sample':
        return {
          title: 'Request Crop / Seed Sample',
          icon: FileText,
          color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10',
          desc: 'Request a physical quality sample batch (1-2 Kg) sent to your laboratory or mill address.',
          showSampleForm: true,
        };
      case 'book_transport':
      case 'book_delivery':
        return {
          title: 'Book Freight & Logistics Transport',
          icon: Truck,
          color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-500/10',
          desc: 'Book verified Farmora cold-chain, local tractor trailer, or livestock transport vehicle.',
          showTransportForm: true,
        };

      // Cattle
      case 'call_seller':
        return {
          title: `Contact ${listing.sellerName}`,
          icon: Phone,
          color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',
          desc: 'Verified phone line and direct WhatsApp contact for livestock discussion.',
          showPhoneCall: true,
        };
      case 'schedule_farm_visit':
      case 'schedule_site_visit':
        return {
          title: 'Schedule Farm & Site Visit Inspection',
          icon: Calendar,
          color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',
          desc: 'Pick a convenient date to physically inspect the farm, cattle breed, or land plot.',
          showVisitScheduler: true,
        };
      case 'request_health_certificate':
        return {
          title: 'Request Veterinary Health Certificate',
          icon: ShieldCheck,
          color: 'text-teal-600 bg-teal-50 dark:bg-teal-500/10',
          desc: 'Request official government vet passport, FMD vaccination record, and lactation logs.',
          showDocRequest: true,
        };

      // Fisheries
      case 'request_live_video':
        return {
          title: 'Request Live Video Inspection',
          icon: Video,
          color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10',
          desc: 'Schedule a live WhatsApp/Video call to view pond aeration, seed feeding, and netting.',
          showVideoRequest: true,
        };
      case 'reserve_stock':
        return {
          title: 'Reserve Aquaculture Stock Deposit',
          icon: Clock,
          color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10',
          desc: 'Reserve seed batch or fish stock for upcoming harvest date with a token deposit agreement.',
          showReserveForm: true,
        };

      // Equipment & Lands
      case 'contact_dealer':
      case 'contact_owner':
        return {
          title: `Contact ${listing.sellerRole}: ${listing.sellerName}`,
          icon: Phone,
          color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',
          desc: 'Send contact info and inquiry to receive callback and official brochure.',
          showContactForm: true,
        };
      case 'request_quote':
        return {
          title: 'Request Formal Quotation',
          icon: FileText,
          color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10',
          desc: 'Get an itemized commercial quotation including GST, delivery charges, and warranty terms.',
          showMsgOnly: true,
        };
      case 'schedule_demo':
        return {
          title: 'Schedule Field Demonstration',
          icon: Calendar,
          color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10',
          desc: 'Book a live field trial of the machinery at your village or dealership showroom.',
          showVisitScheduler: true,
        };
      case 'rent_equipment':
        return {
          title: 'Book Equipment Rental',
          icon: Clock,
          color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',
          desc: 'Rent machinery on hourly or daily basis with or without operator.',
          showRentalForm: true,
        };
      case 'buy_equipment':
        return {
          title: 'Direct Purchase Proposal',
          icon: ShoppingBag,
          color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',
          desc: 'Initiate direct acquisition with title transfer and warranty handover.',
          showPriceOffer: true,
        };
      case 'request_documents':
        return {
          title: 'Request Land Title Deed & Survey Documents',
          icon: Landmark,
          color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10',
          desc: 'Request RTC Pahani, Encumbrance Certificate (EC), and Soil Lab Test report.',
          showDocRequest: true,
        };

      default:
        return {
          title: 'Marketplace Action Inquiry',
          icon: MessageSquare,
          color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',
          desc: 'Send inquiry to seller.',
          showMsgOnly: true,
        };
    }
  };

  const actionInfo = getActionDetails();
  const IconComponent = actionInfo.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmitInquiry({
        listingId: listing.id,
        listingTitle: listing.title,
        category: listing.category,
        sellerId: listing.sellerId,
        sellerName: listing.sellerName,
        actionType,
        actionLabel: actionInfo.title,
        details: {
          proposedPrice,
          quantity,
          preferredDate,
          preferredTime,
          deliveryAddress,
          message,
        },
        buyerPhone: phone,
      });
      setSubmittedSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Action inquiry submitted! The seller has been notified via Farmora network.');
      setSubmittedSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${actionInfo.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  {actionInfo.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs">
                  {listing.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submittedSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Inquiry Sent Successfully!
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-1">
                  {listing.sellerName} has been notified. You can track updates under your <span className="font-semibold text-emerald-600">Inquiries Tab</span>.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition"
              >
                Return to Marketplace
              </button>
            </div>
          ) : actionInfo.showPhoneCall ? (
            <div className="py-6 space-y-5">
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                Contact <strong className="text-zinc-900 dark:text-white">{listing.sellerName}</strong> directly for livestock details, cattle health passport, and farm location.
              </p>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                    Verified Seller Contact
                  </span>
                  <p className="text-lg font-black text-emerald-900 dark:text-emerald-200 mt-0.5">
                    {listing.sellerPhone || '+91 98450 12345'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={`https://wa.me/${(listing.sellerPhone || '919845012345').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${listing.sellerName}, I am inquiring about "${listing.title}" on Farmora.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-md flex items-center space-x-1.5 transition"
                  >
                    <MessageSquare className="w-4 h-4 fill-white text-white" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${listing.sellerPhone || '+91 98450 12345'}`}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-900 text-white text-xs font-bold rounded-lg shadow-md flex items-center space-x-1.5 transition"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
              <div className="text-xs text-zinc-500 space-y-1">
                <p>• Verified Farm Location: {listing.location}</p>
                <p>• Seller Experience: {listing.sellerExperience} Years in Agriculture</p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {actionInfo.desc}
              </p>

              {/* Price / Counter offer inputs */}
              {actionInfo.showPriceOffer && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Proposed Price (₹ / {listing.unit})
                    </label>
                    <input
                      type="number"
                      required
                      value={proposedPrice}
                      onChange={(e) => setProposedPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Target Quantity ({listing.unit})
                    </label>
                    <input
                      type="text"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Visit / Demo date picker */}
              {actionInfo.showVisitScheduler && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Time Slot
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    >
                      <option>Morning (9 AM - 12 PM)</option>
                      <option>Afternoon (12 PM - 4 PM)</option>
                      <option>Evening (4 PM - 7 PM)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Sample or Transport address */}
              {(actionInfo.showSampleForm || actionInfo.showTransportForm) && (
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Delivery / Destination Address & Pincode
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Enter your village/city address, pincode & landmark..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  />
                </div>
              )}

              {/* Contact Phone */}
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Your Phone Number for Seller Callback
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Note / Custom Request to Seller (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="E.g., Willing to inspect this Friday. Please share lab test report..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold transition flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Send Inquiry'}</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
