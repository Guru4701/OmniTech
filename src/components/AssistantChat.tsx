import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  HelpCircle,
  TrendingUp,
  Cpu,
  BookOpen,
  Plus,
  Trash2,
  Search,
  Copy,
  Check,
  X,
  ArrowUpRight,
  FolderHeart,
  Tag,
  Filter,
  ArrowRight
} from "lucide-react";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db, FirebaseUser } from "../firebase";
import { motion, AnimatePresence } from "motion/react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface SavedPrompt {
  id: string;
  title: string;
  prompt: string;
  tags: string[];
  userId?: string;
  isBuiltIn?: boolean;
}

interface AssistantChatProps {
  user: FirebaseUser | null;
  onOpenAuth?: () => void;
}

const BUILT_IN_PROMPTS: SavedPrompt[] = [
  {
    id: "builtin-1",
    title: "LSI Semantic Keyword Extractor",
    prompt: "Act as an elite SEO Strategist. Analyze the following technical text or topic, and extract 8 high-impact LSI (Latent Semantic Indexing) and semantic keywords. For each keyword, explain its relevance and provide a suggested usage frequency to optimize the article for search engine crawlers:\n\n[PASTE TEXT OR TOPIC HERE]",
    tags: ["SEO", "TechWriting"],
    isBuiltIn: true
  },
  {
    id: "builtin-2",
    title: "Technical Outline Architect",
    prompt: "Act as a Lead Technical Writer. Draft a comprehensive H2/H3 blog post outline about [TOPIC OR COMPONENT, e.g. RTX 5090 Memory Bandwidth]. Include deep silicon-level specifications, performance comparison guidelines, clear instructions for each section, and target a professional audience of developers and hardware enthusiasts.",
    tags: ["TechWriting", "Architecture"],
    isBuiltIn: true
  },
  {
    id: "builtin-3",
    title: "GCP Cloud-Native Pitch Writer",
    prompt: "Act as an expert technical freelancer. Write a highly persuasive, customized proposal brief in Markdown responding to the client's goals. Propose a modern Express, Vite, and Firestore real-time architecture, detailing 3 concrete milestone phases, estimated timelines, and a robust Unique Selling Proposition (USP):\n\nClient Brief: [INSERT CLIENT BRIEF]",
    tags: ["Freelance", "SEO"],
    isBuiltIn: true
  },
  {
    id: "builtin-4",
    title: "API REST Schema Designer",
    prompt: "Act as a Principal Software Architect. Design a strict, production-grade JSON schema representing [DOMAIN MODEL]. Provide detailed properties, formats (e.g., date-time, uuid), required fields, and write a brief explanatory guide describing validation rules, database persistence recommendations, and caching policies.",
    tags: ["Code", "Architecture"],
    isBuiltIn: true
  },
  {
    id: "builtin-5",
    title: "Benchmark Draft Evaluator",
    prompt: "Act as a Hardware Review Editor. Analyze the following hardware benchmark draft. Rate it on a scale of 0 to 100 for tone, specification depth, performance comparison clarity, and readability. List 3 critical missing optimizations and provide a list of exact content additions to make it a high-ranking technical article:\n\n[PASTE REVIEW DRAFT HERE]",
    tags: ["Hardware", "TechWriting"],
    isBuiltIn: true
  }
];

