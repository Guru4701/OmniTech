import { TechProduct, NewsCluster, CommunityAMA, SetupPost, BenchmarkLeaderboardEntry, Course, MapFeature } from "./types";

export const PRODUCTS: TechProduct[] = [
  {
    id: "rtx-5090",
    name: "GeForce RTX 5090 Founders Edition",
    brand: "NVIDIA",
    category: "gpu",
    priceUSD: 1999,
    priceINR: 175000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    releaseYear: 2025,
    specs: {
      "Architecture": "Blackwell (GB202)",
      "CUDA Cores": "21760",
      "VRAM": "32GB GDDR7",
      "Memory Bus": "512-bit",
      "Bandwidth": "1792 GB/s",
      "Process Node": "TSMC 4N Custom",
      "Ray Tracing Cores": "170 (4th Gen)",
      "Tensor Cores": "680 (5th Gen)",
      "TGP": "600 Watts"
    },
    benchmarks: {
      gamingFPS: 185, // 4K Ultra average
      aiInference: 145, // tokens/sec
      rendering: 32000, // OctaneBench score
      batteryHours: 0,
      heatingTemp: 74,
      powerWatts: 580,
      repairScore: 4.5
    },
    timeline: [
      { year: "2024-03", title: "Blackwell Architecture Unveiled", desc: "NVIDIA details the unified Blackwell architecture focusing on double precision FP4 AI calculations." },
      { year: "2024-11", title: "Tape-out Accomplished", desc: "Foundry verification completed; full production ramp-up begins." },
      { year: "2025-01", title: "Official Launch at CES", desc: "CEO Jensen Huang announces the RTX 5090 with 32GB of ultra-fast GDDR7 memory." }
    ],
    knownIssues: [
      "Extremely high physical weight requiring robust anti-sag supports.",
      "Requires dual 12V-2x6 high-power connectors under full heavy loads.",
      "High ambient heat exhaust requires highly ventilated high-tower cases."
    ],
    alternatives: ["AMD Radeon RX 8900 XTX", "RTX 4090", "Intel Arc Battlemage Ultra"]
  },
  {
    id: "m4-max",
    name: "Apple M4 Max SoC",
    brand: "Apple",
    category: "cpu",
    priceUSD: 1499, // Component theoretical cost
    priceINR: 125000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    releaseYear: 2024,
    specs: {
      "Cores": "16 (12 Performance + 4 Efficiency)",
      "GPU Cores": "40-Core Apple GPU",
      "Neural Engine": "16-Core (38 TOPS)",
      "Unified Memory": "Up to 128GB LPDDR5X",
      "Memory Bandwidth": "546 GB/s",
      "Process Node": "TSMC 3nm (N3E)",
      "Transistors": "Over 90 Billion",
      "TDP": "30W - 45W Active"
    },
    benchmarks: {
      gamingFPS: 78,
      aiInference: 85,
      rendering: 24500, // Cinebench R23 Multi
      batteryHours: 22,
      heatingTemp: 52,
      powerWatts: 42,
      repairScore: 2.0
    },
    timeline: [
      { year: "2024-10", title: "M4 Max MacBooks Announced", desc: "Apple launches MacBook Pro line featuring the full 16-core M4 Max." },
      { year: "2024-11", title: "Developer Shipments Start", desc: "First compiles reveal 15% IPC single-core gain over predecessor M3 Max." }
    ],
    knownIssues: [
      "No user upgradeability; memory and storage are integrated on-package.",
      "Extremely limited native x86/Windows compatibility for legacy workflows."
    ],
    alternatives: ["Intel Core Ultra 9 285K", "AMD Ryzen AI 9 HX 370", "Qualcomm Snapdragon X Elite"]
  },
  {
    id: "ryzen-ai-9",
    name: "Ryzen AI 9 HX 370 APU",
    brand: "AMD",
    category: "cpu",
    priceUSD: 699,
    priceINR: 58000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    releaseYear: 2024,
    specs: {
      "Cores / Threads": "12 Cores / 24 Threads (4 Zen 5 + 8 Zen 5c)",
      "Base/Boost Clock": "2.0 GHz / 5.1 GHz",
      "Integrated Graphics": "Radeon 890M (16 CUs)",
      "NPU TOPS": "50 TOPS (XDNA 2)",
      "Process Node": "TSMC 4nm (N4P)",
      "Total L3 Cache": "24MB",
      "Default TDP": "15W - 54W"
    },
    benchmarks: {
      gamingFPS: 55, // 1080p Low on Integrated
      aiInference: 50,
      rendering: 18500, // Cinebench Multi
      batteryHours: 15,
      heatingTemp: 68,
      powerWatts: 28,
      repairScore: 6.0
    },
    timeline: [
      { year: "2024-06", title: "Computex Keynote Reveal", desc: "Dr. Lisa Su reveals Ryzen AI 300 series featuring the industry's fastest NPU." },
      { year: "2024-08", title: "Laptop Shipments Launch", desc: "Asus Zenbook and ProArt systems launch utilizing the new chip." }
    ],
    knownIssues: [
      "Occasional latency spikes during transition of threads from Zen 5 to Zen 5c cores.",
      "Deeper driver integration needed for native XDNA 2 performance in standard frameworks."
    ],
    alternatives: ["Intel Lunar Lake Core Ultra 7", "Qualcomm Snapdragon X Plus"]
  },
  {
    id: "iphone-17-pro",
    name: "iPhone 17 Pro Max",
    brand: "Apple",
    category: "phone",
    priceUSD: 1199,
    priceINR: 139900,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    releaseYear: 2025,
    specs: {
      "Processor": "A19 Pro (TSMC 2nm)",
      "Display": "6.9\" LTPO OLED Super Retina, 120Hz",
      "RAM": "12GB LPDDR5X",
      "Camera Grid": "48MP Main + 48MP Ultrawide + 48MP Periscope 10x",
      "NPU capacity": "45 TOPS Apple Neural Engine",
      "Chassis Material": "Grade 5 Satin Titanium",
      "Battery Capacity": "4850 mAh"
    },
    benchmarks: {
      gamingFPS: 120, // Mobile peak
      aiInference: 42,
      rendering: 6800,
      batteryHours: 14,
      heatingTemp: 41,
      powerWatts: 15,
      repairScore: 7.8
    },
    timeline: [
      { year: "2025-09", title: "Apple September Launch Keynote", desc: "Tim Cook announces the 17 Pro with TSMC 2nm design and Apple Intelligence 2.0." }
    ],
    knownIssues: [
      "Extremely expensive glass back replacement cost unless enrolled in AppleCare+.",
      "High thermal levels when streaming video while charging wirelessly via MagSafe."
    ],
    alternatives: ["Samsung Galaxy S26 Ultra", "Google Pixel 10 Pro", "OnePlus 14 Pro"]
  },
  {
    id: "galaxy-s26-ultra",
    name: "Galaxy S26 Ultra",
    brand: "Samsung",
    category: "phone",
    priceUSD: 1299,
    priceINR: 124999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    releaseYear: 2026,
    specs: {
      "Processor": "Snapdragon 8 Gen 5 for Galaxy",
      "Display": "6.8\" Dynamic AMOLED 2X, 144Hz",
      "RAM": "16GB",
      "Camera Grid": "200MP Wide + 50MP 5x + 50MP 10x + 12MP Ultrawide",
      "Battery Capacity": "5100 mAh (45W Fast Charge)",
      "Stylus": "Integrated Bluetooth S-Pen",
      "Biometrics": "Under-display Ultrasonic Scanner"
    },
    benchmarks: {
      gamingFPS: 140,
      aiInference: 48,
      rendering: 7200,
      batteryHours: 16,
      heatingTemp: 39,
      powerWatts: 12,
      repairScore: 8.5
    },
    timeline: [
      { year: "2026-01", title: "Galaxy Unpacked", desc: "Samsung launches the S26 series featuring full on-device Gemini Nano multimodal processing." }
    ],
    knownIssues: [
      "Zoom camera experiences mild latency jitter when shifting focal lengths at night.",
      "Screen anti-reflective coating is vulnerable to micro-scratches from dust particles."
    ],
    alternatives: ["iPhone 17 Pro Max", "Google Pixel 10 Pro", "Xiaomi 16 Ultra"]
  },
  {
    id: "vision-pro-2",
    name: "Apple Vision Pro 2",
    brand: "Apple",
    category: "vr_ar",
    priceUSD: 2999,
    priceINR: 320000,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    releaseYear: 2026,
    specs: {
      "Displays": "Dual Micro-OLED screens (4K per eye)",
      "SoC": "Apple M5 + R2 Dual Chip Design",
      "Sensors": "12 Cameras, 5 Sensors, 6 Mics",
      "OS": "visionOS 3",
      "IPD Adjustment": "Automatic motorized",
      "Battery Life": "Up to 3 hours with external power pack",
      "Tracking": "Controllerless hand/eye and head tracking"
    },
    benchmarks: {
      gamingFPS: 90, // native stereoscopic
      aiInference: 60,
      rendering: 12400,
      batteryHours: 3,
      heatingTemp: 44,
      powerWatts: 35,
      repairScore: 1.5
    },
    timeline: [
      { year: "2026-04", title: "Vision Pro 2 Released", desc: "Apple launches lightened headset weighing 20% less with improved dynamic eye tracking." }
    ],
    knownIssues: [
      "Front laminated glass is extremely fragile and replacement is prohibitively expensive.",
      "Virtual display resolution exhibits slight compression artifacts when connected over unstable Wi-Fi."
    ],
    alternatives: ["Meta Quest 4 Pro", "HTC Vive XR Elite 2", "Sony PlayStation VR3"]
  }
];

