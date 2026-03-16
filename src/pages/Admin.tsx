import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Loader2, Users, Calendar, Mail, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  lastLogin: any;
}

interface Campaign {
  id: string;
  userId: string;
  originalContent: string;
  topic?: string;
  createdAt: any;
  userEmail?: string;
}

export function Admin() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'campaigns'>('users');
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(null);

  // Extra safety check
  if (auth.currentUser?.email !== 'bhuvangowdan71@gmail.com') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Users
        const usersQuery = query(collection(db, 'users'), orderBy('lastLogin', 'desc'));
        const usersSnapshot = await getDocs(usersQuery);
        const fetchedUsers: UserProfile[] = [];
        const userMap = new Map<string, string>();
        
        usersSnapshot.forEach((doc) => {
          const userData = doc.data() as UserProfile;
          fetchedUsers.push(userData);
          userMap.set(userData.uid, userData.email);
        });
        setUsers(fetchedUsers);

        // Fetch Campaigns
        const campaignsQuery = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));
        const campaignsSnapshot = await getDocs(campaignsQuery);
        const fetchedCampaigns: Campaign[] = [];
        
        campaignsSnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedCampaigns.push({
            id: doc.id,
            userId: data.userId,
            originalContent: data.originalContent,
            topic: data.topic,
            createdAt: data.createdAt,
            userEmail: userMap.get(data.userId) || 'Unknown User'
          });
        });
        setCampaigns(fetchedCampaigns);

      } catch (err: any) {
        console.error("Error fetching admin data:", err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-3">
          <Users className="text-emerald-600 dark:text-emerald-400" size={32} />
          Admin Dashboard
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-2">View all registered users and their campaign data.</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100 dark:border-red-500/20">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'users' 
              ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' 
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
        >
          <Users size={16} />
          Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'campaigns' 
              ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' 
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
          }`}
        >
          <FileText size={16} />
          Campaigns ({campaigns.length})
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden transition-colors duration-200">
        {activeTab === 'users' ? (
          <>
            <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">Registered Users</h2>
            </div>
            
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {users.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">No users found.</div>
              ) : (
                users.map((user) => {
                  const date = user.lastLogin?.toDate ? user.lastLogin.toDate().toLocaleString() : 'Just now';
                  
                  return (
                    <div key={user.uid} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 px-6 sm:px-8 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors gap-4 sm:gap-0">
                      <div className="flex items-center gap-4">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
                            {user.email.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">{user.displayName || 'No Name'}</h3>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                            <Mail size={12} /> {user.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 sm:gap-8 shrink-0 justify-between sm:justify-end">
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1 sm:justify-end mb-1">
                            <Calendar size={12} /> Last Login
                          </p>
                          <p className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100">{date}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <>
            <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">User Campaigns</h2>
            </div>
            
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {campaigns.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">No campaigns found.</div>
              ) : (
                campaigns.map((campaign) => {
                  const date = campaign.createdAt?.toDate ? campaign.createdAt.toDate().toLocaleString() : 'Just now';
                  const isExpanded = expandedCampaignId === campaign.id;
                  
                  return (
                    <div key={campaign.id} className="flex flex-col p-4 sm:p-6 px-6 sm:px-8 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <div 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 cursor-pointer"
                        onClick={() => setExpandedCampaignId(isExpanded ? null : campaign.id)}
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1 truncate">
                            {campaign.topic || 'Untitled Campaign'}
                          </h3>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                            <Mail size={12} /> {campaign.userEmail}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4 sm:gap-8 shrink-0 justify-between sm:justify-end">
                          <div className="text-left sm:text-right">
                            <p className="text-[10px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1 sm:justify-end mb-1">
                              <Calendar size={12} /> Created
                            </p>
                            <p className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100">{date}</p>
                          </div>
                          <div className="text-zinc-400">
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                          <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Original Content Entered</h4>
                          <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 max-h-96 overflow-y-auto">
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-mono">
                              {campaign.originalContent}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
