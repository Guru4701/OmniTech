import React, { useState, useRef, useEffect } from "react";
import { 
  Terminal, 
  Code, 
  Layers, 
  Wrench, 
  CheckCircle, 
  XCircle, 
  Cpu, 
  Play, 
  Trash2, 
  RefreshCw 
} from "lucide-react";

interface TerminalLine {
  text: string;
  type: "input" | "output" | "error";
}

export default function DevHub() {
  const [activeDevTab, setActiveDevTab] = useState<"terminal" | "playground" | "packages">("terminal");

  // Terminal Simulator State
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    { text: "OmniTech Cloud Console v1.0.0 (Type 'help' for command directory)", type: "output" },
    { text: "guest@omnitech-vm:~$ ", type: "output" }
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Regex Tester State
  const [regexPattern, setRegexPattern] = useState("\\d+");
  const [regexText, setRegexText] = useState("We taped out on 3nm in 2024 and planned 2nm configurations for 2027.");
  const [regexMatchCount, setRegexMatchCount] = useState<number | null>(null);

  // JSON Validator State
  const [jsonText, setJsonText] = useState(`{\n  "architecture": "Blackwell",\n  "cores": 21760,\n  "vram_gb": 32\n}`);
  const [jsonStatus, setJsonStatus] = useState<{ valid: boolean; message: string } | null>(null);

  // Auto scroll terminal
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  // Terminal command processor
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    let newLines: TerminalLine[] = [
      { text: `guest@omnitech-vm:~$ ${terminalInput}`, type: "input" }
    ];

    if (cmd === "help") {
      newLines.push({ text: "Supported commands inside sandbox node:\n" +
                            "  neofetch  - Displays virtual system specifications\n" +
                            "  ls        - List active files in parent directory\n" +
                            "  cat       - View technical details file (e.g. cat details.txt)\n" +
                            "  bench     - Trigger local CPU benchmark run\n" +
                            "  clear     - Wipe console history logs", type: "output" });
    } else if (cmd === "neofetch") {
      newLines.push({ text: "               .,-:;//;:=,      OS: OmniTech Core OS Enterprise\n" +
                            "           . :H@@@MM@M#H/.,+%;, Kernel: 6.8.0-omnitech-x86\n" +
                            "        ,/X+ +M@@M@MM@@@MS:-    Shell: custom bash\n" +
                            "       ,+@H#D: X@@@@@@@@@##:   CPU: Simulated Blackwell Core Node (64T)\n" +
                            "      /@@@MMH: .@M@@@@@@@@M#    RAM: 128 GB Unified LPDDR5X\n" +
                            "     -@@@@@M@H: :@@@@@@@@#@D   Storage: 2.0 TB NVMe Gen5 SSD", type: "output" });
    } else if (cmd === "ls") {
      newLines.push({ text: "details.txt     benchmark_manifest.json     api_secrets.config", type: "output" });
    } else if (cmd === "clear") {
      setTerminalHistory([
        { text: "Console logs cleared. Type 'help' for directory.", type: "output" }
      ]);
      setTerminalInput("");
      return;
    } else if (cmd === "bench") {
      newLines.push({ text: "Launching benchmark threads...\n" +
                            "Thread 01-16: Core calculation validated...\n" +
                            "Benchmark finished! Multi-core score: 14,250 runs/sec (High density limits)", type: "output" });
    } else if (cmd.startsWith("cat ")) {
      const fileName = cmd.replace("cat ", "").trim();
      if (fileName === "details.txt") {
        newLines.push({ text: "Title: OmniTech Unified Hardware Grid\n" +
                              "Node Address: 127.0.0.1 (Ingress reverse proxy active)\n" +
                              "Permissions: Developer Level 12 authenticated.", type: "output" });
      } else {
        newLines.push({ text: `cat: ${fileName}: Permission restricted or file not found`, type: "error" });
      }
    } else {
      newLines.push({ text: `bash: ${cmd}: command unrecognized. Type 'help' to view valid options.`, type: "error" });
    }

    newLines.push({ text: "guest@omnitech-vm:~$ ", type: "output" });
    setTerminalHistory((prev) => [...prev, ...newLines]);
    setTerminalInput("");
  };

  // Regex Evaluator
  const evaluateRegex = () => {
    try {
      const r = new RegExp(regexPattern, "g");
      const matches = regexText.match(r);
      setRegexMatchCount(matches ? matches.length : 0);
    } catch (e) {
      setRegexMatchCount(null);
    }
  };

  // JSON Validator
  const validateJson = () => {
    try {
      JSON.parse(jsonText);
      setJsonStatus({ valid: true, message: "Valid JSON schema! Formatting is syntactically pristine." });
    } catch (e: any) {
      setJsonStatus({ valid: false, message: e.message || "Invalid JSON syntax." });
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-sans font-bold text-white flex items-center gap-2">
          <Code className="w-6 h-6 text-cyan-400" /> Developer Hub
        </h2>
        <p className="text-zinc-400 text-sm max-w-xl">
          Code playgrounds, regex pattern tools, micro-calculators, and interactive Linux container terminal simulations for active hardware developers.
        </p>
      </div>

      {/* Sub tabs */}
      <div className="flex border-b border-zinc-800 pb-4">
        <div className="bg-zinc-900/60 p-1 rounded-xl border border-zinc-850 flex gap-1">
          <button
            onClick={() => setActiveDevTab("terminal")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeDevTab === "terminal"
                ? "bg-cyan-500 text-zinc-950 font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Terminal className="w-4 h-4" /> Linux Terminal
          </button>
          <button
            onClick={() => setActiveDevTab("playground")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeDevTab === "playground"
                ? "bg-cyan-500 text-zinc-950 font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Wrench className="w-4 h-4" /> Playground Tools
          </button>
          <button
            onClick={() => setActiveDevTab("packages")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeDevTab === "packages"
                ? "bg-cyan-500 text-zinc-950 font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Layers className="w-4 h-4" /> Package Rankings
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB CORES */}
      <div className="min-h-[400px]">
        {activeDevTab === "terminal" && (
          <div className="bg-black/90 border-2 border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Terminal Window Header */}
            <div className="bg-zinc-900 px-4 py-3 flex items-center justify-between border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] text-zinc-500 font-mono ml-2">guest@omnitech-vm: ~ (bash)</span>
              </div>
              <span className="text-[9px] font-mono text-zinc-600">Container Node ACTIVE</span>
            </div>

            {/* Terminal Body */}
            <div className="p-5 h-80 overflow-y-auto font-mono text-xs space-y-2 text-zinc-300">
              {terminalHistory.map((line, idx) => (
                <div 
                  key={idx} 
                  className={`whitespace-pre-wrap ${
                    line.type === "input" 
                      ? "text-white font-semibold" 
                      : line.type === "error" 
                        ? "text-red-400" 
                        : "text-emerald-400"
                  }`}
                >
                  {line.text}
                </div>
              ))}
              <div ref={terminalBottomRef} />
            </div>

            {/* Input prompt form */}
            <form onSubmit={handleTerminalSubmit} className="bg-zinc-950 border-t border-zinc-900 p-3 flex">
              <span className="text-zinc-400 font-mono text-xs py-1.5 pl-2 shrink-0">guest@omnitech-vm:~$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="type 'help' to start..."
                className="flex-1 bg-transparent text-white font-mono text-xs py-1.5 px-2 outline-none border-none focus:ring-0 focus:outline-none"
              />
            </form>
          </div>
        )}

        {activeDevTab === "playground" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Tool 1: Regex Match Evaluator */}
            <div className="bg-zinc-950 border border-zinc-850 p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-sans font-bold text-white flex items-center gap-1.5 border-b border-zinc-900 pb-3">
                Regex Matcher Engine
              </h3>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">Regex Pattern</span>
                  <input 
                    type="text"
                    value={regexPattern}
                    onChange={(e) => setRegexPattern(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-cyan-400 font-mono p-2.5 rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">Input Text</span>
                  <textarea 
                    value={regexText}
                    onChange={(e) => setRegexText(e.target.value)}
                    rows={3}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 p-2.5 rounded-xl outline-none font-sans"
                  />
                </div>

                <button
                  onClick={evaluateRegex}
                  className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Evaluate Matches
                </button>

                {regexMatchCount !== null && (
                  <div className="p-3 bg-zinc-900/60 rounded-lg border border-zinc-850 text-xs text-zinc-300">
                    Matches Found: <strong className="text-cyan-400 font-mono">{regexMatchCount} blocks</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Tool 2: JSON Schema Validator */}
            <div className="bg-zinc-950 border border-zinc-850 p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-sans font-bold text-white flex items-center gap-1.5 border-b border-zinc-900 pb-3">
                JSON Payload Debugger
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">Paste JSON schema:</span>
                  <textarea 
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    rows={6}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs text-emerald-400 p-2.5 rounded-xl outline-none font-mono"
                  />
                </div>

                <button
                  onClick={validateJson}
                  className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  Compile & Validate
                </button>

                {jsonStatus !== null && (
                  <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                    jsonStatus.valid 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}>
                    {jsonStatus.valid ? <CheckCircle className="w-4.5 h-4.5" /> : <XCircle className="w-4.5 h-4.5" />}
                    <span>{jsonStatus.message}</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {activeDevTab === "packages" && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-sans font-bold text-white border-b border-zinc-900 pb-3">
              Web Framework Performance Rankings
            </h3>

            <div className="space-y-4">
              {[
                { name: "React", score: 98, stars: "220K", loadSec: "0.22s", status: "Gold Standard" },
                { name: "Svelte", score: 92, stars: "75K", loadSec: "0.08s", status: "Ultra light weight" },
                { name: "SolidJS", score: 89, stars: "32K", loadSec: "0.05s", status: "Fine grained reactive" },
                { name: "Vue", score: 86, stars: "205K", loadSec: "0.18s", status: "Declarative utility" }
              ].map((fw) => (
                <div key={fw.name} className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-sm font-bold text-white block">{fw.name} Framework</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{fw.status}</span>
                  </div>
                  <div className="flex gap-6 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">Repo Stars</span>
                      <span className="text-white font-semibold block">{fw.stars}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">Load Velocity</span>
                      <span className="text-cyan-400 font-bold block">{fw.loadSec}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
