import React, { useState, useEffect, useRef } from 'react';
import { 
  Leaf, Users, BookOpen, Layers, GitMerge, BookA, Calendar, 
  Shield, Zap, Activity, Globe, Database, Pickaxe, Coins,
  CircleDashed, CheckCircle2, Play, Pause, ChevronLeft, ChevronRight,
  MessageSquare, Send, Network, Tent, Map, Milestone,
  Palette, Cog, TreeDeciduous, Feather, Flame, Droplet,
  Maximize, Minimize, HardDrive, Cpu, Fingerprint, 
  Sparkles, Workflow, ScrollText, Share2, Component, Braces,
  User, Star, Award, Clock, ArrowLeft, BarChart2, Plus, 
  ShoppingCart, Lock, Unlock, CheckCircle, PieChart
} from 'lucide-react';

// --- INITIAL STATE ---
const INITIAL_USER = {
  guestname: 'Maya',
  archetype: 'Terraformer',
  specialization: 'Beekeeper',
  level: 12,
  skillPoints: 1,
  mana: 85,
  maxMana: 100,
  cloud: 1250,
  ownedPerks: []
};

const AUCTION_ITEMS = [
  { id: 'perk1', title: 'Skip Daily Standup', desc: 'Valid for one asynchronous check-in instead of synchronous.', cost: 50, icon: Clock },
  { id: 'perk2', title: '1-on-1 Guild Mentorship', desc: 'A dedicated 1-hour pairing session with a Legendary Guild Master.', cost: 500, icon: Users },
  { id: 'perk3', title: 'Hardware: Ergonomic Chair', desc: 'Expensed physical upgrade for your home ecology.', cost: 3500, icon: Shield },
  { id: 'perk4', title: 'Choose Next Raid Scope', desc: 'Override the backlog and prioritize a Side Quest of your choosing.', cost: 1200, icon: Pickaxe }
];

const TALENT_TREE = [
  { id: 't1', label: 'Terraformer Core', status: 'mastered', x: 50, y: 10, req: null },
  { id: 't2', label: 'Beekeeper Spec', status: 'mastered', x: 50, y: 35, req: 't1' },
  { id: 't3', label: 'Regenerative DBs', status: 'available', x: 30, y: 60, req: 't2' },
  { id: 't4', label: 'Swarm Coordination', status: 'locked', x: 70, y: 60, req: 't2' },
  { id: 't5', label: 'Mycelial Architecture', status: 'locked', x: 30, y: 85, req: 't3' },
  { id: 't6', label: 'Ecosystem API', status: 'locked', x: 70, y: 85, req: 't4' }
];

const INITIAL_QUESTS = [
  {
    id: 'q1',
    title: 'Deploy Pollination Sensor Network',
    type: 'Raid',
    difficulty: 'Epic',
    manaCost: 40,
    roles: [
      { id: 'r1', name: 'Infra (Tank)', filled: true, user: 'Ahmed' },
      { id: 'r2', name: 'Code (DPS)', filled: true, user: 'Maya' },
      { id: 'r3', name: 'Earth (Healer)', filled: false, user: null }
    ],
    reward: 200,
    status: 'Recruiting'
  },
  {
    id: 'q2',
    title: 'Refactor Reputation Graph Query',
    type: 'Side Quest',
    difficulty: 'Rare',
    manaCost: 15,
    roles: [
      { id: 'r4', name: 'Code (DPS)', filled: false, user: null }
    ],
    reward: 50,
    status: 'Open'
  }
];

const INITIAL_PEERS = [
  { id: 'p1', name: 'Ahmed', archetype: 'Navigator', specialization: 'Connector', crafts: 'Water × Code', guild: 'Spring', class: 'Navigator', status: 'Online', mana: 45, maxMana: 100, level: 24, rarity: 'Epic', contributions: 142, joined: 'Season of the Root, Year 1', about: 'Bridging technical architecture with community needs.', stats: { water: 80, code: 65, form: 20 } },
  { id: 'p2', name: 'Sofia', archetype: 'Seedkeeper', specialization: 'Data Architect', crafts: 'Earth × Code', guild: 'Root', class: 'Seedkeeper', status: 'Online', mana: 90, maxMana: 100, level: 15, rarity: 'Rare', contributions: 68, joined: 'Season of the Forge, Year 2', about: 'Building resilient database schemas for ecological monitoring.', stats: { earth: 75, code: 60, word: 30 } },
  { id: 'p3', name: 'Kwame', archetype: 'Guardian', specialization: 'Protector', crafts: 'Earth × Sound', guild: 'Forge', class: 'Guardian', status: 'Resting', mana: 100, maxMana: 100, level: 42, rarity: 'Legendary', contributions: 410, joined: 'Genesis Block', about: 'Holding space and setting the rhythm for cross-hub convergences.', stats: { earth: 90, sound: 85, fire: 50, word: 40 } },
  { id: 'p4', name: 'Nou Bot', archetype: 'Logic Engine', specialization: 'Automation', crafts: 'Code', guild: 'Loom', class: 'Logic Engine (AI)', status: 'Processing', mana: 12, maxMana: 100, level: 8, rarity: 'Uncommon', contributions: 1024, joined: 'Season of the Loom, Year 3', about: 'Autonomous agent executing routine attestations.', stats: { code: 95, logic: 100 } }
];

