export type CategoryType =
  | 'cattle'
  | 'poultry'
  | 'fisheries'
  | 'pets'
  | 'crops'
  | 'equipment'
  | 'lands'
  | 'agri_shops'
  | 'veterinary'
  | 'labour'
  | 'farm_loans'
  | 'seeds'
  | 'dairy'
  | 'fertilizer';

export type VerificationStatus = 'draft' | 'pending_verification' | 'admin_review' | 'approved' | 'rejected';

export interface SellerProfile {
  uid: string;
  displayName: string;
  email: string;
  role: 'farmer' | 'dealer' | 'business' | 'admin';
  isVerified: boolean;
  yearsExperience: number;
  location: string;
  phone: string;
  rating: number;
  reviewCount: number;
  certifications: string[];
  photoURL?: string;
}

export interface SpecificationItem {
  key: string;
  value: string;
}

export interface Listing {
  id: string;
  title: string;
  category: CategoryType;
  subcategory: string;
  description: string;
  sellerId: string;
  sellerName: string;
  sellerRole: 'Farmer' | 'Dealer' | 'Verified Business';
  sellerVerified: boolean;
  sellerRating: number;
  sellerExperience: number;
  sellerPhone?: string;
  price: number;
  unit: string;
  isNegotiable: boolean;
  minOrderQuantity: string;
  quantityAvailable: string;
  images: string[];
  videoUrl?: string;
  location: string;
  pincode: string;
  distanceKm: number;
  deliveryOptions: string[];
  availabilityDate: string;
  leadTime: string;
  certifications: string[];
  aiVerificationScore: number;
  aiVerificationSummary: string;
  status: VerificationStatus;
  rejectionReason?: string;
  mspPrice?: number;
  specifications: Record<string, string>;
  badge?: 'FEATURED' | 'ELITE' | 'VERIFIED' | 'ORGANIC' | 'POPULAR' | 'HOT DEAL' | 'CERTIFIED' | 'NEW' | 'BEST SELLER';
  postedAgo?: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ActionType =
  | 'inquiry'
  | 'buy_now'
  // Crops
  | 'chat_farmer'
  | 'negotiate_price'
  | 'place_bulk_order'
  | 'request_sample'
  | 'book_transport'
  // Cattle
  | 'chat_seller'
  | 'call_seller'
  | 'schedule_farm_visit'
  | 'request_health_certificate'
  | 'make_offer'
  // Fisheries
  | 'request_live_video'
  | 'book_delivery'
  | 'reserve_stock'
  // Equipment
  | 'contact_dealer'
  | 'request_quote'
  | 'calculate_emi'
  | 'schedule_demo'
  | 'rent_equipment'
  | 'buy_equipment'
  // Lands
  | 'contact_owner'
  | 'schedule_site_visit'
  | 'request_documents';

export interface ActionInquiry {
  id: string;
  listingId: string;
  listingTitle: string;
  category: CategoryType;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  actionType: ActionType;
  actionLabel: string;
  details: {
    proposedPrice?: number;
    quantity?: string;
    preferredDate?: string;
    preferredTime?: string;
    deliveryAddress?: string;
    message?: string;
    loanTenureMonths?: number;
    rentalDays?: number;
  };
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  buyerName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedTransaction: boolean;
  userRole: string;
}

export interface PriceTrendData {
  month: string;
  marketMsp: number;
  farmoraAvg: number;
}
