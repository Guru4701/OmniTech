import React, { useState } from "react";
import { MAP_FEATURES } from "../data";
import { MapPin, Info, Sparkles, Server, Cpu, Globe, Rocket } from "lucide-react";

export default function TechMaps() {
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>("map-1");

  const activeFeature = MAP_FEATURES.find((f) => f.id === selectedFeatureId) || MAP_FEATURES[0];

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-sans font-bold text-white flex items-center gap-2">
          <Globe className="w-6 h-6 text-cyan-400" /> Interactive Tech Maps
        </h2>
        <p className="text-zinc-400 text-sm max-w-xl">
          A physical geography of global technology. Click on key fabrication plants, subsea cable landings, rocket launch sites, or core hyperscaler datacenters.
        </p>
      </div>

      {/* Grid Map layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Interactive SVG World Map Grid */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-850 rounded-2xl p-6 relative flex flex-col justify-between items-center min-h-[400px]">
          <div className="w-full flex justify-between items-center text-[10px] font-mono text-zinc-500 pb-3 border-b border-zinc-900">
            <span>Projection: Mercator Flat Grid</span>
            <span className="text-cyan-400 font-bold">Points: {MAP_FEATURES.length} nodes verified</span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full max-w-lg aspect-video my-6">
            <svg 
              className="w-full h-full bg-zinc-900/10 border border-zinc-900/60 rounded-xl"
              viewBox="0 0 400 240"
            >
              {/* Abstract outlines of continental plates */}
              {/* North America */}
              <path d="M 20,40 L 100,30 L 110,60 L 90,110 L 60,110 L 30,70 Z" fill="#18181b" stroke="#27272a" strokeWidth="1" />
              {/* South America */}
              <path d="M 80,120 L 120,130 L 110,190 L 90,230 L 80,210 L 70,140 Z" fill="#18181b" stroke="#27272a" strokeWidth="1" />
              {/* Eurasia / Africa */}
              <path d="M 160,30 L 290,20 L 320,60 L 330,120 L 290,130 L 260,160 L 200,160 L 170,110 L 160,50 Z" fill="#18181b" stroke="#27272a" strokeWidth="1" />
              {/* Africa */}
              <path d="M 170,100 L 220,110 L 230,170 L 210,210 L 190,190 L 180,140 Z" fill="#18181b" stroke="#27272a" strokeWidth="1" />
              {/* Australia */}
              <path d="M 310,160 L 350,155 L 360,185 L 320,190 Z" fill="#18181b" stroke="#27272a" strokeWidth="1" />

              {/* Draw connections lines (undersea data cables) */}
              <path d="M 80,60 Q 140,55 200,60" fill="none" stroke="#0891b2" strokeWidth="0.5" strokeDasharray="3,3" />
              <path d="M 100,50 Q 210,100 320,80" fill="none" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="2,2" />

              {/* Render Map pins from dataset */}
              {MAP_FEATURES.map((feature) => {
                const isSelected = feature.id === selectedFeatureId;
                // Convert coordinates into SVG space roughly
                const x = ((feature.lng + 180) / 360) * 400;
                const y = ((90 - feature.lat) / 180) * 240;

                return (
                  <g 
                    key={feature.id} 
                    onClick={() => setSelectedFeatureId(feature.id)}
                    className="cursor-pointer group"
                  >
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isSelected ? "7" : "4.5"} 
                      fill={isSelected ? "#06b6d4" : "#1e1b4b"} 
                      fillOpacity={isSelected ? "0.3" : "0.5"}
                      className="transition-all"
                    />
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="2" 
                      fill={isSelected ? "#22d3ee" : "#3f3f46"} 
                      stroke={isSelected ? "#ffffff" : "none"}
                      strokeWidth="0.5"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          <span className="text-[10px] text-zinc-500 font-mono">Click a geographical pin on the grid to load full node telemetry</span>
        </div>

        {/* Selected telemetry readout */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-zinc-900 pb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Geographical Telemetry
            </h3>

            {/* Feature Identity Card */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center shrink-0">
                  {activeFeature.type === "fab" && <Cpu className="w-5 h-5 text-cyan-400" />}
                  {activeFeature.type === "datacenter" && <Server className="w-5 h-5 text-cyan-400" />}
                  {activeFeature.type === "launchpad" && <Rocket className="w-5 h-5 text-cyan-400" />}
                </div>
                <div>
                  <h4 className="text-sm font-sans font-bold text-white leading-snug">{activeFeature.name}</h4>
                  <span className="text-[10px] text-zinc-400 font-mono block leading-none mt-0.5">{activeFeature.location}</span>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-2 text-xs">
                <p className="text-zinc-300 font-sans leading-relaxed bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-850">
                  {activeFeature.description}
                </p>
                <div className="p-3.5 rounded-xl border border-zinc-850 space-y-1 bg-zinc-900/10">
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block">Node Operations detail:</span>
                  <p className="text-zinc-400 leading-relaxed font-sans">{activeFeature.details}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-cyan-500/5 rounded-xl border border-cyan-500/10 text-[10px] text-cyan-300 leading-normal flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>Interactive Node telemetry maps utilize public GPS coordinates and verified industrial factory registries.</span>
          </div>
        </div>

      </div>

    </div>
  );
}
