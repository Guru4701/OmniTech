import React, { useState } from "react";
import { 
  Sparkles, 
  TrendingUp, 
  Gauge, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Copy, 
  Plus, 
  Search, 
  ArrowRight, 
  Mail, 
  FileCheck,
  Check,
  Zap,
  Info,
  ChevronRight,
  User,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SeoBrief {
  titleTag: string;
  metaDescription: string;
  targetKeyword: string;
  searchIntent: string;
  difficulty: string;
  estimatedVolume: string;
  recommendedWordCount: string;
  headers: {
    level: string;
    text: string;
    instructions: string;
  }[];
  semanticKeywords: string[];
  faqSchema: {
    question: string;
    suggestedAnswer: string;
  }[];
}

interface SeoReport {
  score: number;
  readability: string;
  keywordDensity: number;
  positives: string[];
  negatives: string[];
  lsiKeywordsCheck: {
    keyword: string;
    status: string;
  }[];
  actionItems: string[];
}

interface FreelancerProposal {
  subjectLine: string;
  proposalText: string;
  milestones: {
    name: string;
    description: string;
    estimatedTime: string;
  }[];
  differentiator: string;
}

export default function SeoStudio() {
  const [activeSubTab, setActiveSubTab] = useState<"brief" | "optimize" | "pitch">("brief");
  
  // 1. Brief states
  const [keyword, setKeyword] = useState("");
  const [audience, setAudience] = useState("Freelancers & Tech Buyers");
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefData, setBriefData] = useState<SeoBrief | null>(null);
  
  // 2. Optimize states
  const [optKeyword, setOptKeyword] = useState("");
  const [optContent, setOptContent] = useState("");
  const [optLoading, setOptLoading] = useState(false);
  const [optData, setOptData] = useState<SeoReport | null>(null);

  // 3. Pitch states
  const [clientBrief, setClientBrief] = useState("");
  const [services, setServices] = useState("React & Node Full-Stack Development");
  const [skills, setSkills] = useState("React, Express, Tailwind CSS, Firestore Syncing");
  const [pitchLoading, setPitchLoading] = useState(false);
  const [pitchData, setPitchData] = useState<FreelancerProposal | null>(null);

  // Status flags
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleGenerateBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setBriefLoading(true);
    setBriefData(null);
    try {
      const res = await fetch("/api/gemini/seo-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, targetAudience: audience })
      });
      if (res.ok) {
        const data = await res.json();
        setBriefData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBriefLoading(false);
    }
  };

  const handleOptimizeContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!optKeyword.trim() || !optContent.trim()) return;
    setOptLoading(true);
    setOptData(null);
    try {
      const res = await fetch("/api/gemini/seo-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: optContent, keyword: optKeyword })
      });
      if (res.ok) {
        const data = await res.json();
        setOptData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOptLoading(false);
    }
  };

  const handleGeneratePitch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientBrief.trim()) return;
    setPitchLoading(true);
    setPitchData(null);
    try {
      const res = await fetch("/api/gemini/freelancer-pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientBrief, services, skills })
      });
      if (res.ok) {
        const data = await res.json();
        setPitchData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPitchLoading(false);
    }
  };

  // Sample prompt helpers to save typing
  const loadBriefPreset = (kw: string, aud: string) => {
    setKeyword(kw);
    setAudience(aud);
  };

  const loadOptimizePreset = (kw: string, text: string) => {
    setOptKeyword(kw);
    setOptContent(text);
  };

  const loadPitchPreset = (brief: string, serv: string, tech: string) => {
    setClientBrief(brief);
    setServices(serv);
    setSkills(tech);
  };

  return (
    <div id="seo-gig-studio-view" className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>AI GIG ECONOMY BOOSTER</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-light tracking-tight text-white">
            SEO & Freelancer Workspace
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Equip your freelance business and technical writing portfolio with high-performance search strategies, real-time content optimization scoring, and custom-tailored technical client proposals.
          </p>
        </div>
      </div>

      {/* Sub tabs switcher */}
      <div className="flex border-b border-zinc-800 gap-1 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveSubTab("brief")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all relative shrink-0 cursor-pointer ${
            activeSubTab === "brief" 
              ? "text-white font-semibold" 
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>SEO Content Briefs</span>
          {activeSubTab === "brief" && (
            <motion.div layoutId="seoActiveSub" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab("optimize")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all relative shrink-0 cursor-pointer ${
            activeSubTab === "optimize" 
              ? "text-white font-semibold" 
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>Real-time Content Grader</span>
          {activeSubTab === "optimize" && (
            <motion.div layoutId="seoActiveSub" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab("pitch")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all relative shrink-0 cursor-pointer ${
            activeSubTab === "pitch" 
              ? "text-white font-semibold" 
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Gig Proposals & Pitches</span>
          {activeSubTab === "pitch" && (
            <motion.div layoutId="seoActiveSub" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
          )}
        </button>
      </div>

      {/* RENDER VIEWPORTS */}
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: BRIEF BUILDER */}
        {activeSubTab === "brief" && (
          <motion.div
            key="brief"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Input Config Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-5">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Generate SEO Content Strategy</h3>
                  <p className="text-zinc-500 text-[11px] leading-relaxed">
                    Enter any technology topic or specific hardware component to plan a high-ranking, spec-dense blog post outline.
                  </p>
                </div>

                <form onSubmit={handleGenerateBrief} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Target Focus Keyword</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., RTX 5090 comparison"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-zinc-200 outline-none focus:border-zinc-700 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Target Core Audience</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., freelance developers, gamers"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-zinc-200 outline-none focus:border-zinc-700 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={briefLoading}
                    className="w-full bg-white hover:bg-zinc-200 text-black py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {briefLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Generating Outline...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                        Build Content Brief
                      </>
                    )}
                  </button>
                </form>

                {/* Preset suggestions */}
                <div className="pt-4 border-t border-zinc-900 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider">Workspace Presets</span>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => loadBriefPreset("Apple M4 Max vs Intel Core Ultra 9", "Software Engineers & Tech Writers")}
                      className="text-left bg-zinc-900/30 hover:bg-zinc-900 border border-zinc-800/40 rounded-lg p-2 text-xs transition-all hover:border-zinc-700"
                    >
                      <div className="font-semibold text-zinc-300">Apple M4 Max vs Intel Ultra 9</div>
                      <div className="text-[10px] text-zinc-500">Audience: Software Engineers</div>
                    </button>
                    <button
                      onClick={() => loadBriefPreset("RTX 5090 gaming performance scaling", "Hardware Enthusiasts & Reviewers")}
                      className="text-left bg-zinc-900/30 hover:bg-zinc-900 border border-zinc-800/40 rounded-lg p-2 text-xs transition-all hover:border-zinc-700"
                    >
                      <div className="font-semibold text-zinc-300">RTX 5090 Performance Scaling</div>
                      <div className="text-[10px] text-zinc-500">Audience: Hardware Enthusiasts</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Dashboard */}
            <div className="lg:col-span-8">
              {briefLoading && (
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white animate-spin" />
                  <p className="text-zinc-400 text-xs font-mono">Consulting Gemini knowledge graphs and compiling keyword indices...</p>
                </div>
              )}

              {!briefLoading && !briefData && (
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500 space-y-3">
                  <FileText className="w-8 h-8 text-zinc-700 mx-auto" />
                  <p className="text-xs">Submit a focus keyword on the left to compile a complete, optimized SEO Content Brief.</p>
                </div>
              )}

              {briefData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Meta tag overview */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-5">
                    <div className="flex justify-between items-start gap-4 border-b border-zinc-900 pb-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">SEO META SPECIFICATION</span>
                        <h2 className="text-lg font-serif font-light text-white">Target Keyword: &ldquo;{briefData.targetKeyword}&rdquo;</h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-mono px-2.5 py-1 rounded-full">
                          Intent: {briefData.searchIntent}
                        </span>
                        <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-mono px-2.5 py-1 rounded-full">
                          Diff: {briefData.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1 bg-zinc-900/20 border border-zinc-800/60 rounded-xl p-4 relative">
                        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase">
                          <span>SEO Title Tag</span>
                          <button
                            onClick={() => handleCopy(briefData.titleTag, "title")}
                            className="hover:text-white flex items-center gap-1 transition-colors"
                          >
                            {copiedText === "title" ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-zinc-200 mt-1">{briefData.titleTag}</p>
                        <span className="text-[9px] font-mono text-zinc-500 block mt-2">Length: {briefData.titleTag.length} / 60 chars</span>
                      </div>

                      <div className="space-y-1 bg-zinc-900/20 border border-zinc-800/60 rounded-xl p-4 relative">
                        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase">
                          <span>Meta Description</span>
                          <button
                            onClick={() => handleCopy(briefData.metaDescription, "meta")}
                            className="hover:text-white flex items-center gap-1 transition-colors"
                          >
                            {copiedText === "meta" ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <p className="text-xs text-zinc-300 mt-1 leading-normal">{briefData.metaDescription}</p>
                        <span className="text-[9px] font-mono text-zinc-500 block mt-2">Length: {briefData.metaDescription.length} / 160 chars</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center pt-2 border-t border-zinc-900">
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase block">Est. Search Volume</span>
                        <span className="text-sm font-bold text-white mt-1 block">{briefData.estimatedVolume || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase block">Recommended Words</span>
                        <span className="text-sm font-bold text-white mt-1 block">{briefData.recommendedWordCount || "1500w"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase block">Suggested Frequency</span>
                        <span className="text-sm font-bold text-white mt-1 block">1.5% - 2.2%</span>
                      </div>
                    </div>
                  </div>

                  {/* LSI Semantic Keywords */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-3">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block">LSI & Related Keywords to Scatter</span>
                    <div className="flex flex-wrap gap-2">
                      {briefData.semanticKeywords.map((kw, idx) => (
                        <span key={idx} className="bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 hover:border-white/20 text-xs px-3 py-1.5 rounded-xl transition-all cursor-default flex items-center gap-1.5">
                          <TrendingUp className="w-3 h-3 text-zinc-400" />
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Outline Section Checklist */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
                    <div className="border-b border-zinc-900 pb-3 flex justify-between items-center">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">Section-by-Section Content Outline</h3>
                      <span className="text-[9px] font-mono text-zinc-500">{briefData.headers.length} Headers Defined</span>
                    </div>

                    <div className="space-y-4.5">
                      {briefData.headers.map((hdr, idx) => (
                        <div key={idx} className="flex gap-4 border-l-2 border-zinc-800 hover:border-white pl-4 transition-colors">
                          <div className="shrink-0 w-8 text-xs font-mono text-zinc-500 font-semibold uppercase mt-0.5">{hdr.level}</div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-zinc-200">{hdr.text}</h4>
                            <p className="text-[11px] text-zinc-400 leading-normal">{hdr.instructions}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FAQ and Schema options */}
                  {briefData.faqSchema && briefData.faqSchema.length > 0 && (
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 border-b border-zinc-900 pb-3">FAQ Schema Recommendations</h3>
                      <div className="space-y-4">
                        {briefData.faqSchema.map((faq, idx) => (
                          <div key={idx} className="space-y-1.5">
                            <span className="text-xs font-semibold text-zinc-200 block flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                              {faq.question}
                            </span>
                            <p className="text-[11px] text-zinc-400 pl-3 leading-normal bg-zinc-900/10 p-2.5 rounded-lg border border-zinc-900">{faq.suggestedAnswer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* VIEW 2: CONTENT OPTIMIZER */}
        {activeSubTab === "optimize" && (
          <motion.div
            key="optimize"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left editor input */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-5">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Content Quality Editor</h3>
                  <p className="text-zinc-500 text-[11px] leading-relaxed">
                    Paste your article draft and target focus keyword to calculate an instant quality score and list exact missing items.
                  </p>
                </div>

                <form onSubmit={handleOptimizeContent} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Target Focus Keyword</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Apple M4 Max performance"
                      value={optKeyword}
                      onChange={(e) => setOptKeyword(e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-zinc-200 outline-none focus:border-zinc-700 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Draft Content (Markdown / Text)</label>
                    <textarea
                      required
                      rows={12}
                      placeholder="Paste your content here..."
                      value={optContent}
                      onChange={(e) => setOptContent(e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-3 px-3.5 text-xs text-zinc-300 outline-none focus:border-zinc-700 transition-colors font-mono leading-relaxed resize-y scrollbar-thin"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      {optContent.split(/\s+/).filter(Boolean).length} Words | {optContent.length} Chars
                    </span>
                    <button
                      type="submit"
                      disabled={optLoading}
                      className="bg-white hover:bg-zinc-200 text-black py-2.5 px-6 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {optLoading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          Analyzing Draft...
                        </>
                      ) : (
                        <>
                          <Gauge className="w-3.5 h-3.5 text-black" />
                          Calculate SEO Grade
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Presets */}
                <div className="pt-4 border-t border-zinc-900 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider">Quick Templates to Test</span>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => loadOptimizePreset(
                        "Intel Arrow Lake",
                        "# Intel Arrow Lake Optimization Insights\n\nIntel's Arrow Lake represent a fresh rethink of high-end desktop cores. Focusing on performance-per-watt optimization, they trade hyperthreading for physical efficiency. We find the efficiency metrics are extremely impressive in sustained multi-threaded compiling."
                      )}
                      className="text-left bg-zinc-900/30 hover:bg-zinc-900 border border-zinc-800/40 rounded-lg p-2 text-xs transition-all hover:border-zinc-700"
                    >
                      <span className="font-semibold text-zinc-300">Intel Arrow Lake Draft</span>
                      <span className="text-[10px] text-zinc-500 block font-mono">Wordcount: ~35w | Keyword Density: High</span>
                    </button>
                    <button
                      onClick={() => loadOptimizePreset(
                        "liquid metal cooling",
                        "When setting up liquid metal cooling, freelancers and technicians must exercise absolute caution. This highly conductive interface material can degrade copper heatsinks if not deployed with barrier tape. Our benchmarks prove that liquid metal cooling drops peak loads by up to 12 degrees Celsius under intense rendering."
                      )}
                      className="text-left bg-zinc-900/30 hover:bg-zinc-900 border border-zinc-800/40 rounded-lg p-2 text-xs transition-all hover:border-zinc-700"
                    >
                      <span className="font-semibold text-zinc-300">Liquid Metal Cooling Draft</span>
                      <span className="text-[10px] text-zinc-500 block font-mono">Wordcount: ~45w | Keyword Density: Perfect</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right scorecard analysis */}
            <div className="lg:col-span-5 space-y-6">
              {optLoading && (
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 h-64 justify-center">
                  <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white animate-spin" />
                  <p className="text-zinc-400 text-xs font-mono">Running SEO rules, counting densities, and mapping structures...</p>
                </div>
              )}

              {!optLoading && !optData && (
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500 space-y-3 h-64 flex flex-col items-center justify-center">
                  <Gauge className="w-8 h-8 text-zinc-700 mx-auto" />
                  <p className="text-xs">Grade your article content to review keyword density, readabilities, and check semantic terms.</p>
                </div>
              )}

              {optData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Gauge Ring */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-center space-y-4">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block">CONTENT AUDIT SCORE</span>
                    
                    <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="60"
                          className="stroke-zinc-900"
                          strokeWidth="10"
                          fill="transparent"
                        />
                        <motion.circle
                          cx="72"
                          cy="72"
                          r="60"
                          className={`${optData.score >= 80 ? "stroke-white" : optData.score >= 60 ? "stroke-zinc-300" : "stroke-zinc-600"}`}
                          strokeWidth="10"
                          fill="transparent"
                          strokeDasharray={377}
                          initial={{ strokeDashoffset: 377 }}
                          animate={{ strokeDashoffset: 377 - (377 * optData.score) / 100 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-serif font-light text-white">{optData.score}</span>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase mt-1">Grade Index</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center pt-2 border-t border-zinc-900">
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase block">Density</span>
                        <span className="text-xs font-bold text-white mt-1 block">{optData.keywordDensity}%</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase block">Readability</span>
                        <span className="text-xs font-bold text-white mt-1 block">{optData.readability}</span>
                      </div>
                    </div>
                  </div>

                  {/* LSI keywords lookup check */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Semantic Topics Check</span>
                    <div className="grid grid-cols-2 gap-2">
                      {optData.lsiKeywordsCheck.map((kw, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-zinc-900/30 rounded-lg border border-zinc-900">
                          <span className="text-[11px] text-zinc-300 truncate mr-2">{kw.keyword}</span>
                          {kw.status === "Present" ? (
                            <span className="bg-white/10 text-white border border-white/15 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded">OK</span>
                          ) : (
                            <span className="bg-zinc-900 text-zinc-600 text-[8px] font-mono px-1.5 py-0.5 rounded">MISSING</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions checklist */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 border-b border-zinc-900 pb-3">Critical Action Items</h3>
                    <div className="space-y-3.5">
                      {optData.actionItems.map((act, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start">
                          <div className="p-0.5 bg-cyan-400/10 border border-cyan-400/20 rounded text-cyan-400 shrink-0 mt-0.5 text-[10px] font-mono">
                            {idx + 1}
                          </div>
                          <p className="text-xs text-zinc-300 leading-normal">{act}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Positive/Negative Lists */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Auditing Breakdown</span>
                    
                    <div className="space-y-3">
                      {optData.positives.map((pos, idx) => (
                        <div key={idx} className="flex gap-2 text-xs text-zinc-400 items-start">
                          <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                          <span>{pos}</span>
                        </div>
                      ))}

                      {optData.negatives.map((neg, idx) => (
                        <div key={idx} className="flex gap-2 text-xs text-zinc-500 items-start">
                          <XCircle className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
                          <span>{neg}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* VIEW 3: PROPOSALS / PITCH BUILDER */}
        {activeSubTab === "pitch" && (
          <motion.div
            key="pitch"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Config Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-5">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Proposal Configurator</h3>
                  <p className="text-zinc-500 text-[11px] leading-relaxed">
                    Provide the client's job requirements or brief. AI will construct an incredibly tailored cold pitch complete with transparent development phases.
                  </p>
                </div>

                <form onSubmit={handleGeneratePitch} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Client Requirements / Job Brief</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Paste client brief or job description here..."
                      value={clientBrief}
                      onChange={(e) => setClientBrief(e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-zinc-200 outline-none focus:border-zinc-700 transition-colors resize-y"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Proposed Services</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Full Stack, Technical Writing, SEO"
                      value={services}
                      onChange={(e) => setServices(e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-zinc-200 outline-none focus:border-zinc-700 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Your Technical Skills / Stack</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., React, Node, Tailwind, Firebase"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-2.5 px-3.5 text-sm text-zinc-200 outline-none focus:border-zinc-700 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={pitchLoading}
                    className="w-full bg-white hover:bg-zinc-200 text-black py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {pitchLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Formulating Pitch...
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5 text-black" />
                        Draft Custom Proposal
                      </>
                    )}
                  </button>
                </form>

                {/* Preset Suggestions */}
                <div className="pt-4 border-t border-zinc-900 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider">Freelancer Gig Templates</span>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => loadPitchPreset(
                        "We need a full-stack dashboard for tracking hardware performance indexes over time using React and charts.",
                        "Interactive Spec Matrix Design & Chart Coding",
                        "React, Recharts, Tailwind CSS, Lucide Icons"
                      )}
                      className="text-left bg-zinc-900/30 hover:bg-zinc-900 border border-zinc-800/40 rounded-lg p-2 text-xs transition-all hover:border-zinc-700"
                    >
                      <span className="font-semibold text-zinc-300">Spec Matrix Dashboard</span>
                      <span className="text-[10px] text-zinc-500 block">Stack: React & Recharts</span>
                    </button>
                    <button
                      onClick={() => loadPitchPreset(
                        "Looking for a technical copywriter to draft five dense guides comparing the latest laptop benchmarks under heavy gaming loads.",
                        "In-depth Technical Blog Writing & SEO Auditing",
                        "Technical copywriting, SEO research, performance spec benchmarking"
                      )}
                      className="text-left bg-zinc-900/30 hover:bg-zinc-900 border border-zinc-800/40 rounded-lg p-2 text-xs transition-all hover:border-zinc-700"
                    >
                      <span className="font-semibold text-zinc-300">Technical Writer Gig</span>
                      <span className="text-[10px] text-zinc-500 block">Stack: SEO copywriting</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Proposals view */}
            <div className="lg:col-span-8">
              {pitchLoading && (
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white animate-spin" />
                  <p className="text-zinc-400 text-xs font-mono">Formulating persuasive pitches, structuring milestones, and refining USP...</p>
                </div>
              )}

              {!pitchLoading && !pitchData && (
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500 space-y-3">
                  <Mail className="w-8 h-8 text-zinc-700 mx-auto" />
                  <p className="text-xs">Compile highly polished technical pitches with milestone lists on the left.</p>
                </div>
              )}

              {pitchData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Subject and differentiator */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
                    <div className="space-y-1.5 border-b border-zinc-900 pb-4">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">SUGGESTED SUBJECT LINE</span>
                      
                      <div className="flex justify-between items-center bg-zinc-900/30 border border-zinc-900 rounded-xl p-3">
                        <span className="text-sm font-semibold text-zinc-200">{pitchData.subjectLine}</span>
                        <button
                          onClick={() => handleCopy(pitchData.subjectLine, "subject")}
                          className="hover:text-white flex items-center gap-1 text-zinc-400 transition-colors"
                        >
                          {copiedText === "subject" ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">YOUR UNIQUE VALUE PROPOSITION</span>
                      <p className="text-xs text-zinc-300 leading-normal italic bg-zinc-900/10 p-3 rounded-xl border border-zinc-900">
                        &ldquo;{pitchData.differentiator}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Main Pitch Email Text */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">Personalized Pitch Proposal</h3>
                      <button
                        onClick={() => handleCopy(pitchData.proposalText, "proposal")}
                        className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
                      >
                        {copiedText === "proposal" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Proposal Markdown</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-xs text-zinc-300 leading-relaxed font-sans whitespace-pre-wrap space-y-3 select-text select-all">
                      {pitchData.proposalText}
                    </div>
                  </div>

                  {/* Milestone timelines list */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 border-b border-zinc-900 pb-3">Project Phases & Deliverables</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {pitchData.milestones.map((mile, idx) => (
                        <div key={idx} className="bg-zinc-900/20 border border-zinc-800/80 rounded-xl p-4.5 space-y-3 flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono text-zinc-500 uppercase">Phase {idx + 1}</span>
                              <span className="text-[10px] font-mono text-white bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">{mile.estimatedTime}</span>
                            </div>
                            <h4 className="text-xs font-bold text-zinc-200 mt-1">{mile.name}</h4>
                            <p className="text-[11px] text-zinc-400 leading-normal mt-1">{mile.description}</p>
                          </div>
                          
                          <div className="pt-2 flex items-center gap-1.5 text-[9px] font-mono text-cyan-400">
                            <Check className="w-3.5 h-3.5" />
                            <span>SLA Target Checked</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
