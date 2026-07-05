import React, { useState, useEffect } from "react";
import { 
  Cpu, 
  TrendingUp, 
  Sparkles, 
  DollarSign, 
  Flame, 
  Play, 
  ArrowRight,
  TrendingDown,
  Clock,
  ThumbsUp,
  MessageCircle,
  Tv,
  RefreshCw
} from "lucide-react";
import { PRODUCTS, NEWS_CLUSTERS } from "../data";
import { TechProduct } from "../types";

interface TechFeedProps {
  onSelectProduct: (productId: string) => void;
  onSaveProduct: (productId: string) => void;
  savedIds: string[];
  newsClusters?: any[];
  nextUpdateInMs?: number;
  loadingNews?: boolean;
  onManualRefreshNews?: () => void;
}

export default function TechFeed({ 
  onSelectProduct, 
  onSaveProduct, 
  savedIds,
  newsClusters = [],
  nextUpdateInMs = 300000,
  loadingNews = false,
  onManualRefreshNews
}: TechFeedProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [secondsLeft, setSecondsLeft] = useState<number>(Math.floor(nextUpdateInMs / 1000));

  useEffect(() => {
    setSecondsLeft(Math.floor(nextUpdateInMs / 1000));
  }, [nextUpdateInMs]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  const topics = [
    { id: "all", label: "All Tech" },
    { id: "ai", label: "Artificial Intelligence" },
    { id: "gaming", label: "GPUs & Gaming" },
    { id: "silicon", label: "Apple & Custom Silicon" },
    { id: "smartphones", label: "Flagship Phones" },
    { id: "wearables", label: "VR & Smartwatches" }
  ];

  // Filtering logic based on categories/topics
  const filteredProducts = PRODUCTS.filter((p) => {
    if (selectedTopic === "all") return true;
    if (selectedTopic === "ai") return p.specs["NPU TOPS"] || p.specs["Neural Engine"] || p.category === "cpu";
    if (selectedTopic === "gaming") return p.category === "gpu" || p.category === "laptop";
    if (selectedTopic === "silicon") return p.brand === "Apple" || p.brand === "AMD";
    if (selectedTopic === "smartphones") return p.category === "phone";
    if (selectedTopic === "wearables") return p.category === "vr_ar" || p.category === "smartwatch";
    return true;
  });

  const featuredNews = newsClusters.length > 0 ? newsClusters[0] : NEWS_CLUSTERS[0];

  return (
    <div className="space-y-10 py-6">
      {/* Vision Statement Banner */}
      <div className="relative rounded-2xl bg-gradient-to-br from-zinc-900 to-black p-8 md:p-10 border border-zinc-800 overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 hidden md:block select-none pointer-events-none">
          <div className="text-[140px] font-serif leading-none">MATRIX</div>
        </div>
        
        <span className="text-zinc-500 text-[10px] font-mono tracking-[0.2em] uppercase block mb-3">
          Vision: Unified Technology Matrix
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-light text-white tracking-tight leading-tight">
          Everything Connected. <span className="font-normal italic">Intelligently.</span>
        </h1>
        <p className="text-zinc-400 text-sm max-w-2xl mt-4 leading-relaxed">
          Welcome to your personalized intelligence hub. No more switching sites to check chip specs, watch hands-on reviews, trace company histories, or track price trends. Everything is linked into a single tech knowledge matrix.
        </p>
      </div>

      {/* Dynamic Topic Filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-4">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setSelectedTopic(topic.id)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              selectedTopic === topic.id
                ? "bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20 font-bold"
                : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200"
            }`}
          >
            {topic.label}
          </button>
        ))}
      </div>

      {/* Hero Interactive Split Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Curated Story Cluster */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-sans font-bold text-zinc-100 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" /> Hot Story Clusters
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  Update in <span className="text-cyan-400 font-bold">{formatTime(secondsLeft)}</span>
                </span>
              </div>
              {onManualRefreshNews && (
                <button
                  onClick={onManualRefreshNews}
                  disabled={loadingNews}
                  title="Check for news now"
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 disabled:opacity-50 text-zinc-400 hover:text-white p-1.5 rounded-lg transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingNews ? "animate-spin text-cyan-400" : ""}`} />
                </button>
              )}
            </div>
          </div>

          <div className="bg-zinc-900/60 rounded-xl border border-zinc-800 p-6 hover:border-zinc-700 transition-all group">
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 mb-3">
              <span className="text-purple-400 font-bold uppercase">{featuredNews.category}</span>
              <span>•</span>
              <span>{featuredNews.timestamp}</span>
              <span>•</span>
              <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">Cluster: {featuredNews.sourcesCount} sources</span>
            </div>
            <h3 className="text-lg md:text-xl font-sans font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
              {featuredNews.title}
            </h3>
            <p className="text-zinc-400 text-xs mt-3 leading-relaxed">
              {featuredNews.summary30s}
            </p>

            {/* Impact & Credibility Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-zinc-800/60">
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase font-mono">Tech Impact</span>
                <span className="text-sm font-semibold text-white flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-4 h-4 text-cyan-400" /> {featuredNews.impactScore}% (Extreme)
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase font-mono">AI Verification</span>
                <span className="text-sm font-semibold text-emerald-400 mt-0.5 block">
                  ✓ {featuredNews.credibilityRating} Source
                </span>
              </div>
              <div className="hidden sm:block">
                <span className="text-[10px] text-zinc-500 block uppercase font-mono">Engagement</span>
                <span className="text-sm font-semibold text-zinc-300 flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5 text-zinc-500" /> {featuredNews.reactions.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5 text-zinc-500" /> {featuredNews.reactions.comments}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Upcoming Launch timelines */}
        <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800/80 space-y-5">
          <h2 className="text-lg font-sans font-bold text-zinc-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400 animate-pulse" /> Launch Timeline
          </h2>
          <div className="space-y-4">
            <div className="relative pl-6 border-l border-cyan-500/30">
              <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-cyan-400 -translate-x-1.5 border border-zinc-950 ring-4 ring-cyan-400/20" />
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">Sept 2026</span>
              <h4 className="text-xs font-semibold text-zinc-100 mt-1">Apple iPhone 17 Pro Launch</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">Featuring final TSMC 2nm design weights and unified Apple Intelligence 2.0 layers.</p>
            </div>

            <div className="relative pl-6 border-l border-zinc-800">
              <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-zinc-600 -translate-x-1.5 border border-zinc-950" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Nov 2026</span>
              <h4 className="text-xs font-semibold text-zinc-300 mt-1">NVIDIA Blackwell Ultra Release</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">HBM3e memory buffer density upgrades for heavy rendering superclusters.</p>
            </div>

            <div className="relative pl-6">
              <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-zinc-700 -translate-x-1.5 border border-zinc-950" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Early 2027</span>
              <h4 className="text-xs font-semibold text-zinc-400 mt-1">Intel Lunar Elite SoC</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5">First 1.8nm High-NA EUV lithography runs scheduled for core laptop stacks.</p>
            </div>
          </div>

          <div className="pt-2">
            <div className="p-3 bg-cyan-500/5 rounded-lg border border-cyan-500/10 text-[11px] text-cyan-300/90 leading-relaxed">
              💡 <strong>AI Prediction:</strong> TSMC 2nm wafers will trigger a 35% pricing surge on flagship architectures due to raw lithography tooling expenses.
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Gadgets - "Netflix style sliders" */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-sans font-bold text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" /> Trending Tech Grid
          </h2>
          <span className="text-xs text-zinc-500">Showing {filteredProducts.length} devices matching filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isSaved = savedIds.includes(product.id);
            return (
              <div 
                key={product.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-cyan-500/40 transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Image & Price Drop Badge */}
                <div className="relative h-44 w-full bg-zinc-950 overflow-hidden shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                  
                  {/* Floating tags */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-zinc-900/90 text-zinc-200 text-[10px] font-mono px-2 py-0.5 rounded-full border border-zinc-800">
                      {product.brand}
                    </span>
                    <span className="bg-cyan-500/20 text-cyan-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-cyan-500/30 font-bold uppercase">
                      {product.category}
                    </span>
                  </div>

                  {/* Rating display */}
                  <span className="absolute bottom-3 right-3 bg-zinc-900/80 text-amber-400 text-xs font-mono font-bold px-2 py-0.5 rounded">
                    ★ {product.rating}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-sans font-bold text-white text-base group-hover:text-cyan-400 transition-colors leading-tight">
                      {product.name}
                    </h3>
                    
                    {/* Quick Core specs overview */}
                    <div className="grid grid-cols-2 gap-y-1 gap-x-2 mt-3 mb-4 text-[10px] font-mono text-zinc-400">
                      {Object.entries(product.specs).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="truncate">
                          <span className="text-zinc-500">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase font-mono">Retail Value</span>
                      <span className="text-sm font-semibold text-emerald-400 font-mono">
                        ${product.priceUSD.toLocaleString()} / ₹{product.priceINR.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onSaveProduct(product.id)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                          isSaved 
                            ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" 
                            : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
                        }`}
                      >
                        {isSaved ? "Saved" : "Save"}
                      </button>
                      <button
                        onClick={() => onSelectProduct(product.id)}
                        className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors"
                      >
                        Explore <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Buying / Price Predictor Alert Feature */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center gap-2 text-yellow-400">
            <TrendingDown className="w-5 h-5" />
            <span className="text-xs font-mono font-bold uppercase tracking-wide">Shopping Assistant Alerts</span>
          </div>
          <h3 className="text-lg font-sans font-bold text-white leading-tight">
            Should you buy an NVIDIA RTX GPU right now?
          </h3>
          <p className="text-zinc-400 text-xs leading-relaxed max-w-xl">
            Our predictive price engine estimates a <strong>12% price correction</strong> on 40-series cards within the next 15 days as retailer clearance volumes align with Blackwell arrivals.
          </p>
        </div>
        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/80 text-center space-y-1">
          <span className="text-[10px] text-zinc-500 block uppercase font-mono">Verdict Index</span>
          <span className="text-xl font-sans font-bold text-yellow-400 block">WAIT 10 DAYS</span>
          <span className="text-[10px] text-zinc-400 block font-mono">Predicted drop: -$150</span>
        </div>
      </div>
    </div>
  );
}
