import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { generateRepurposedContent } from '../services/geminiService';
import { Loader2, Sparkles, FileText, Youtube, AlignLeft } from 'lucide-react';

export function NewCampaign() {
  const [inputContent, setInputContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;

    setLoading(true);
    setError('');

    try {
      const repurposedData = await generateRepurposedContent(inputContent);
      
      const docRef = await addDoc(collection(db, 'campaigns'), {
        userId: auth.currentUser?.uid,
        originalContent: inputContent,
        topic: repurposedData.step1_extraction.videoTopic,
        repurposedData: JSON.stringify(repurposedData),
        createdAt: serverTimestamp(),
      });

      navigate(`/campaign/${docRef.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">Create New Campaign</h1>
        <p className="text-sm sm:text-base text-zinc-500 mt-2">Paste your long-form content below to generate viral social media assets.</p>
      </header>

      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-zinc-100 p-6 sm:p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-zinc-900 mb-2">
              Source Content
            </label>
            <textarea
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Paste your YouTube transcript, blog post, or long-form script here..."
              className="w-full h-64 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none text-zinc-900 placeholder-zinc-400"
              required
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-0">
            <div className="flex flex-wrap gap-4 text-zinc-400">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileText size={16} /> Script
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Youtube size={16} /> Transcript
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <AlignLeft size={16} /> Blog Post
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !inputContent.trim()}
              className="w-full sm:w-auto bg-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Repurpose Content
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
