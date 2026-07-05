import React, { useState } from "react";
import { PRODUCTS, NEWS_CLUSTERS } from "../data";
import { 
  User, 
  Award, 
  Heart, 
  Bell, 
  Check, 
  Trash2, 
  Lock, 
  AlertCircle 
} from "lucide-react";

interface DashboardProps {
  savedProductIds: string[];
  onRemoveProduct: (productId: string) => void;
  user: any;
  onOpenAuth: () => void;
}

export default function Dashboard({ savedProductIds, onRemoveProduct, user, onOpenAuth }: DashboardProps) {
  // Notification Toggle states
  const [notifyPriceDrops, setNotifyPriceDrops] = useState(true);
  const [notifyNewLaunches, setNotifyNewLaunches] = useState(false);
  const [notifyCoreLeaks, setNotifyCoreLeaks] = useState(true);

  // Filter bookmarked items
  const savedProducts = PRODUCTS.filter((p) => savedProductIds.includes(p.id));

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-sans font-bold text-white flex items-center gap-2">
          <User className="w-6 h-6 text-cyan-400" /> My Workspace Dashboard
        </h2>
        <p className="text-zinc-400 text-sm max-w-xl">
          Monitor saved chips, tracked retail products, unlocked learning academy certifications, and manage price drop alerts.
        </p>
      </div>

      {/* Grid splits: Profile setup & Wishlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile and Settings Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card 1: Dynamic Profile Details */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            {user ? (
              <>
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-white/10 border border-zinc-850 rounded-full flex items-center justify-center text-white font-mono text-base font-bold uppercase">
                    {user.displayName ? user.displayName.slice(0, 2) : (user.email ? user.email.slice(0, 2) : "US")}
                  </div>
                  <div>
                    <h3 className="text-sm font-sans font-bold text-white leading-tight">
                      {user.displayName || "Ecosystem User"}
                    </h3>
                    <span className="text-[10px] text-zinc-500 font-mono block leading-none mt-1">
                      {user.email || user.phoneNumber || "Verified Account"}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-900 grid grid-cols-2 gap-4 text-center">
                  <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-850">
                    <span className="text-[10px] text-zinc-500 font-mono block uppercase">Saved Wishlist</span>
                    <span className="text-base font-bold text-white block mt-0.5">{savedProductIds.length} items</span>
                  </div>
                  <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-850">
                    <span className="text-[10px] text-zinc-500 font-mono block uppercase">Active Rank</span>
                    <span className="text-base font-bold text-zinc-200 block mt-0.5">Guru #124</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4 py-2 text-center">
                <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-sans font-bold text-white">Ecosystem Unconnected</h3>
                  <p className="text-[11px] text-zinc-500 leading-normal max-w-xs mx-auto">
                    Log in with Google, email, or SMS to synchronize saved hardware, release notifications, and telemetry specs.
                  </p>
                </div>
                <button
                  onClick={onOpenAuth}
                  className="w-full bg-white hover:bg-zinc-200 text-black py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Connect Profile
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Custom Price-drop Alerts & Toggles */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-zinc-900 pb-3">
              <Bell className="w-4 h-4" /> Hardware Release Alerts
            </h3>

            <div className="space-y-3.5">
              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-zinc-200 block">Retail Price Drops</span>
                  <span className="text-[10px] text-zinc-500 block leading-normal">Alert on 5% MSRP price adjustments</span>
                </div>
                <input 
                  type="checkbox"
                  checked={notifyPriceDrops}
                  onChange={(e) => setNotifyPriceDrops(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer shrink-0 mt-0.5"
                />
              </label>

              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-zinc-200 block">Silicon Tapeout Releases</span>
                  <span className="text-[10px] text-zinc-500 block leading-normal">Alert on sub-3nm industrial node schedules</span>
                </div>
                <input 
                  type="checkbox"
                  checked={notifyNewLaunches}
                  onChange={(e) => setNotifyNewLaunches(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer shrink-0 mt-0.5"
                />
              </label>

              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-zinc-200 block">Global Leak Intel</span>
                  <span className="text-[10px] text-zinc-500 block leading-normal">Alert on unannounced schematics/benchmarks</span>
                </div>
                <input 
                  type="checkbox"
                  checked={notifyCoreLeaks}
                  onChange={(e) => setNotifyCoreLeaks(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer shrink-0 mt-0.5"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Wishlist Tracking Feed */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-zinc-900 pb-3">
            <Heart className="w-4 h-4" /> Tracked Devices ({savedProducts.length})
          </h3>

          {savedProducts.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/10 rounded-xl border border-zinc-900 space-y-2">
              <Heart className="w-10 h-10 text-zinc-650 mx-auto" />
              <h4 className="text-xs font-semibold text-zinc-400">Your tracked wishlist is empty</h4>
              <p className="text-[10px] text-zinc-500 max-w-xs mx-auto">Explore the Master Gadget Database and save products to monitor real-time pricing and benchmarks here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedProducts.map((p) => (
                <div 
                  key={p.id}
                  className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-850 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{p.brand}</span>
                      <span className="bg-zinc-950 text-cyan-400 font-mono text-[9px] px-1.5 py-0.5 rounded border border-zinc-850">{p.releaseYear}</span>
                    </div>
                    <h4 className="text-xs font-sans font-bold text-white">{p.name}</h4>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-emerald-400 font-bold">${p.priceUSD.toLocaleString()} / ₹{p.priceINR.toLocaleString()}</span>
                    
                    <button
                      onClick={() => onRemoveProduct(p.id)}
                      className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Academic Certifications */}
          <div className="pt-6 border-t border-zinc-900 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Earned Certificates
            </h3>

            <div className="p-4 bg-zinc-900/10 rounded-xl border border-zinc-900 flex items-center gap-3">
              <Lock className="w-5 h-5 text-zinc-500" />
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-zinc-400 block">Silicon Lithography Certificate (Pending)</span>
                <span className="text-[10px] text-zinc-500 block leading-normal">Complete the respective course quiz inside the Learning Academy to unlock.</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
