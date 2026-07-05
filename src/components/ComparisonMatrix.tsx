import React, { useState } from "react";
import { PRODUCTS } from "../data";
import { TechProduct } from "../types";
import { 
  Sliders, 
  Trash2, 
  Plus, 
  Info, 
  Sparkles,
  Zap,
  DollarSign,
  Wrench,
  Gauge
} from "lucide-react";

export default function ComparisonMatrix() {
  const [selectedIds, setSelectedIds] = useState<string[]>(["rtx-5090", "m4-max", "ryzen-ai-9"]);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const selectedProducts = PRODUCTS.filter((p) => selectedIds.includes(p.id));
  const availableProducts = PRODUCTS.filter((p) => !selectedIds.includes(p.id));

  const addProduct = (id: string) => {
    if (selectedIds.length >= 10) {
      alert("You can compare up to 10 products simultaneously.");
      return;
    }
    setSelectedIds((prev) => [...prev, id]);
    setShowAddMenu(false);
  };

  const removeProduct = (id: string) => {
    setSelectedIds((prev) => prev.filter((pId) => pId !== id));
  };

  // Compile all unique specification keys across selected products
  const specKeys = Array.from(
    new Set(selectedProducts.flatMap((p) => Object.keys(p.specs)))
  ).slice(0, 8); // Display top 8 specs for layout safety

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-sans font-bold text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-cyan-400" /> Dynamic Product Comparison
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl">
            Compare up to 10 different hardware platforms, CPUs, GPUs, or mobile chips simultaneously across design metrics and cost indicators.
          </p>
        </div>

        {/* Add Product Button */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Device ({selectedIds.length}/10)
          </button>

          {showAddMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-30 p-2 max-h-60 overflow-y-auto scrollbar-thin">
              {availableProducts.length === 0 ? (
                <span className="text-[10px] text-zinc-500 block p-2">All available products added.</span>
              ) : (
                availableProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => addProduct(p.id)}
                    className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span className="font-semibold truncate">{p.name}</span>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">{p.category}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comparison Matrix Grid */}
      {selectedProducts.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-zinc-850 space-y-3">
          <Sliders className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-sans font-semibold text-zinc-400">No devices selected for comparison</h3>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto">Click 'Add Device' at the top right to start comparing specifications and benchmarks.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-800 rounded-2xl bg-zinc-950/40">
          <table className="min-w-full divide-y divide-zinc-850">
            {/* Header row - Product Names & Remove Actions */}
            <thead>
              <tr className="bg-zinc-900/60 divide-x divide-zinc-850/60">
                <th className="px-5 py-4 text-left text-xs font-mono text-zinc-400 uppercase tracking-wider w-56 shrink-0 bg-zinc-900/80 sticky left-0 z-10">
                  Specification Parameters
                </th>
                {selectedProducts.map((p) => (
                  <th key={p.id} className="px-5 py-4 text-left min-w-[200px]">
                    <div className="flex flex-col justify-between h-full gap-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[9px] font-mono text-cyan-400 uppercase bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/10 font-bold">
                          {p.brand}
                        </span>
                        <button
                          onClick={() => removeProduct(p.id)}
                          className="text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-sm font-sans font-bold text-white leading-tight">
                        {p.name}
                      </h4>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Matrix Body */}
            <tbody className="divide-y divide-zinc-850/60 text-xs">
              
              {/* Category node */}
              <tr className="divide-x divide-zinc-850/60 bg-zinc-900/10">
                <td className="px-5 py-3 font-mono font-bold text-zinc-500 uppercase tracking-widest text-[10px] sticky left-0 bg-zinc-950">
                  Device Classification
                </td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="px-5 py-3 font-mono text-zinc-300 uppercase font-semibold">
                    {p.category}
                  </td>
                ))}
              </tr>

              {/* Retail Pricing row */}
              <tr className="divide-x divide-zinc-850/60">
                <td className="px-5 py-3 font-sans font-medium text-zinc-400 flex items-center gap-2 sticky left-0 bg-zinc-950">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> MSRP Pricing
                </td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="px-5 py-3 font-mono text-emerald-400 font-bold">
                    ${p.priceUSD.toLocaleString()} / ₹{p.priceINR.toLocaleString()}
                  </td>
                ))}
              </tr>

              {/* Hardware Performance Score Indicators */}
              <tr className="divide-x divide-zinc-850/60">
                <td className="px-5 py-3 font-sans font-medium text-zinc-400 flex items-center gap-2 sticky left-0 bg-zinc-950">
                  <Gauge className="w-4 h-4 text-cyan-400" /> Gaming FPS (Average)
                </td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="px-5 py-3 font-mono text-white font-semibold">
                    {p.benchmarks.gamingFPS ? `${p.benchmarks.gamingFPS} FPS` : <span className="text-zinc-600">Discrete-GPU only</span>}
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-zinc-850/60">
                <td className="px-5 py-3 font-sans font-medium text-zinc-400 flex items-center gap-2 sticky left-0 bg-zinc-950">
                  <Sparkles className="w-4 h-4 text-purple-400" /> Local AI Inference
                </td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="px-5 py-3 font-mono text-white font-semibold">
                    {p.benchmarks.aiInference ? `${p.benchmarks.aiInference} tokens/s` : <span className="text-zinc-600">N/A</span>}
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-zinc-850/60">
                <td className="px-5 py-3 font-sans font-medium text-zinc-400 flex items-center gap-2 sticky left-0 bg-zinc-950">
                  <Zap className="w-4 h-4 text-yellow-400" /> Thermal Power Draw
                </td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="px-5 py-3 font-mono text-zinc-300">
                    {p.benchmarks.powerWatts ? `${p.benchmarks.powerWatts} Watts` : "Minimal Mobile Draw"}
                  </td>
                ))}
              </tr>

              <tr className="divide-x divide-zinc-850/60">
                <td className="px-5 py-3 font-sans font-medium text-zinc-400 flex items-center gap-2 sticky left-0 bg-zinc-950">
                  <Wrench className="w-4 h-4 text-amber-500" /> Repairability Index
                </td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="px-5 py-3 font-mono font-bold text-amber-400">
                    {p.benchmarks.repairScore}/10
                  </td>
                ))}
              </tr>

              {/* Dynamic Specifications Rows */}
              <tr className="divide-x divide-zinc-850/60 bg-zinc-900/10">
                <td className="px-5 py-3 font-mono font-bold text-zinc-500 uppercase tracking-widest text-[10px] sticky left-0 bg-zinc-950">
                  Architecture Specifications
                </td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="px-5 py-3 text-zinc-500"></td>
                ))}
              </tr>

              {specKeys.map((key) => (
                <tr key={key} className="divide-x divide-zinc-850/60">
                  <td className="px-5 py-3 font-sans font-medium text-zinc-400 sticky left-0 bg-zinc-950">
                    {key}
                  </td>
                  {selectedProducts.map((p) => (
                    <td key={p.id} className="px-5 py-3 text-zinc-300 font-mono text-[11px]">
                      {p.specs[key] || "Not applicable"}
                    </td>
                  ))}
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      )}

      {/* Advisory Note */}
      <div className="p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/10 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-zinc-200">How to analyze custom benchmarks:</h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            MSRP and physical core layouts reflect launch standards. Thermal and rendering parameters represent performance under laboratory conditions. Overclocked settings or chassis limits can restrict actual real-world throughputs.
          </p>
        </div>
      </div>
    </div>
  );
}
