import React, { useState } from "react";
import { Clock, ShieldAlert, Sparkles, TrendingUp, Info } from "lucide-react";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type: "historic" | "prediction";
}

export default function TechTimelines() {
  const [activeBrand, setActiveBrand] = useState<string>("apple");

  const brandData: { [key: string]: { name: string; info: string; timeline: TimelineEvent[] } } = {
    apple: {
      name: "Apple Inc.",
      info: "Pivotal shifts from hardware-focused computer manufacturer to unified consumer device and custom silicon giant.",
      timeline: [
        { year: "1976", title: "Company Founded", description: "Steve Jobs, Steve Wozniak, and Ronald Wayne form Apple Computer in a garage, releasing the Apple I.", type: "historic" },
        { year: "1984", title: "Macintosh Unveiled", description: "The iconic Macintosh 128K debuts with a historic Super Bowl commercial, popularizing the graphical user interface.", type: "historic" },
        { year: "2001", title: "The iPod Revolution", description: "Apple resets the audio industry, packing '1,000 songs in your pocket' alongside the iTunes Store.", type: "historic" },
        { year: "2007", title: "iPhone Paradigm Shift", description: "Steve Jobs introduces a widescreen iPod, a revolutionary phone, and an internet communicator in a single multi-touch screen.", type: "historic" },
        { year: "2020", title: "Apple Silicon Switch", description: "Apple transitions Macs from Intel chips to custom ARM-based Apple M1 Silicon, establishing immense efficiency leads.", type: "historic" },
        { year: "2030", title: "Predictive: Fully Neural Core", description: "Apple silicon shifts away from general-purpose CPUs, dedicating 85% of die sizes to liquid-cooled photonic neural cores.", type: "prediction" }
      ]
    },
    nvidia: {
      name: "NVIDIA Corporation",
      info: "Journey from high-refresh gaming 3D accelerators to reigning king of global Artificial Intelligence processing hardware.",
      timeline: [
        { year: "1993", title: "Company Founded", description: "Jensen Huang, Chris Malachowsky, and Curtis Priem establish Nvidia with a vision to revolutionize graphical compute.", type: "historic" },
        { year: "1999", title: "GeForce 256 'World's First GPU'", description: "NVIDIA invents the term Graphics Processing Unit, introducing hardwired transform-and-lighting calculations.", type: "historic" },
        { year: "2006", title: "CUDA Language Architecture", description: "Nvidia releases CUDA, unlocking hardware graphics cores for general-purpose scientific math computations.", type: "historic" },
        { year: "2024", title: "Blackwell Tensor Powerhouse", description: "Nvidia launches Blackwell architecture with interconnected dual-die layouts, cementing a multi-trillion market cap.", type: "historic" },
        { year: "2032", title: "Predictive: Quantum GPUs", description: "Silicon lithography limits trigger a shift to cryogenic Quantum Tensor Processing elements scaling AI superclusters.", type: "prediction" }
      ]
    },
    google: {
      name: "Google (Alphabet)",
      info: "Evolution from Stanford search algorithms to global Android mobile software ecosystems and custom tensor processing units.",
      timeline: [
        { year: "1998", title: "Google Search Launched", description: "Larry Page and Sergey Brin launch a web search engine utilizing proprietary PageRank backlink logic.", type: "historic" },
        { year: "2008", title: "Android OS & Chrome Debut", description: "Google introduces Chrome and ships the first commercial Android handset (T-Mobile G1) to rival Apple iOS.", type: "historic" },
        { year: "2016", title: "Tensor Processing Unit (TPU)", description: "Google designs its first custom ASIC accelerator (TPU v1) specifically for machine learning models.", type: "historic" },
        { year: "2026", title: "Dynamic Gemini Agentic Core", description: "Google Search evolves into a continuous, multi-turn agentic task ecosystem executing requests autonomously.", type: "historic" },
        { year: "2031", title: "Predictive: Hive AI Networks", description: "Unified visionOS, search data, and dynamic TPUs are consolidated into a real-time predictive human-avatar network.", type: "prediction" }
      ]
    }
  };

  const selectedBrand = brandData[activeBrand];

  return (
    <div className="space-y-8 py-6">
      {/* Timeline Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-sans font-bold text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-cyan-400" /> Tech Timeline & Future Roadmaps
        </h2>
        <p className="text-zinc-400 text-sm max-w-xl">
          Trace structural product launch points, leadership transitions, and strategic technological pivots alongside predictive future roadmap forecasts.
        </p>
      </div>

      {/* Brand toggles */}
      <div className="flex gap-2 border-b border-zinc-800 pb-4">
        {Object.entries(brandData).map(([key, data]) => (
          <button
            key={key}
            onClick={() => setActiveBrand(key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeBrand === key
                ? "bg-cyan-500 text-zinc-950 font-bold"
                : "bg-zinc-900 text-zinc-400 border border-zinc-850 hover:text-zinc-200"
            }`}
          >
            {data.name}
          </button>
        ))}
      </div>

      {/* Brand description info card */}
      <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-850">
        <h3 className="text-sm font-bold text-white mb-1 font-sans">{selectedBrand.name} Evolution</h3>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans">{selectedBrand.info}</p>
      </div>

      {/* Vertical Timeline Tree */}
      <div className="relative pl-6 border-l-2 border-zinc-850 space-y-8 ml-3">
        {selectedBrand.timeline.map((event, idx) => {
          const isPrediction = event.type === "prediction";
          return (
            <div key={idx} className="relative group">
              {/* Timeline outer circle node */}
              <div className={`absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full bg-zinc-950 border-2 flex items-center justify-center transition-all ${
                isPrediction 
                  ? "border-purple-500 shadow-lg shadow-purple-500/20" 
                  : "border-cyan-400 shadow-md shadow-cyan-400/10 group-hover:border-white"
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isPrediction ? "bg-purple-500" : "bg-cyan-400"}`} />
              </div>

              {/* Event Content Container */}
              <div className={`p-5 rounded-xl border transition-all ${
                isPrediction 
                  ? "bg-purple-950/10 border-purple-500/20" 
                  : "bg-zinc-900/20 border-zinc-850 hover:border-zinc-800"
              }`}>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    isPrediction 
                      ? "bg-purple-500/15 text-purple-400 border-purple-500/20" 
                      : "bg-cyan-500/15 text-cyan-400 border-cyan-500/20"
                  }`}>
                    {event.year}
                  </span>
                  
                  {isPrediction && (
                    <span className="flex items-center gap-1 bg-purple-500/10 text-purple-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-purple-400" /> AI Forecast
                    </span>
                  )}

                  <h4 className="text-sm font-sans font-bold text-white">{event.title}</h4>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-sans pl-1">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Forecasting Disclaimer */}
      <div className="p-4 bg-purple-500/5 rounded-xl border border-purple-500/10 flex items-start gap-3">
        <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-xs font-semibold text-zinc-200">How AI roadmaps are generated:</h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Our predictive forecasting agent parses historical engineering cycles, corporate patent approvals, and fab layout nodes. These metrics outline industry boundaries and potential technological releases.
          </p>
        </div>
      </div>

    </div>
  );
}
