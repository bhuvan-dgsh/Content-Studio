import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, CheckCircle2, Heart, MessageSquare, Share2, Plus, Filter,
  Tractor, Sprout, Building2, Package, FileText, Landmark, X,
  Sparkles, Send, ShieldCheck, CloudRain, Users, ArrowLeft
} from 'lucide-react';

interface Post {
  id: string;
  authorName: string;
  authorLocation: string;
  authorVerified: boolean;
  authorAvatar: string;
  timeAgo: string;
  category: 'Tips' | 'Harvest' | 'Livestock' | 'Weather' | 'Equipment';
  content: string;
  image?: string;
  likes: number;
  commentsCount: number;
  isLiked?: boolean;
  comments?: { id: string; author: string; text: string; timeAgo: string }[];
}

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    authorName: 'Rajesh Kumar',
    authorLocation: 'Ludhiana, Punjab',
    authorVerified: true,
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    timeAgo: '2h ago',
    category: 'Harvest',
    content: 'Wheat crop looking strong this season! Used organic compost + drip irrigation. Yield expected around 18 quintals per acre. Happy to share my schedule with anyone starting Rabi prep.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000',
    likes: 48,
    commentsCount: 18,
    isLiked: false,
    comments: [
      { id: 'c1', author: 'Gurpreet Singh', text: 'Which organic compost brand did you use brother?', timeAgo: '1h ago' },
      { id: 'c2', author: 'Rajesh Kumar', text: 'Used local Vermicompost mixed with neem cake.', timeAgo: '45m ago' },
    ],
  },
  {
    id: 'post-2',
    authorName: 'Priya Sharma',
    authorLocation: 'Nashik, Maharashtra',
    authorVerified: false,
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    timeAgo: '5h ago',
    category: 'Tips',
    content: 'Anyone facing leaf curl on tomato plants after recent rains? Tried neem spray twice but problem persists. Looking for organic solutions only.',
    likes: 23,
    commentsCount: 19,
    isLiked: false,
    comments: [
      { id: 'c3', author: 'Anand Patil', text: 'Try sour buttermilk spray mixed with copper sulphate (10g/L). Works very well for fungal leaf curl.', timeAgo: '3h ago' },
    ],
  },
  {
    id: 'post-3',
    authorName: 'Amar Singh',
    authorLocation: 'Meerut, UP',
    authorVerified: true,
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    timeAgo: '8h ago',
    category: 'Livestock',
    content: 'Murrah buffalo calved last night — healthy female calf! 8.5L milk average this week. DM if you want breeding tips for high-yield dairy setup.',
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=1000',
    likes: 91,
    commentsCount: 27,
    isLiked: false,
    comments: [
      { id: 'c4', author: 'Ramesh Yadav', text: 'Congratulations! What feed mix do you give during peak lactation?', timeAgo: '6h ago' },
    ],
  },
  {
    id: 'post-4',
    authorName: 'Farmora Weather Desk',
    authorLocation: 'Pan-India',
    authorVerified: true,
    authorAvatar: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=200',
    timeAgo: 'Today',
    category: 'Weather',
    content: '⚠️ Heavy rainfall alert for Vidarbha & Marathwada in the next 48 hours. Delay urea top-dressing and ensure field drainage channels are clear.',
    likes: 142,
    commentsCount: 34,
    isLiked: false,
    comments: [
      { id: 'c5', author: 'Suresh More', text: 'Thanks for the timely update! Saved our standing soybean crop.', timeAgo: '2h ago' },
    ],
  },
];

const GOVERNMENT_SCHEMES = [
  {
    title: 'PM-KISAN Samman Nidhi',
    desc: 'Direct income support of ₹6,000/year to landholding farmer families.',
    benefit: '₹2,000 per trimester',
    link: 'https://pmkisan.gov.in',
  },
  {
    title: 'PM Fasal Bima Yojana (PMFBY)',
    desc: 'Crop insurance cover against natural risks with low premium rates.',
    benefit: '1.5% - 2% Premium Cover',
    link: 'https://pmfby.gov.in',
  },
  {
    title: 'Kisan Credit Card (KCC) Scheme',
    desc: 'Subsidized institutional credit for agriculture & allied needs up to ₹3 Lakhs.',
    benefit: '4% Effective Interest Rate',
    link: 'https://agricoop.nic.in',
  },
  {
    title: 'PM-KUSUM Solar Pump Subsidy',
    desc: 'Up to 60% government subsidy for installing solar powered irrigation pumps.',
    benefit: '60% Subsidy',
    link: 'https://pmkusum.mnre.gov.in',
  },
];

