export type TechCategory = 
  | "cpu"
  | "gpu"
  | "phone"
  | "laptop"
  | "smartwatch"
  | "camera"
  | "vr_ar";

export interface TechProduct {
  id: string;
  name: string;
  brand: string;
  category: TechCategory;
  priceUSD: number;
  priceINR: number;
  rating: number;
  image: string;
  releaseYear: number;
  specs: { [key: string]: string };
  benchmarks: {
    gamingFPS?: number;
    aiInference?: number; // tokens/sec
    rendering?: number;  // Cinebench-like score
    batteryHours?: number;
    heatingTemp?: number; // C
    powerWatts?: number;
    repairScore?: number; // 1-10
  };
  timeline: { year: string; title: string; desc: string }[];
  knownIssues: string[];
  alternatives: string[];
}

export interface NewsCluster {
  id: string;
  title: string;
  category: string;
  sourcesCount: number;
  summary30s: string;
  summary2m: string;
  fullArticle: string;
  impactScore: number; // 1-100
  credibilityRating: string; // High, Verified, Mixed
  timestamp: string;
  reactions: { likes: number; comments: number };
}

export interface CommunityAMA {
  id: string;
  guestName: string;
  guestTitle: string;
  timeString: string;
  questionsCount: number;
  avatar: string;
}

export interface SetupPost {
  id: string;
  username: string;
  avatar: string;
  title: string;
  imageUrl: string;
  tags: string[];
  likes: number;
  views: number;
}

export interface BenchmarkLeaderboardEntry {
  id: string;
  username: string;
  productName: string;
  score: number;
  fps: number;
  power: number;
  temp: number;
  timestamp: string;
}

export interface Course {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  duration: string;
  lessonsCount: number;
  image: string;
  roadmap: string[];
  quizzes: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  }[];
}

export interface MapFeature {
  id: string;
  type: "fab" | "datacenter" | "launchpad" | "cable";
  name: string;
  location: string;
  lat: number;
  lng: number;
  description: string;
  details: string;
}

export interface SavedGadget {
  productId: string;
  dateSaved: string;
  priceAlert: boolean;
  alertPriceThreshold?: number;
}
