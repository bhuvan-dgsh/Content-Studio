import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MoreVertical, Camera, CheckCircle2, MapPin, Edit3, Calendar,
  Star, ShoppingBag, Users, Plus, ExternalLink, FileText, Copy, Check,
  LayoutDashboard, Package, Heart, MessageSquare, CreditCard, User,
  Settings, Headphones, Gift, PhoneCall, Youtube, Facebook, Instagram,
  Linkedin, Twitter, Globe, Sparkles, X, ChevronRight, Map
} from 'lucide-react';

export const Profile: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copiedGst, setCopiedGst] = useState<boolean>(false);

  // User Profile Data
  const [userProfile, setUserProfile] = useState({
    name: 'Ramesh Yadav',
    role: 'Farmer & Agri Entrepreneur',
    location: 'Nashik, Maharashtra, India',
    memberSince: 'May 2022',
    rating: 4.8,
    reviewsCount: 128,
    totalOrders: 52,
    followers: '1.2K',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    banner: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
    
    // Social Links
    facebook: 'facebook.com/rameshyadav',
    instagram: 'instagram.com/rameshyadav',
    twitter: 'x.com/rameshyadav',
    linkedin: 'linkedin.com/in/rameshyadav',
    youtube: 'https://www.youtube.com/@rameshyadavfarming',
    youtubeBio: 'Sharing farming knowledge, tips and modern agriculture techniques.',

    // GST
    gstNumber: '27ABCDE1234F1Z5',
    tradeName: 'Yadav Agro Farms',
    businessType: 'Proprietorship',
    gstStatus: 'Verified',

    // Address
    primaryAddress: 'Yadav Agro Farms, At Post - Dindori, Tal. Dindori, Dist. Nashik, Maharashtra - 422202, India',
  });

  // Edit profile form state
  const [editForm, setEditForm] = useState({ ...userProfile });

  const handleCopyGst = () => {
    navigator.clipboard.writeText(userProfile.gstNumber);
    setCopiedGst(true);
    setTimeout(() => setCopiedGst(false), 2000);
  };

  const handleSaveProfile = () => {
    setUserProfile({ ...editForm });
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      
      {/* Top Mobile/Header Nav */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white">
            Customer Profile
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          <button className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Brand Card & Sidebar Nav */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm space-y-3">
            
            {/* Brand Header */}
            <div className="flex items-center space-x-2.5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-sm">
                🌱
              </div>
              <div>
                <h3 className="font-black text-sm text-zinc-900 dark:text-white leading-tight">
                  Farmora
                </h3>
                <p className="text-[10px] text-zinc-400 font-bold">
                  AI Powered Agriculture
                </p>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="space-y-1 font-bold text-xs">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, link: '/' },
                { id: 'orders', label: 'Orders', icon: Package, link: '/inquiries' },
                { id: 'wishlist', label: 'Wishlist', icon: Heart, link: '/' },
                { id: 'messages', label: 'Messages', icon: MessageSquare, link: '/inquiries' },
                { id: 'address', label: 'Address Book', icon: MapPin, action: () => {} },
                { id: 'payments', label: 'Payments', icon: CreditCard, action: () => {} },
                { id: 'profile', label: 'My Profile', icon: User, action: () => setActiveTab('profile') },
                { id: 'seller_hub', label: 'Seller Hub', icon: Sparkles, link: '/seller-hub' },
                { id: 'settings', label: 'Settings', icon: Settings, action: () => {} },
                { id: 'help', label: 'Help & Support', icon: Headphones, action: () => {} },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id || (item.id === 'profile' && activeTab === 'profile');

                if (item.link) {
                  return (
                    <Link
                      key={item.id}
                      to={item.link}
                      className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl transition ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-black'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-zinc-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (item.action) item.action();
                    }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-left transition ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-black'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Refer & Earn Banner Widget */}
          <div className="p-4 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
            <div>
              <h4 className="text-xs font-black text-emerald-950 dark:text-emerald-200 flex items-center space-x-1">
                <Gift className="w-4 h-4 text-emerald-600" />
                <span>Refer & Earn</span>
              </h4>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-400 mt-1 leading-relaxed">
                Invite your friends and earn exciting rewards on every transaction.
              </p>
            </div>
            
            <div className="w-full h-24 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-3 flex items-center justify-between text-white overflow-hidden relative shadow-inner">
              <div className="space-y-1 z-10">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  Bonus ₹500
                </span>
                <p className="text-xs font-black leading-tight">
                  Share Farmora app
                </p>
              </div>
              <div className="text-4xl z-10">🎁</div>
            </div>

            <button className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-2xl shadow-md transition">
              Invite Now
            </button>
          </div>

          {/* Need Help Widget */}
          <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-extrabold text-zinc-900 dark:text-white">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>Need Help?</span>
            </div>
            <p className="text-[11px] text-zinc-500">Chat with us anytime</p>
            <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              +91 98765 43210
            </p>
          </div>

        </div>

        {/* ================= RIGHT MAIN PROFILE CONTENT ================= */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* USER HERO CARD */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            
            {/* Banner Background */}
            <div className="h-36 sm:h-48 w-full relative overflow-hidden bg-emerald-900">
              <img
                src={userProfile.banner}
                alt="Banner"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Profile Content Container */}
            <div className="px-5 pb-5 pt-0 relative">
              
              {/* Avatar & Edit Profile Button Row */}
              <div className="flex items-end justify-between -mt-14 sm:-mt-16 mb-4">
                
                {/* Avatar with Camera Icon */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden shadow-xl bg-zinc-100">
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute bottom-1 right-1 p-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition"
                    title="Change Photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-extrabold text-xs rounded-2xl shadow-xs hover:bg-zinc-50 transition flex items-center space-x-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Name & Title */}
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                    {userProfile.name}
                  </h2>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950 shrink-0" />
                </div>
                <p className="text-xs sm:text-sm font-extrabold text-zinc-600 dark:text-zinc-400">
                  {userProfile.role}
                </p>
                <div className="flex items-center space-x-1 text-xs text-zinc-500 font-medium pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{userProfile.location}</span>
                </div>
              </div>

              {/* Stats Row Below Hero */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-zinc-100 dark:border-zinc-800/80">
                
                <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40">
                  <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold block">Member Since</span>
                    <span className="text-xs font-black text-zinc-900 dark:text-white">{userProfile.memberSince}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40">
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                    <Star className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold block">Rating</span>
                    <span className="text-xs font-black text-zinc-900 dark:text-white">{userProfile.rating} ({userProfile.reviewsCount} Reviews)</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40">
                  <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold block">Total Orders</span>
                    <span className="text-xs font-black text-zinc-900 dark:text-white">{userProfile.totalOrders}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40">
                  <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold block">Followers</span>
                    <span className="text-xs font-black text-zinc-900 dark:text-white">{userProfile.followers}</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* SECTION 1: SOCIAL MEDIA LINKS */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center space-x-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Social Media Links</span>
              </h3>
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Link</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Facebook */}
              <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-2 hover:border-emerald-300 transition group">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    f
                  </div>
                  <a
                    href={`https://${userProfile.facebook}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-400 group-hover:text-emerald-600 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div>
                  <h4 className="text-xs font-black text-zinc-900 dark:text-white">Facebook</h4>
                  <p className="text-[11px] text-zinc-500 font-mono truncate">{userProfile.facebook}</p>
                </div>
              </div>

              {/* Instagram */}
              <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-2 hover:border-emerald-300 transition group">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <a
                    href={`https://${userProfile.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-400 group-hover:text-emerald-600 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div>
                  <h4 className="text-xs font-black text-zinc-900 dark:text-white">Instagram</h4>
                  <p className="text-[11px] text-zinc-500 font-mono truncate">{userProfile.instagram}</p>
                </div>
              </div>

              {/* X (Twitter) */}
              <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-2 hover:border-emerald-300 transition group">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-xs">
                    𝕏
                  </div>
                  <a
                    href={`https://${userProfile.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-400 group-hover:text-emerald-600 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div>
                  <h4 className="text-xs font-black text-zinc-900 dark:text-white">X (Twitter)</h4>
                  <p className="text-[11px] text-zinc-500 font-mono truncate">{userProfile.twitter}</p>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-2 hover:border-emerald-300 transition group">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-sky-700 text-white flex items-center justify-center font-bold text-xs">
                    in
                  </div>
                  <a
                    href={`https://${userProfile.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-400 group-hover:text-emerald-600 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div>
                  <h4 className="text-xs font-black text-zinc-900 dark:text-white">LinkedIn</h4>
                  <p className="text-[11px] text-zinc-500 font-mono truncate">{userProfile.linkedin}</p>
                </div>
              </div>

            </div>

          </div>

          {/* SECTION 2: YOUTUBE CHANNEL / VIDEO */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-3">
            
            <div className="flex items-center space-x-2">
              <Youtube className="w-5 h-5 text-rose-600" />
              <h3 className="text-sm font-black text-zinc-900 dark:text-white">
                YouTube Channel / Video
              </h3>
            </div>

            <div className="p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 truncate">
                {userProfile.youtube}
              </span>
              <a
                href={userProfile.youtube}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 text-zinc-400 hover:text-emerald-600 transition"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <p className="text-xs text-zinc-500 font-medium pl-1">
              {userProfile.youtubeBio}
            </p>

          </div>

          {/* SECTION 3: GST DETAILS */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-3">
            
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-black text-zinc-900 dark:text-white">
                GST Details
              </h3>
            </div>

            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* GST Number */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-zinc-400 block">GST Number</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-black text-zinc-900 dark:text-white">
                    {userProfile.gstNumber}
                  </span>
                  <button
                    onClick={handleCopyGst}
                    className="p-1 text-zinc-400 hover:text-emerald-600 transition"
                    title="Copy GST Number"
                  >
                    {copiedGst ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Trade Name */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-zinc-400 block">Trade Name</span>
                <span className="text-xs font-extrabold text-zinc-900 dark:text-white">
                  {userProfile.tradeName}
                </span>
              </div>

              {/* Business Type */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-zinc-400 block">Business Type</span>
                <span className="text-xs font-extrabold text-zinc-900 dark:text-white">
                  {userProfile.businessType}
                </span>
              </div>

              {/* GST Status */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-zinc-400 block">GST Status</span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{userProfile.gstStatus}</span>
                </span>
              </div>

            </div>

          </div>

          {/* SECTION 4: ADDRESS DETAILS */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Address Details</span>
              </h3>
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
              
              <div className="sm:col-span-8 space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-[10px]">
                  Primary Address
                </span>
                <p className="text-xs font-extrabold text-zinc-900 dark:text-white leading-relaxed">
                  {userProfile.primaryAddress}
                </p>
                <button className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1 pt-1">
                  <Star className="w-3 h-3" />
                  <span>Set as Default</span>
                </button>
              </div>

              {/* Map Preview Image */}
              <div className="sm:col-span-4 h-28 rounded-2xl overflow-hidden relative border border-zinc-200 dark:border-zinc-700">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600"
                  alt="Map Location"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg animate-bounce">
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* SECTION 5: BOTTOM METRICS BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm text-center">
            
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40">
              <div className="text-xl font-black text-zinc-900 dark:text-white flex items-center justify-center space-x-1">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>{userProfile.totalOrders}</span>
              </div>
              <span className="text-[11px] font-bold text-zinc-400 mt-0.5 block">Total Orders</span>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40">
              <div className="text-xl font-black text-zinc-900 dark:text-white flex items-center justify-center space-x-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{userProfile.rating}</span>
              </div>
              <span className="text-[11px] font-bold text-zinc-400 mt-0.5 block">Rating</span>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40">
              <div className="text-xl font-black text-zinc-900 dark:text-white flex items-center justify-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>2+ Years</span>
              </div>
              <span className="text-[11px] font-bold text-zinc-400 mt-0.5 block">On Farmora</span>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40">
              <div className="text-xl font-black text-zinc-900 dark:text-white flex items-center justify-center space-x-1">
                <Users className="w-4 h-4 text-teal-600" />
                <span>{userProfile.followers}</span>
              </div>
              <span className="text-[11px] font-bold text-zinc-400 mt-0.5 block">Followers</span>
            </div>

          </div>

        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-base font-black text-zinc-900 dark:text-white">
                Edit Customer Profile
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-zinc-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">Role / Designation</label>
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">GST Number</label>
                <input
                  type="text"
                  value={editForm.gstNumber}
                  onChange={(e) => setEditForm({ ...editForm, gstNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">Trade Name</label>
                <input
                  type="text"
                  value={editForm.tradeName}
                  onChange={(e) => setEditForm({ ...editForm, tradeName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">Primary Address</label>
                <textarea
                  rows={2}
                  value={editForm.primaryAddress}
                  onChange={(e) => setEditForm({ ...editForm, primaryAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">YouTube Link</label>
                <input
                  type="url"
                  value={editForm.youtube}
                  onChange={(e) => setEditForm({ ...editForm, youtube: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-1/2 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="w-1/2 py-2.5 bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
