import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, ChevronRight, ChevronLeft, CheckCircle2, Shield, MapPin, 
  Trash2, AlertTriangle, Truck, BarChart2, Cpu, HelpCircle, Sparkles,
  BookOpen, Search, Compass, Radio, Activity, Leaf, Coins, Gift, 
  Award, Camera, Flame, Layers, ArrowRight, ExternalLink, Play
} from 'lucide-react';

export interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
  activeContext?: 'dashboard' | 'driver' | 'maintenance';
}

export interface StepData {
  id: string;
  step: string;
  title: string;
  icon: string;
  category: 'Operations' | 'AI & ML' | 'Circular & ESG' | 'Hardware & IoT' | 'Civic';
  badge: string;
  accentColor: string;
  summary: string;
  details: string[];
  actionLabel?: string;
  targetTab?: string;
  highlights?: string[];
}

const ALL_STEPS: StepData[] = [
  {
    id: 'overview',
    step: '01',
    title: 'Executive Command Center & Multi-City Grid',
    icon: '🏛️',
    category: 'Operations',
    badge: 'Control Grid',
    accentColor: '#06b6d4',
    summary: 'Centralized operations hub displaying live telemetry from 8 major Indian metropolitan grids (Hyderabad, Bangalore, Mumbai, Delhi, Chennai, Kolkata, Pune, Ahmedabad) and national aggregate views.',
    details: [
      'Real-time KPI cards track live active bins, critical overflows, and 24h predictive risks.',
      'City Switcher instantly resets and loads local municipality telemetry, depots, and ward metrics.',
      'One-click action shortcuts to trigger XGBoost 24h AI predictions and OR-Tools route optimizations.'
    ],
    highlights: ['Multi-City Selector', 'Live Telemetry Badge', 'Instant State Reset'],
    actionLabel: 'Overview Dashboard',
    targetTab: 'overview'
  },
  {
    id: 'map',
    step: '02',
    title: 'Interactive GIS Map & Real-Time Bin Locator',
    icon: '🗺️',
    category: 'Operations',
    badge: 'Spatial Intelligence',
    accentColor: '#0284c7',
    summary: 'Dynamic Leaflet GIS map with color-coded fill statuses, municipal depot hubs, live collection truck coordinates, and OSRM turn-by-turn navigation paths.',
    details: [
      'Color status coding: Normal (<50% Green), Warning (50-79% Orange), and Critical (≥80% Red with pulse animation).',
      'Click any bin marker to inspect ultrasonic fill level, battery charge, temperature, and 7-day trend.',
      'Switch between Dark, Light, Street, and Satellite tile layers seamlessly in any theme.'
    ],
    highlights: ['OSRM Street Polyline', 'Depot Anchors', 'Multi-Layer Tiles'],
    actionLabel: 'Live GIS Map',
    targetTab: 'map'
  },
  {
    id: 'routes',
    step: '03',
    title: 'Street-Snapped Dynamic Dispatch Routes',
    icon: '🛣️',
    category: 'Operations',
    badge: 'Fleet Routing',
    accentColor: '#0891b2',
    summary: 'Turn-by-turn road navigation powered by Google OR-Tools CVRP engine integrated with Open Source Routing Machine (OSRM) highway snapping.',
    details: [
      'Switch routing modes instantly: Eco-Fuel Saver, Priority/Emergency, Shortest Distance, or Congestion-Aware.',
      'Calculates accurate turn-by-turn road distances and travel durations instead of crude straight-line math.',
      'Shows road-by-road street names, maneuver arrows, and truck capacity load progression.'
    ],
    highlights: ['Turn-by-Turn OSRM', 'Emergency Resequencing', 'Fuel Consumption Modeling'],
    actionLabel: 'Street Routes',
    targetTab: 'routes'
  },
  {
    id: 'bins',
    step: '04',
    title: 'Smart Bins Fleet & Capacity Telemetry',
    icon: '🗑️',
    category: 'Operations',
    badge: 'Sensory Fleet',
    accentColor: '#059669',
    summary: 'Comprehensive tabular inventory of all municipal bins with multi-column sorting, ward filtering, and instant search capabilities.',
    details: [
      'Sort bins by fill level, priority score, battery health, or area type (Hospital, Market, Residential).',
      'Register new smart bins with automatic city depot GPS centering.',
      'Click any bin row to slide out the detailed 7-day load sparkline and ML 24h forecast inspector.'
    ],
    highlights: ['Multi-Column Sort', 'Ward Filter', 'Quick Inspector Slide-Out'],
    actionLabel: 'Smart Bins Table',
    targetTab: 'bins'
  },
  {
    id: 'fleet',
    step: '05',
    title: 'Fleet Manager & Certified Driver Dispatch',
    icon: '🚚',
    category: 'Operations',
    badge: 'Logistics',
    accentColor: '#7c3aed',
    summary: 'Manage municipal compactor trucks, assign certified commercial drivers, monitor route loads, and generate tamper-proof QR identity badges.',
    details: [
      'Track truck states: Idle, En Route, Collecting, or Maintenance.',
      'Generate verifiable QR Driver Gate Passes for mobile device logins and weight bridge check-ins.',
      'Add or modify municipal trucks with custom capacity and license tracking.'
    ],
    highlights: ['QR Driver Badges', 'Capacity Utilization %', 'Truck Lifecycle'],
    actionLabel: 'Fleet Manager',
    targetTab: 'fleet'
  },
  {
    id: 'maintenance',
    step: '06',
    title: 'Maintenance Operations & Work Order Hub',
    icon: '🔧',
    category: 'Operations',
    badge: 'Field Ops',
    accentColor: '#ea580c',
    summary: 'End-to-end work order ticketing system for field technicians and sanitation supervisors repairing damaged ultrasonic sensors, solar modules, or bin lids.',
    details: [
      'Categorizes incidents by priority: Critical, High, Medium, Low with real-time status transitions.',
      'Assign tasks directly to certified municipal technicians in specific municipal zones.',
      'Dedicated standalone worker portal at /maintenance for field smartphones with QR barcode verification.'
    ],
    highlights: ['Zone Dispatch', 'Dedicated Worker Portal', 'SLA Tracking'],
    actionLabel: 'Maintenance Hub',
    targetTab: 'maintenance'
  },
  {
    id: 'aiscanner',
    step: '07',
    title: 'AI Waste Vision & Edge Image Classifier',
    icon: '📸',
    category: 'AI & ML',
    badge: 'Computer Vision',
    accentColor: '#0284c7',
    summary: 'Deep neural network image classifier that visually inspects uploaded or camera-captured garbage to detect material composition and segregation instructions.',
    details: [
      'Instant categorization into Dry Recyclable, Wet Organic, Hazardous/E-Waste, or General.',
      'Calculates carbon avoidance credits (kg CO2 avoided) and municipal recycling revenue in INR.',
      'Provides actionable citizen segregation instructions with camera and image upload support.'
    ],
    highlights: ['Edge Inference Fallback', 'Material Breakdown', 'CO2 Offset Calculation'],
    actionLabel: 'AI Waste Scanner',
    targetTab: 'aiscanner'
  },
  {
    id: 'prediction',
    step: '08',
    title: 'XGBoost 24-Hour ML Forecasting Engine',
    icon: '⚡',
    category: 'AI & ML',
    badge: 'Machine Learning',
    accentColor: '#d97706',
    summary: 'Supervised gradient boosted regression model that predicts bin fill levels 24 hours into the future using temporal, demographic, and historical telemetry data.',
    details: [
      'Identifies high-risk bins before they overflow, enabling proactive rather than reactive dispatch.',
      'Calculates overflow probability (%) and composite priority scores (0-100).',
      'Trains on rainfall, holiday indicators, population density, and area classification.'
    ],
    highlights: ['XGBoost Regression', 'Proactive Dispatch', 'Priority Risk Scoring'],
    actionLabel: 'AI Forecasting',
    targetTab: 'prediction'
  },
  {
    id: 'iotbench',
    step: '09',
    title: 'IoT Multi-Sensor Hardware Bench & Telemetry',
    icon: '📡',
    category: 'Hardware & IoT',
    badge: 'Embedded IoT',
    accentColor: '#8b5cf6',
    summary: 'Hardware-in-the-loop simulation bench modeling ESP32-WROOM dual-core microcontrollers, JSN-SR04T ultrasonic sensors, HX711 strain gauges, and LoRaWAN IN865 packets.',
    details: [
      'Interactive sliders to adjust bin distance, tare weight, MQ-135 gas PPM, and temperature.',
      'Live hex packet encoder simulating real LoRaWAN 865MHz uplinks to municipal gateways.',
      'Inspect serial console debugging logs for hardware firmware integration.'
    ],
    highlights: ['LoRaWAN IN865 Packets', 'JSN-SR04T Ultrasonic Model', 'Serial Console Logs'],
    actionLabel: 'IoT Hardware Bench',
    targetTab: 'iotbench'
  },
  {
    id: 'simulation',
    step: '10',
    title: 'Multi-Speed Municipal Time-Warp Simulator',
    icon: '⏱️',
    category: 'Hardware & IoT',
    badge: 'Simulation',
    accentColor: '#db2777',
    summary: 'Accelerated municipal simulation engine running up to 24x real-time speed to stress-test collection networks and emergency response during peak waste generation.',
    details: [
      'Simulate 1 hour of municipal waste accumulation in just 2.5 seconds at 24x speed.',
      'Calls the exact same HTTP IoT ingestion endpoint that physical ESP32 devices connect to.',
      'Test network resilience and dynamic route generation under festival and market surge loads.'
    ],
    highlights: ['1x to 24x Acceleration', 'Identical Hardware API', 'Zero-Code Switchover'],
    actionLabel: 'Simulation Engine',
    targetTab: 'simulation'
  },
  {
    id: 'circular',
    step: '11',
    title: 'Circular Economy Hub & Secondary Exchange',
    icon: '♻️',
    category: 'Circular & ESG',
    badge: 'Zero Landfill',
    accentColor: '#059669',
    summary: 'Transform municipal waste streams into verified industrial raw materials, bio-methane clean fuel, refurbished electronics, and zero-landfill secondary assets.',
    details: [
      'MRF Facilities: Monitor real-time daily intake capacity and utilization across recycling centers.',
      'Secondary Commodities Exchange: Trade baled PET, HDPE, aluminium, and compost with verified industrial offtakers.',
      'Food Waste & Bio-CNG: Track anaerobic biomethanation digester volume and LPG cylinder equivalents.',
      'E-Waste & Product Repair: Browse right-to-repair manuals and circular reuse marketplaces.'
    ],
    highlights: ['Commodities Portal', 'Bio-CNG Production', 'Right-to-Repair Guides'],
    actionLabel: 'Circular Economy Hub',
    targetTab: 'circular'
  },
  {
    id: 'citizen',
    step: '12',
    title: 'Citizen Civic Hub & Swachhata Rewards',
    icon: '🎁',
    category: 'Civic',
    badge: 'Civic Karma',
    accentColor: '#d97706',
    summary: 'Gamified civic portal where citizens record segregated waste deposits, report illegal dumping blackspots, and redeem local municipal rewards.',
    details: [
      'Localized city rewards: Metro transit passes (DMRC, BMRCL, GHMC), clean energy bill rebates, and organic bio-compost.',
      'Civic Blackspots: Community-driven reporting of roadside illegal dumps with rapid crew dispatching.',
      'Track individual citizen karma tiers, certificates, and verified CO2 avoided stats.'
    ],
    highlights: ['Metro Transit Vouchers', 'Electricity Rebates', 'Blackspot Reporting'],
    actionLabel: 'Citizen & Civic Hub',
    targetTab: 'citizen'
  },
  {
    id: 'impact',
    step: '13',
    title: 'Carbon Reduction ESG & Financial ROI Impact',
    icon: '🌿',
    category: 'Circular & ESG',
    badge: 'ESG Audit',
    accentColor: '#059669',
    summary: 'Audited environmental and financial scorecard quantifying metric tons of CO2 avoided, diesel saved in litres, and municipal tax budget ROI.',
    details: [
      'Converts diesel savings to tree-year absorption equivalents (1 Mature Tree ≈ 21.7 kg CO2/year).',
      'Ward-by-ward breakdown of waste diverted from open landfills to recovery centers.',
      'Material carbon credit breakdown compliant with Central Pollution Control Board (CPCB) standards.'
    ],
    highlights: ['Audited Carbon Metric', 'Diesel Cost Preserved', 'Tree-Year Equivalents'],
    actionLabel: 'Carbon Impact Dashboard',
    targetTab: 'impact'
  },
  {
    id: 'analytics',
    step: '14',
    title: 'Multi-Algorithm CVRP vs Genetic Benchmark',
    icon: '📊',
    category: 'AI & ML',
    badge: 'Benchmark',
    accentColor: '#0891b2',
    summary: 'Deep algorithmic comparison pitting Google OR-Tools CVRP against Genetic Algorithms (GA), Simulated Annealing (SA), and Greedy Nearest Neighbor baselines.',
    details: [
      'Demonstrates up to 29.6% fuel efficiency gains over static fixed municipal routes.',
      'Inspect R2, RMSE, and MAE regression evaluation metrics across ML models.',
      'Export certified executive PDF/email reports directly to municipal administrative directors.'
    ],
    highlights: ['OR-Tools vs GA vs SA', 'Algorithm Runtime (ms)', 'Automated Email Reports'],
    actionLabel: 'Analytics Benchmark',
    targetTab: 'analytics'
  },
  {
    id: 'notifications',
    step: '15',
    title: 'Emergency Notification Engine & Auto-Alerts',
    icon: '🔔',
    category: 'Operations',
    badge: 'Real-Time Alert',
    accentColor: '#dc2626',
    summary: 'Real-time alert dispatch system triggering instant notifications whenever any bin fill level exceeds the 80% critical safety threshold.',
    details: [
      'WebSocket live pushes deliver alerts instantaneously without page refreshes.',
      'City-filtered alert feeds and mark-as-read synchronization.',
      'Auto-generates emergency collection work tickets and dispatches email alerts.'
    ],
    highlights: ['WebSocket Live Feeds', 'One-Click Mark Read', 'City-Scoped Filtering'],
    actionLabel: 'Notifications Center',
    targetTab: 'notifications'
  },
  {
    id: 'pitch',
    step: '16',
    title: 'Executive Pitch & System Evaluation',
    icon: '🏆',
    category: 'Civic',
    badge: 'Grand Evaluation',
    accentColor: '#0891b2',
    summary: 'Interactive evaluation presentation deck highlighting technological innovation, multi-sensor hardware architecture, ESG sustainability, and commercial viability.',
    details: [
      'Comprehensive 6-pillar architecture: IoT telemetry, AI vision, ML prediction, CVRP routing, circular economy, and citizen engagement.',
      'Verified performance metrics: -29.6% fuel burn, +34.2% landfill diversion, 100% solar self-powered edge nodes.',
      'Interactive executive evaluation scorecard with competitive benchmarking.'
    ],
    highlights: ['6 Core Pillars', 'Grand Jury Presentation', 'Benchmark Comparison'],
    actionLabel: 'Executive Evaluation Deck',
    targetTab: 'pitch'
  }
];