export const NEWS_CLUSTERS: NewsCluster[] = [
  {
    id: "news-1",
    title: "TSMC Successfully Tapes Out First 2nm AI Chips for Next-Gen Architectures",
    category: "Semiconductors",
    sourcesCount: 24,
    summary30s: "TSMC has completed physical tape-out of its first 2nm wafer runs. Early metrics confirm a 15% clock boost and 30% reduction in power over 3nm, targeting 2027 server and mobile architectures.",
    summary2m: "Semiconductor powerhouse TSMC announced completion of physical tape-out validation for its 2nm (N2) manufacturing platform. This marks a critical breakthrough utilizing Nanosheet transistor technology instead of traditional FinFET. Early silicon feedback indicates the N2 node yields a 15% speed increase at identical power levels, or a massive 25% to 30% power reduction at matching core speeds compared to N3E. Production yields are scaling ahead of internal forecasts, opening the door for Apple and NVIDIA to command early wafer allocations.",
    fullArticle: `## TSMC Secures Semiconductor Supremacy with 2nm Nanosheet Tape-Out\n\nHsinchu, Taiwan — Taiwan Semiconductor Manufacturing Company (TSMC) has completed the physical design tape-out for its high-performance 2-nanometer (N2) process node. Transitioning from the established FinFET configuration to an innovative Nanosheet nanosheet gate-all-around (GAA) layout, this reset will fuel the next decade of edge-computing devices and massive high-density cloud matrices.\n\n### The Nanosheet Architecture Breakthrough\nBy wrapping gates on all four sides of the channel, GAA technology eliminates source-to-drain leakage, which has plagued conventional FinFETs below 3nm. Engineers can now fine-tune individual transistor channels to optimize logic gates, maximizing frequency ceilings without thermal runaway.\n\n### Market Impacts and Launch Roadmap\nIndustry analysts confirm Apple has already fully reserved TSMC's first-wave N2 capacity for the upcoming A20 SoC family. Concurrently, AMD and NVIDIA are drafting multi-chip-module designs scaling next-generation enterprise hardware on 2nm starting in early 2027.`,
    impactScore: 92,
    credibilityRating: "Verified",
    timestamp: "10 minutes ago",
    reactions: { likes: 520, comments: 84 }
  },
  {
    id: "news-2",
    title: "NVIDIA Blackwell B200 Experiencing Liquid Cooling Leaks in Hyperscaler Racks",
    category: "Datacenters",
    sourcesCount: 18,
    summary30s: "Reports emerge from custom AWS and Microsoft server hubs highlighting micro-fissures in liquid-cooling blocks of early Blackwell racks, causing temporary system adjustments.",
    summary2m: "High-density cloud datacenters deployed with early NVIDIA Blackwell B200 servers have identified microscopic fissures in the customized liquid coolant distribution manifolds. Hyperscalers are adjusting rack telemetry thresholds to bypass affected nodes, resulting in slight performance restrictions while NVIDIA and thermal suppliers deliver replacement blocks. Both AWS and Microsoft confirmed they are working closely with server integrators and that overall AI compute capacity remains largely unaffected.",
    fullArticle: `## Blackwell Deployments Face Minor Setback Due to Thermal Loop Leaks\n\nSanta Clara, CA — Hyperscaler datacenters are troubleshooting minor structural issues within the complex liquid-cooling assemblies engineered for NVIDIA's flagship Blackwell B200 server racks.\n\n### Root Cause Identified\nThe issue centers around custom quick-disconnect manifolds manufactured by second-party cooling vendors. High sustained temperatures of 70°C+ combined with highly pressurized coolant loops led to stress-corrosion cracks in the nickel-plated copper joints. Over time, trace amounts of non-conductive dielectric fluid seeped onto baseplate shields, triggering automated system shutdown interrupts.\n\n### Remediation Actions\nNVIDIA has qualified two additional cold-plate manufacturers to diversify the supply loop. Redesigned manifolds with strengthened steel sleeves are being hot-swapped into active server racks. Integrators expect all early delivery installations to be fully patched within 3 weeks.`,
    impactScore: 84,
    credibilityRating: "High",
    timestamp: "1 hour ago",
    reactions: { likes: 310, comments: 145 }
  },
  {
    id: "news-3",
    title: "Google DeepMind Unveils AlphaFold-4 with Quantum Molecular Dynamics",
    category: "Artificial Intelligence",
    sourcesCount: 31,
    summary30s: "DeepMind introduces AlphaFold-4, integrating quantum-level force field simulations to model dynamic protein-drug interactions in real time with 99.4% alignment accuracy.",
    summary2m: "Google DeepMind has officially launched AlphaFold-4. While previous versions predicted static structures, AlphaFold-4 models protein motion and dynamic interactions with drugs, chemicals, and enzymes. Utilizing a hybrid transformer-diffusion network grounded on quantum chemical force fields, it reaches a phenomenal 99.4% precision in atomic-scale interactions, accelerating drug synthesis workflows from years to hours.",
    fullArticle: `## Google DeepMind Resets Structural Biology with AlphaFold-4 Launch\n\nLondon, UK — Google DeepMind has announced the release of AlphaFold-4, a major leap that expands AI's capability from structural prediction to dynamic biochemical system simulation.\n\n### Simulating Life in Motion\nUntil now, biochemical simulations were computationally throttled, unable to calculate multi-million atom relationships over biological timescales. AlphaFold-4 integrates a novel temporal-attention architecture that simulates protein-ligand docking over microsecond scales, representing an exponential speedup in chemical evaluation pipelines.\n\n### Open Source Access for Researchers\nContinuing its scientific open-science commitment, DeepMind has released the model weights for academic research. Biotech startups are already utilizing AlphaFold-4 to develop specialized enzymes aimed at consuming plastic waste and targeted oncology cell treatments.`,
    impactScore: 96,
    credibilityRating: "Verified",
    timestamp: "3 hours ago",
    reactions: { likes: 840, comments: 92 }
  }
];

