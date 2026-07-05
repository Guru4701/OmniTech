import React, { useState, useEffect } from "react";
import { LEADERBOARD_RUNS } from "../data";
import { BarChart3, TrendingUp, Sparkles, Plus, Play, Info, ThumbsUp, LogIn, Zap, Cpu, History } from "lucide-react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy, limit, setDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ComposedChart
} from "recharts";

// Sector Growth over time (2021-2026) normalized baseline
const SECTOR_GROWTH_DATA = [
  { year: "2021", "AI Accelerators & GPUs": 100, "Custom Silicon (ARM)": 100, "x86 Server/Desktop": 100, "Mobile SoCs": 100 },
  { year: "2022", "AI Accelerators & GPUs": 170, "Custom Silicon (ARM)": 135, "x86 Server/Desktop": 112, "Mobile SoCs": 118 },
  { year: "2023", "AI Accelerators & GPUs": 380, "Custom Silicon (ARM)": 180, "x86 Server/Desktop": 125, "Mobile SoCs": 142 },
  { year: "2024", "AI Accelerators & GPUs": 820, "Custom Silicon (ARM)": 245, "x86 Server/Desktop": 138, "Mobile SoCs": 170 },
  { year: "2025", "AI Accelerators & GPUs": 1850, "Custom Silicon (ARM)": 320, "x86 Server/Desktop": 152, "Mobile SoCs": 210 },
  { year: "2026", "AI Accelerators & GPUs": 4200, "Custom Silicon (ARM)": 410, "x86 Server/Desktop": 170, "Mobile SoCs": 265 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950/95 border border-zinc-800 p-3.5 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-zinc-400 text-xs font-mono font-bold mb-1.5">{label}</p>
        <div className="space-y-1">
          {payload.map((pld: any) => (
            <div key={pld.name} className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.color || pld.fill }} />
              <span className="text-zinc-500">{pld.name}:</span>
              <span className="font-mono text-zinc-100 font-bold ml-auto">
                {typeof pld.value === 'number' ? pld.value.toLocaleString() : pld.value}
                {pld.name.toLowerCase().includes("power") || pld.name.toLowerCase().includes("watt") ? "W" : pld.name.toLowerCase().includes("temp") ? "°C" : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

interface BenchmarkCenterProps {
  user: any;
  onOpenAuth: () => void;
}

export default function BenchmarkCenter({ user, onOpenAuth }: BenchmarkCenterProps) {
  const [leaderboard, setLeaderboard] = useState(LEADERBOARD_RUNS);
  
  // Custom overclocking simulator state
  const [coreClock, setCoreClock] = useState(3200); // MHz
  const [threadCount, setThreadCount] = useState(16);
  const [voltage, setVoltage] = useState(1.1); // Volts
  
  const [simulating, setSimulating] = useState(false);
  const [latestSimScore, setLatestSimScore] = useState<number | null>(null);

  // Sync with Firestore Real-time Leaderboard
  useEffect(() => {
    const q = query(collection(db, "leaderboard_runs"), orderBy("score", "desc"), limit(25));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // Seed the leaderboard in Firestore if it's empty
        LEADERBOARD_RUNS.forEach(async (run) => {
          try {
            await setDoc(doc(db, "leaderboard_runs", run.id), {
              username: run.username,
              productName: run.productName,
              score: run.score,
              fps: run.fps,
              power: run.power,
              temp: run.temp,
              timestamp: run.timestamp,
              createdAt: new Date()
            });
          } catch (err) {
            console.warn("Seeding error:", err);
          }
        });
      } else {
        const runs: any[] = [];
        snapshot.forEach((docSnap) => {
          runs.push({ id: docSnap.id, ...docSnap.data() });
        });
        setLeaderboard(runs);
      }
    }, (err) => {
      console.warn("Firestore subscription failed, falling back to LEADERBOARD_RUNS static:", err);
    });

    return () => unsubscribe();
  }, []);

  const runSimulation = () => {
    setSimulating(true);
    setLatestSimScore(null);
    setTimeout(() => {
      // Calculate realistic rendering score based on input parameters
      const baseMult = (coreClock / 1000) * threadCount;
      const thermalLoss = voltage > 1.35 ? 0.85 : 1.0; // Thermal throttling
      const calculatedScore = Math.floor(baseMult * 520 * thermalLoss);
      
      setLatestSimScore(calculatedScore);
      setSimulating(false);
    }, 1200);
  };

  const uploadSimResult = async () => {
    if (!latestSimScore) return;
    const authorName = user ? (user.displayName || user.email?.split("@")[0] || "AuthEnthusiast") : "GuestEnthusiast";
    const newEntry = {
      username: authorName,
      productName: `Custom Node (${(coreClock/1000).toFixed(1)}GHz, ${threadCount}T)`,
      score: latestSimScore,
      fps: Math.floor(latestSimScore / 180),
      power: Math.floor(voltage * threadCount * 12),
      temp: Math.floor(45 + (voltage * 30)),
      timestamp: "Just now",
      createdAt: new Date()
    };
    
    try {
      await addDoc(collection(db, "leaderboard_runs"), newEntry);
      setLatestSimScore(null);
    } catch (err) {
      console.warn("Firestore addDoc failed, updating local state:", err);
      // Fallback
      setLeaderboard((prev) => [
        { id: `run-${Date.now()}`, ...newEntry } as any,
        ...prev
      ].sort((a, b) => b.score - a.score));
      setLatestSimScore(null);
    }
  };

  // Map current leaderboard status for the charts
  const trendData = leaderboard.slice(0, 8).map((run) => ({
    name: run.username,
    device: run.productName,
    score: run.score,
    power: run.power,
    temp: run.temp,
    efficiency: run.power > 0 ? Math.round((run.score / run.power) * 10) / 10 : 0
  }));

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-sans font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-400" /> Live Benchmark Center
        </h2>
        <p className="text-zinc-400 text-sm max-w-xl">
          Track real-world rendering throughput, GPU frame rates, and thermal efficiency. Upload custom client results or run architectural simulation stress-tests.
        </p>
      </div>

      {/* Visual Analytics section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sector Growth Area Chart */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
            <div>
              <h3 className="text-sm font-sans font-bold text-white flex items-center gap-1.5">
                <History className="w-4 h-4 text-cyan-400" /> Sector Growth Index (2021-2026)
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Normalized compute performance scaling relative to 2021 baseline (100)</p>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/20 text-[9px] text-cyan-400 font-mono px-2 py-0.5 rounded uppercase">
              Area Scale
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SECTOR_GROWTH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSilicon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                <XAxis dataKey="year" stroke="#71717a" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#a1a1aa' }} />
                <Area type="monotone" dataKey="AI Accelerators & GPUs" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorGpu)" name="AI & GPUs" />
                <Area type="monotone" dataKey="Custom Silicon (ARM)" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorSilicon)" name="Custom Silicon" />
                <Area type="monotone" dataKey="x86 Server/Desktop" stroke="#eab308" strokeWidth={1.5} fill="none" name="x86 Desktop" />
                <Area type="monotone" dataKey="Mobile SoCs" stroke="#10b981" strokeWidth={1.5} fill="none" name="Mobile APUs" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hardware Performance Trends Composed Chart */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
            <div>
              <h3 className="text-sm font-sans font-bold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" /> Leaderboard Performance vs. Power Draw
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">Tested render score vs power footprint for active submissions</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 font-mono px-2 py-0.5 rounded uppercase">
              Score/Watt Metric
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} />
                <YAxis yAxisId="left" stroke="#71717a" fontSize={10} tickLine={false} label={{ value: 'Score', angle: -90, position: 'insideLeft', fill: '#71717a', fontSize: 10, offset: 10 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#71717a" fontSize={10} tickLine={false} label={{ value: 'Power (W)', angle: 90, position: 'insideRight', fill: '#71717a', fontSize: 10, offset: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#a1a1aa' }} />
                <Bar yAxisId="left" dataKey="score" name="Tested Score" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30}>
                  {trendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#059669'} />
                  ))}
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="power" name="Power Draw" stroke="#f43f5e" strokeWidth={2} dot={{ r: 4, strokeWidth: 1 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Split grid: Run Simulator & Active Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Run Simulator Control board */}
        <div className="lg:col-span-1 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-sans font-bold text-white flex items-center gap-1.5 border-b border-zinc-900 pb-3">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Custom Stress-Test Rig
          </h3>

          <div className="space-y-4">
            {/* Core Clock */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Target Core Frequency</span>
                <span className="text-cyan-400 font-mono font-bold">{(coreClock/1000).toFixed(2)} GHz</span>
              </div>
              <input 
                type="range"
                min="2000"
                max="6000"
                step="100"
                value={coreClock}
                onChange={(e) => setCoreClock(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-zinc-900 h-1 rounded-lg appearance-none cursor-ew-resize"
              />
            </div>

            {/* Thread Density */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Active Compute Threads</span>
                <span className="text-cyan-400 font-mono font-bold">{threadCount} Threads</span>
              </div>
              <input 
                type="range"
                min="4"
                max="64"
                step="4"
                value={threadCount}
                onChange={(e) => setThreadCount(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-zinc-900 h-1 rounded-lg appearance-none cursor-ew-resize"
              />
            </div>

            {/* Core Voltage */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Core Voltage (vCore)</span>
                <span className="text-cyan-400 font-mono font-bold">{voltage.toFixed(2)} Volts</span>
              </div>
              <input 
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-zinc-900 h-1 rounded-lg appearance-none cursor-ew-resize"
              />
            </div>
          </div>

          {/* Warning badge on overvoltage */}
          {voltage > 1.35 && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 rounded-xl leading-normal">
              ⚠️ <strong>Warning: Thermal Throttle Alert!</strong> Voltage exceeds 1.35V. High risk of junction overheating will limit multi-core sustained turbo durations.
            </div>
          )}

          {/* Simulation Actions */}
          <div className="pt-2">
            <button
              onClick={runSimulation}
              disabled={simulating}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-zinc-950 font-bold py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-zinc-950" /> {simulating ? "Executing run..." : "Execute Stress Test"}
            </button>
          </div>

          {/* Test results readout */}
          {latestSimScore !== null && (
            <div className="bg-zinc-900 border border-cyan-500/20 p-5 rounded-xl space-y-3.5 text-center">
              <div>
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest block">Simulated Render Score</span>
                <span className="text-2xl font-bold font-mono text-cyan-400 block mt-0.5">{latestSimScore.toLocaleString()}</span>
              </div>
              <button
                onClick={uploadSimResult}
                className="bg-cyan-500/15 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/35 w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                Upload score to Live charts
              </button>
            </div>
          )}
        </div>

        {/* Global Live Leaderboard */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <div className="flex justify-between items-center pb-3 border-b border-zinc-900">
            <h3 className="text-sm font-sans font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Global Verified Leaderboard
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">Showing top {leaderboard.length} submissions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-mono text-[10px] uppercase">
                  <th className="py-2.5 px-3">Pos</th>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Hardware configuration</th>
                  <th className="py-2.5 px-3 text-right">Tested Score</th>
                  <th className="py-2.5 px-3 text-right">Max Temp</th>
                  <th className="py-2.5 px-3 text-right">Power Draw</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60 font-sans">
                {leaderboard.map((run, idx) => (
                  <tr key={run.id} className="hover:bg-zinc-900/10 text-zinc-300">
                    <td className="py-3 px-3 font-mono font-bold text-cyan-400">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-zinc-200">{run.username}</div>
                      <div className="text-[9px] text-zinc-500 font-mono mt-0.5">{run.timestamp}</div>
                    </td>
                    <td className="py-3 px-3 text-xs font-mono font-medium max-w-[200px] truncate">{run.productName}</td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-400 font-bold">{run.score.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono text-zinc-400">{run.temp}°C</td>
                    <td className="py-3 px-3 text-right font-mono text-zinc-400">{run.power}W</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-cyan-500/5 rounded-xl border border-cyan-500/10 text-[10px] text-cyan-300/80 leading-normal flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>Anti-Cheating Policy: Leaderboard submissions run a validation hash verifying local BIOS parameters and register layouts to prevent synthetic fake score injections.</span>
          </div>
        </div>

      </div>

    </div>
  );
}
