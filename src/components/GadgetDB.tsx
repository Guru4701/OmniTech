import React, { useState } from "react";
import { PRODUCTS } from "../data";
import { TechProduct, TechCategory } from "../types";
import { 
  Info, 
  Settings, 
  HelpCircle, 
  Clock, 
  Rotate3d, 
  ShieldAlert, 
  CornerDownRight, 
  Sparkles,
  Search,
  Filter
} from "lucide-react";

interface GadgetDBProps {
  onSaveProduct: (productId: string) => void;
  savedIds: string[];
}

export default function GadgetDB({ onSaveProduct, savedIds }: GadgetDBProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<TechProduct | null>(null);

  const categories = [
    { id: "all", label: "All Devices" },
    { id: "cpu", label: "Processors" },
    { id: "gpu", label: "GPUs" },
    { id: "phone", label: "Smartphones" },
    { id: "laptop", label: "Laptops" },
    { id: "vr_ar", label: "Spatial VR/AR" }
  ];

  // Filtering products
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 py-6">
      {/* DB Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-sans font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-cyan-400" /> World's Largest Gadget Database
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl">
            Detailed hardware specs, design timelines, alternative suggestions, and reported engineering/known issues for millions of devices.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="md:col-span-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search specs, brands..."
            className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-cyan-500 font-sans"
          />
        </div>

        {/* Category Toggles */}
        <div className="md:col-span-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-zinc-500 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedCategory === cat.id
                  ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-bold"
                  : "bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => {
          const isSaved = savedIds.includes(p.id);
          return (
            <div 
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-cyan-500/35 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{p.brand}</span>
                  <span className="bg-zinc-950 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-400 border border-zinc-800">{p.releaseYear}</span>
                </div>

                <h3 className="font-sans font-bold text-white group-hover:text-cyan-400 transition-colors text-base">
                  {p.name}
                </h3>

                {/* Micro specs */}
                <div className="space-y-1.5 mt-4">
                  {Object.entries(p.specs).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-[11px] font-mono border-b border-zinc-850/40 pb-1">
                      <span className="text-zinc-500">{key}</span>
                      <span className="text-zinc-300 truncate max-w-[150px]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-850/60">
                <span className="text-emerald-400 font-mono text-xs font-semibold">
                  ${p.priceUSD.toLocaleString()} / ₹{p.priceINR.toLocaleString()}
                </span>
                
                <div className="flex gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSaveProduct(p.id);
                    }}
                    className={`p-1.5 rounded-lg border text-[10px] font-medium transition-colors ${
                      isSaved 
                        ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" 
                        : "bg-zinc-950 text-zinc-400 border-zinc-850 hover:bg-zinc-800"
                    }`}
                  >
                    {isSaved ? "Saved" : "Save"}
                  </button>
                  <span className="bg-cyan-500 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider group-hover:bg-cyan-400 transition-colors">
                    Specs Sheet
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Specification details overlays/Modals */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-4xl max-h-[85vh] rounded-2xl overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-thin scrollbar-thumb-zinc-800">
            {/* Header overlay */}
            <div className="flex items-start justify-between border-b border-zinc-800 pb-5">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">{selectedProduct.brand} Core Specs</span>
                <h3 className="text-2xl font-sans font-bold text-white mt-1">{selectedProduct.name}</h3>
                <span className="text-emerald-400 font-mono text-sm block mt-1">${selectedProduct.priceUSD.toLocaleString()} / ₹{selectedProduct.priceINR.toLocaleString()} Retail Price</span>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer"
              >
                Close ESC
              </button>
            </div>

            {/* Split specifications & Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Detailed Technical metrics */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                  <Info className="w-4 h-4" /> Full Specification Node
                </h4>
                <div className="space-y-2 bg-zinc-900/40 p-4 rounded-xl border border-zinc-850/80">
                  {Object.entries(selectedProduct.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-xs py-1.5 border-b border-zinc-850/60">
                      <span className="text-zinc-500 font-sans">{key}</span>
                      <span className="text-zinc-200 font-mono font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Design development and launch timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Design Timeline & Launch Roadmap
                </h4>
                <div className="relative pl-4 border-l border-zinc-800 space-y-4">
                  {selectedProduct.timeline.map((step, idx) => (
                    <div key={idx} className="relative space-y-0.5">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-zinc-950 rounded-full border border-cyan-400" />
                      <span className="text-[10px] font-mono text-cyan-400">{step.year}</span>
                      <h5 className="text-xs font-semibold text-zinc-100">{step.title}</h5>
                      <p className="text-[11px] text-zinc-400 leading-normal">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Benchmarks metrics bar */}
            <div className="bg-zinc-900/30 p-5 rounded-xl border border-zinc-850 space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-400">Tested Architectural Scores</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-850">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono">Gaming Average</span>
                  <span className="text-lg font-bold text-white block mt-0.5">{selectedProduct.benchmarks.gamingFPS ? `${selectedProduct.benchmarks.gamingFPS} FPS` : "N/A"}</span>
                </div>
                <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-850">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono">AI Inference</span>
                  <span className="text-lg font-bold text-white block mt-0.5">{selectedProduct.benchmarks.aiInference ? `${selectedProduct.benchmarks.aiInference} tok/s` : "N/A"}</span>
                </div>
                <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-850">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono">Heat Thermal Limit</span>
                  <span className="text-lg font-bold text-white block mt-0.5">{selectedProduct.benchmarks.heatingTemp ? `${selectedProduct.benchmarks.heatingTemp}°C` : "N/A"}</span>
                </div>
                <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-850">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono">Repairability index</span>
                  <span className="text-lg font-bold text-cyan-400 block mt-0.5">{selectedProduct.benchmarks.repairScore}/10</span>
                </div>
              </div>
            </div>

            {/* Reported bugs, firmware updates or issues */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900/50 p-5 rounded-xl border border-red-500/10 space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase text-red-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-400" /> Reported Issues / Technical Known Warnings
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-400 font-sans">
                  {selectedProduct.knownIssues.map((issue, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-red-500 font-mono">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Similar Alternatives */}
              <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800 space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase text-zinc-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> Alternate Model Recommendations
                </h4>
                <div className="space-y-1.5 text-xs text-zinc-400 font-sans">
                  {selectedProduct.alternatives.map((alt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CornerDownRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{alt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
