import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wand2, Copy, Check, RefreshCw, Type, Users, Sparkles, Quote, ChevronRight } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';

const MOODS = [
  { id: 'inspiring', label: 'Inspiring', color: 'bg-amber-100 text-amber-900 border-amber-200' },
  { id: 'professional', label: 'Professional', color: 'bg-slate-100 text-slate-900 border-slate-200' },
  { id: 'humorous', label: 'Humorous', color: 'bg-rose-100 text-rose-900 border-rose-200' },
  { id: 'dramatic', label: 'Dramatic', color: 'bg-indigo-100 text-indigo-900 border-indigo-200' },
];

const AUDIENCES = ['General', 'Students', 'Executives', 'Wedding Guests', 'Community'];

export default function SpeechGenerator() {
  const [keywords, setKeywords] = useState('');
  const [mood, setMood] = useState('inspiring');
  const [audience, setAudience] = useState('General');
  const [isGenerating, setIsGenerating] = useState(false);
  const [speech, setSpeech] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!keywords.trim()) return;
    setIsGenerating(true);
    setSpeech(null);
    try {
      const result = await generateSpeech({ keywords, mood, audience });
      setSpeech(result);
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please check your connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!speech) return;
    navigator.clipboard.writeText(speech);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-4 border border-slate-200"
        >
          <Sparkles className="w-3 h-3" />
          Eloquent AI Speech Architect
        </motion.div>
        <motion.h1 
          className="text-5xl md:text-6xl font-serif font-light tracking-tight text-slate-900 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Command the <span className="italic font-normal">Room.</span>
        </motion.h1>
        <motion.p 
          className="text-lg text-slate-500 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Transform your raw ideas into powerful, memorable speeches in seconds.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel */}
        <motion.section 
          className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3 uppercase tracking-wider">
                <Type className="w-4 h-4" />
                Raw Keywords or Ideas
              </label>
              <textarea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., Team achieved goals, hard work, future growth, grateful for support..."
                className="w-full h-40 p-5 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none resize-none text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-slate-700 mb-3 block uppercase tracking-wider">Mood</label>
                <div className="grid grid-cols-2 gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMood(m.id)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        mood === m.id 
                          ? `${m.color} ring-2 ring-offset-1 ring-slate-900`
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3 uppercase tracking-wider">
                  <Users className="w-4 h-4" />
                  Audience
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:ring-2 focus:ring-slate-900 outline-none appearance-none"
                >
                  {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !keywords.trim()}
              className={`w-full group py-4 rounded-2xl flex items-center justify-center gap-2 text-lg font-medium transition-all ${
                isGenerating || !keywords.trim()
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]'
              }`}
            >
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Craft Your Speech
                </>
              )}
            </button>
          </div>
        </motion.section>

        {/* Result Panel */}
        <motion.section 
          className="lg:col-span-5 relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {!speech && !isGenerating && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <Quote className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 font-medium font-serif italic text-lg leading-relaxed px-4">
                  "Speak with impact, lead with vision."
                </p>
                <div className="mt-8 flex items-center gap-2 text-xs text-slate-300 uppercase tracking-widest font-semibold">
                  Awaiting Input <ChevronRight className="w-3 h-3" />
                </div>
              </motion.div>
            )}

            {isGenerating && (
              <motion.div 
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[400px] bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center overflow-hidden"
              >
                <div className="w-full space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2 mx-auto"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6 mx-auto"></div>
                  <div className="h-4 bg-slate-100 rounded w-2/3 mx-auto"></div>
                  <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto"></div>
                </div>
                <p className="mt-8 text-slate-500 font-medium">Architecting the perfect words...</p>
              </motion.div>
            )}

            {speech && (
              <motion.div 
                key="speech"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm h-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded">
                    Generated Transcript
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-900 font-serif leading-relaxed text-lg whitespace-pre-wrap italic">
                    {speech}
                  </p>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    ~45-60 Seconds
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    Eloquent Studio
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>

      <footer className="mt-24 text-center pb-8">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">Crafted with Intelligence • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
