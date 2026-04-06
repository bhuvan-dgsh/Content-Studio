import { useState } from 'react';
import { Loader2, PenTool, Copy, CheckCircle2, Sparkles } from 'lucide-react';
import { generateScript } from '../services/geminiService';

export function ScriptGenerator() {
  const [topic, setTopic] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [script, setScript] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setScript('');
    setCopied(false);

    try {
      const generatedScript = await generateScript(topic, details);
      setScript(generatedScript);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate script. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!script) return;
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-3">
          <PenTool className="text-emerald-600 dark:text-emerald-400" size={32} />
          AI Script Generator
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-2">
          Enter a topic and some context, and our AI will write a high-retention script for you.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 sm:p-8 transition-colors duration-200">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Topic / Title <span className="text-red-500">*</span>
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How to start a YouTube channel in 2026"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="details" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Details & Context
              </label>
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Add any specific talking points, tone, target audience, or key takeaways you want included..."
                className="w-full h-40 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none resize-none"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100 dark:border-red-500/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Generating Script...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Script
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Area */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-6 sm:p-8 flex flex-col transition-colors duration-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Generated Script</h2>
            {script && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 rounded-lg"
              >
                {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>

          <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800 p-5 overflow-y-auto min-h-[300px]">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 space-y-4">
                <Loader2 className="animate-spin text-emerald-500" size={32} />
                <p className="text-sm font-medium animate-pulse">Crafting the perfect script...</p>
              </div>
            ) : script ? (
              <div className="prose prose-zinc dark:prose-invert max-w-none text-sm sm:text-base whitespace-pre-wrap font-mono">
                {script}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 space-y-3">
                <PenTool size={32} className="opacity-50" />
                <p className="text-sm font-medium text-center max-w-[250px]">
                  Your generated script will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
