import React, { useState, useEffect } from "react";
import { 
  Search, 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Activity, 
  Cpu,
  Info,
  History
} from "lucide-react";
import { db } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

interface SpecItem {
  label: string;
  value: string;
}

interface BenchmarkItem {
  metric: string;
  score: number;
  competitorScore: number;
  competitorName: string;
}

interface TimelineItem {
  year: string;
  event: string;
  description: string;
}

interface SearchGraph {
  summary: string;
  pros: string[];
  cons: string[];
  verdict: string;
  specs: SpecItem[];
  benchmarks?: BenchmarkItem[];
  timeline?: TimelineItem[];
}

interface UniversalSearchProps {
  user: any;
  onOpenAuth: () => void;
}

export default function UniversalSearch({ user, onOpenAuth }: UniversalSearchProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchGraph | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);

  const sampleSearches = [
    "RTX 7090",
    "Apple M5 chip",
    "Ryzen AI 9 HX 370",
    "Qualcomm Snapdragon X Elite",
    "Quantum Dot Display"
  ];

  // Sync Search History with Firestore or LocalStorage
  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem("omnitech_search_history");
      if (stored) {
        try {
          setRecentQueries(JSON.parse(stored));
        } catch (e) {}
      }
      return;
    }

    const docRef = doc(db, "users_searches", user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.queries)) {
          setRecentQueries(data.queries);
        }
      }
    }, (err) => {
      console.warn("Firestore searches fetch failed:", err);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setQuery(searchQuery);

    // Save historical search query
    setRecentQueries((prev) => {
      const filtered = prev.filter(q => q.toLowerCase() !== searchQuery.toLowerCase());
      const updated = [searchQuery, ...filtered].slice(0, 5);

      if (user) {
        setDoc(doc(db, "users_searches", user.uid), { queries: updated }, { merge: true })
          .catch(e => console.warn("Error saving search history:", e));
      } else {
        localStorage.setItem("omnitech_search_history", JSON.stringify(updated));
      }
      return updated;
    });

    try {
      const response = await fetch("/api/gemini/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      if (!response.ok) {
        throw new Error("Search service returned error status");
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch intelligence graph. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Search Header */}
      <div className="space-y-3">
        <h2 className="text-2xl font-sans font-bold text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-cyan-400" /> Universal Tech Search
        </h2>
        <p className="text-zinc-400 text-sm max-w-xl">
          Search any gadget, hardware architecture, or tech term. Our AI instantly constructs a complete, interconnected knowledge graph from technical specifications, live reviews, and benchmarks.
        </p>
      </div>

      {/* Main Search Input */}
      <div className="relative">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search RTX 7090, Apple M5, sub-nanometer nodes..."
              className="w-full bg-zinc-900/80 border border-zinc-800 text-white rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-500 transition-all font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-zinc-950 font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            {loading ? "Generating..." : "Generate Graph"}
          </button>
        </form>
      </div>

      {/* Suggestion tags */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider mr-1">Trending:</span>
        {sampleSearches.map((sample) => (
          <button
            key={sample}
            onClick={() => handleSearch(sample)}
            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs px-3 py-1.5 rounded-lg transition-all"
          >
            {sample}
          </button>
        ))}
      </div>

      {/* Search History tags */}
      {recentQueries.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <History className="w-3 h-3 text-cyan-400" /> Recent:
          </span>
          {recentQueries.map((hist) => (
            <button
              key={hist}
              onClick={() => handleSearch(hist)}
              className="bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/15 hover:border-cyan-500/30 text-cyan-400 text-xs px-3 py-1.5 rounded-lg transition-all"
            >
              {hist}
            </button>
          ))}
        </div>
      )}

      {/* Error View */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/25 rounded-xl text-xs text-red-400 flex items-center gap-2">
          <XCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-850 p-6 md:p-8 space-y-6 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-800" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-zinc-800 rounded w-1/4" />
              <div className="h-3 bg-zinc-800 rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-zinc-800 rounded" />
            <div className="h-3 bg-zinc-800 rounded" />
            <div className="h-3 bg-zinc-800 rounded w-2/3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-28 bg-zinc-800 rounded" />
            <div className="h-28 bg-zinc-800 rounded" />
          </div>
        </div>
      )}

      {/* Result Display */}
      {result && !loading && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10" />

          {/* Graph Heading Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center shrink-0">
                <Cpu className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-sans font-bold text-white tracking-tight">
                  {query}
                </h3>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                  Connected Knowledge Graph
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-850 px-3 py-1.5 rounded-lg">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-zinc-300">Synthesis Engine v2.5</span>
            </div>
          </div>

          {/* AI Summary block */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-cyan-400" /> AI Executive Summary
            </h4>
            <p className="text-zinc-300 text-sm leading-relaxed font-sans bg-zinc-900/40 p-4 rounded-xl border border-zinc-850">
              {result.summary}
            </p>
          </div>

          {/* Side-by-Side Pros and Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pros */}
            <div className="bg-zinc-900/50 p-5 rounded-xl border border-emerald-500/10 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" /> Key Strengths
              </h4>
              <ul className="space-y-2 text-xs text-zinc-400 font-sans">
                {result.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-mono mt-0.5">•</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="bg-zinc-900/50 p-5 rounded-xl border border-red-500/10 space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase text-red-400 flex items-center gap-1.5">
                <XCircle className="w-4.5 h-4.5 text-red-400" /> Key Limitations
              </h4>
              <ul className="space-y-2 text-xs text-zinc-400 font-sans">
                {result.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-500 font-mono mt-0.5">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Comprehensive Specifications Table */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Technical Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/20 p-5 rounded-xl border border-zinc-850">
              {result.specs.map((spec, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-zinc-850/60 text-xs">
                  <span className="text-zinc-500 font-sans">{spec.label}</span>
                  <span className="text-zinc-200 font-mono font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benchmarks graph section */}
          {result.benchmarks && result.benchmarks.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-400" /> Real-time Hardware Benchmarks
              </h4>
              <div className="space-y-4 bg-zinc-900/30 p-5 rounded-xl border border-zinc-850">
                {result.benchmarks.map((bench, idx) => {
                  const maxVal = Math.max(bench.score, bench.competitorScore);
                  const scorePct = (bench.score / maxVal) * 100;
                  const compPct = (bench.competitorScore / maxVal) * 100;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <span className="text-xs font-medium text-zinc-300 block">{bench.metric}</span>
                      
                      {/* Metric Progress Bar (Current query) */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                          <span>{query}</span>
                          <span className="font-bold text-cyan-400">{bench.score}</span>
                        </div>
                        <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-900">
                          <div 
                            className="bg-cyan-500 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${scorePct}%` }}
                          />
                        </div>
                      </div>

                      {/* Competitor Compare Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                          <span>vs {bench.competitorName || "Competitor"}</span>
                          <span>{bench.competitorScore}</span>
                        </div>
                        <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-900">
                          <div 
                            className="bg-zinc-700 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${compPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Development / Release Timeline */}
          {result.timeline && result.timeline.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" /> Milestone Timeline
              </h4>
              <div className="space-y-6 border-l border-zinc-800 pl-4 ml-2">
                {result.timeline.map((item, idx) => (
                  <div key={idx} className="relative space-y-1">
                    {/* Circle bullet */}
                    <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 bg-zinc-950 rounded-full border-2 border-cyan-500 ring-4 ring-cyan-500/10" />
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/10 font-bold">
                        {item.year}
                      </span>
                      <span className="text-zinc-200 font-semibold">{item.event}</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans pl-1">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Purchasing Verdict */}
          <div className="bg-gradient-to-r from-cyan-950/10 to-zinc-900/50 p-6 rounded-xl border border-cyan-500/20 space-y-2">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">The Verdict</span>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {result.verdict}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
