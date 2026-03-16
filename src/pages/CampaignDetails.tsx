import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { RepurposedContent } from '../services/geminiService';
import { Loader2, ArrowLeft, CheckCircle2, TrendingUp, Calendar, PlaySquare, Image as ImageIcon, MessageSquare, Target, Clock } from 'lucide-react';

export function CampaignDetails() {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<any>(null);
  const [data, setData] = useState<RepurposedContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'campaigns', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCampaign({ id: docSnap.id, ...docSnap.data() });
          setData(JSON.parse(docSnap.data().repurposedData));
        } else {
          setError('Campaign not found');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center p-12">
        <p className="text-red-500 font-medium">{error || 'Something went wrong'}</p>
        <Link to="/" className="text-emerald-600 hover:underline mt-4 inline-block">Go back to Dashboard</Link>
      </div>
    );
  }

  if (!data.step1_extraction) {
    return (
      <div className="text-center p-12">
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">This campaign was created with an older version of the AI Content Engine and cannot be displayed in the new format.</p>
        <Link to="/" className="text-emerald-600 dark:text-emerald-400 hover:underline mt-4 inline-block">Go back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <header className="mb-8 sm:mb-10">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-4 sm:mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">{data.step1_extraction.videoTopic}</h1>
            <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-3xl">{data.step1_extraction.coreMessage}</p>
            {data.step1_extraction.videoTitle && (
              <p className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-500 mt-2 flex items-center gap-2">
                <PlaySquare size={14} /> {data.step1_extraction.videoTitle}
              </p>
            )}
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 border border-emerald-400/30 p-4 sm:p-6 rounded-2xl text-center w-full md:w-auto md:max-w-xs shrink-0 hover:-translate-y-2 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 text-white">
            <p className="text-[10px] sm:text-xs font-bold text-emerald-50 uppercase tracking-wider mb-1">Viral Score</p>
            <p className="text-3xl sm:text-4xl font-black text-white mb-2">{data.step8_viralScore.viralityScore}</p>
            <div className="flex gap-3 sm:gap-4 text-[10px] sm:text-xs text-emerald-50 justify-center mb-3">
              <div className="flex flex-col items-center">
                <span className="font-bold text-white">{data.step8_viralScore.hookStrength}</span>
                <span className="opacity-80">Hook</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-white">{data.step8_viralScore.engagementPotential}</span>
                <span className="opacity-80">Engage</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-white">{data.step8_viralScore.retentionPotential}</span>
                <span className="opacity-80">Retain</span>
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-emerald-50/90 leading-snug">{data.step8_viralScore.explanation}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Step 4: Short Video Scripts */}
          <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl sm:rounded-3xl shadow-xl border-none p-5 sm:p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 text-white rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm">
                <PlaySquare size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Short Video Scripts</h2>
            </div>
            <div className="space-y-4 sm:space-y-6">
              {data.step4_scripts.map((script, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:-translate-y-1 hover:bg-white/20 transition-all duration-300">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">{script.title}</h3>
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-blue-50">
                    <p><span className="font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Hook (0-3s):</span> {script.hook}</p>
                    <p><span className="font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Curiosity Build:</span> {script.curiosityBuild}</p>
                    <p><span className="font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Main Value:</span> {script.mainValue}</p>
                    <p><span className="font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Insight/Twist:</span> {script.insightOrTwist}</p>
                    <p><span className="font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Call to Action:</span> {script.callToAction}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Step 6: Multi-Platform Content */}
          <section className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-2xl sm:rounded-3xl shadow-xl border-none p-5 sm:p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 text-white rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm">
                <MessageSquare size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Multi-Platform Content</h2>
            </div>
            
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white"></span> YouTube
                </h3>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:-translate-y-1 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4 text-xs font-medium text-purple-100">
                    <span className="flex items-center gap-1"><Clock size={14} /> {data.step6_multiPlatform.youtube.suggestedPostingTime}</span>
                    <span className="bg-white/20 px-2 py-1 rounded-md">{data.step6_multiPlatform.youtube.bestFormat}</span>
                  </div>
                  <p className="font-bold text-fuchsia-300 drop-shadow-[0_0_8px_rgba(240,171,252,0.8)] text-sm mb-2">Viral Titles</p>
                  <ul className="list-disc pl-5 mb-4 space-y-1 text-sm text-white">
                    {data.step6_multiPlatform.youtube.viralTitles.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                  <p className="font-bold text-fuchsia-300 drop-shadow-[0_0_8px_rgba(240,171,252,0.8)] text-sm mb-1">SEO Description</p>
                  <p className="text-sm text-white mb-4">{data.step6_multiPlatform.youtube.seoDescription}</p>
                  <p className="font-bold text-fuchsia-300 drop-shadow-[0_0_8px_rgba(240,171,252,0.8)] text-sm mb-1">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {data.step6_multiPlatform.youtube.hashtags.map((t, i) => (
                      <span key={i} className="bg-white/20 text-white px-2 py-1 rounded-md text-xs font-medium">#{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white"></span> Instagram
                  </h3>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full hover:-translate-y-1 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4 text-xs font-medium text-purple-100">
                      <span className="flex items-center gap-1"><Clock size={14} /> {data.step6_multiPlatform.instagram.suggestedPostingTime}</span>
                      <span className="bg-white/20 px-2 py-1 rounded-md">{data.step6_multiPlatform.instagram.bestFormat}</span>
                    </div>
                    <p className="text-sm text-white whitespace-pre-wrap mb-4">{data.step6_multiPlatform.instagram.caption}</p>
                    <div className="flex flex-wrap gap-2">
                      {data.step6_multiPlatform.instagram.hashtags.map((t, i) => (
                        <span key={i} className="text-pink-200 text-xs font-medium">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white"></span> TikTok
                  </h3>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full hover:-translate-y-1 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4 text-xs font-medium text-purple-100">
                      <span className="flex items-center gap-1"><Clock size={14} /> {data.step6_multiPlatform.tiktok.suggestedPostingTime}</span>
                      <span className="bg-white/20 px-2 py-1 rounded-md">{data.step6_multiPlatform.tiktok.bestFormat}</span>
                    </div>
                    <p className="font-bold text-sm text-white mb-2">"{data.step6_multiPlatform.tiktok.hookLine}"</p>
                    <p className="text-sm text-white whitespace-pre-wrap">{data.step6_multiPlatform.tiktok.caption}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white"></span> Twitter/X Thread
                </h3>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4 hover:-translate-y-1 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-2 text-xs font-medium text-purple-100">
                    <span className="flex items-center gap-1"><Clock size={14} /> {data.step6_multiPlatform.twitter.suggestedPostingTime}</span>
                    <span className="bg-white/20 px-2 py-1 rounded-md">{data.step6_multiPlatform.twitter.bestFormat}</span>
                  </div>
                  {data.step6_multiPlatform.twitter.thread.map((tweet, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm text-white pt-1">{tweet}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white"></span> LinkedIn
                </h3>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:-translate-y-1 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4 text-xs font-medium text-purple-100">
                    <span className="flex items-center gap-1"><Clock size={14} /> {data.step6_multiPlatform.linkedin.suggestedPostingTime}</span>
                    <span className="bg-white/20 px-2 py-1 rounded-md">{data.step6_multiPlatform.linkedin.bestFormat}</span>
                  </div>
                  <p className="text-sm text-white whitespace-pre-wrap">{data.step6_multiPlatform.linkedin.caption}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Step 7: Content Calendar */}
          <section className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl sm:rounded-3xl shadow-xl border-none p-5 sm:p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 text-white rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm">
                <Calendar size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">30-Day Content Calendar</h2>
            </div>
            <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
              <table className="w-full text-left text-xs sm:text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/20 text-orange-100">
                    <th className="pb-3 font-medium">Day</th>
                    <th className="pb-3 font-medium">Platform</th>
                    <th className="pb-3 font-medium">Format</th>
                    <th className="pb-3 font-medium">Topic Idea</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {data.step7_calendar.map((item, i) => (
                    <tr key={i} className="hover:bg-white/10 transition-colors">
                      <td className="py-4 font-bold text-white">W{item.week} D{item.day}</td>
                      <td className="py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                          {item.platform}
                        </span>
                      </td>
                      <td className="py-4 text-orange-100">{item.contentType}</td>
                      <td className="py-4 text-white">
                        <p className="font-bold">{item.topic}</p>
                        <p className="text-xs text-orange-50 mt-1"><span className="font-bold text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">Hook:</span> {item.viralHookIdea}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Step 1: Insights & Highlights */}
          <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl sm:rounded-3xl shadow-xl border-none p-5 sm:p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 text-white rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm">
                <CheckCircle2 size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Key Insights & Highlights</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-emerald-300 drop-shadow-[0_0_8px_rgba(110,231,183,0.8)] uppercase tracking-wider mb-3">Key Insights</h3>
                <ul className="space-y-3">
                  {data.step1_extraction.keyInsights.map((insight, i) => (
                    <li key={i} className="flex gap-3 text-sm text-white">
                      <span className="text-emerald-300 drop-shadow-[0_0_8px_rgba(110,231,183,0.8)] mt-0.5">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-300 drop-shadow-[0_0_8px_rgba(110,231,183,0.8)] uppercase tracking-wider mb-3">Highlight Moments</h3>
                <ul className="space-y-3">
                  {data.step1_extraction.highlightMoments.map((moment, i) => (
                    <li key={i} className="flex gap-3 text-sm text-white">
                      <span className="text-emerald-300 drop-shadow-[0_0_8px_rgba(110,231,183,0.8)] mt-0.5">•</span>
                      {moment}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Step 1: Clip Opportunities */}
          <section className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-2xl sm:rounded-3xl shadow-xl border-none p-5 sm:p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 text-white rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm">
                <CheckCircle2 size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Clip Opportunities</h2>
            </div>
            <div className="space-y-4">
              {data.step1_extraction.clipOpportunities.map((clip, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 hover:-translate-y-1 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.8)] bg-white/10 px-2 py-1 rounded-md border border-cyan-300/30">{clip.timestamp}</span>
                    <span className="text-xs font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.8)]">{clip.type}</span>
                  </div>
                  <p className="text-sm text-white">{clip.idea}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Step 3: Viral Hooks */}
          <section className="bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-2xl sm:rounded-3xl shadow-xl border-none p-5 sm:p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 text-white rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm">
                <Target size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Viral Hooks</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(data.step3_hooks).map(([type, hook]) => (
                <div key={type} className="border-l-2 border-white/30 pl-4 hover:border-white/60 transition-colors">
                  <p className="text-xs font-bold text-rose-300 drop-shadow-[0_0_8px_rgba(253,164,175,0.8)] uppercase tracking-wider mb-1">{type}</p>
                  <p className="text-sm font-medium text-white">{hook}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Step 5: Thumbnails */}
          <section className="bg-gradient-to-br from-fuchsia-600 to-purple-700 text-white rounded-2xl sm:rounded-3xl shadow-xl border-none p-5 sm:p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 text-white rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm">
                <ImageIcon size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Thumbnails</h2>
            </div>
            <div className="space-y-6">
              {data.step5_thumbnails.map((thumb, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:-translate-y-1 hover:bg-white/20 transition-all duration-300">
                  <div className="aspect-video bg-zinc-200 dark:bg-zinc-700 rounded-xl mb-4 flex items-center justify-center text-center p-4 relative overflow-hidden" style={{ backgroundColor: thumb.colorPalette.split(',')[0] || '#e4e4e7' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/40 to-zinc-900/80 mix-blend-overlay"></div>
                    <p className="relative z-10 font-black text-white text-lg leading-tight uppercase drop-shadow-md">
                      {thumb.thumbnailText}
                    </p>
                  </div>
                  <div className="space-y-2 text-xs text-fuchsia-50">
                    <p><span className="font-bold text-fuchsia-300 drop-shadow-[0_0_8px_rgba(240,171,252,0.8)]">Concept:</span> {thumb.visualConcept}</p>
                    <p><span className="font-bold text-fuchsia-300 drop-shadow-[0_0_8px_rgba(240,171,252,0.8)]">Expression:</span> {thumb.facialExpression}</p>
                    <p><span className="font-bold text-fuchsia-300 drop-shadow-[0_0_8px_rgba(240,171,252,0.8)]">Colors:</span> {thumb.colorPalette}</p>
                    <p><span className="font-bold text-fuchsia-300 drop-shadow-[0_0_8px_rgba(240,171,252,0.8)]">Layout:</span> {thumb.layoutComposition}</p>
                    <p><span className="font-bold text-fuchsia-300 drop-shadow-[0_0_8px_rgba(240,171,252,0.8)]">Emotion:</span> {thumb.emotionTrigger}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Step 2: Trend Analysis */}
          <section className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl sm:rounded-3xl shadow-xl border-none p-5 sm:p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 text-white rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm">
                <TrendingUp size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Trend Analysis</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)] uppercase tracking-wider mb-2">Trending Topics</p>
                <div className="flex flex-wrap gap-2">
                  {data.step2_trendPrediction.trendingTopics.map((t, i) => (
                    <span key={i} className="bg-white/20 text-white px-2.5 py-1 rounded-md text-xs font-medium">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)] uppercase tracking-wider mb-2">Trending Formats</p>
                <div className="flex flex-wrap gap-2">
                  {data.step2_trendPrediction.trendingContentFormats.map((t, i) => (
                    <span key={i} className="bg-white/20 text-white px-2.5 py-1 rounded-md text-xs font-medium">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)] uppercase tracking-wider mb-2">Trending Hooks</p>
                <div className="flex flex-wrap gap-2">
                  {data.step2_trendPrediction.trendingHooks.map((t, i) => (
                    <span key={i} className="bg-white/20 text-white px-2.5 py-1 rounded-md text-xs font-medium">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)] uppercase tracking-wider mb-2">Content Opportunities</p>
                <ul className="space-y-2">
                  {data.step2_trendPrediction.contentOpportunities.map((opp, i) => (
                    <li key={i} className="text-sm text-white flex gap-2">
                      <span className="text-orange-300">→</span> {opp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