export const Community: React.FC = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showSchemesModal, setShowSchemesModal] = useState<boolean>(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState<boolean>(false);
  
  // Comments modal state
  const [activePostForComments, setActivePostForComments] = useState<Post | null>(null);
  const [newCommentText, setNewCommentText] = useState<string>('');

  // Create post state
  const [newPostContent, setNewPostContent] = useState<string>('');
  const [newPostCategory, setNewPostCategory] = useState<'Tips' | 'Harvest' | 'Livestock' | 'Weather' | 'Equipment'>('Harvest');
  const [newPostImageUrl, setNewPostImageUrl] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleShare = (post: Post) => {
    navigator.clipboard.writeText(window.location.href);
    showToast(`Copied post by ${post.authorName} to clipboard!`);
  };

  const handleAddComment = () => {
    if (!newCommentText.trim() || !activePostForComments) return;

    const newC = {
      id: `comment-${Date.now()}`,
      author: 'Bhuvan Gowda',
      text: newCommentText.trim(),
      timeAgo: 'Just now',
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === activePostForComments.id) {
          const updatedComments = [...(p.comments || []), newC];
          return {
            ...p,
            comments: updatedComments,
            commentsCount: p.commentsCount + 1,
          };
        }
        return p;
      })
    );

    setActivePostForComments((prev) =>
      prev
        ? {
            ...prev,
            comments: [...(prev.comments || []), newC],
            commentsCount: prev.commentsCount + 1,
          }
        : null
    );

    setNewCommentText('');
    showToast('Comment added!');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorName: 'Bhuvan Gowda',
      authorLocation: 'Bengaluru, Karnataka',
      authorVerified: true,
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      timeAgo: 'Just now',
      category: newPostCategory,
      content: newPostContent.trim(),
      image: newPostImageUrl.trim() || undefined,
      likes: 1,
      commentsCount: 0,
      isLiked: true,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostImageUrl('');
    setShowCreatePostModal(false);
    showToast('Your post has been published to the Farmer Community!');
  };

  const filteredPosts = posts.filter((p) => {
    const topicMatch = selectedTopic === 'All' || p.category.toLowerCase() === selectedTopic.toLowerCase();
    const searchMatch =
      !searchQuery ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authorLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return topicMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 border border-emerald-500/40"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header Bar (Matching screenshot 1 top header) */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 sticky top-0 z-40 flex items-center justify-between shadow-xs">
        <div className="w-8">
          <button
            onClick={() => navigate('/')}
            className="p-1 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <h1 className="text-base sm:text-lg font-black text-emerald-800 dark:text-emerald-400 text-center tracking-wide">
          Farmer Community
        </h1>

        <button
          onClick={() => setShowSearch(!showSearch)}
          className="p-1.5 rounded-full text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input Bar Dropdown */}
      {showSearch && (
        <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-800">
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts, topics, or farmers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto px-4 py-5 space-y-6">
        
        {/* 2. Hero Intro Header */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            Farmer Community
          </h2>
          <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Share harvest updates, ask questions, and learn from farmers near you.
          </p>
        </div>

        {/* 3. Horizontal Highlights / Stories Cards (Matching screenshot 1) */}
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
          
          {/* Highlight Card 1 */}
          <div className="w-60 shrink-0 p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center shrink-0">
                <Tractor className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-black text-zinc-900 dark:text-white truncate">
                  Rajesh Kumar
                </h4>
                <p className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400">
                  Harvest Update
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-medium text-zinc-500">
                2h ago • 48 likes
              </p>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold">
                Wheat
              </span>
            </div>
          </div>

          {/* Highlight Card 2 */}
          <div className="w-60 shrink-0 p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center shrink-0">
                <Sprout className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-black text-zinc-900 dark:text-white truncate">
                  Priya Sharma
                </h4>
                <p className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400">
                  Crop Tips
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-medium text-zinc-500">
                5h ago • 23 likes
              </p>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold">
                Organic
              </span>
            </div>
          </div>

          {/* Highlight Card 3 */}
          <div className="w-60 shrink-0 p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-black text-zinc-900 dark:text-white truncate">
                  Amar Singh
                </h4>
                <p className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400">
                  Livestock Dairy
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-medium text-zinc-500">
                8h ago • 91 likes
              </p>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold">
                Dairy Setup
              </span>
            </div>
          </div>

        </div>

        {/* 4. Quick Action Grid Buttons (My Listings, Orders, Schemes - matching screenshot 1) */}
        <div className="grid grid-cols-3 gap-3">
          
          <button
            onClick={() => navigate('/seller-hub')}
            className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 text-center transition flex flex-col items-center justify-center space-y-2 shadow-xs group"
          >
            <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 group-hover:bg-emerald-50 transition">
              <Package className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">
              My Listings
            </span>
          </button>

          <button
            onClick={() => navigate('/inquiries')}
            className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 text-center transition flex flex-col items-center justify-center space-y-2 shadow-xs group"
          >
            <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 group-hover:bg-emerald-50 transition">
              <FileText className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">
              Orders
            </span>
          </button>

          <button
            onClick={() => setShowSchemesModal(true)}
            className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 text-center transition flex flex-col items-center justify-center space-y-2 shadow-xs group"
          >
            <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 group-hover:bg-emerald-50 transition">
              <Landmark className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">
              Schemes
            </span>
          </button>

        </div>

        {/* 5. Browse by topic filter chips (Matching screenshot 1) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Browse by topic
            </h3>
            <button
              onClick={() => setShowCreatePostModal(true)}
              className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center space-x-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Post</span>
            </button>
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {['All', 'Tips', 'Harvest', 'Livestock', 'Weather', 'Equipment'].map((topic) => {
              const isSelected = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap border ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-600 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-600/30 font-black'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Recent Posts Header */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">
            Recent posts
          </h3>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3"
              >
                {/* Author Info Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center space-x-1">
                        <h4 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white">
                          {post.authorName}
                        </h4>
                        {post.authorVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                        )}
                      </div>
                      <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                        {post.authorLocation} • {post.timeAgo}
                      </p>
                    </div>
                  </div>

                  {/* Category Pill Badge */}
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100/90 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-200 dark:border-emerald-800">
                    {post.category}
                  </span>
                </div>

                {/* Post Content Text */}
                <p className="text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Optional Post Image */}
                {post.image && (
                  <div className="rounded-2xl overflow-hidden max-h-72 w-full border border-zinc-100 dark:border-zinc-800">
                    <img
                      src={post.image}
                      alt="Post visual"
                      className="w-full h-full object-cover hover:scale-101 transition duration-300"
                    />
                  </div>
                )}

                {/* Post Actions Bar (Like, Comment, Share matching screenshot 2) */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-600 dark:text-zinc-400 font-bold">
                  
                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition ${
                      post.isLiked ? 'text-rose-600 dark:text-rose-400 font-extrabold' : ''
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                    <span>{post.likes}</span>
                  </button>

                  {/* Comment Button */}
                  <button
                    onClick={() => setActivePostForComments(post)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>{post.commentsCount}</span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => handleShare(post)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  >
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    <span>Share</span>
                  </button>

                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

      {/* --- MODAL 1: Government Schemes Modal --- */}
      {showSchemesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center space-x-2">
                <Landmark className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-black text-zinc-900 dark:text-white">
                  Government Agriculture Schemes
                </h3>
              </div>
              <button
                onClick={() => setShowSchemesModal(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {GOVERNMENT_SCHEMES.map((scheme, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-emerald-900 dark:text-emerald-300">
                      {scheme.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold">
                      {scheme.benefit}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    {scheme.desc}
                  </p>
                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-[11px] font-bold text-emerald-600 dark:text-emerald-400 underline pt-1"
                  >
                    Official Portal →
                  </a>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowSchemesModal(false)}
              className="w-full py-2.5 bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md"
            >
              Close Portal
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 2: Create Community Post Modal --- */}
      {showCreatePostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Create Community Post</span>
              </h3>
              <button
                onClick={() => setShowCreatePostModal(false)}
                className="text-xs font-bold text-zinc-400"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">
                  Topic Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(['Harvest', 'Tips', 'Livestock', 'Weather', 'Equipment'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewPostCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                        newPostCategory === cat
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">
                  Post Update / Question
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share harvest updates, pest solutions, crop pricing, or farming tips..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase block mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newPostImageUrl}
                  onChange={(e) => setNewPostImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium bg-zinc-50 dark:bg-zinc-800"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreatePostModal(false)}
                  className="w-1/2 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: Comments Modal --- */}
      {activePostForComments && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Comments ({activePostForComments.commentsCount})</span>
              </h3>
              <button
                onClick={() => setActivePostForComments(null)}
                className="text-xs font-bold text-zinc-400"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {(!activePostForComments.comments || activePostForComments.comments.length === 0) ? (
                <p className="text-xs text-zinc-400 text-center py-4 font-medium">
                  No comments yet. Be the first farmer to comment!
                </p>
              ) : (
                activePostForComments.comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-100 dark:border-zinc-800 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-zinc-900 dark:text-zinc-200">
                        {c.author}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-semibold">
                        {c.timeAgo}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                      {c.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <input
                type="text"
                placeholder="Write a reply or solution..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