export const AMAS: CommunityAMA[] = [
  {
    id: "ama-1",
    guestName: "Dr. Jim Keller",
    guestTitle: "CEO, Tenstorrent / Chip Architect Legend",
    timeString: "Happening Live on July 6, 10:00 AM",
    questionsCount: 423,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "ama-2",
    guestName: "Raja Koduri",
    guestTitle: "Founder, Mihira AI / Former Intel & AMD Graphics Chief",
    timeString: "Saved Session - 2 days ago",
    questionsCount: 812,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

export const DESK_SETUPS: SetupPost[] = [
  {
    id: "setup-1",
    username: "dev_architect_42",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    title: "Minimalist Coding Corner with Apple M4 Max",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["M4 Max", "Keychron Q1", "Studio Display", "Ergonomic Desk"],
    likes: 342,
    views: 2450
  },
  {
    id: "setup-2",
    username: "hardware_beast",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    title: "Custom Loop RTX 5090 Blackwell Rig",
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["RTX 5090", "Custom Liquid Loop", "AMD 9950X3D", "Lian Li O11"],
    likes: 689,
    views: 4520
  }
];

export const LEADERBOARD_RUNS: BenchmarkLeaderboardEntry[] = [
  { id: "run-1", username: "OverclockKing", productName: "GeForce RTX 5090 FE (Overclocked)", score: 35400, fps: 215, power: 640, temp: 78, timestamp: "Just now" },
  { id: "run-2", username: "LinusBench", productName: "GeForce RTX 5090 FE", score: 32050, fps: 185, power: 580, temp: 73, timestamp: "5 mins ago" },
  { id: "run-3", username: "RyzenWarrior", productName: "Radeon RX 8900 XTX (Pre-release)", score: 28400, fps: 162, power: 420, temp: 68, timestamp: "12 mins ago" },
  { id: "run-4", username: "SiliconeSlayer", productName: "Apple M4 Max SoC", score: 24500, fps: 78, power: 45, temp: 52, timestamp: "1 hour ago" },
  { id: "run-5", username: "IntelLover", productName: "Core Ultra 9 285K + RTX 4090", score: 23100, fps: 135, power: 510, temp: 70, timestamp: "3 hours ago" }
];

export const COURSES: Course[] = [
  {
    id: "course-1",
    title: "Semiconductor Architecture & Silicon Design Foundations",
    level: "Advanced",
    category: "Hardware Engineering",
    duration: "12 Hours",
    lessonsCount: 8,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    roadmap: [
      "Introduction to Lithography & Wafer Fabs",
      "Understanding FinFET vs Nanosheet GAA",
      "Instruction Set Architectures (ISA): x86 vs ARM vs RISC-V",
      "Caching Hierarchies and Unified Memory",
      "Dynamic Branch Prediction & Speculative Execution"
    ],
    quizzes: [
      {
        question: "What is the primary physical benefit of Nanosheet GAA over FinFET below 3nm?",
        options: [
          "It is cheaper to fabricate on older DUV machines.",
          "Wrapping the gate on all four sides eliminates source-to-drain leakage.",
          "It uses cobalt instead of copper interconnects.",
          "It does away with silicon entirely, using graphene."
        ],
        answerIndex: 1,
        explanation: "Wrapping the gate completely around the channel (Gate-All-Around) allows maximum electrical control, stopping leak currents which occur at extreme sub-3nm scales."
      },
      {
        question: "In Apple's SoC designs, what does 'Unified Memory' mean?",
        options: [
          "Memory is pooled onto a cloud server.",
          "RAM is integrated on-package and shared directly by CPU, GPU, and NPU without copying.",
          "RAM and SSD use the same NAND flash cells.",
          "All MacBooks around the world share a virtual RAM pool."
        ],
        answerIndex: 1,
        explanation: "Unified Memory integrates high-bandwidth memory directly onto the silicon package, giving CPU and GPU simultaneous access to the same physical address space without system bus overhead."
      }
    ]
  },
  {
    id: "course-2",
    title: "AI Inference & Local LLM Optimization",
    level: "Intermediate",
    category: "Software Development",
    duration: "8 Hours",
    lessonsCount: 6,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    roadmap: [
      "Understanding Model Weights: FP16, INT8, and INT4",
      "Setting up llama.cpp & Ollama locally",
      "NPU Acceleration via WinML, CoreML, and ROCm",
      "Quantization Mechanics & Loss Metrics"
    ],
    quizzes: [
      {
        question: "What happens when you quantize a model from FP16 to INT4?",
        options: [
          "The file size increases but inference is faster.",
          "The file size is reduced by ~75% and runs faster with a minor loss in perplexity.",
          "The model can no longer output text in English.",
          "It forces the model to use double the VRAM."
        ],
        answerIndex: 1,
        explanation: "Quantization converts model weights to lower-precision integers, vastly reducing VRAM footprint and accelerating inference on target NPUs with small precision compromises."
      }
    ]
  }
];

export const MAP_FEATURES: MapFeature[] = [
  {
    id: "map-1",
    type: "fab",
    name: "TSMC Fab 18 (GigaFab)",
    location: "Tainan, Taiwan",
    lat: 23.1,
    lng: 120.28,
    description: "The crown jewel of global semiconductor manufacturing.",
    details: "TSMC's most advanced facility, handling the volume production of 3nm and 2nm wafers for Apple, AMD, NVIDIA, and Qualcomm."
  },
  {
    id: "map-2",
    type: "fab",
    name: "Intel Fab 34",
    location: "Leixlip, Ireland",
    lat: 53.38,
    lng: -6.49,
    description: "Intel's lead European EUV lithography plant.",
    details: "Produces Intel 4 process modules using advanced ASML Twinscan EXE High-NA EUV scanners, supplying Core Ultra laptop cores."
  },
  {
    id: "map-3",
    type: "datacenter",
    name: "Microsoft Quincy Datacenter Core",
    location: "Washington, USA",
    lat: 47.23,
    lng: -119.85,
    description: "Massive AI supercluster powering Copilot operations.",
    details: "Houses tens of thousands of liquid-cooled H100 and Blackwell clusters, utilizing hydro-electric power from the Columbia River."
  },
  {
    id: "map-4",
    type: "launchpad",
    name: "SpaceX Starbase Orbital Pad",
    location: "Boca Chica, Texas, USA",
    lat: 25.99,
    lng: -97.15,
    description: "Orbital launch site of Starship and satellite clusters.",
    details: "Launches the next-generation Starlink V3 direct-to-cell satellites, enabling global high-speed edge telemetry."
  }
];
