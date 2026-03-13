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
        <p className="text-zinc-500 font-medium">This campaign was created with an older version of the AI Content Engine and cannot be displayed in the new format.</p>
        <Link to="/" className="text-emerald-600 hover:underline mt-4 inline-block">Go back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <header className="mb-8 sm:mb-10">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-4 sm:mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight mb-2">{data.step1_extraction.videoTopic}</h1>
            <p className="text-lg sm:text-xl text-zinc-500 max-w-3xl">{data.step1_extraction.coreMessage}</p>
            {data.step1_extraction.videoTitle && (
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 flex items-center gap-2">
                <PlaySquare size={14} /> {data.step1_extraction.videoTitle}
              </p>
            )}
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-4 sm:p-6 rounded-2xl text-center w-full md:w-auto md:max-w-xs shrink-0">
            <p className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Viral Score</p>
            <p className="text-3xl sm:text-4xl font-black text-emerald-700 mb-2">{data.step8_viralScore.viralityScore}</p>
            <div className="flex gap-3 sm:gap-4 text-[10px] sm:text-xs text-emerald-700 justify-center mb-3">
              <div className="flex flex-col items-center">
                <span className="font-bold">{data.step8_viralScore.hookStrength}</span>
                <span className="opacity-70">Hook</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold">{data.step8_viralScore.engagementPotential}</span>
                <span className="opacity-70">Engage</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold">{data.step8_viralScore.retentionPotential}</span>
                <span className="opacity-70">Retain</span>
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-emerald-600/80 leading-snug">{data.step8_viralScore.explanation}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Step 4: Short Video Scripts */}
          <section className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-zinc-100 p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <PlaySquare size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">Short Video Scripts</h2>
            </div>
            <div className="space-y-4 sm:space-y-6">
              {data.step4_scripts.map((script, idx) => (
                <div key={idx} className="bg-zinc-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-100">
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 mb-3 sm:mb-4">{script.title}</h3>
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <p><span className="font-bold text-emerald-600">Hook (0-3s):</span> {script.hook}</p>
                    <p><span className="font-bold text-blue-600">Curiosity Build:</span> {script.curiosityBuild}</p>
                    <p><span className="font-bold text-purple-600">Main Value:</span> {script.mainValue}</p>
                    <p><span className="font-bold text-amber-600">Insight/Twist:</span> {script.insightOrTwist}</p>
                    <p><span className="font-bold text-red-600">Call to Action:</span> {script.callToAction}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Step 6: Multi-Platform Content */}
          <section className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-zinc-100 p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                <MessageSquare size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">Multi-Platform Content</h2>
            </div>
            
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> YouTube
                </h3>
                <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                  <div className="flex items-center gap-4 mb-4 text-xs font-medium text-zinc-500">
                    <span className="flex items-center gap-1"><Clock size={14} /> {data.step6_multiPlatform.youtube.suggestedPostingTime}</span>
                    <span className="bg-zinc-200 px-2 py-1 rounded-md">{data.step6_multiPlatform.youtube.bestFormat}</span>
                  </div>
                  <p className="font-semibold text-sm text-zinc-500 mb-2">Viral Titles</p>
                  <ul className="list-disc pl-5 mb-4 space-y-1 text-sm text-zinc-800">
                    {data.step6_multiPlatform.youtube.viralTitles.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                  <p className="font-semibold text-sm text-zinc-500 mb-1">SEO Description</p>
                  <p className="text-sm text-zinc-800 mb-4">{data.step6_multiPlatform.youtube.seoDescription}</p>
                  <p className="font-semibold text-sm text-zinc-500 mb-1">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {data.step6_multiPlatform.youtube.hashtags.map((t, i) => (
                      <span key={i} className="bg-zinc-200 text-zinc-700 px-2 py-1 rounded-md text-xs font-medium">#{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span> Instagram
                  </h3>
                  <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 h-full">
                    <div className="flex items-center gap-4 mb-4 text-xs font-medium text-zinc-500">
                      <span className="flex items-center gap-1"><Clock size={14} /> {data.step6_multiPlatform.instagram.suggestedPostingTime}</span>
                      <span className="bg-zinc-200 px-2 py-1 rounded-md">{data.step6_multiPlatform.instagram.bestFormat}</span>
                    </div>
                    <p className="text-sm text-zinc-800 whitespace-pre-wrap mb-4">{data.step6_multiPlatform.instagram.caption}</p>
                    <div className="flex flex-wrap gap-2">
                      {data.step6_multiPlatform.instagram.hashtags.map((t, i) => (
                        <span key={i} className="text-pink-600 text-xs font-medium">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-black"></span> TikTok
                  </h3>
                  <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 h-full">
                    <div className="flex items-center gap-4 mb-4 text-xs font-medium text-zinc-500">
                      <span className="flex items-center gap-1"><Clock size={14} /> {data.step6_multiPlatform.tiktok.suggestedPostingTime}</span>
                      <span className="bg-zinc-200 px-2 py-1 rounded-md">{data.step6_multiPlatform.tiktok.bestFormat}</span>
                    </div>
                    <p className="font-bold text-sm text-zinc-900 mb-2">"{data.step6_multiPlatform.tiktok.hookLine}"</p>
                    <p className="text-sm text-zinc-800 whitespace-pre-wrap">{data.step6_multiPlatform.tiktok.caption}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span> Twitter/X Thread
                </h3>
                <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 space-y-4">
                  <div className="flex items-center gap-4 mb-2 text-xs font-medium text-zinc-500">
                    <span className="flex items-center gap-1"><Clock size={14} /> {data.step6_multiPlatform.twitter.suggestedPostingTime}</span>
                    <span className="bg-zinc-200 px-2 py-1 rounded-md">{data.step6_multiPlatform.twitter.bestFormat}</span>
                  </div>
                  {data.step6_multiPlatform.twitter.thread.map((tweet, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm text-zinc-800 pt-1">{tweet}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-700"></span> LinkedIn
                </h3>
                <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                  <div className="flex items-center gap-4 mb-4 text-xs font-medium text-zinc-500">
                    <span className="flex items-center gap-1"><Clock size={14} /> {data.step6_multiPlatform.linkedin.suggestedPostingTime}</span>
                    <span className="bg-zinc-200 px-2 py-1 rounded-md">{data.step6_multiPlatform.linkedin.bestFormat}</span>
                  </div>
                  <p className="text-sm text-zinc-800 whitespace-pre-wrap">{data.step6_multiPlatform.linkedin.caption}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Step 7: Content Calendar */}
          <section className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-zinc-100 p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                <Calendar size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">30-Day Content Calendar</h2>
            </div>
            <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
              <table className="w-full text-left text-xs sm:text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-500">
                    <th className="pb-3 font-medium">Day</th>
                    <th className="pb-3 font-medium">Platform</th>
                    <th className="pb-3 font-medium">Format</th>
                    <th className="pb-3 font-medium">Topic Idea</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {data.step7_calendar.map((item, i) => (
                    <tr key={i} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-4 font-medium text-zinc-900">W{item.week} D{item.day}</td>
                      <td className="py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
                          {item.platform}
                        </span>
                      </td>
                      <td className="py-4 text-zinc-600">{item.contentType}</td>
                      <td className="py-4 text-zinc-900">
                        <p className="font-medium">{item.topic}</p>
                        <p className="text-xs text-zinc-500 mt-1">Hook: {item.viralHookIdea}</p>
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
          <section className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-zinc-100 p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900">Key Insights & Highlights</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Key Insights</h3>
                <ul className="space-y-3">
                  {data.step1_extraction.keyInsights.map((insight, i) => (
                    <li key={i} className="flex gap-3 text-sm text-zinc-700">
                      <span className="text-indigo-500 mt-0.5">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Highlight Moments</h3>
                <ul className="space-y-3">
                  {data.step1_extraction.highlightMoments.map((moment, i) => (
                    <li key={i} className="flex gap-3 text-sm text-zinc-700">
                      <span className="text-indigo-500 mt-0.5">•</span>
                      {moment}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Step 1: Clip Opportunities */}
          <section className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-zinc-100 p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900">Clip Opportunities</h2>
            </div>
            <div className="space-y-4">
              {data.step1_extraction.clipOpportunities.map((clip, i) => (
                <div key={i} className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-md">{clip.timestamp}</span>
                    <span className="text-xs font-medium text-zinc-500">{clip.type}</span>
                  </div>
                  <p className="text-sm text-zinc-800">{clip.idea}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Step 3: Viral Hooks */}
          <section className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-zinc-100 p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                <Target size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900">Viral Hooks</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(data.step3_hooks).map(([type, hook]) => (
                <div key={type} className="border-l-2 border-rose-200 pl-4">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{type}</p>
                  <p className="text-sm font-medium text-zinc-900">{hook}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Step 5: Thumbnails */}
          <section className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-zinc-100 p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <ImageIcon size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900">Thumbnails</h2>
            </div>
            <div className="space-y-6">
              {data.step5_thumbnails.map((thumb, i) => (
                <div key={i} className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100">
                  <div className="aspect-video bg-zinc-200 rounded-xl mb-4 flex items-center justify-center text-center p-4 relative overflow-hidden" style={{ backgroundColor: thumb.colorPalette.split(',')[0] || '#e4e4e7' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/40 to-zinc-900/80 mix-blend-overlay"></div>
                    <p className="relative z-10 font-black text-white text-lg leading-tight uppercase drop-shadow-md">
                      {thumb.thumbnailText}
                    </p>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p><span className="font-semibold text-zinc-500">Concept:</span> {thumb.visualConcept}</p>
                    <p><span className="font-semibold text-zinc-500">Expression:</span> {thumb.facialExpression}</p>
                    <p><span className="font-semibold text-zinc-500">Colors:</span> {thumb.colorPalette}</p>
                    <p><span className="font-semibold text-zinc-500">Layout:</span> {thumb.layoutComposition}</p>
                    <p><span className="font-semibold text-zinc-500">Emotion:</span> {thumb.emotionTrigger}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Step 2: Trend Analysis */}
          <section className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-zinc-100 p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp size={18} className="sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900">Trend Analysis</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Trending Topics</p>
                <div className="flex flex-wrap gap-2">
                  {data.step2_trendPrediction.trendingTopics.map((t, i) => (
                    <span key={i} className="bg-orange-50 text-orange-700 px-2.5 py-1 rounded-md text-xs font-medium">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Trending Formats</p>
                <div className="flex flex-wrap gap-2">
                  {data.step2_trendPrediction.trendingContentFormats.map((t, i) => (
                    <span key={i} className="bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-md text-xs font-medium">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Trending Hooks</p>
                <div className="flex flex-wrap gap-2">
                  {data.step2_trendPrediction.trendingHooks.map((t, i) => (
                    <span key={i} className="bg-rose-50 text-rose-700 px-2.5 py-1 rounded-md text-xs font-medium">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Content Opportunities</p>
                <ul className="space-y-2">
                  {data.step2_trendPrediction.contentOpportunities.map((opp, i) => (
                    <li key={i} className="text-sm text-zinc-700 flex gap-2">
                      <span className="text-orange-400">→</span> {opp}
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