export default function AssistantChat({ user, onOpenAuth }: AssistantChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: 
        "### Welcome to the Tech Engine Intelligence Room\n\n" +
        "I am **The Brain**, a custom-tailored hardware architect and tech analyst. " +
        "You can ask me to:\n" +
        "1. Recommend laptops or gaming builds under specific budgets (e.g., **₹80,000** or **$1,000**).\n" +
        "2. Perform in-depth comparisons between custom architectures (e.g., **Ryzen AI 9 vs Apple M4 Max**).\n" +
        "3. Explain complex silicon fabrication technologies like **EUV Lithography** or **Gate-All-Around (GAA) Transistors**."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Prompt Library states
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [customPrompts, setCustomPrompts] = useState<SavedPrompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  
  // Custom prompt creator form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [newTags, setNewTags] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Toast / Status state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const suggestionPrompts = [
    { title: "💻 Laptop Recommendation", text: "Suggest the best programming & editing laptops under ₹80,000 with pros & cons." },
    { title: "⚡ CPU Architecture Compare", text: "Compare Ryzen AI 9 HX 370 with Apple M4 Max. Which is better for performance-per-watt?" },
    { title: "🔬 Explain GAA Lithography", text: "Explain the technical difference between FinFET and Nanosheet GAA transistors at sub-3nm scales." }
  ];

  // Sync prompts either from Firestore or localStorage
  useEffect(() => {
    if (user) {
      try {
        const q = query(
          collection(db, "prompts"),
          where("userId", "==", user.uid)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const promptsList: SavedPrompt[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            promptsList.push({
              id: doc.id,
              title: data.title || "",
              prompt: data.prompt || "",
              tags: data.tags || [],
              userId: data.userId,
              isBuiltIn: false
            });
          });
          setCustomPrompts(promptsList);
        }, (err) => {
          console.warn("Firestore prompts sync error:", err);
        });
        return () => unsubscribe();
      } catch (err) {
        console.warn("Could not setup Firestore snapshot listener:", err);
      }
    } else {
      // Guest local storage fallback
      const local = localStorage.getItem("omnitech_custom_prompts");
      if (local) {
        try {
          setCustomPrompts(JSON.parse(local));
        } catch (e) {
          console.error("Failed to parse local prompts", e);
        }
      } else {
        setCustomPrompts([]);
      }
    }
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const formattedHistory = messages.map(m => ({
        role: m.role === "user" ? "user" : "model",
        content: m.content
      }));

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, history: formattedHistory }),
      });

      if (!response.ok) {
        throw new Error("Chat service returned error status");
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "⚠️ **System Communication Interruption**: I ran into a minor connection glitch. Please check your credentials or try asking again!" 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCustomPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrompt.trim()) return;
    setIsSaving(true);

    const parsedTags = newTags
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0 && !t.startsWith("#"))
      .map(t => t.toLowerCase());

    const cleanTags = parsedTags.length > 0 ? parsedTags : ["custom"];

    const newPromptData = {
      title: newTitle.trim(),
      prompt: newPrompt.trim(),
      tags: cleanTags,
      createdAt: new Date().toISOString()
    };

    try {
      if (user) {
        await addDoc(collection(db, "prompts"), {
          ...newPromptData,
          userId: user.uid
        });
        showToast("Prompt saved to your cloud profile!");
      } else {
        const localDataObj: SavedPrompt = {
          ...newPromptData,
          id: `local-${Date.now()}`,
          isBuiltIn: false
        };
        const updated = [...customPrompts, localDataObj];
        setCustomPrompts(updated);
        localStorage.setItem("omnitech_custom_prompts", JSON.stringify(updated));
        showToast("Prompt saved locally in Guest Mode!");
      }

      // Reset Form
      setNewTitle("");
      setNewPrompt("");
      setNewTags("");
      setIsFormOpen(false);
    } catch (err) {
      console.error("Save prompt error:", err);
      showToast("Error saving prompt.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCustomPrompt = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this custom prompt?")) return;

    try {
      if (user) {
        await deleteDoc(doc(db, "prompts", id));
        showToast("Deleted from cloud profile.");
      } else {
        const updated = customPrompts.filter(p => p.id !== id);
        setCustomPrompts(updated);
        localStorage.setItem("omnitech_custom_prompts", JSON.stringify(updated));
        showToast("Deleted from local storage.");
      }
    } catch (err) {
      console.error("Delete prompt error:", err);
      showToast("Error deleting prompt.");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyPrompt = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    showToast("Prompt copied to clipboard!");
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handleInjectPrompt = (text: string) => {
    setInput(text);
    showToast("Prompt injected! Customize template tags before sending.");
    // Focus the text input
    const chatInput = document.getElementById("chat-message-input");
    if (chatInput) {
      chatInput.focus();
    }
    // Close mobile side drawer
    setIsLibraryOpen(false);
  };

  // Safe and clean custom Markdown compiler
  const parseMarkdownToHtml = (text: string) => {
    let lines = text.split("\n");
    let inTable = false;
    let tableRows: string[] = [];
    let compiledLines: string[] = [];

    lines.forEach((line) => {
      let trimmed = line.trim();

      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        if (trimmed.includes("---") || trimmed.includes(":---")) {
          return;
        }
        inTable = true;
        let cols = trimmed.split("|").slice(1, -1).map(c => c.trim());
        let isHeader = tableRows.length === 0;
        
        let rowHtml = `<tr class="${isHeader ? "bg-zinc-900 font-bold border-b border-zinc-800 text-cyan-400" : "border-b border-zinc-900 hover:bg-zinc-900/30"}">`;
        cols.forEach((col) => {
          let formattedCol = formatInlineStyles(col);
          rowHtml += isHeader 
            ? `<th class="px-3 py-2 text-left text-xs font-mono uppercase tracking-wider">${formattedCol}</th>`
            : `<td class="px-3 py-2 text-xs font-sans text-zinc-300">${formattedCol}</td>`;
        });
        rowHtml += `</tr>`;
        tableRows.push(rowHtml);
        return;
      } else {
        if (inTable) {
          compiledLines.push(`<div class="overflow-x-auto my-3 border border-zinc-850 rounded-xl bg-zinc-950/40 p-1"><table class="min-w-full text-xs">${tableRows.join("")}</table></div>`);
          tableRows = [];
          inTable = false;
        }
      }

      if (trimmed.startsWith("### ")) {
        compiledLines.push(`<h4 class="text-sm font-sans font-bold text-white mt-4 mb-2 tracking-tight flex items-center gap-1.5"><span class="w-1.5 h-3.5 bg-cyan-500 rounded-sm"></span>${formatInlineStyles(trimmed.slice(4))}</h4>`);
      } else if (trimmed.startsWith("#### ")) {
        compiledLines.push(`<h5 class="text-xs font-mono uppercase tracking-widest text-cyan-400 mt-3 mb-1.5">${formatInlineStyles(trimmed.slice(5))}</h5>`);
      } else if (trimmed.startsWith("## ")) {
        compiledLines.push(`<h3 class="text-base font-sans font-bold text-white mt-5 mb-2 border-b border-zinc-850 pb-1.5">${formatInlineStyles(trimmed.slice(3))}</h3>`);
      } else if (trimmed.startsWith("1. ") || trimmed.startsWith("2. ") || trimmed.startsWith("3. ") || trimmed.startsWith("4. ")) {
        compiledLines.push(`<div class="flex items-start gap-2.5 my-1.5 pl-1"><span class="text-cyan-400 font-mono text-xs mt-0.5">${trimmed.match(/^\d+\./)?.[0]}</span><span class="text-zinc-300 text-xs">${formatInlineStyles(trimmed.replace(/^\d+\.\s*/, ""))}</span></div>`);
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        compiledLines.push(`<div class="flex items-start gap-2 my-1 pl-3"><span class="text-cyan-500/80 font-mono text-xs">•</span><span class="text-zinc-400 text-xs">${formatInlineStyles(trimmed.slice(2))}</span></div>`);
      } else if (trimmed === "") {
        compiledLines.push(`<div class="h-2"></div>`);
      } else {
        compiledLines.push(`<p class="text-zinc-300 text-xs leading-relaxed font-sans">${formatInlineStyles(trimmed)}</p>`);
      }
    });

    if (inTable) {
      compiledLines.push(`<div class="overflow-x-auto my-3 border border-zinc-850 rounded-xl bg-zinc-950/40 p-1"><table class="min-w-full text-xs">${tableRows.join("")}</table></div>`);
    }

    return compiledLines.join("");
  };

  const formatInlineStyles = (txt: string) => {
    let step1 = txt.replace(/\*\*(.*?)\*\*/g, `<strong class="text-white font-semibold font-sans">$1</strong>`);
    let step2 = step1.replace(/`(.*?)`/g, `<code class="bg-zinc-900 border border-zinc-800 text-cyan-400 font-mono text-[11px] px-1.5 py-0.5 rounded">$1</code>`);
    return step2;
  };

  // Compile combined list of prompts
  const allPrompts = [...BUILT_IN_PROMPTS, ...customPrompts];

  // Extract all unique tags
  const allTags = ["All", ...Array.from(new Set(allPrompts.flatMap(p => p.tags)))];

  // Filter prompts based on search and tags
  const filteredPrompts = allPrompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === "All" || p.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Prompt Library UI block used on both responsive structures
  const renderPromptLibrary = () => (
    <div className="flex flex-col h-full bg-zinc-950/90 text-zinc-100 border-l border-zinc-800">
      
      {/* Title block */}
      <div className="p-4 border-b border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono">Prompt Library</h3>
          </div>
          <button 
            onClick={() => setIsLibraryOpen(false)} 
            className="md:hidden p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Sync Profile Notice */}
        {user ? (
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-2.5 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate">Cloud Synced: {user.email?.split("@")[0]}</span>
          </div>
        ) : (
          <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-3 text-[11px] text-zinc-400 space-y-1.5">
            <div className="flex items-center gap-1 text-cyan-400 font-semibold font-mono">
              <Sparkles className="w-3 h-3" />
              <span>GUEST MODE</span>
            </div>
            <p className="leading-normal">Prompts are saving locally. Sync them across devices anytime!</p>
            <button 
              onClick={onOpenAuth} 
              className="text-white hover:underline font-bold font-mono uppercase text-[9px] flex items-center gap-0.5 cursor-pointer"
            >
              Connect Profile <ArrowUpRight className="w-2.5 h-2.5" />
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search controls */}
      <div className="p-3 border-b border-zinc-900 space-y-2.5">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-1.5 pl-9 pr-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-zinc-700 transition-colors"
          />
        </div>

        {/* Tag Filters list */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                selectedTag === tag 
                  ? "bg-white text-black font-semibold" 
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800/60"
              }`}
            >
              {tag === "All" ? "All" : `#${tag}`}
            </button>
          ))}
        </div>
      </div>

      {/* Save prompt accordion/expandible form */}
      <div className="p-3 border-b border-zinc-900">
        {!isFormOpen ? (
          <button
            onClick={() => setIsFormOpen(true)}
            className="w-full bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 py-2 rounded-xl text-xs font-mono font-semibold flex items-center justify-center gap-1.5 border border-zinc-800 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Save Custom Prompt
          </button>
        ) : (
          <form onSubmit={handleSaveCustomPrompt} className="space-y-3 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800">
            <div className="flex justify-between items-center pb-1 border-b border-zinc-900">
              <span className="text-[10px] font-mono font-bold uppercase text-zinc-400">New Custom Prompt</span>
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)} 
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-zinc-500 uppercase">Title</label>
              <input
                type="text"
                required
                placeholder="e.g., Silicon Architect Planner"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 px-2.5 text-xs text-white outline-none focus:border-zinc-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-zinc-500 uppercase">Prompt Content</label>
              <textarea
                required
                rows={4}
                placeholder="Enter optimized prompt templates here..."
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 px-2.5 text-xs text-white outline-none focus:border-zinc-700 font-mono resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-zinc-500 uppercase">Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g., SEO, techwriting"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 px-2.5 text-xs text-white outline-none focus:border-zinc-700"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="flex-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 py-1.5 rounded-lg text-[10px] font-mono text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-white hover:bg-zinc-200 text-black py-1.5 rounded-lg text-[10px] font-mono font-bold disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? "Saving..." : "Save Prompt"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Prompts list container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
        {filteredPrompts.length === 0 ? (
          <div className="text-center text-zinc-500 text-xs py-8 space-y-1">
            <FolderHeart className="w-6 h-6 mx-auto text-zinc-700" />
            <p>No templates found.</p>
          </div>
        ) : (
          filteredPrompts.map((p) => (
            <div
              key={p.id}
              onClick={() => handleInjectPrompt(p.prompt)}
              className="bg-zinc-900/30 hover:bg-zinc-900/80 border border-zinc-900 hover:border-zinc-800 p-3.5 rounded-xl transition-all duration-200 group cursor-pointer space-y-2 relative"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1 truncate pr-8">
                  <h4 className="text-xs font-semibold text-zinc-100 group-hover:text-cyan-400 transition-colors truncate">
                    {p.title}
                  </h4>
                  
                  {/* Tag list badges */}
                  <div className="flex flex-wrap gap-1">
                    {p.isBuiltIn && (
                      <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[8px] font-mono px-1 rounded">
                        Built-in
                      </span>
                    )}
                    {p.tags.map((tag) => (
                      <span key={tag} className="text-[8px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800/80 px-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right utility buttons */}
                <div className="absolute top-3 right-3 flex items-center gap-1 opacity-10 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleCopyPrompt(p.prompt, p.id, e)}
                    className="p-1 text-zinc-400 hover:text-white bg-zinc-950/80 rounded border border-zinc-850 cursor-pointer"
                    title="Copy to clipboard"
                  >
                    {copiedPromptId === p.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                  {!p.isBuiltIn && (
                    <button
                      onClick={(e) => handleDeleteCustomPrompt(p.id, e)}
                      className="p-1 text-zinc-400 hover:text-rose-400 bg-zinc-950/80 rounded border border-zinc-850 cursor-pointer"
                      title="Delete prompt"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Prompt snippet preview */}
              <p className="text-[10px] text-zinc-500 group-hover:text-zinc-400 transition-colors line-clamp-2 leading-relaxed">
                {p.prompt}
              </p>

              {/* Use Action label */}
              <div className="pt-1 flex items-center justify-end text-[9px] font-mono text-zinc-600 group-hover:text-cyan-400 font-semibold gap-0.5">
                <span>Inject to chat input</span>
                <ArrowRight className="w-2.5 h-2.5 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );

  return (
    <div className="flex h-[calc(100vh-80px)] border border-zinc-800 rounded-2xl bg-zinc-950/50 overflow-hidden relative">
      
      {/* Toast Alert Indicator */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-xs text-zinc-200 font-mono font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT CONTENT BLOCK: CHAT WINDOW */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Thread Header */}
        <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center relative">
              <Bot className="w-5 h-5 text-cyan-400" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-900" />
            </div>
            <div>
              <h3 className="text-sm font-sans font-bold text-white flex items-center gap-2">
                The Brain Assistant <span className="bg-cyan-500/10 text-cyan-400 font-mono text-[9px] px-1.5 py-0.5 rounded border border-cyan-500/20 uppercase">Core Architecture</span>
              </h3>
              <span className="text-zinc-500 text-[10px] block leading-none mt-0.5">Hardware Synthesizer & Advisor</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Prompt Library Toggle Button */}
            <button
              onClick={() => setIsLibraryOpen(!isLibraryOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isLibraryOpen 
                  ? "bg-white text-black border-white" 
                  : "bg-zinc-950/40 text-zinc-400 border-zinc-850 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="font-mono text-[10px]">Prompt Library</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-[10px]">Gemini 3.5 Engine</span>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
          {messages.map((msg, index) => {
            const isAi = msg.role === "assistant";
            return (
              <div 
                key={index} 
                className={`flex gap-4 max-w-3xl ${isAi ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  isAi 
                    ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" 
                    : "bg-zinc-850 border-zinc-700 text-zinc-300"
                }`}>
                  {isAi ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                </div>

                <div className={`p-4 rounded-xl space-y-2 border ${
                  isAi 
                    ? "bg-zinc-900/40 border-zinc-850/80 text-zinc-300" 
                    : "bg-cyan-500/10 border-cyan-500/20 text-cyan-100"
                }`}>
                  <div 
                    className="space-y-2 prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(msg.content) }}
                  />
                </div>
              </div>
            );
          })}

          {/* Streaming Loader Bubble */}
          {loading && (
            <div className="flex gap-4 max-w-xl mr-auto">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                <Bot className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div className="bg-zinc-900/40 border border-zinc-850/80 p-4 rounded-xl flex items-center gap-3">
                <div className="flex space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Consulting specifications...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Suggested prompting anchors */}
        {messages.length === 1 && (
          <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {suggestionPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.text)}
                className="text-left p-3 rounded-xl border border-zinc-850 bg-zinc-900/30 hover:bg-zinc-900/80 hover:border-cyan-500/30 transition-all group"
              >
                <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-cyan-400 flex items-center gap-1.5">
                  {idx === 0 && <Cpu className="w-3.5 h-3.5" />}
                  {idx === 1 && <TrendingUp className="w-3.5 h-3.5" />}
                  {idx === 2 && <HelpCircle className="w-3.5 h-3.5" />}
                  {p.title}
                </h4>
                <p className="text-[10px] text-zinc-500 mt-1 truncate">{p.text}</p>
              </button>
            ))}
          </div>
        )}

        {/* Input Tray */}
        <div className="p-4 bg-zinc-900/90 border-t border-zinc-800">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }} 
            className="flex gap-2"
          >
            <input
              id="chat-message-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Type a hardware query (or select an optimized template from Prompt Library)..."
              className="flex-1 bg-zinc-950 border border-zinc-850 rounded-xl py-3 px-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-zinc-950 font-bold p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* RIGHT CONTENT BLOCK: DESKTOP PROMPT LIBRARY PANEL */}
      {isLibraryOpen && (
        <div className="hidden md:block w-96 h-full overflow-hidden shrink-0">
          {renderPromptLibrary()}
        </div>
      )}

      {/* MOBILE CONTENT BLOCK: OVERLAY MOBILE DRAWER */}
      <AnimatePresence>
        {isLibraryOpen && (
          <div className="md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLibraryOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-[85vw] max-w-sm h-full"
            >
              {renderPromptLibrary()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
