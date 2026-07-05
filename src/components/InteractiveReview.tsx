import React, { useState } from "react";
import { Tv, Sparkles, Smartphone, ShieldCheck, HelpCircle, ArrowRight, Gauge, Layers } from "lucide-react";

export default function InteractiveReview() {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [lensPosition, setLensPosition] = useState(50);
  const [batteryLoad, setBatteryLoad] = useState(1); // 1 = low, 2 = medium, 3 = maximum gaming load

  const batteryHours = batteryLoad === 1 ? "18 Hours (Standard)" : batteryLoad === 2 ? "11 Hours (Heavy multitasking)" : "5.5 Hours (Ultra graphics)";
  const batteryPercentage = batteryLoad === 1 ? 100 : batteryLoad === 2 ? 60 : 25;

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-sans font-bold text-white flex items-center gap-2">
          <Tv className="w-6 h-6 text-cyan-400" /> Interactive Reviews
        </h2>
        <p className="text-zinc-400 text-sm max-w-xl">
          Experience hardware reviews like never before. Rotate custom device grids, toggle live synthetic thermal loads, and drag camera slider details.
        </p>
      </div>

      {/* Main split grid: 3D phone rotation & battery/slider metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Interactive 3D SVG phone container */}
        <div className="bg-zinc-950 border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between items-center min-h-[400px]">
          <div className="w-full flex justify-between items-center text-xs font-mono text-zinc-500 pb-4 border-b border-zinc-900">
            <span>Module: Interactive 3D Wireframe</span>
            <span className="text-cyan-400 font-bold">Angle: {rotationAngle}°</span>
          </div>

          {/* Interactive rotated phone body using basic SVG transforms */}
          <div className="relative w-64 h-80 flex items-center justify-center my-6">
            <svg 
              className="w-48 h-72 transition-all duration-300"
              style={{ transform: `rotateY(${rotationAngle}deg)` }}
              viewBox="0 0 200 320"
            >
              {/* Phone Frame */}
              <rect x="10" y="10" width="180" height="300" rx="20" fill="#09090b" stroke="#14b8a6" strokeWidth="3" />
              {/* Screen Area */}
              <rect x="16" y="16" width="168" height="288" rx="15" fill="#18181b" stroke="#27272a" strokeWidth="1" />
              
              {/* Dynamic Screen Contents */}
              <circle cx="100" cy="30" r="4" fill="#000" /> {/* Dynamic island */}
              <rect x="40" y="80" width="120" height="4" rx="2" fill="#22d3ee" fillOpacity="0.4" />
              <rect x="40" y="100" width="80" height="4" rx="2" fill="#a78bfa" fillOpacity="0.4" />

              {/* Back elements (Only visible if rotated past 90 degrees or before -90) */}
              {Math.abs(rotationAngle) > 90 && Math.abs(rotationAngle) < 270 && (
                <g>
                  {/* Overlay camera deck on back */}
                  <rect x="25" y="25" width="150" height="270" rx="15" fill="#09090b" />
                  <rect x="35" y="35" width="55" height="55" rx="10" fill="#18181b" stroke="#22d3ee" strokeWidth="1.5" />
                  <circle cx="50" cy="50" r="8" fill="#000" stroke="#a78bfa" strokeWidth="2" />
                  <circle cx="75" cy="50" r="6" fill="#000" stroke="#22d3ee" strokeWidth="1" />
                  <circle cx="50" cy="75" r="6" fill="#000" stroke="#a78bfa" strokeWidth="1" />
                  <span className="text-[10px] text-zinc-500 font-mono">Back side</span>
                </g>
              )}
            </svg>

            {/* Indicator badge */}
            <span className="absolute bottom-1 bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[9px] px-2 py-0.5 rounded uppercase">
              {Math.abs(rotationAngle) > 90 && Math.abs(rotationAngle) < 270 ? "Rear Chassis view" : "Front display view"}
            </span>
          </div>

          {/* Slider input for wireframe angle */}
          <div className="w-full space-y-2 pt-4 border-t border-zinc-900">
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span className="font-sans">Rotate smartphone chassis (0° - 360°)</span>
              <span className="font-mono">{rotationAngle}°</span>
            </div>
            <input 
              type="range"
              min="0"
              max="360"
              value={rotationAngle}
              onChange={(e) => setRotationAngle(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-zinc-900 cursor-ew-resize h-1.5 rounded-lg appearance-none"
            />
          </div>
        </div>

        {/* Experiential Camera compare & Battery simulation */}
        <div className="space-y-6">
          
          {/* Slider Comparison: Camera zoom */}
          <div className="bg-zinc-900/40 border border-zinc-850 p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Camera Lens detail Comparison Slider
            </h3>
            
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Drag the separator to evaluate native RAW capture (left) vs. automated 4x machine-learning super-sampling upscale algorithms (right).
            </p>

            {/* Dynamic camera compare slide window */}
            <div className="relative h-44 w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800">
              {/* Base Left image: RAW (slightly blurry / high grain) */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-black flex items-center justify-center">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Original Sensor RAW</span>
                  <span className="text-xl font-bold text-zinc-300 font-serif block select-none">4K Grainy Capture</span>
                </div>
              </div>

              {/* Sliding Right Image Container (Upscaled sharp detail) */}
              <div 
                className="absolute inset-y-0 right-0 overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950 via-zinc-950 to-black border-l-2 border-cyan-400"
                style={{ left: `${lensPosition}%` }}
              >
                {/* Compensate container content scroll position */}
                <div className="absolute inset-y-0 right-0 w-[400px] flex items-center justify-center">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">AI Super-Sampled Core</span>
                    <span className="text-xl font-bold text-cyan-200 font-sans block select-none">High-Fidelity sharp Details</span>
                  </div>
                </div>
              </div>

              {/* Left/Right overlay labels */}
              <span className="absolute top-3 left-3 bg-zinc-900/90 text-[10px] text-zinc-400 font-mono px-2 py-0.5 rounded-full border border-zinc-800">Sensor RAW</span>
              <span className="absolute top-3 right-3 bg-cyan-950/90 text-[10px] text-cyan-400 font-mono px-2 py-0.5 rounded-full border border-cyan-500/20 font-bold">Neural HD</span>
            </div>

            {/* Range input for camera zoom divider */}
            <div className="space-y-1">
              <input 
                type="range"
                min="0"
                max="100"
                value={lensPosition}
                onChange={(e) => setLensPosition(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-zinc-950 cursor-ew-resize h-1.5 rounded-lg appearance-none border border-zinc-900"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>Left: 100% RAW</span>
                <span>Divider: {lensPosition}%</span>
                <span>Right: 100% Neural</span>
              </div>
            </div>
          </div>

          {/* Animated Battery Discharge load simulation */}
          <div className="bg-zinc-900/40 border border-zinc-850 p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Gauge className="w-4 h-4" /> Thermal load & Battery drain simulator
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setBatteryLoad(1)}
                className={`flex-1 py-2 rounded-lg text-[10px] uppercase font-bold tracking-wider border transition-colors ${
                  batteryLoad === 1 
                    ? "bg-cyan-500 text-zinc-950 border-cyan-500 font-extrabold" 
                    : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Standard Web
              </button>
              <button
                onClick={() => setBatteryLoad(2)}
                className={`flex-1 py-2 rounded-lg text-[10px] uppercase font-bold tracking-wider border transition-colors ${
                  batteryLoad === 2 
                    ? "bg-cyan-500 text-zinc-950 border-cyan-500 font-extrabold" 
                    : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                HEAVY MULTITASK
              </button>
              <button
                onClick={() => setBatteryLoad(3)}
                className={`flex-1 py-2 rounded-lg text-[10px] uppercase font-bold tracking-wider border transition-colors ${
                  batteryLoad === 3 
                    ? "bg-cyan-500 text-zinc-950 border-cyan-500 font-extrabold" 
                    : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                MAX GAMING LOAD
              </button>
            </div>

            {/* Display active battery metrics */}
            <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-850 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-sans">Sustained Lifespan prediction:</span>
                <span className="text-white font-mono font-bold">{batteryHours}</span>
              </div>

              {/* Custom charging bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>Battery State</span>
                  <span>{batteryPercentage}%</span>
                </div>
                <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      batteryLoad === 1 ? "bg-emerald-500" : batteryLoad === 2 ? "bg-yellow-400" : "bg-red-500"
                    }`}
                    style={{ width: `${batteryPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