export const HowToUseModal: React.FC<HowToUseModalProps> = ({ 
  isOpen, 
  onClose, 
  onNavigateTab,
  activeContext = 'dashboard'
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'tour' | 'grid'>('tour');

  // Filter steps by category and search
  const filteredSteps = useMemo(() => {
    return ALL_STEPS.filter(s => {
      const matchCat = selectedCategory === 'All' || s.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' || 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.details.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Keep index in bounds when filtering
  useEffect(() => {
    if (activeStepIndex >= filteredSteps.length) {
      setActiveStepIndex(0);
    }
  }, [filteredSteps.length, activeStepIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && viewMode === 'tour') {
        setActiveStepIndex(prev => Math.min(filteredSteps.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' && viewMode === 'tour') {
        setActiveStepIndex(prev => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredSteps.length, viewMode, onClose]);

  if (!isOpen) return null;

  const currentStep = filteredSteps[activeStepIndex] || filteredSteps[0] || ALL_STEPS[0];
  const categories = ['All', 'Operations', 'AI & ML', 'Circular & ESG', 'Hardware & IoT', 'Civic'];
  const progressPercent = Math.round(((activeStepIndex + 1) / Math.max(1, filteredSteps.length)) * 100);

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: '94vw',
          maxWidth: '860px',
          maxHeight: '90vh',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-glass)',
          borderRadius: '20px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.45), 0 0 35px var(--accent-cyan-dim)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Accent Top Glow Line */}
        <div style={{
          height: '4px',
          width: '100%',
          background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #10b981, #f97316)',
          flexShrink: 0
        }} />

        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          flexWrap: 'wrap',
          gap: '12px',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 14px rgba(6, 182, 212, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              flexShrink: 0
            }}>
              📖
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '18px', color: 'var(--text-primary)' }}>
                  EcoBin Operations & Platform Guide
                </h3>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '10px',
                  background: 'var(--accent-cyan-dim)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid var(--border-accent)'
                }}>
                  v2.0
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                Comprehensive guide to all 16 intelligent modules, IoT edge sensors, and municipal workflows
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* View Mode Switcher */}
            <div style={{
              display: 'flex',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              padding: '2px'
            }}>
              <button
                onClick={() => setViewMode('tour')}
                style={{
                  padding: '5px 11px',
                  borderRadius: '6px',
                  border: 'none',
                  background: viewMode === 'tour' ? 'var(--accent-cyan)' : 'transparent',
                  color: viewMode === 'tour' ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Compass size={13} /> Tour
              </button>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '5px 11px',
                  borderRadius: '6px',
                  border: 'none',
                  background: viewMode === 'grid' ? 'var(--accent-cyan)' : 'transparent',
                  color: viewMode === 'grid' ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Layers size={13} /> All Modules
              </button>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              title="Close Guide (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filter Bar (Search & Categories) */}
        <div style={{
          padding: '10px 20px',
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          flexShrink: 0
        }}>
          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', flex: 1, minWidth: '220px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveStepIndex(0);
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '16px',
                  border: selectedCategory === cat ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                  background: selectedCategory === cat ? 'var(--accent-cyan-dim)' : 'var(--bg-secondary)',
                  color: selectedCategory === cat ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Search Input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-glass)',
            borderRadius: '8px',
            padding: '5px 10px',
            width: '210px'
          }}>
            <Search size={13} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setActiveStepIndex(0);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '12px',
                width: '100%',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar (Tour Mode) */}
        {viewMode === 'tour' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 20px',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-glass)',
            flexShrink: 0
          }}>
            <div style={{ flex: 1, height: '5px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
                  borderRadius: '4px',
                  transition: 'width 0.25s ease'
                }} 
              />
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 700, flexShrink: 0 }}>
              {activeStepIndex + 1} / {filteredSteps.length} ({progressPercent}%)
            </span>
          </div>
        )}

        {/* Body Content Area with Explicit High-Contrast Background */}
        <div style={{
          padding: '20px',
          overflowY: 'auto',
          flex: 1,
          minHeight: 0,
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)'
        }}>
          {filteredSteps.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '14px', marginBottom: '10px' }}>🔍 No features match your search query "{searchQuery}".</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="btn btn-secondary btn-sm"
              >
                Reset Search Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* ── ALL MODULES GRID VIEW ── */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '14px'
            }}>
              {filteredSteps.map((step, idx) => (
                <div
                  key={step.id}
                  onClick={() => {
                    setActiveStepIndex(idx);
                    setViewMode('tour');
                  }}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border: '1px solid var(--border-glass)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = step.accentColor;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border-glass)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '24px' }}>{step.icon}</span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: '6px',
                        background: 'var(--bg-primary)',
                        border: `1px solid ${step.accentColor}`,
                        color: step.accentColor
                      }}>
                        {step.step} · {step.category}
                      </span>
                    </div>
                    <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '14px', margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                      {step.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {step.summary}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-glass)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 700 }}>Explore module →</span>
                    {step.targetTab && onNavigateTab && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateTab(step.targetTab!);
                          onClose();
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '2px 4px'
                        }}
                        title={`Jump to ${step.actionLabel}`}
                      >
                        <ExternalLink size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ── STEP-BY-STEP TOUR VIEW ── */
            <div>
              {/* Step Navigation Pills with Distinct Contrast */}
              <div style={{
                display: 'flex',
                gap: '6px',
                padding: '8px',
                marginBottom: '16px',
                borderRadius: '12px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-glass)',
                overflowX: 'auto'
              }}>
                {filteredSteps.map((s, idx) => {
                  const isSelected = activeStepIndex === idx;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveStepIndex(idx)}
                      style={{
                        flexShrink: 0,
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                        background: isSelected ? 'var(--accent-cyan)' : 'var(--bg-primary)',
                        color: isSelected ? '#ffffff' : 'var(--text-primary)',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 2px 8px var(--accent-cyan-dim)' : 'none'
                      }}
                    >
                      <span style={{ opacity: isSelected ? 1 : 0.7 }}>{s.step}</span>
                      <span>{s.icon}</span>
                      <span>{s.title.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Step Details */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: currentStep.accentColor,
                    background: 'var(--bg-secondary)',
                    border: `1px solid ${currentStep.accentColor}`,
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>
                    MODULE {currentStep.step} / {ALL_STEPS.length}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-glass)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    color: 'var(--text-primary)'
                  }}>
                    {currentStep.badge}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-secondary)'
                  }}>
                    Category: <strong>{currentStep.category}</strong>
                  </span>
                </div>
                <div style={{ fontSize: '32px' }}>{currentStep.icon}</div>
              </div>

              {/* Title with crisp high contrast */}
              <h2 style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 800,
                fontSize: '22px',
                color: 'var(--text-primary)',
                margin: '0 0 10px 0',
                lineHeight: 1.3
              }}>
                {currentStep.title}
              </h2>

              {/* Summary with crisp readable secondary text */}
              <p style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: 'var(--text-secondary)',
                marginBottom: '18px'
              }}>
                {currentStep.summary}
              </p>

              {/* Highlights Chips */}
              {currentStep.highlights && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {currentStep.highlights.map((h, i) => (
                    <span key={i} style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '12px',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-glass)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      ⚡ <span style={{ color: currentStep.accentColor }}>{h}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Key Capabilities Card with high-contrast text */}
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-glass)',
                borderRadius: '14px',
                padding: '16px 20px',
                marginBottom: '10px'
              }}>
                <h4 style={{
                  margin: '0 0 12px 0',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-secondary)',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Sparkles size={14} color={currentStep.accentColor} /> Key Operational Capabilities
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentStep.details.map((detail, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <CheckCircle2 size={16} color={currentStep.accentColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5', fontWeight: 500 }}>
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          flexShrink: 0,
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {viewMode === 'tour' ? (
            <>
              <button
                onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
                disabled={activeStepIndex === 0}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-glass)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  cursor: activeStepIndex === 0 ? 'not-allowed' : 'pointer',
                  opacity: activeStepIndex === 0 ? 0.35 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  fontSize: '13px'
                }}
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {currentStep.targetTab && onNavigateTab && (
                  <button
                    onClick={() => {
                      onNavigateTab(currentStep.targetTab!);
                      onClose();
                    }}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 14px rgba(6, 182, 212, 0.4)'
                    }}
                  >
                    <span>Open {currentStep.actionLabel}</span>
                    <ChevronRight size={14} />
                  </button>
                )}

                <button
                  onClick={() => {
                    if (activeStepIndex < filteredSteps.length - 1) {
                      setActiveStepIndex(activeStepIndex + 1);
                    } else {
                      onClose();
                    }
                  }}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeStepIndex === filteredSteps.length - 1 ? '#10b981' : '#8b5cf6',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  <span>{activeStepIndex === filteredSteps.length - 1 ? 'Finish Guide' : 'Next Module'}</span>
                  {activeStepIndex < filteredSteps.length - 1 && <ChevronRight size={16} />}
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <button
                onClick={onClose}
                className="btn btn-secondary btn-sm"
                style={{ padding: '8px 20px', fontSize: '13px', fontWeight: 700 }}
              >
                Close Guide
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowToUseModal;