export default function WoWcNodeHUD() {
  // UI State
  const [activeView, setActiveView] = useState('quests'); // 'quests', 'create_quest', 'vault', 'forest', 'guild_loom', 'guild_root', 'archetypes', 'graph', 'profile'
  const [activeLayer, setActiveLayer] = useState('A/');
  const [profileTab, setProfileTab] = useState('dossier'); // 'dossier', 'talents'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState(null);
  
  // Engine State
  const [simRunning, setSimRunning] = useState(true);
  const [tick, setTick] = useState(0);
  
  // Entity State
  const [user, setUser] = useState(INITIAL_USER);
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [peers, setPeers] = useState(INITIAL_PEERS);
  const [talents, setTalents] = useState(TALENT_TREE);
  const [combatLog, setCombatLog] = useState([
    { id: 'log-0', type: 'System', user: 'Forest Council', action: 'initialized', target: 'Hub Node', time: 'Just now' }
  ]);
  const [logPage, setLogPage] = useState(1);
  const LOGS_PER_PAGE = 8;

  // Create Quest Form State
  const [newQuest, setNewQuest] = useState({ title: '', type: 'Side Quest', difficulty: 'Common', reward: 100, roles: [{ name: 'Code (DPS)' }] });

  // Guild Chat State
  const [chatMessages, setChatMessages] = useState({ loom: [], root: [] });
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeView]);

  // Fullscreen Handlers
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    else if (document.exitFullscreen) document.exitFullscreen();
  };

  const addLog = (type, actionUser, action, target) => {
    setCombatLog(prev => [...prev, { id: `log-${Date.now()}-${Math.random()}`, type, user: actionUser, action, target, time: 'Just now' }].slice(-100));
    setLogPage(prev => (prev === 1 ? 1 : prev)); 
  };

  // Interactions
  const handleClaimRole = (questId, roleId, cost) => {
    if (user.mana < cost) return;
    setUser(prev => ({ ...prev, mana: prev.mana - cost }));
    setQuests(prev => prev.map(q => q.id === questId ? { ...q, roles: q.roles.map(r => r.id === roleId ? { ...r, filled: true, user: user.guestname } : r) } : q));
    const targetQuest = quests.find(q => q.id === questId);
    const targetRole = targetQuest.roles.find(r => r.id === roleId);
    addLog('Quest', user.guestname, `claimed role [${targetRole.name}] on`, targetQuest.title);
  };

  const handleBuyPerk = (perk) => {
    if (user.cloud < perk.cost) return;
    setUser(prev => ({ ...prev, cloud: prev.cloud - perk.cost, ownedPerks: [...prev.ownedPerks, perk.id] }));
    addLog('Loot', user.guestname, `purchased auction item:`, perk.title);
  };

  const handleUnlockTalent = (talentId) => {
    if (user.skillPoints < 1) return;
    setUser(prev => ({ ...prev, skillPoints: prev.skillPoints - 1 }));
    setTalents(prev => prev.map(t => {
      if (t.id === talentId) return { ...t, status: 'mastered' };
      // Unlock downstream nodes if their requirements are met
      if (t.req === talentId) return { ...t, status: 'available' };
      return t;
    }));
    const target = talents.find(t => t.id === talentId);
    addLog('Level Up', user.guestname, `unlocked specialized talent:`, target.label);
  };

  const handleCreateQuest = () => {
    if (!newQuest.title) return;
    const qCost = newQuest.type === 'Raid' ? 40 : 15;
    const formattedQuest = {
      id: `q-${Date.now()}`,
      title: newQuest.title,
      type: newQuest.type,
      difficulty: newQuest.difficulty,
      manaCost: qCost,
      reward: newQuest.reward,
      status: 'Open',
      roles: newQuest.roles.map((r, i) => ({ id: `r-${Date.now()}-${i}`, name: r.name, filled: false, user: null }))
    };
    setQuests(prev => [formattedQuest, ...prev]);
    addLog('System', user.guestname, `forged a new ${newQuest.type}:`, newQuest.title);
    setActiveView('quests');
    setNewQuest({ title: '', type: 'Side Quest', difficulty: 'Common', reward: 100, roles: [{ name: 'Code (DPS)' }] });
  };

  // --- THE SIMULATION ENGINE ---
  useEffect(() => {
    if (!simRunning) return;
    const interval = setInterval(() => {
      setTick(t => {
        const nextTick = t + 1;
        if (nextTick % 4 === 0) {
          setPeers(prev => prev.map(p => {
            if (p.name === 'Nou Bot') {
              const newMana = Math.max(0, p.mana - 5);
              if (newMana > 0) addLog('Attestation', 'Nou Bot', 'verified on-chain contribution by', 'Sofia');
              else if (p.mana > 0) addLog('System Alert', 'Nou Bot', 'ran out of compute budget and entered', 'Rest Mode');
              return { ...p, mana: newMana, status: newMana > 0 ? 'Processing' : 'Resting' };
            }
            return p;
          }));
        }
        if (nextTick % 12 === 0) {
           setUser(u => ({ ...u, mana: Math.min(u.maxMana, u.mana + 15) }));
           setPeers(prev => prev.map(p => ({ ...p, mana: Math.min(p.maxMana, p.mana + 15), status: (p.mana + 15) >= 20 ? (p.name === 'Nou Bot' ? 'Processing' : 'Online') : p.status })));
           addLog('Regen', 'Ecosystem', 'triggered global rested XP &', 'Mana Recovery');
        }
        if (nextTick % 9 === 0) {
           addLog('Loot', 'System', `processed background patronage block`, '');
        }
        return nextTick;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [simRunning, quests]);

  const totalLogPages = Math.max(1, Math.ceil(combatLog.length / LOGS_PER_PAGE));
  const paginatedLogs = [...combatLog].reverse().slice((logPage - 1) * LOGS_PER_PAGE, logPage * LOGS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 font-sans flex flex-col overflow-hidden">
      
      {/* TOP BAR: HUD & Resource Router */}
      <header className="bg-[#1a1a1a] border-b border-[#333333] p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center space-x-4">
          <div 
            className="flex flex-col cursor-pointer group"
            onClick={() => { setSelectedPeer({...user, name: user.guestname}); setActiveView('profile'); }}
          >
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white group-hover:text-[#c4956a] transition-colors">{user.guestname}</span>
              <span className="bg-[#c4956a]/10 text-[#c4956a] text-xs px-2 py-0.5 rounded-full border border-[#c4956a]/30">
                Lvl {user.level}
              </span>
            </div>
            <span className="text-xs text-[#999999]">{user.archetype} ({user.specialization})</span>
          </div>
        </div>

        {/* Engine Controls & Resources */}
        <div className="flex items-center space-x-6">
          <button onClick={toggleFullscreen} className="p-1.5 rounded-lg bg-[#0f0f0f] border border-[#333333] text-[#999999] hover:text-white hover:bg-[#333333] transition-colors" title="Toggle Fullscreen">
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
          
          <div className="flex items-center space-x-2 bg-[#0f0f0f] px-3 py-1.5 rounded-lg border border-[#333333]">
            <button onClick={() => setSimRunning(!simRunning)} className={`p-1 rounded ${simRunning ? 'bg-[#c4956a]/20 text-[#c4956a]' : 'bg-[#333333] text-[#999999]'} hover:bg-[#333333] transition-colors`} title="Toggle Simulation">
              {simRunning ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <div className="text-xs font-mono text-[#999999] w-16 text-center">Tick {tick}</div>
          </div>

          <div className="flex flex-col items-end w-48">
            <div className="flex justify-between w-full mb-1">
              <span className="text-xs font-medium text-[#999999] flex items-center"><Zap size={12} className="mr-1 text-blue-400"/> Mana Pool</span>
              <span className={`text-xs ${user.mana < 20 ? 'text-red-400 font-bold animate-pulse' : 'text-blue-400'}`}>{user.mana}/{user.maxMana}</span>
            </div>
            <div className="w-full bg-[#333333] rounded-full h-2">
              <div className={`h-2 rounded-full transition-all duration-500 ${user.mana < 20 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'}`} style={{ width: `${(user.mana/user.maxMana)*100}%` }}></div>
            </div>
          </div>

          <div 
            onClick={() => setActiveView('vault')}
            className="flex flex-col items-end w-36 cursor-pointer bg-[#0f0f0f] p-2 rounded-lg border border-[#333333] hover:border-[#c4956a]/50 transition-colors group"
          >
             <span className="text-[10px] font-medium text-[#999999] uppercase tracking-widest flex items-center group-hover:text-[#c4956a] transition-colors">
               <Coins size={12} className="mr-1.5"/> Vault Balance
             </span>
             <span className="text-sm font-bold text-[#c4956a] mt-0.5">{user.cloud.toLocaleString()} $CLOUD</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR: Navigation */}
        <aside className="w-64 bg-[#1a1a1a] border-r border-[#333333] flex flex-col z-20">
          <div className="p-4 border-b border-[#333333] flex bg-[#0f0f0f] rounded-lg m-2 p-1">
            <button className={`flex-1 py-1.5 text-sm text-center rounded-md transition-all ${['quests', 'create_quest'].includes(activeView) ? 'bg-[#c4956a] text-white shadow-sm' : 'text-[#999999] hover:text-gray-200'}`} onClick={() => setActiveView('quests')}>
              <Database size={14} className="inline mr-1" /> Hub Node
            </button>
            <button className={`flex-1 py-1.5 text-sm text-center rounded-md transition-all ${activeView === 'forest' ? 'bg-[#c4956a] text-white shadow-sm' : 'text-[#999999] hover:text-gray-200'}`} onClick={() => setActiveView('forest')}>
              <Globe size={14} className="inline mr-1" /> Forest
            </button>
          </div>

          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            <div className="text-[10px] font-semibold text-[#999999] uppercase tracking-widest mb-3 px-3 pt-2">Ecosystem Lore</div>
            <button onClick={() => setActiveView('archetypes')} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-sm mb-4 ${activeView === 'archetypes' ? 'bg-[#333333] text-white border-l-2 border-[#c4956a]' : 'text-[#999999] hover:bg-[#333333]/50 hover:text-gray-200'}`}>
              <Map size={16} className={activeView === 'archetypes' ? 'text-[#c4956a]' : 'text-[#999999]'} />
              <span>Archetype Codex</span>
            </button>

            <div className="text-[10px] font-semibold text-[#999999] uppercase tracking-widest mb-3 px-3 pt-2 border-t border-[#333333] mt-2 pt-4">Knowledge Graph Views</div>
            {[
              { name: 'Ecology', icon: Leaf, id: 'e/' }, { name: 'Human', icon: Users, id: 'H/' },
              { name: 'Language', icon: BookA, id: 'L/' }, { name: 'Artifacts', icon: Layers, id: 'A/' },
              { name: 'Methodology', icon: GitMerge, id: 'M/' }
            ].map(layer => (
              <button key={layer.id} onClick={() => { setActiveView('graph'); setActiveLayer(layer.id); }} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-sm ${activeView === 'graph' && activeLayer === layer.id ? 'bg-[#333333] text-white border-l-2 border-[#c4956a]' : 'text-[#999999] hover:bg-[#333333]/50 hover:text-gray-200'}`}>
                <layer.icon size={16} className={activeView === 'graph' && activeLayer === layer.id ? 'text-[#c4956a]' : 'text-[#999999]'} />
                <span className="w-6 text-xs text-[#999999] opacity-70 font-mono">{layer.id}</span>
                <span>{layer.name}</span>
              </button>
            ))}

            <div className="text-[10px] font-semibold text-[#999999] uppercase tracking-widest mb-3 mt-6 px-3">Guild Chambers</div>
            <button onClick={() => setActiveView('guild_loom')} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-sm ${activeView === 'guild_loom' ? 'bg-[#333333] text-white border-l-2 border-[#c4956a]' : 'text-[#999999] hover:bg-[#333333]/50 hover:text-gray-200'}`}>
              <Network size={16} className={activeView === 'guild_loom' ? 'text-[#c4956a]' : 'text-[#999999]'} />
              <span>Guild of the Loom (Code)</span>
            </button>
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex overflow-hidden">
          
          <div className="flex-1 flex flex-col overflow-y-auto bg-[#0f0f0f] relative z-0">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 w-full h-96 bg-[#c4956a]/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none -z-10"></div>

            {activeView === 'quests' && (
              <div className="p-8 relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Shield className="mr-3 text-[#c4956a]" size={28} /> 
                      Local Quest Board
                    </h2>
                    <p className="text-sm text-[#999999] mt-2 max-w-xl leading-relaxed">
                      Review available scopes. Committing to a role deducts from your Mana pool.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveView('create_quest')}
                    className="bg-[#c4956a] hover:bg-[#c4956a]/80 text-[#0f0f0f] font-bold py-2 px-4 rounded-lg flex items-center transition-colors shadow-lg shadow-[#c4956a]/20"
                  >
                    <Plus size={18} className="mr-2" /> Forge New Quest
                  </button>
                </div>

                <div className="space-y-5">
                  {quests.length === 0 ? (
                    <div className="text-center py-12 border border-[#333333] border-dashed rounded-xl bg-[#1a1a1a]/50">
                      <Pickaxe size={32} className="mx-auto text-[#999999] mb-3" />
                      <p className="text-[#999999]">No active quests in this layer.</p>
                    </div>
                  ) : quests.map(quest => (
                    <div key={quest.id} className="bg-[#1a1a1a] border border-[#333333] rounded-xl p-5 hover:border-[#c4956a]/40 transition-all shadow-lg hover:shadow-[#c4956a]/5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${quest.type === 'Raid' ? 'bg-[#c4956a]/10 border-[#c4956a]/30 text-[#c4956a]' : 'bg-[#333333]/50 border-[#333333] text-gray-300'}`}>
                              {quest.type}
                            </span>
                            <span className="text-xs text-[#999999] bg-[#0f0f0f] px-2 py-0.5 rounded border border-[#333333]">Lvl: {quest.difficulty}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-white">{quest.title}</h3>
                        </div>
                        <div className="text-right bg-[#0f0f0f] p-2 rounded-lg border border-[#333333]">
                          <div className="text-[#c4956a] font-bold text-sm flex items-center justify-end">{quest.reward} <Coins size={12} className="ml-1"/></div>
                          <div className="text-xs text-blue-400 mt-1 flex items-center justify-end font-medium"><Zap size={10} className="mr-1"/> Cost: {quest.manaCost}</div>
                        </div>
                      </div>

                      <div className="mt-5 bg-[#0f0f0f]/60 rounded-lg p-4 border border-[#333333]/50">
                        <div className="text-[10px] font-semibold text-[#999999] mb-3 uppercase tracking-widest flex items-center"><Users size={12} className="mr-1.5" /> Required Roles</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {quest.roles.map((role) => (
                            <div key={role.id} onClick={() => !role.filled && handleClaimRole(quest.id, role.id, quest.manaCost)} className={`flex items-center justify-between text-sm px-3 py-2 rounded-md border transition-all ${role.filled ? 'bg-[#333333]/50 border-[#333333] text-gray-300' : user.mana >= quest.manaCost ? 'bg-[#1a1a1a] border-dashed border-[#c4956a]/30 text-[#c4956a] hover:border-[#c4956a] hover:bg-[#c4956a]/10 cursor-pointer' : 'bg-[#1a1a1a] border-dashed border-red-500/20 text-[#999999] cursor-not-allowed opacity-60'}`}>
                              <div className="flex items-center">
                                {role.filled ? <CheckCircle2 size={16} className="mr-2 text-[#c4956a]" /> : <CircleDashed size={16} className="mr-2" />}
                                <span className="font-medium mr-2">{role.name}</span>
                              </div>
                              {role.filled ? <span className="text-xs font-mono bg-[#0f0f0f] px-2 py-0.5 rounded text-[#999999] border border-[#333333]">{role.user}</span> : <span className="text-xs font-medium uppercase tracking-wide">{user.mana >= quest.manaCost ? 'Claim' : 'Low Mana'}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NEW SPRINT 1: CREATE QUEST ENGINE */}
            {activeView === 'create_quest' && (
              <div className="p-8 relative z-10 flex flex-col h-full overflow-y-auto">
                <button onClick={() => setActiveView('quests')} className="flex items-center text-[#999999] hover:text-white transition-colors mb-6 w-fit bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-[#333333]">
                  <ArrowLeft size={16} className="mr-2" /> Back to Board
                </button>

                <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl p-8 max-w-2xl mx-auto shadow-2xl">
                  <h2 className="text-2xl font-bold text-white flex items-center mb-2">
                    <Flame className="mr-3 text-[#c4956a]" size={28} /> The Catalyst's Forge
                  </h2>
                  <p className="text-sm text-[#999999] mb-8">Structure a new scope. Required roles dictate the total Mana estimation for the Party.</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-[#c4956a] uppercase tracking-widest mb-2">Quest Title</label>
                      <input type="text" value={newQuest.title} onChange={e => setNewQuest({...newQuest, title: e.target.value})} placeholder="e.g., Build Regenerative DB Schema" className="w-full bg-[#0f0f0f] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c4956a] transition-colors" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#c4956a] uppercase tracking-widest mb-2">Scope Type</label>
                        <select value={newQuest.type} onChange={e => setNewQuest({...newQuest, type: e.target.value})} className="w-full bg-[#0f0f0f] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c4956a] transition-colors appearance-none">
                          <option>Side Quest</option><option>Main Story</option><option>Raid</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#c4956a] uppercase tracking-widest mb-2">Treasury Bounty ($CLOUD)</label>
                        <input type="number" value={newQuest.reward} onChange={e => setNewQuest({...newQuest, reward: parseInt(e.target.value)})} className="w-full bg-[#0f0f0f] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c4956a] transition-colors" />
                      </div>
                    </div>

                    <div className="bg-[#0f0f0f] p-5 rounded-lg border border-[#333333]">
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-xs font-bold text-[#c4956a] uppercase tracking-widest">Required Archetype Roles</label>
                        <button onClick={() => setNewQuest({...newQuest, roles: [...newQuest.roles, { name: 'New Role' }]})} className="text-xs bg-[#1a1a1a] hover:bg-[#333333] text-white px-3 py-1.5 rounded border border-[#333333] transition-colors flex items-center">
                          <Plus size={14} className="mr-1"/> Add Role
                        </button>
                      </div>
                      <div className="space-y-2">
                        {newQuest.roles.map((r, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <select value={r.name} onChange={e => { const updated = [...newQuest.roles]; updated[i].name = e.target.value; setNewQuest({...newQuest, roles: updated}); }} className="flex-1 bg-[#1a1a1a] border border-[#333333] rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#c4956a]">
                              <option>Code (DPS)</option><option>Earth (Tank)</option><option>Form (Visualizer)</option><option>Word (Context)</option><option>Water (Healer)</option>
                            </select>
                            <button onClick={() => setNewQuest({...newQuest, roles: newQuest.roles.filter((_, idx) => idx !== i)})} className="p-2 text-red-400 hover:bg-red-500/20 rounded-md transition-colors">✕</button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-[#333333] flex justify-between items-center text-sm">
                        <span className="text-[#999999]">Estimated Party Mana Cost:</span>
                        <span className="font-bold text-blue-400 flex items-center"><Zap size={14} className="mr-1"/> {newQuest.type === 'Raid' ? 40 : 15} per role</span>
                      </div>
                    </div>

                    <button onClick={handleCreateQuest} disabled={!newQuest.title} className="w-full bg-[#c4956a] hover:bg-[#c4956a]/80 disabled:bg-[#333333] disabled:text-[#999999] text-[#0f0f0f] font-bold py-3 rounded-lg transition-colors shadow-lg shadow-[#c4956a]/20 mt-4 flex justify-center items-center">
                      Launch to Network <Share2 size={16} className="ml-2"/>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* NEW SPRINT 3: THE VAULT & AUCTION HOUSE */}
            {activeView === 'vault' && (
              <div className="p-8 relative z-10 flex flex-col h-full overflow-y-auto">
                <div className="mb-8 flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Database className="mr-3 text-[#c4956a]" size={28} /> Local Hub Vault
                    </h2>
                    <p className="text-sm text-[#999999] mt-2 max-w-xl leading-relaxed">Redeem your accumulated cooperative value for explicit agency perks or review your Patronage share.</p>
                  </div>
                  <div className="bg-[#1a1a1a] border border-[#c4956a]/30 p-4 rounded-xl shadow-[0_0_15px_rgba(196,149,106,0.1)] text-right">
                    <div className="text-[10px] uppercase font-bold text-[#999999] tracking-widest mb-1">Available Purchasing Power</div>
                    <div className="text-3xl font-bold text-[#c4956a] flex items-center justify-end"><Coins size={24} className="mr-2"/> {user.cloud.toLocaleString()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <h3 className="text-sm font-bold text-[#c4956a] uppercase tracking-widest mb-4 border-b border-[#333333] pb-2 flex items-center">
                      <ShoppingCart size={16} className="mr-2"/> The Auction House
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {AUCTION_ITEMS.map(perk => {
                        const isOwned = user.ownedPerks.includes(perk.id);
                        const canAfford = user.cloud >= perk.cost;
                        return (
                          <div key={perk.id} className="bg-[#1a1a1a] border border-[#333333] p-5 rounded-xl hover:border-[#c4956a]/40 transition-all flex flex-col h-full relative overflow-hidden">
                            {isOwned && <div className="absolute -right-6 top-4 bg-[#c4956a] text-[#0f0f0f] text-[10px] font-bold px-8 py-1 rotate-45">OWNED</div>}
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="bg-[#0f0f0f] border border-[#333333] p-2 rounded-lg text-[#c4956a]"><perk.icon size={20}/></div>
                              <h4 className="font-bold text-white">{perk.title}</h4>
                            </div>
                            <p className="text-xs text-[#999999] flex-1 mb-4">{perk.desc}</p>
                            <button 
                              onClick={() => !isOwned && handleBuyPerk(perk)}
                              disabled={isOwned || !canAfford}
                              className={`w-full py-2 rounded text-sm font-bold transition-colors flex items-center justify-center ${
                                isOwned ? 'bg-[#0f0f0f] text-[#c4956a] border border-[#c4956a]/30' : 
                                canAfford ? 'bg-[#333333] hover:bg-[#c4956a] text-white hover:text-[#0f0f0f]' : 
                                'bg-[#0f0f0f] border border-[#333333] text-[#555555] cursor-not-allowed'
                              }`}
                            >
                              {isOwned ? <><CheckCircle size={14} className="mr-2"/> Purchased</> : <><Coins size={14} className="mr-2"/> Buy for {perk.cost}</>}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-[#c4956a] uppercase tracking-widest mb-4 border-b border-[#333333] pb-2 flex items-center">
                      <PieChart size={16} className="mr-2"/> Patronage Snapshot
                    </h3>
                    <div className="bg-[#1a1a1a] border border-[#333333] p-6 rounded-xl flex flex-col items-center">
                       {/* Mock CSS Pie Chart */}
                       <div className="w-32 h-32 rounded-full mb-6 relative shadow-lg" style={{ background: 'conic-gradient(#c4956a 0% 60%, #333333 60% 85%, #0f0f0f 85% 100%)', border: '4px solid #1a1a1a' }}>
                         <div className="absolute inset-0 m-auto w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center shadow-inner">
                           <span className="text-[#c4956a] font-bold">100%</span>
                         </div>
                       </div>
                       <div className="w-full space-y-3">
                         <div className="flex justify-between items-center text-xs"><span className="flex items-center"><div className="w-3 h-3 bg-[#c4956a] rounded-sm mr-2"></div>Labor (Quests)</span><span className="text-white font-mono">60%</span></div>
                         <div className="flex justify-between items-center text-xs"><span className="flex items-center"><div className="w-3 h-3 bg-[#333333] rounded-sm mr-2"></div>Capital (Assets)</span><span className="text-white font-mono">25%</span></div>
                         <div className="flex justify-between items-center text-xs"><span className="flex items-center"><div className="w-3 h-3 bg-[#0f0f0f] border border-[#333333] rounded-sm mr-2"></div>Community (Guilds)</span><span className="text-white font-mono">15%</span></div>
                       </div>
                       <div className="mt-6 w-full text-center text-[10px] text-[#999999] bg-[#0f0f0f] p-3 rounded border border-[#333333]">
                         Allocations are recalculated at the end of every Moon Cycle (Sprint) based on verifiable on-chain attestations.
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SPRINT 2: UPDATED PROFILE VIEW WITH TALENT TREE */}
            {activeView === 'profile' && selectedPeer && (
              <div className="p-8 relative z-10 flex flex-col h-full overflow-y-auto">
                <button onClick={() => setActiveView('quests')} className="flex items-center text-[#999999] hover:text-white transition-colors mb-6 w-fit bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-[#333333]">
                  <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </button>

                <div className="bg-[#1a1a1a] border border-[#333333] rounded-2xl relative overflow-hidden shadow-2xl">
                  {/* Decorative Background */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[#c4956a]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                  
                  {/* Profile Header */}
                  <div className="p-8 pb-0 flex items-start justify-between relative z-10">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 rounded-2xl bg-[#0f0f0f] border-2 border-[#c4956a] flex items-center justify-center shadow-[0_0_20px_rgba(196,149,106,0.2)]">
                        <User size={40} className="text-[#c4956a]" strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h2 className="text-3xl font-bold text-white">{selectedPeer.name}</h2>
                          <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md border ${selectedPeer.rarity === 'Legendary' ? 'bg-amber-900/30 text-amber-400 border-amber-500/50' : 'bg-blue-900/30 text-blue-400 border-blue-500/50'}`}>
                            {selectedPeer.rarity || 'Common'}
                          </span>
                        </div>
                        <div className="text-[#999999] flex items-center space-x-2 mt-2">
                          <span className="bg-[#c4956a]/10 text-[#c4956a] text-xs font-bold px-2 py-0.5 rounded border border-[#c4956a]/30">Lvl {selectedPeer.level}</span>
                          <span>•</span><span className="font-medium text-gray-300">{selectedPeer.archetype}</span>
                          {selectedPeer.specialization && <span>({selectedPeer.specialization})</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Tabs */}
                  <div className="flex px-8 mt-6 border-b border-[#333333] relative z-10">
                    <button onClick={() => setProfileTab('dossier')} className={`pb-3 px-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${profileTab === 'dossier' ? 'border-[#c4956a] text-[#c4956a]' : 'border-transparent text-[#999999] hover:text-white'}`}>
                      Dossier & Stats
                    </button>
                    {selectedPeer.name === user.guestname && (
                      <button onClick={() => setProfileTab('talents')} className={`pb-3 px-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 flex items-center ${profileTab === 'talents' ? 'border-[#c4956a] text-[#c4956a]' : 'border-transparent text-[#999999] hover:text-white'}`}>
                        Talent Tree <span className="ml-2 bg-[#c4956a] text-[#0f0f0f] rounded-full w-5 h-5 flex items-center justify-center text-[10px]">{user.skillPoints}</span>
                      </button>
                    )}
                  </div>

                  {/* Tab Content: Dossier */}
                  {profileTab === 'dossier' && (
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#0f0f0f] border border-[#333333] rounded-xl p-5">
                          <h3 className="text-xs font-bold text-[#c4956a] uppercase tracking-widest mb-3 flex items-center"><BookA size={14} className="mr-2" /> Dossier</h3>
                          <p className="text-sm text-[#999999] leading-relaxed">{selectedPeer.about || 'A dedicated operative within the ecosystem.'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-[#0f0f0f] border border-[#333333] rounded-xl p-5">
                            <h3 className="text-xs font-bold text-[#c4956a] uppercase tracking-widest mb-3 flex items-center"><Shield size={14} className="mr-2" /> Class Identity</h3>
                            <div className="space-y-3">
                              <div><div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Primary × Secondary</div><div className="text-sm text-white font-medium">{selectedPeer.crafts || 'Unknown'}</div></div>
                            </div>
                          </div>
                          <div className="bg-[#0f0f0f] border border-[#333333] rounded-xl p-5">
                            <h3 className="text-xs font-bold text-[#c4956a] uppercase tracking-widest mb-3 flex items-center"><Award size={14} className="mr-2" /> Record</h3>
                            <div className="space-y-3">
                              <div><div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Contributions</div><div className="text-sm text-white font-medium"><Activity size={12} className="inline text-[#c4956a] mr-1" /> {selectedPeer.contributions || 0}</div></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="bg-[#0f0f0f] border border-[#333333] rounded-xl p-5">
                          <h3 className="text-xs font-bold text-[#c4956a] uppercase tracking-widest mb-4 flex items-center"><BarChart2 size={14} className="mr-2" /> Domain Mastery</h3>
                          <div className="space-y-4">
                            {selectedPeer.stats && Object.entries(selectedPeer.stats).map(([stat, val]) => (
                              <div key={stat}>
                                <div className="flex justify-between text-xs mb-1"><span className="text-gray-300 capitalize font-medium">{stat}</span><span className="text-[#c4956a] font-mono">{val} XP</span></div>
                                <div className="w-full bg-[#333333] rounded-full h-1.5"><div className="bg-[#c4956a] h-1.5 rounded-full" style={{ width: `${val}%` }}></div></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab Content: Talent Tree (DAG) */}
                  {profileTab === 'talents' && selectedPeer.name === user.guestname && (
                    <div className="p-8 h-96 relative z-10 bg-[#0f0f0f] m-8 mt-4 rounded-xl border border-[#333333] overflow-hidden flex flex-col">
                      <div className="text-xs text-[#999999] mb-4 text-center">Spend Skill Points earned from leveling up to deepen your specialization.</div>
                      
                      <div className="flex-1 relative">
                        {/* Connecting Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          {talents.map(node => {
                            if (!node.req) return null;
                            const parent = talents.find(t => t.id === node.req);
                            if (!parent) return null;
                            const strokeColor = node.status === 'mastered' ? '#c4956a' : '#333333';
                            return <line key={`edge-${node.id}`} x1={`${parent.x}%`} y1={`${parent.y}%`} x2={`${node.x}%`} y2={`${node.y}%`} stroke={strokeColor} strokeWidth="2" strokeDasharray={node.status !== 'mastered' ? '4 4' : 'none'} />
                          })}
                        </svg>

                        {/* Nodes */}
                        {talents.map(node => {
                          const isMastered = node.status === 'mastered';
                          const isAvailable = node.status === 'available';
                          return (
                            <div 
                              key={node.id} 
                              className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group ${isAvailable && user.skillPoints > 0 ? 'cursor-pointer' : ''}`}
                              style={{ left: `${node.x}%`, top: `${node.y}%` }}
                              onClick={() => isAvailable && handleUnlockTalent(node.id)}
                            >
                              <div className={`p-3 rounded-full border-2 transition-all duration-300 ${
                                isMastered ? 'bg-[#c4956a] border-[#c4956a] text-[#0f0f0f] shadow-[0_0_15px_rgba(196,149,106,0.4)]' : 
                                isAvailable ? 'bg-[#1a1a1a] border-[#c4956a]/50 text-[#c4956a] group-hover:bg-[#c4956a]/20' : 
                                'bg-[#0f0f0f] border-[#333333] text-[#333333]'
                              }`}>
                                {isMastered ? <CheckCircle size={20} /> : isAvailable ? <Unlock size={20} /> : <Lock size={20} />}
                              </div>
                              <span className={`mt-2 text-[10px] font-bold uppercase tracking-wider bg-[#0f0f0f] px-2 py-0.5 rounded border ${isMastered ? 'text-[#c4956a] border-[#c4956a]/30' : 'text-[#999999] border-[#333333]'}`}>
                                {node.label}
                              </span>
                              {isAvailable && (
                                <span className="absolute -bottom-6 text-[9px] bg-[#c4956a] text-[#0f0f0f] px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  Click to unlock (1 SP)
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeView === 'forest' && (
              <div className="p-8 relative z-10 flex flex-col h-full"><div className="mb-8"><h2 className="text-2xl font-bold text-white flex items-center"><Globe className="mr-3 text-[#c4956a]" size={28} /> The Forest Federation</h2><p className="text-sm text-[#999999] mt-2 max-w-xl leading-relaxed">Peer-to-peer relationships across autonomous hubs.</p></div></div>
            )}
            {activeView === 'archetypes' && (
              <div className="p-8 relative z-10 flex flex-col h-full"><div className="mb-8"><h2 className="text-2xl font-bold text-white flex items-center"><Map className="mr-3 text-[#c4956a]" size={28} /> Agency Archetype Codex</h2></div></div>
            )}
            {activeView === 'graph' && (
              <div className="p-8 relative z-10 flex flex-col h-full overflow-hidden"><div className="mb-6 z-20 pointer-events-none"><h2 className="text-2xl font-bold text-white flex items-center">Graph View: {activeLayer} Dimension</h2></div></div>
            )}
          </div>

          {/* RIGHT SIDEBAR: Peer Network & Combat Log */}
          <aside className="w-80 bg-[#1a1a1a] border-l border-[#333333] flex flex-col shadow-[-4px_0_15px_rgba(0,0,0,0.5)] z-20">
            {/* Peer Nodes / Talent Network */}
            <div className="p-5 h-2/5 border-b border-[#333333] overflow-y-auto bg-[#1a1a1a]">
              <h3 className="text-[10px] font-bold text-[#999999] uppercase tracking-widest mb-4 flex items-center">
                <Globe size={14} className="mr-2 text-[#c4956a]" /> Active Roster
              </h3>
              <div className="space-y-3">
                {peers.map((peer) => (
                  <div key={peer.id} onClick={() => { setSelectedPeer(peer); setActiveView('profile'); }} className="group flex items-center justify-between p-2.5 rounded-lg border border-transparent hover:border-[#c4956a]/30 hover:bg-[#333333]/50 cursor-pointer transition-all">
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-200 flex items-center group-hover:text-white transition-colors">
                        <div className={`w-2 h-2 rounded-full mr-2 shadow-sm ${peer.status === 'Online' || peer.status === 'Processing' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : peer.status === 'Resting' ? 'bg-[#c4956a]' : 'bg-[#333333]'}`}></div>
                        {peer.name}
                      </div>
                      <div className="text-xs text-[#999999] ml-4 mt-0.5 flex justify-between">
                        <span>{peer.class}</span>
                        <span className="text-[10px] uppercase text-[#999999] font-bold">{peer.status}</span>
                      </div>
                      <div className="ml-4 mt-2 h-1 w-full bg-[#333333] rounded-full overflow-hidden">
                         <div className={`h-full transition-all duration-500 ${peer.mana < 20 ? 'bg-red-500' : 'bg-blue-500/50'}`} style={{ width: `${(peer.mana/peer.maxMana)*100}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Ledger */}
            <div className="p-5 flex-1 overflow-y-auto bg-[#0f0f0f] relative flex flex-col">
              <div className="sticky top-0 bg-[#0f0f0f] pb-3 mb-2 z-10 border-b border-[#333333] flex justify-between items-center">
                <h3 className="text-[10px] font-bold text-[#999999] uppercase tracking-widest flex items-center">
                  <Pickaxe size={14} className="mr-2 text-[#c4956a]" /> Event Ledger
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center bg-[#1a1a1a] rounded border border-[#333333]">
                    <button onClick={() => setLogPage(p => Math.min(totalLogPages, p + 1))} disabled={logPage === totalLogPages} className="p-1 text-[#999999] hover:text-[#c4956a] disabled:opacity-30"><ChevronLeft size={12} /></button>
                    <span className="text-[10px] font-mono text-[#999999] px-1">{logPage}/{totalLogPages}</span>
                    <button onClick={() => setLogPage(p => Math.max(1, p - 1))} disabled={logPage === 1} className="p-1 text-[#999999] hover:text-[#c4956a] disabled:opacity-30"><ChevronRight size={12} /></button>
                  </div>
                  <span className="flex h-2 w-2 relative">
                    {simRunning && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c4956a] opacity-75"></span>}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${simRunning ? 'bg-[#c4956a]' : 'bg-[#333333]'}`}></span>
                  </span>
                </div>
              </div>
              
              <div className="space-y-4 pt-2 flex-1">
                {paginatedLogs.map((log) => (
                  <div key={log.id} className="text-sm relative pl-4 border-l-2 border-[#333333] hover:border-[#c4956a]/50 transition-colors py-1">
                    <div className="absolute -left-1.5 top-2.5 w-2.5 h-2.5 rounded-full bg-[#0f0f0f] border-2 border-[#333333]"></div>
                    <div className="flex flex-wrap items-baseline gap-1.5 leading-tight">
                      <span className={`font-bold ${log.type === 'Loot' ? 'text-[#c4956a]' : log.type === 'System Alert' ? 'text-red-400' : log.type === 'Level Up' ? 'text-blue-400' : 'text-white'}`}>{log.user}</span>
                      <span className="text-[#999999] text-xs">{log.action}</span>
                      <span className="font-semibold text-gray-200">{log.target}</span>
                    </div>
                    <div className="text-[9px] uppercase tracking-wider font-bold text-[#999999] mt-1.5 flex items-center">
                      <span className="text-[#999999] opacity-70">{log.time}</span><span className="mx-1.5">•</span><span className="font-mono bg-[#1a1a1a] px-1 rounded">{log.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}



