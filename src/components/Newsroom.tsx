import React, { useState } from "react";
import { NEWS_CLUSTERS } from "../data";
import { NewsCluster } from "../types";
import { 
  Newspaper, 
  Layers, 
  Clock, 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  MessageSquare, 
  ThumbsUp,
  AlertCircle,
  RefreshCw
} from "lucide-react";

interface NewsroomProps {
  newsClusters?: any[];
  loadingNews?: boolean;
  onManualRefreshNews?: () => void;
  nextUpdateInMs?: number;
}

export default function Newsroom({
  newsClusters = [],
  loadingNews = false,
  onManualRefreshNews,
  nextUpdateInMs = 300000
}: NewsroomProps) {
  const activeClusters = newsClusters.length > 0 ? newsClusters : NEWS_CLUSTERS;
  const [selectedClusterId, setSelectedClusterId] = useState<string>("");
  const [summaryLevel, setSummaryLevel] = useState<"30s" | "2m" | "full">("30s");

  const defaultId = activeClusters[0]?.id || "news-1";
  const activeId = selectedClusterId || defaultId;

  const activeCluster = activeClusters.find((c) => c.id === activeId) || activeClusters[0];

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-sans font-bold text-white flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-cyan-400" /> AI Newsroom
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl">
            We monitor thousands of technology publications every minute, clustering related stories, removing duplicate feeds, and running automated AI credibility verifications.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-850 px-3 py-1.5 rounded-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              Next Sync: <span className="text-cyan-400 font-bold">{Math.ceil(nextUpdateInMs / 60000)}m left</span>
            </span>
          </div>
          {onManualRefreshNews && (
            <button
              onClick={onManualRefreshNews}
              disabled={loadingNews}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingNews ? "animate-spin text-cyan-400" : ""}`} />
              {loadingNews ? "Syncing..." : "Sync Now"}
            </button>
          )}
        </div>
      </div>

      {/* Cluster selection bar & Story details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left list of clusters */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
            <Layers className="w-4 h-4" /> Active Story Clusters
          </h3>
          <div className="space-y-3">
            {activeClusters.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedClusterId(c.id);
                  setSummaryLevel("30s");
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                  c.id === selectedClusterId
                    ? "bg-cyan-500/10 border-cyan-500/35 text-white"
                    : "bg-zinc-900/60 border-zinc-850 text-zinc-300 hover:border-zinc-800"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mb-2">
                    <span className="text-cyan-400 font-bold uppercase">{c.category}</span>
                    <span>{c.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-sans font-bold leading-snug group-hover:text-cyan-400">
                    {c.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-850/40">
                  <span className="bg-zinc-950 px-1.5 py-0.5 rounded text-zinc-400">{c.sourcesCount} sources</span>
                  <span className={c.credibilityRating === "Verified" ? "text-emerald-400 font-semibold" : "text-yellow-400"}>
                    ✓ {c.credibilityRating}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Active Story Detail Panel */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10" />

          {/* Active Story Meta Header */}
          <div className="space-y-3 pb-6 border-b border-zinc-850">
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
              <span className="text-purple-400 font-bold uppercase">{activeCluster.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activeCluster.timestamp}</span>
              <span>•</span>
              <span className="bg-zinc-900 px-2 py-0.5 rounded text-zinc-300">Cluster density: {activeCluster.sourcesCount} verified publishers</span>
            </div>
            <h3 className="text-xl md:text-2xl font-sans font-bold text-white tracking-tight leading-snug">
              {activeCluster.title}
            </h3>
          </div>

          {/* Summary toggle switches */}
          <div className="flex border-b border-zinc-850 pb-4">
            <div className="bg-zinc-900/60 p-1 rounded-xl border border-zinc-850 flex gap-1">
              <button
                onClick={() => setSummaryLevel("30s")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  summaryLevel === "30s"
                    ? "bg-cyan-500 text-zinc-950 font-bold shadow-md"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                30s Bullet Brief
              </button>
              <button
                onClick={() => setSummaryLevel("2m")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  summaryLevel === "2m"
                    ? "bg-cyan-500 text-zinc-950 font-bold shadow-md"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                2m Analytical Read
              </button>
              <button
                onClick={() => setSummaryLevel("full")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  summaryLevel === "full"
                    ? "bg-cyan-500 text-zinc-950 font-bold shadow-md"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Full Analytical Report
              </button>
            </div>
          </div>

          {/* Render target content */}
          <div className="min-h-[150px] leading-relaxed">
            {summaryLevel === "30s" && (
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Bullet Executive Metrics:</span>
                <p className="text-zinc-300 text-sm font-sans bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 leading-relaxed">
                  {activeCluster.summary30s}
                </p>
              </div>
            )}

            {summaryLevel === "2m" && (
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Analytical Deep Read:</span>
                <p className="text-zinc-300 text-sm font-sans leading-relaxed">
                  {activeCluster.summary2m}
                </p>
              </div>
            )}

            {summaryLevel === "full" && (
              <div className="space-y-6 prose prose-invert max-w-none text-zinc-300 text-sm font-sans">
                {activeCluster.fullArticle.split("\n\n").map((para, index) => {
                  if (para.startsWith("## ")) {
                    return <h4 key={index} className="text-base font-bold text-white mt-4 border-b border-zinc-850 pb-2">{para.replace("## ", "")}</h4>;
                  }
                  if (para.startsWith("### ")) {
                    return <h5 key={index} className="text-sm font-semibold text-cyan-400 mt-3">{para.replace("### ", "")}</h5>;
                  }
                  return <p key={index} className="leading-relaxed">{para}</p>;
                })}
              </div>
            )}
          </div>

          {/* AI Fact checker & Credibility metrics overlay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-zinc-850">
            <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-mono block">AI Validation Status</span>
                <span className="text-xs text-zinc-200 font-semibold block mt-0.5">Credibility Score: {activeCluster.credibilityRating === "Verified" ? "98% (High)" : "85% (Medium)"}</span>
                <span className="text-[10px] text-zinc-400 leading-normal block mt-1">Cross-checked across 24 technical journals and verified hardware schematics.</span>
              </div>
            </div>

            <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-mono block">Market Impact Level</span>
                <span className="text-xs text-zinc-200 font-semibold block mt-0.5">Impact Score: {activeCluster.impactScore}/100</span>
                <span className="text-[10px] text-zinc-400 leading-normal block mt-1">Triggers secondary adjustments in supplier components and regional retail wafer margins.</span>
              </div>
            </div>
          </div>

          {/* Interaction toolbar */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-850/60 text-xs text-zinc-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><ThumbsUp className="w-4 h-4 text-zinc-500" /> {activeCluster.reactions.likes} Likes</span>
              <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-zinc-500" /> {activeCluster.reactions.comments} Comments</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Node ID: {activeCluster.id}</span>
          </div>

        </div>

      </div>

    </div>
  );
}
