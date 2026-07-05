/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import TechFeed from "./components/TechFeed";
import UniversalSearch from "./components/UniversalSearch";
import AssistantChat from "./components/AssistantChat";
import GadgetDB from "./components/GadgetDB";
import ComparisonMatrix from "./components/ComparisonMatrix";
import TechTimelines from "./components/TechTimelines";
import Newsroom from "./components/Newsroom";
import SocialNetwork from "./components/SocialNetwork";
import InteractiveReview from "./components/InteractiveReview";
import BenchmarkCenter from "./components/BenchmarkCenter";
import DevHub from "./components/DevHub";
import SeoStudio from "./components/SeoStudio";
import LearningAcademy from "./components/LearningAcademy";
import TechMaps from "./components/TechMaps";
import Dashboard from "./components/Dashboard";
import AuthModal from "./components/AuthModal";
import { auth, onAuthStateChanged, db } from "./firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("feed");
  const [savedProductIds, setSavedProductIds] = useState<string[]>(["rtx-5090", "m4-max"]);
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  
  // Real-time dynamic news states
  const [newsClusters, setNewsClusters] = useState<any[]>([]);
  const [nextUpdateInMs, setNextUpdateInMs] = useState<number>(300000);
  const [loadingNews, setLoadingNews] = useState<boolean>(true);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.news)) {
          setNewsClusters(data.news);
          setNextUpdateInMs(data.nextUpdateInMs || 300000);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch latest news:", err);
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // Poll the backend news endpoint every 30 seconds to fetch updates and recalculate active timestamps
    const interval = setInterval(() => {
      fetchNews();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Sync with both real Firebase Auth and local storage bypass for iframe tests
  useEffect(() => {
    // 1. Real Firebase Auth Listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          phoneNumber: firebaseUser.phoneNumber,
          photoURL: firebaseUser.photoURL
        });
      } else {
        // If no real user, check for a simulated user
        const storedSimulated = localStorage.getItem("omnitech_simulated_user");
        if (storedSimulated) {
          try {
            setUser(JSON.parse(storedSimulated));
          } catch (e) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    });

    // 2. Simulated Auth Events for instant UI response on bypass logins
    const handleSimAuthChange = (e: any) => {
      setUser(e.detail);
    };

    const handleStorageChange = () => {
      const storedSimulated = localStorage.getItem("omnitech_simulated_user");
      if (storedSimulated) {
        try {
          setUser(JSON.parse(storedSimulated));
        } catch (e) {
          setUser(null);
        }
      } else if (!auth.currentUser) {
        setUser(null);
      }
    };

    window.addEventListener("simulated_auth_change", handleSimAuthChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener("simulated_auth_change", handleSimAuthChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Sync Wishlist with Firestore / LocalStorage
  useEffect(() => {
    if (!user) {
      // Load from localStorage for guest wishlist
      const guestSaved = localStorage.getItem("omnitech_guest_wishlist");
      if (guestSaved) {
        try {
          setSavedProductIds(JSON.parse(guestSaved));
        } catch (e) {
          // ignore parsing errors
        }
      }
      return;
    }

    // Subscribe to Firestore wishlist document for logged-in user
    const docRef = doc(db, "wishlists", user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.productIds)) {
          setSavedProductIds(data.productIds);
        }
      } else {
        // If doc doesn't exist, initialize it with current state
        setDoc(docRef, { productIds: savedProductIds }, { merge: true })
          .catch((err) => console.warn("Firestore initialize wishlist ignored:", err));
      }
    }, (err) => {
      console.warn("Firestore subscription error (usually permissions before setup), ignoring:", err);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSaveProduct = (productId: string) => {
    setSavedProductIds((prev) => {
      const isCurrentlySaved = prev.includes(productId);
      const updated = isCurrentlySaved 
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];

      if (user) {
        // Update in Firestore
        const docRef = doc(db, "wishlists", user.uid);
        setDoc(docRef, { productIds: updated }, { merge: true })
          .catch((err) => console.warn("Error saving to Firestore:", err));
      } else {
        // Save to localStorage for guests
        localStorage.setItem("omnitech_guest_wishlist", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleRemoveProduct = (productId: string) => {
    setSavedProductIds((prev) => {
      const updated = prev.filter((id) => id !== productId);
      if (user) {
        const docRef = doc(db, "wishlists", user.uid);
        setDoc(docRef, { productIds: updated }, { merge: true })
          .catch((err) => console.warn("Error removing from Firestore:", err));
      } else {
        localStorage.setItem("omnitech_guest_wishlist", JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-zinc-100 font-sans antialiased overflow-hidden select-none">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        savedCount={savedProductIds.length} 
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Viewport Content Scroll container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Main Content scrollable panel */}
        <main className="flex-1 overflow-y-auto px-6 md:px-10 py-6 max-w-7xl w-full mx-auto pb-16">
          {/* Dynamic Navigation Router Switch */}
          {activeTab === "feed" && (
            <TechFeed 
              onSelectProduct={() => setActiveTab("database")}
              onSaveProduct={handleSaveProduct}
              savedIds={savedProductIds}
              newsClusters={newsClusters}
              nextUpdateInMs={nextUpdateInMs}
              loadingNews={loadingNews}
              onManualRefreshNews={fetchNews}
            />
          )}
          {activeTab === "search" && (
            <UniversalSearch 
              user={user} 
              onOpenAuth={() => setIsAuthOpen(true)} 
            />
          )}
          {activeTab === "assistant" && (
            <AssistantChat 
              user={user} 
              onOpenAuth={() => setIsAuthOpen(true)} 
            />
          )}
          
          {activeTab === "database" && (
            <GadgetDB 
              onSaveProduct={handleSaveProduct} 
              savedIds={savedProductIds} 
            />
          )}
          
          {activeTab === "compare" && <ComparisonMatrix />}
          {activeTab === "timeline" && <TechTimelines />}
          {activeTab === "news" && (
            <Newsroom 
              newsClusters={newsClusters}
              loadingNews={loadingNews}
              onManualRefreshNews={fetchNews}
              nextUpdateInMs={nextUpdateInMs}
            />
          )}
          {activeTab === "social" && (
            <SocialNetwork 
              user={user} 
              onOpenAuth={() => setIsAuthOpen(true)} 
            />
          )}
          {activeTab === "reviews" && <InteractiveReview />}
          {activeTab === "benchmarks" && (
            <BenchmarkCenter 
              user={user} 
              onOpenAuth={() => setIsAuthOpen(true)} 
            />
          )}
          {activeTab === "dev" && <DevHub />}
          {activeTab === "seo" && <SeoStudio />}
          {activeTab === "academy" && <LearningAcademy />}
          {activeTab === "maps" && <TechMaps />}
          
          {activeTab === "dashboard" && (
            <Dashboard 
              savedProductIds={savedProductIds} 
              onRemoveProduct={handleRemoveProduct} 
              user={user}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          )}
        </main>

        {/* Sophisticated Dark Ticker Footer */}
        <footer className="h-12 border-t border-zinc-800 bg-zinc-900/20 shrink-0 flex items-center px-6 md:px-10 text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          <div className="flex-1 flex gap-6 md:gap-10 overflow-x-auto whitespace-nowrap scrollbar-none">
            <span>BTC/USD: $98,431.20 <span className="text-zinc-200 font-bold">+1.2%</span></span>
            <span>AAPL: $192.42 <span className="text-zinc-500 font-semibold">-0.4%</span></span>
            <span>TSMC: $142.10 <span className="text-zinc-200 font-bold">+3.1%</span></span>
            <span>Global Compute Load: 68%</span>
          </div>
          <div className="hidden sm:flex gap-4 shrink-0">
            <span>Status: Synced</span>
            <span className="text-white font-medium">09:41 GMT</span>
          </div>
        </footer>
      </div>

      {/* Realtime Authentication Dialog Gateway */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

    </div>
  );
}
