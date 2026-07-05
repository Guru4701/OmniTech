import React from "react";
import { 
  Home, 
  MessageSquare, 
  Cpu, 
  Sliders, 
  Clock, 
  Newspaper, 
  Users, 
  Tv2, 
  BarChart3, 
  Terminal, 
  GraduationCap, 
  MapPin, 
  BookmarkCheck, 
  Atom,
  LogOut,
  LogIn,
  Wand2
} from "lucide-react";
import { auth, signOut } from "../firebase";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedCount: number;
  user: any;
  onOpenAuth: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, savedCount, user, onOpenAuth }: SidebarProps) {
  const navItems = [
    { id: "feed", label: "Home Feed", icon: Home },
    { id: "search", label: "Universal Search", icon: Atom },
    { id: "assistant", label: "AI Assistant", icon: MessageSquare },
    { id: "database", label: "Gadget DB", icon: Cpu },
    { id: "compare", label: "Spec Matrix", icon: Sliders },
    { id: "timeline", label: "Tech Timelines", icon: Clock },
    { id: "news", label: "AI Newsroom", icon: Newspaper },
    { id: "social", label: "Social Setup", icon: Users },
    { id: "reviews", label: "Live Reviews", icon: Tv2 },
    { id: "benchmarks", label: "Benchmark Lab", icon: BarChart3 },
    { id: "dev", label: "Developer Hub", icon: Terminal },
    { id: "seo", label: "SEO & Gig Studio", icon: Wand2 },
    { id: "academy", label: "Learning Academy", icon: GraduationCap },
    { id: "maps", label: "Tech Maps", icon: MapPin },
    { id: "dashboard", label: "My Hub", icon: BookmarkCheck, count: savedCount }
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col shrink-0 h-screen sticky top-0">
      {/* Brand logo */}
      <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shrink-0">
          <div className="w-5.5 h-5.5 border-2 border-black rounded-sm flex items-center justify-center">
            <Cpu className="w-3.5 h-3.5 text-black stroke-[2.5]" />
          </div>
        </div>
        <div>
          <span className="font-sans font-bold text-base tracking-tight text-white block leading-none">OmniTech</span>
          <span className="text-zinc-500 text-[10px] font-mono tracking-wider uppercase">Unified Ecosystem</span>
        </div>
      </div>

      {/* Nav items list */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-sans font-medium transition-all duration-200 ${
                isActive 
                  ? "bg-white/10 text-white border-l-2 border-white pl-2.5" 
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : "text-zinc-500"}`} />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className="bg-white text-black text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User profile section */}
      <div className="p-4 border-t border-zinc-800 bg-[#070708]">
        {user ? (
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8.5 h-8.5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white font-mono font-bold text-xs uppercase shrink-0">
                {user.displayName ? user.displayName.slice(0, 2) : (user.email ? user.email.slice(0, 2) : "US")}
              </div>
              <div className="min-w-0 leading-tight">
                <span className="text-zinc-200 text-xs font-semibold truncate block">
                  {user.displayName || "Ecosystem User"}
                </span>
                <span className="text-[9px] font-mono text-zinc-500 block truncate">
                  {user.email || user.phoneNumber || "Verified Account"}
                </span>
              </div>
            </div>
            <button
              onClick={async () => {
                await signOut(auth);
                localStorage.removeItem("omnitech_simulated_user");
                window.dispatchEvent(new Event("storage"));
                window.dispatchEvent(new CustomEvent("simulated_auth_change", { detail: null }));
              }}
              className="text-zinc-500 hover:text-white p-1.5 rounded transition-colors cursor-pointer shrink-0"
              title="Disconnect Profile"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" /> Connect Profile
          </button>
        )}
      </div>
    </aside>
  );
}
