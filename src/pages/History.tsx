import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Link } from 'react-router-dom';
import { Trash2, FileText, Calendar, TrendingUp } from 'lucide-react';

export function History() {
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

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'campaigns', id));
    } catch (err) {
      console.error('Failed to delete campaign', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Campaign History</h1>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-2">View and manage all your repurposed content campaigns.</p>
      </header>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden transition-colors duration-200">
        {loading ? (
          <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">Loading campaigns...</div>
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-zinc-400 dark:text-zinc-500" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">No campaigns yet</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">Start repurposing your long-form content today.</p>
            <Link to="/new" className="bg-emerald-600 dark:bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-colors">
              Create Campaign
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {campaigns.map((campaign) => {
              const data = JSON.parse(campaign.repurposedData);
              const date = campaign.createdAt?.toDate ? campaign.createdAt.toDate().toLocaleDateString() : 'Just now';
              
              return (
                <Link key={campaign.id} to={`/campaign/${campaign.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 px-6 sm:px-8 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group gap-4 sm:gap-0">
                  <div className="flex-1 min-w-0 sm:pr-8">
                    <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1 truncate">{campaign.topic || data.step1_extraction?.videoTopic || data.step1_analysis?.mainTopic}</h3>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 truncate">{data.step1_extraction?.coreMessage || data.step1_analysis?.coreMessage}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 sm:gap-8 shrink-0 justify-between sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1 sm:justify-end mb-1"><Calendar size={12} /> Created</p>
                      <p className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100">{date}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] sm:text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1 sm:justify-end mb-1"><TrendingUp size={12} /> Score</p>
                      <p className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">{data.step8_viralScore?.viralityScore || 0}/100</p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(campaign.id, e)}
                      className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors sm:opacity-0 group-hover:opacity-100"
                      title="Delete Campaign"
                    >
                      <Trash2 size={20} />
                    </button>
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
