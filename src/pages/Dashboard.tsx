import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Link } from 'react-router-dom';
import { FileText, TrendingUp, Calendar, Video } from 'lucide-react';

export function Dashboard() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'campaigns'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCampaigns(data);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">Welcome back, {auth.currentUser?.displayName?.split(' ')[0]}</h1>
        <p className="text-sm sm:text-base text-zinc-500 mt-2">Here's an overview of your content repurposing campaigns.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Total Campaigns</p>
            <p className="text-2xl font-bold text-zinc-900">{campaigns.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Video size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Shorts Generated</p>
            <p className="text-2xl font-bold text-zinc-900">{campaigns.length * 3}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Avg Viral Score</p>
            <p className="text-2xl font-bold text-zinc-900">
              {campaigns.length > 0 
                ? Math.round(campaigns.reduce((acc, c) => acc + (JSON.parse(c.repurposedData).step8_viralScore?.viralityScore || 0), 0) / campaigns.length)
                : 0}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Days Planned</p>
            <p className="text-2xl font-bold text-zinc-900">{campaigns.length * 30}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
        <div className="px-6 sm:px-8 py-5 sm:py-6 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900">Recent Campaigns</h2>
          <Link to="/new" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Create New &rarr;</Link>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-zinc-500">Loading campaigns...</div>
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-zinc-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">No campaigns yet</h3>
            <p className="text-zinc-500 mb-6">Start repurposing your long-form content today.</p>
            <Link to="/new" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors">
              Create Campaign
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {campaigns.slice(0, 5).map((campaign) => {
              const data = JSON.parse(campaign.repurposedData);
              return (
                <Link key={campaign.id} to={`/campaign/${campaign.id}`} className="block hover:bg-zinc-50 transition-colors p-4 sm:p-6 px-6 sm:px-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-zinc-900 mb-1">{campaign.topic || data.step1_extraction?.videoTopic || data.step1_analysis?.mainTopic}</h3>
                      <p className="text-xs sm:text-sm text-zinc-500 line-clamp-1">{data.step1_extraction?.coreMessage || data.step1_analysis?.coreMessage}</p>
                    </div>
                    <div className="flex items-center gap-4 self-start sm:self-auto">
                      <div className="text-left sm:text-right">
                        <p className="text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wider">Viral Score</p>
                        <p className="text-base sm:text-lg font-bold text-emerald-600">{data.step8_viralScore?.viralityScore || 0}/100</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
