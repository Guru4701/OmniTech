import React, { useState, useEffect } from "react";
import { DESK_SETUPS, AMAS } from "../data";
import { 
  Users, 
  Sparkles, 
  ThumbsUp, 
  Eye, 
  MessageCircle, 
  Cpu, 
  Calendar, 
  Plus, 
  ExternalLink,
  X,
  CheckCircle2,
  LogIn
} from "lucide-react";
import { db } from "../firebase";
import { collection, onSnapshot, query, setDoc, doc, addDoc, updateDoc, increment } from "firebase/firestore";

interface SocialNetworkProps {
  user: any;
  onOpenAuth: () => void;
}

const PRESET_IMAGES = [
  {
    name: "Cozy Wood Studio",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    name: "Neon Liquid Loop",
    url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    name: "Clean White Desk",
    url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    name: "Walnut Coding Haven",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

export default function SocialNetwork({ user, onOpenAuth }: SocialNetworkProps) {
  const [setups, setSetups] = useState(DESK_SETUPS);
  const [isShareOpen, setIsShareOpen] = useState(false);
  
  // Custom workstation form state
  const [title, setTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0].url);
  const [tagsInput, setTagsInput] = useState("Keychron Q1, Apple Silicon, Minimalist");
  const [customImage, setCustomImage] = useState("");
  const [publishing, setPublishing] = useState(false);

  // Sync with Firestore Real-time Workstations
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "desk_setups"), (snapshot) => {
      if (snapshot.empty) {
        // Seed database
        DESK_SETUPS.forEach(async (setup) => {
          try {
            await setDoc(doc(db, "desk_setups", setup.id), {
              username: setup.username,
              avatar: setup.avatar,
              title: setup.title,
              imageUrl: setup.imageUrl,
              tags: setup.tags,
              likes: setup.likes,
              views: setup.views,
              createdAt: new Date()
            });
          } catch (e) {
            console.warn("Seeding desk setups ignored:", e);
          }
        });
      } else {
        const list: any[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        setSetups(list);
      }
    }, (err) => {
      console.warn("Firestore collection subscription ignored:", err);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (id: string) => {
    try {
      const docRef = doc(db, "desk_setups", id);
      await updateDoc(docRef, {
        likes: increment(1)
      });
    } catch (err) {
      console.warn("Error incrementing Firestore likes, falling back locally:", err);
      setSetups((prev) => 
        prev.map((s) => s.id === id ? { ...s, likes: s.likes + 1 } : s)
      );
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setPublishing(true);

    const userName = user ? (user.displayName || user.email?.split("@")[0] || "Enthusiast") : "GuestEnthusiast";
    const avatarUrl = user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
    const tagsArr = tagsInput.split(",").map(t => t.trim()).filter(t => t.length > 0);

    const newSetup = {
      username: userName,
      avatar: avatarUrl,
      title: title.trim(),
      imageUrl: customImage.trim() || selectedImage,
      tags: tagsArr,
      likes: 1,
      views: Math.floor(Math.random() * 50) + 12,
      createdAt: new Date()
    };

    try {
      await addDoc(collection(db, "desk_setups"), newSetup);
      setIsShareOpen(false);
      setTitle("");
      setCustomImage("");
      setPublishing(false);
    } catch (err) {
      console.warn("Failed to publish to Firestore, fallback locally:", err);
      setSetups(prev => [
        { id: `setup-${Date.now()}`, ...newSetup } as any,
        ...prev
      ]);
      setIsShareOpen(false);
      setTitle("");
      setCustomImage("");
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-sans font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" /> Tech Social Network
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl">
            Connect with hardware developers, upload benchmark runs, share workstation setups, and host interactive AMAs with key industry engineers.
          </p>
        </div>

        <button
          onClick={() => setIsShareOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Share My Setup
        </button>
      </div>

      {/* Grid: Split Setups & AMAs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Setups Feed */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Workstations & Rig Designs
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {setups.map((setup) => (
              <div 
                key={setup.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative h-48 bg-zinc-950">
                  <img 
                    src={setup.imageUrl} 
                    alt={setup.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                </div>

                {/* Info block */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* User */}
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={setup.avatar} 
                        alt={setup.username} 
                        className="w-6 h-6 rounded-full object-cover border border-zinc-700"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-xs font-mono font-medium text-zinc-300">@{setup.username}</span>
                    </div>

                    <h4 className="font-sans font-bold text-white text-sm leading-snug">
                      {setup.title}
                    </h4>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {setup.tags && setup.tags.map((tag: string) => (
                        <span 
                          key={tag}
                          className="bg-zinc-950 text-zinc-400 font-mono text-[9px] px-2 py-0.5 rounded border border-zinc-850"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-850 text-zinc-500 text-[11px] font-mono">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {setup.views} views</span>
                    
                    <button
                      onClick={() => handleLike(setup.id)}
                      className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/15 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" /> 
                      <span className="font-bold">{setup.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AMA Panel */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-cyan-400" /> Global AMAs (Ask Me Anything)
          </h3>

          <div className="space-y-4">
            {AMAS.map((ama) => (
              <div 
                key={ama.id}
                className="p-4 rounded-xl border border-zinc-850 bg-zinc-900/20 space-y-3.5 hover:border-zinc-800 transition-all"
              >
                <div className="flex items-start gap-3">
                  <img 
                    src={ama.avatar} 
                    alt={ama.guestName} 
                    className="w-10 h-10 rounded-full object-cover border border-zinc-800"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-sans font-bold text-white">{ama.guestName}</h4>
                    <span className="text-[10px] text-zinc-400 font-mono block leading-tight mt-0.5">{ama.guestTitle}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-850/60 text-[10px] font-mono">
                  <span className="text-cyan-400 font-semibold">{ama.timeString}</span>
                  <span className="bg-zinc-900 px-2 py-0.5 rounded text-zinc-400 flex items-center gap-1">
                    <MessageCircle className="w-3 h-3 text-zinc-500" /> {ama.questionsCount} threads
                  </span>
                </div>

                <button
                  onClick={() => alert(`Redirecting you to the live AMA workspace for ${ama.guestName}...`)}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-[10px] uppercase font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Enter Chatroom <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-3 bg-cyan-500/5 rounded-xl border border-cyan-500/10 text-[11px] text-cyan-300 leading-normal">
            🛡️ <strong>Enthusiast Policy:</strong> Uploaded configurations must detail component specifications and validated hardware serial codes to be pinned on the trending charts.
          </div>
        </div>

      </div>

      {/* Share Setup Dialog Modal */}
      {isShareOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 relative space-y-6">
            <button 
              onClick={() => setIsShareOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" /> Share Workstation Configuration
              </h3>
              <p className="text-xs text-zinc-400">
                Post your layout, peripheral checklist, and custom benchmark scores.
              </p>
            </div>

            {!user ? (
              <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-855 text-center space-y-4">
                <p className="text-xs text-zinc-400">
                  You need to be authenticated to publish setups to the global feed.
                </p>
                <button
                  onClick={() => { setIsShareOpen(false); onOpenAuth(); }}
                  className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 w-full transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4" /> Authenticate Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handlePublish} className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Workspace Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Minimalist Dual-Display Coding Corner"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Preset image selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">Select Workstation Image</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        type="button"
                        key={img.name}
                        onClick={() => { setSelectedImage(img.url); setCustomImage(""); }}
                        className={`border rounded-lg p-1.5 text-left transition-all flex flex-col justify-between ${
                          selectedImage === img.url && !customImage
                            ? "border-cyan-400 bg-cyan-400/5" 
                            : "border-zinc-800 hover:border-zinc-700 bg-zinc-950"
                        }`}
                      >
                        <img src={img.url} alt={img.name} className="w-full h-16 object-cover rounded-md" referrerPolicy="no-referrer" />
                        <span className="text-[9px] font-mono text-zinc-400 mt-1 block truncate">{img.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Image URL fallback */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">Or Custom Image URL</label>
                  <input 
                    type="url" 
                    value={customImage}
                    onChange={(e) => { setCustomImage(e.target.value); setSelectedImage(""); }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Tags input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">Workspace Hardware Tags (Comma-separated)</label>
                  <input 
                    type="text" 
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Keychron Q1, Apple Silicon, Minimalist"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Actions */}
                <div className="pt-2 flex justify-end gap-3 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setIsShareOpen(false)}
                    className="border border-zinc-850 hover:bg-zinc-850 px-4 py-2.5 rounded-xl text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={publishing}
                    className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-zinc-950 px-5 py-2.5 rounded-xl cursor-pointer"
                  >
                    {publishing ? "Publishing..." : "Publish Setup"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
