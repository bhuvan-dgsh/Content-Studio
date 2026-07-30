import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CategoriesModal } from './components/CategoriesModal';
import { Marketplace } from './pages/Marketplace';
import { ProductDetail } from './pages/ProductDetail';
import { SellerHub } from './pages/SellerHub';
import { InquiriesHub } from './pages/InquiriesHub';
import { AdminVerification } from './pages/AdminVerification';
import { Profile } from './pages/Profile';
import { CategoryDetail } from './pages/CategoryDetail';
import { Community } from './pages/Community';
import { ListingWizard } from './components/ListingWizard';
import { INITIAL_MOCK_LISTINGS } from './data/mockListings';
import { Listing, ActionInquiry, CategoryType } from './types';

export function AppContent() {
  const [currentLocation, setCurrentLocation] = useState<string>('Hebbal, Bengaluru');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState<boolean>(false);
  const [listings, setListings] = useState<Listing[]>(INITIAL_MOCK_LISTINGS);
  const [inquiries, setInquiries] = useState<ActionInquiry[]>([
    {
      id: 'inq-001',
      listingId: 'rec-001',
      listingTitle: 'MURRAH BUFFALO — PREMIUM BREED',
      category: 'cattle',
      sellerId: 'farmer-gurpreet-1',
      sellerName: 'Gurpreet Singh Dairy',
      buyerId: 'user-current',
      buyerName: 'Bhuvan Gowda',
      buyerPhone: '+91 98450 99887',
      actionType: 'make_offer',
      actionLabel: 'Make Offer / Counter Price',
      details: {
        proposedPrice: 82000,
        quantity: '1 Head',
        message: 'Offer ₹82,000 with immediate truck pick up from Ludhiana farm.',
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [wizardDraft, setWizardDraft] = useState<Partial<Listing> | undefined>(undefined);

  const handleOpenWizard = (draft?: Partial<Listing>) => {
    setWizardDraft(draft);
    setIsWizardOpen(true);
  };

  const handleCloseWizard = () => {
    setIsWizardOpen(false);
    setWizardDraft(undefined);
  };

  const handleWizardComplete = (newListing: Listing) => {
    setListings((prev) => [newListing, ...prev]);
    setIsWizardOpen(false);
    setWizardDraft(undefined);
  };

  const handleAddInquiry = async (inquiryData: any) => {
    const newInquiry: ActionInquiry = {
      id: `inq-${Date.now()}`,
      ...inquiryData,
      buyerId: 'user-current',
      buyerName: 'Bhuvan Gowda',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  const handleApproveListing = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'approved' } : l))
    );
  };

  const handleRejectListing = (id: string, reason: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: 'rejected', rejectionReason: reason } : l
      )
    );
  };

  const handleResubmitListing = (id: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: 'pending_verification',
              aiVerificationScore: 96,
              aiVerificationSummary:
                'Re-audited: Updated certificate documentation provided by seller.',
            }
          : l
      )
    );
  };

  const handleSeedPendingListing = () => {
    const pendingItem: Listing = {
      id: `pending-demo-${Date.now()}`,
      title: 'Fresh Organic Alphonso Mangoes (Ratnagiri Export Quality Batch)',
      category: 'crops',
      subcategory: 'Vegetables & Fruits',
      description: 'Hand-harvested naturally ripened Alphonso mangoes. No carbide, GI tag certified from Ratnagiri orchard.',
      sellerId: 'farmer-mango-9',
      sellerName: 'Venkatesh Sawant (Ratnagiri Orchards)',
      sellerRole: 'Farmer',
      sellerVerified: true,
      sellerRating: 4.9,
      sellerExperience: 20,
      sellerPhone: '+91 98220 11223',
      price: 1200,
      unit: 'Quintal',
      isNegotiable: true,
      minOrderQuantity: '5 Crates',
      quantityAvailable: '120 Crates',
      images: [
        'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=1000',
      ],
      location: 'Ratnagiri, Maharashtra',
      pincode: '415612',
      distanceKm: 85,
      deliveryOptions: ['Temperature Controlled Freight', 'Farm Pickup'],
      availabilityDate: 'Immediate',
      leadTime: '24 Hours',
      certifications: ['GI Tag Certified Ratnagiri Alphonso', 'Organic India Certified'],
      aiVerificationScore: 94,
      aiVerificationSummary: 'AI Audit 94/100: GI Tag documentation matched with Maharashtra Agriculture Board.',
      status: 'pending_verification',
      badge: 'FEATURED',
      postedAgo: 'JUST NOW',
      specifications: {
        'Ripening Process': '100% Natural Grass Ripened',
        'Average Size': '220 - 250 grams per fruit',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setListings((prev) => [pendingItem, ...prev]);
  };

  const pendingAdminCount = listings.filter(
    (l) => l.status === 'pending_verification' || l.status === 'admin_review'
  ).length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans pb-16">
      <Header
        onOpenWizard={() => handleOpenWizard()}
        pendingAdminCount={pendingAdminCount}
        currentLocation={currentLocation}
        onSelectLocation={setCurrentLocation}
      />

      <main className="flex-1">
        {isWizardOpen ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ListingWizard
              onComplete={handleWizardComplete}
              onCancel={handleCloseWizard}
              initialDraft={wizardDraft}
            />
          </div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <Marketplace
                  listings={listings}
                  onOpenWizard={() => handleOpenWizard()}
                  onAddInquiry={handleAddInquiry}
                  onOpenCategoriesModal={() => setIsCategoriesModalOpen(true)}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={(cat) => {
                    setSelectedCategory(cat);
                    setSelectedSubcategory('all');
                  }}
                  selectedSubcategory={selectedSubcategory}
                  setSelectedSubcategory={setSelectedSubcategory}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
              }
            />
            <Route
              path="/listing/:id"
              element={
                <ProductDetail
                  listings={listings}
                  onAddInquiry={handleAddInquiry}
                />
              }
            />
            <Route
              path="/category/:categoryId"
              element={<CategoryDetail listings={listings} onOpenSellWizard={handleOpenWizard} />}
            />
            <Route
              path="/seller-hub"
              element={
                <SellerHub
                  listings={listings}
                  onOpenWizard={handleOpenWizard}
                  onResubmitListing={handleResubmitListing}
                />
              }
            />
            <Route
              path="/inquiries"
              element={<InquiriesHub inquiries={inquiries} />}
            />
            <Route
              path="/community"
              element={<Community />}
            />
            <Route
              path="/profile"
              element={<Profile />}
            />
            <Route
              path="/admin"
              element={
                <AdminVerification
                  listings={listings}
                  onApproveListing={handleApproveListing}
                  onRejectListing={handleRejectListing}
                  onSeedPendingListing={handleSeedPendingListing}
                />
              }
            />
          </Routes>
        )}
      </main>

      {/* Categories Drawer / Modal */}
      <CategoriesModal
        isOpen={isCategoriesModalOpen}
        initialCategory={selectedCategory}
        onClose={() => setIsCategoriesModalOpen(false)}
        onApplyCategoryFilter={(catId, sub, sortVal) => {
          setSelectedCategory(catId as any);
          if (sub) {
            setSelectedSubcategory(sub);
          } else {
            setSelectedSubcategory('all');
          }
          if (sortVal) {
            setSortBy(sortVal);
          } else {
            setSortBy('default');
          }
        }}
      />

      {/* Floating Bottom Nav */}
      <BottomNav
        onOpenWizard={() => handleOpenWizard()}
        onOpenCategories={() => setIsCategoriesModalOpen(true)}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-8 text-xs text-zinc-500 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-zinc-900 dark:text-white">
              Farmora Verified Agriculture Marketplace
            </p>
            <p className="mt-0.5 text-zinc-500">
              Connecting farmers, dealers, and verified agricultural businesses directly.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
