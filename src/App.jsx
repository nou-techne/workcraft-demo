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

export default function App() {
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
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 font-sans flex flex-col overflow-hidden"&gt>;
      
      {/* TOP BAR: HUD & Resource Router */}
      <header className="bg-[#1a1a1a] border-b border-[#333333] p-4 flex items-center justify-between shadow-md z-10"&gt>;
        <div className="flex items-center space-x-4"&gt>;
          <div> 
            className="flex flex-col cursor-pointer group"
            onClick={() =&gt; { setSelectedPeer({...user, name: user.guestname}); setActiveView('profile'); }}
          &gt;
            <div className="flex items-center space-x-2"&gt>;
              <span className="font-bold text-lg text-white group-hover:text-[#c4956a] transition-colors"&gt;{user.guestname}</span&gt>>;
              <span className="bg-[#c4956a]/10 text-[#c4956a] text-xs px-2 py-0.5 rounded-full border border-[#c4956a]/30"&gt>;
                Lvl {user.level}
              </span&gt>;
            </div&gt>;
            <span className="text-xs text-[#999999]"&gt;{user.archetype} ({user.specialization})</span&gt>>;
          </div&gt>;
        </div&gt>;

        {/* Engine Controls & Resources */}
        <div className="flex items-center space-x-6"&gt>;
          <button onClick={toggleFullscreen} className="p-1.5 rounded-lg bg-[#0f0f0f] border border-[#333333] text-[#999999] hover:text-white hover:bg-[#333333] transition-colors" title="Toggle Fullscreen"&gt>;
            {isFullscreen ? <Minimize size={16} /&gt; : &lt;Maximize size={16} /&gt>;}
          </button&gt>;
          
          <div className="flex items-center space-x-2 bg-[#0f0f0f] px-3 py-1.5 rounded-lg border border-[#333333]"&gt>;
            <button onClick={() =&gt; setSimRunning(!simRunning)} className={`p-1 rounded ${simRunning ? 'bg-[#c4956a]/20 text-[#c4956a]' : 'bg-[#333333] text-[#999999]'} hover:bg-[#333333] transition-colors`} title="Toggle Simulation"&gt>;
              {simRunning ? <Pause size={16} /&gt; : &lt;Play size={16} /&gt>;}
            </button&gt>;
            <div className="text-xs font-mono text-[#999999] w-16 text-center"&gt;Tick {tick}</div&gt>>;
          </div&gt>;

          <div className="flex flex-col items-end w-48"&gt>;
            <div className="flex justify-between w-full mb-1"&gt>;
              <span className="text-xs font-medium text-[#999999] flex items-center"&gt;&lt;Zap size={12} className="mr-1 text-blue-400"/&gt; Mana Pool</span&gt>>;
              <span className={`text-xs ${user.mana &lt; 20 ? 'text-red-400 font-bold animate-pulse' : 'text-blue-400'}`}&gt;{user.mana}/{user.maxMana}</span&gt>>;
            </div&gt>;
            <div className="w-full bg-[#333333] rounded-full h-2"&gt>;
              <div className={`h-2 rounded-full transition-all duration-500 ${user.mana &lt; 20 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'}`} style={{ width: `${(user.mana/user.maxMana)*100}%` }}&gt;</div&gt>>;
            </div&gt>;
          </div&gt>;

          <div> 
            onClick={() =&gt; setActiveView('vault')}
            className="flex flex-col items-end w-36 cursor-pointer bg-[#0f0f0f] p-2 rounded-lg border border-[#333333] hover:border-[#c4956a]/50 transition-colors group"
          &gt;
             <span className="text-[10px] font-medium text-[#999999] uppercase tracking-widest flex items-center group-hover:text-[#c4956a] transition-colors"&gt>;
               <Coins size={12} className="mr-1.5"/&gt; Vault Balance>
             </span&gt>;
             <span className="text-sm font-bold text-[#c4956a] mt-0.5"&gt;{user.cloud.toLocaleString()} $CLOUD</span&gt>>;
          </div&gt>;
        </div&gt>;
      </header&gt>;

      <div className="flex flex-1 overflow-hidden"&gt>;
        {/* LEFT SIDEBAR: Navigation */}
        <aside className="w-64 bg-[#1a1a1a] border-r border-[#333333] flex flex-col z-20"&gt>;
          <div className="p-4 border-b border-[#333333] flex bg-[#0f0f0f] rounded-lg m-2 p-1"&gt>;
            <button className={`flex-1 py-1.5 text-sm text-center rounded-md transition-all ${['quests', 'create_quest'].includes(activeView) ? 'bg-[#c4956a] text-white shadow-sm' : 'text-[#999999] hover:text-gray-200'}`} onClick={() =&gt; setActiveView('quests')}&gt>;
              <Database size={14} className="inline mr-1" /&gt; Hub Node>
            </button&gt>;
            <button className={`flex-1 py-1.5 text-sm text-center rounded-md transition-all ${activeView === 'forest' ? 'bg-[#c4956a] text-white shadow-sm' : 'text-[#999999] hover:text-gray-200'}`} onClick={() =&gt; setActiveView('forest')}&gt>;
              <Globe size={14} className="inline mr-1" /&gt; Forest>
            </button&gt>;
          </div&gt>;

          <nav className="flex-1 p-2 space-y-1 overflow-y-auto"&gt>;
            <div className="text-[10px] font-semibold text-[#999999] uppercase tracking-widest mb-3 px-3 pt-2"&gt;Ecosystem Lore</div&gt>>;
            <button onClick={() =&gt; setActiveView('archetypes')} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-sm mb-4 ${activeView === 'archetypes' ? 'bg-[#333333] text-white border-l-2 border-[#c4956a]' : 'text-[#999999] hover:bg-[#333333]/50 hover:text-gray-200'}`}&gt>;
              <Map size={16} className={activeView === 'archetypes' ? 'text-[#c4956a]' : 'text-[#999999]'} /&gt>;
              <span&gt;Archetype Codex</span&gt>>;
            </button&gt>;

            <div className="text-[10px] font-semibold text-[#999999] uppercase tracking-widest mb-3 px-3 pt-2 border-t border-[#333333] mt-2 pt-4"&gt;Knowledge Graph Views</div&gt>>;
            {[
              { name: 'Ecology', icon: Leaf, id: 'e/' }, { name: 'Human', icon: Users, id: 'H/' },
              { name: 'Language', icon: BookA, id: 'L/' }, { name: 'Artifacts', icon: Layers, id: 'A/' },
              { name: 'Methodology', icon: GitMerge, id: 'M/' }
            ].map(layer =&gt; (
              <button key={layer.id} onClick={() =&gt; { setActiveView('graph'); setActiveLayer(layer.id); }} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-sm ${activeView === 'graph' && activeLayer === layer.id ? 'bg-[#333333] text-white border-l-2 border-[#c4956a]' : 'text-[#999999] hover:bg-[#333333]/50 hover:text-gray-200'}`}&gt>;
                <layer.icon size={16} className={activeView === 'graph' && activeLayer === layer.id ? 'text-[#c4956a]' : 'text-[#999999]'} /&gt>;
                <span className="w-6 text-xs text-[#999999] opacity-70 font-mono"&gt;{layer.id}</span&gt>>;
                <span&gt;{layer.name}</span&gt>>;
              </button&gt>;
            ))}

            <div className="text-[10px] font-semibold text-[#999999] uppercase tracking-widest mb-3 mt-6 px-3"&gt;Guild Chambers</div&gt>>;
            <button onClick={() =&gt; setActiveView('guild_loom')} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-sm ${activeView === 'guild_loom' ? 'bg-[#333333] text-white border-l-2 border-[#c4956a]' : 'text-[#999999] hover:bg-[#333333]/50 hover:text-gray-200'}`}&gt>;
              <Network size={16} className={activeView === 'guild_loom' ? 'text-[#c4956a]' : 'text-[#999999]'} /&gt>;
              <span&gt;Guild of the Loom (Code)</span&gt>>;
            </button&gt>;
          </nav&gt>;
        </aside&gt>;

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex overflow-hidden"&gt>;
          
          <div className="flex-1 flex flex-col overflow-y-auto bg-[#0f0f0f] relative z-0"&gt>;
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 w-full h-96 bg-[#c4956a]/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none -z-10"&gt;</div&gt>>;

            {activeView === 'quests' && (
              <div className="p-8 relative z-10 flex flex-col h-full"&gt>;
                <div className="flex justify-between items-start mb-8"&gt>;
                  <div&gt>;
                    <h2 className="text-2xl font-bold text-white flex items-center"&gt>;
                      <Shield className="mr-3 text-[#c4956a]" size={28} /&gt>; 
                      Local Quest Board
                    </h2&gt>;
                    <p className="text-sm text-[#999999] mt-2 max-w-xl leading-relaxed"&gt>;
                      Review available scopes. Committing to a role deducts from your Mana pool.
                    </p&gt>;
                  </div&gt>;
                  <button> 
                    onClick={() =&gt; setActiveView('create_quest')}
                    className="bg-[#c4956a] hover:bg-[#c4956a]/80 text-[#0f0f0f] font-bold py-2 px-4 rounded-lg flex items-center transition-colors shadow-lg shadow-[#c4956a]/20"
                  &gt;
                    <Plus size={18} className="mr-2" /&gt; Forge New Quest>
                  </button&gt>;
                </div&gt>;

                <div className="space-y-5"&gt>;
                  {quests.length === 0 ? (
                    <div className="text-center py-12 border border-[#333333] border-dashed rounded-xl bg-[#1a1a1a]/50"&gt>;
                      <Pickaxe size={32} className="mx-auto text-[#999999] mb-3" /&gt>;
                      <p className="text-[#999999]"&gt;No active quests in this layer.</p&gt>>;
                    </div&gt>;
                  ) : quests.map(quest =&gt; (
                    <div key={quest.id} className="bg-[#1a1a1a] border border-[#333333] rounded-xl p-5 hover:border-[#c4956a]/40 transition-all shadow-lg hover:shadow-[#c4956a]/5"&gt>;
                      <div className="flex justify-between items-start mb-4"&gt>;
                        <div&gt>;
                          <div className="flex items-center space-x-2 mb-2"&gt>;
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${quest.type === 'Raid' ? 'bg-[#c4956a]/10 border-[#c4956a]/30 text-[#c4956a]' : 'bg-[#333333]/50 border-[#333333] text-gray-300'}`}&gt>;
                              {quest.type}
                            </span&gt>;
                            <span className="text-xs text-[#999999] bg-[#0f0f0f] px-2 py-0.5 rounded border border-[#333333]"&gt;Lvl: {quest.difficulty}</span&gt>>;
                          </div&gt>;
                          <h3 className="text-lg font-semibold text-white"&gt;{quest.title}</h3&gt>>;
                        </div&gt>;
                        <div className="text-right bg-[#0f0f0f] p-2 rounded-lg border border-[#333333]"&gt>;
                          <div className="text-[#c4956a] font-bold text-sm flex items-center justify-end"&gt;{quest.reward} &lt;Coins size={12} className="ml-1"/&gt;</div&gt>>;
                          <div className="text-xs text-blue-400 mt-1 flex items-center justify-end font-medium"&gt;&lt;Zap size={10} className="mr-1"/&gt; Cost: {quest.manaCost}</div&gt>>;
                        </div&gt>;
                      </div&gt>;

                      <div className="mt-5 bg-[#0f0f0f]/60 rounded-lg p-4 border border-[#333333]/50"&gt>;
                        <div className="text-[10px] font-semibold text-[#999999] mb-3 uppercase tracking-widest flex items-center"&gt;&lt;Users size={12} className="mr-1.5" /&gt; Required Roles</div&gt>>;
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2"&gt>;
                          {quest.roles.map((role) =&gt; (
                            <div key={role.id} onClick={() =&gt; !role.filled && handleClaimRole(quest.id, role.id, quest.manaCost)} className={`flex items-center justify-between text-sm px-3 py-2 rounded-md border transition-all ${role.filled ? 'bg-[#333333]/50 border-[#333333] text-gray-300' : user.mana &gt;= quest.manaCost ? 'bg-[#1a1a1a] border-dashed border-[#c4956a]/30 text-[#c4956a] hover:border-[#c4956a] hover:bg-[#c4956a]/10 cursor-pointer' : 'bg-[#1a1a1a] border-dashed border-red-500/20 text-[#999999] cursor-not-allowed opacity-60'}`}&gt>;
                              <div className="flex items-center"&gt>;
                                {role.filled ? <CheckCircle2 size={16} className="mr-2 text-[#c4956a]" /&gt; : &lt;CircleDashed size={16} className="mr-2" /&gt>;}
                                <span className="font-medium mr-2"&gt;{role.name}</span&gt>>;
                              </div&gt>;
                              {role.filled ? <span className="text-xs font-mono bg-[#0f0f0f] px-2 py-0.5 rounded text-[#999999] border border-[#333333]"&gt;{role.user}</span&gt; : &lt;span className="text-xs font-medium uppercase tracking-wide"&gt;{user.mana &gt;= quest.manaCost ? 'Claim' : 'Low Mana'}&lt;/span&gt>>;}
                            </div&gt>;
                          ))}
                        </div&gt>;
                      </div&gt>;
                    </div&gt>;
                  ))}
                </div&gt>;
              </div&gt>;
            )}

            {/* NEW SPRINT 1: CREATE QUEST ENGINE */}
            {activeView === 'create_quest' && (
              <div className="p-8 relative z-10 flex flex-col h-full overflow-y-auto"&gt>;
                <button onClick={() =&gt; setActiveView('quests')} className="flex items-center text-[#999999] hover:text-white transition-colors mb-6 w-fit bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-[#333333]"&gt>;
                  <ArrowLeft size={16} className="mr-2" /&gt; Back to Board>
                </button&gt>;

                <div className="bg-[#1a1a1a] border border-[#333333] rounded-xl p-8 max-w-2xl mx-auto shadow-2xl"&gt>;
                  <h2 className="text-2xl font-bold text-white flex items-center mb-2"&gt>;
                    <Flame className="mr-3 text-[#c4956a]" size={28} /&gt; The Catalyst's Forge>
                  </h2&gt>;
                  <p className="text-sm text-[#999999] mb-8"&gt;Structure a new scope. Required roles dictate the total Mana estimation for the Party.</p&gt>>;

                  <div className="space-y-6"&gt>;
                    <div&gt>;
                      <label className="block text-xs font-bold text-[#c4956a] uppercase tracking-widest mb-2"&gt;Quest Title</label&gt>>;
                      <input type="text" value={newQuest.title} onChange={e =&gt; setNewQuest({...newQuest, title: e.target.value})} placeholder="e.g., Build Regenerative DB Schema" className="w-full bg-[#0f0f0f] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c4956a] transition-colors" /&gt>;
                    </div&gt>;

                    <div className="grid grid-cols-2 gap-4"&gt>;
                      <div&gt>;
                        <label className="block text-xs font-bold text-[#c4956a] uppercase tracking-widest mb-2"&gt;Scope Type</label&gt>>;
                        <select value={newQuest.type} onChange={e =&gt; setNewQuest({...newQuest, type: e.target.value})} className="w-full bg-[#0f0f0f] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c4956a] transition-colors appearance-none"&gt>;
                          <option&gt;Side Quest</option&gt;&lt;option&gt;Main Story&lt;/option&gt;&lt;option&gt;Raid&lt;/option&gt>>;
                        </select&gt>;
                      </div&gt>;
                      <div&gt>;
                        <label className="block text-xs font-bold text-[#c4956a] uppercase tracking-widest mb-2"&gt;Treasury Bounty ($CLOUD)</label&gt>>;
                        <input type="number" value={newQuest.reward} onChange={e =&gt; setNewQuest({...newQuest, reward: parseInt(e.target.value)})} className="w-full bg-[#0f0f0f] border border-[#333333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c4956a] transition-colors" /&gt>;
                      </div&gt>;
                    </div&gt>;

                    <div className="bg-[#0f0f0f] p-5 rounded-lg border border-[#333333]"&gt>;
                      <div className="flex justify-between items-center mb-4"&gt>;
                        <label className="block text-xs font-bold text-[#c4956a] uppercase tracking-widest"&gt;Required Archetype Roles</label&gt>>;
                        <button onClick={() =&gt; setNewQuest({...newQuest, roles: [...newQuest.roles, { name: 'New Role' }] })} className="text-xs bg-[#1a1a1a] hover:bg-[#333333] text-white px-3 py-1.5 rounded border border-[#333333] transition-colors flex items-center"&gt>;
                          <Plus size={14} className="mr-1"/&gt; Add Role>
                        </button&gt>;
                      </div&gt>;
                      <div className="space-y-2"&gt>;
                        {newQuest.roles.map((r, i) =&gt; (
                          <div key={i} className="flex items-center space-x-2"&gt>;
                            <select value={r.name} onChange={e =&gt; { const updated = [...newQuest.roles]; updated[i].name = e.target.value; setNewQuest({...newQuest, roles: updated}); }} className="flex-1 bg-[#1a1a1a] border border-[#333333] rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#c4956a]"&gt>;
                              <option&gt;Code (DPS)</option&gt;&lt;option&gt;Earth (Tank)&lt;/option&gt;&lt;option&gt;Form (Visualizer)&lt;/option&gt;&lt;option&gt;Word (Context)&lt;/option&gt;&lt;option&gt;Water (Healer)&lt;/option&gt>>;
                            </select&gt>;
                            <button onClick={() =&gt; setNewQuest({...newQuest, roles: newQuest.roles.filter((_, idx) =&gt; idx !== i)})} className="p-2 text-red-400 hover:bg-red-500/20 rounded-md transition-colors"&gt;✕</button&gt>>;
                          </div&gt>;
                        ))}
                      </div&gt>;
                      <div className="mt-4 pt-4 border-t border-[#333333] flex justify-between items-center text-sm"&gt>;
                        <span className="text-[#999999]"&gt;Estimated Party Mana Cost:</span&gt>>;
                        <span className="font-bold text-blue-400 flex items-center"&gt;&lt;Zap size={14} className="mr-1"/&gt; {newQuest.type === 'Raid' ? 40 : 15} per role</span&gt>>;
                      </div&gt>;
                    </div&gt>;

                    <button onClick={handleCreateQuest} disabled={!newQuest.title} className="w-full bg-[#c4956a] hover:bg-[#c4956a]/80 disabled:bg-[#333333] disabled:text-[#999999] text-[#0f0f0f] font-bold py-3 rounded-lg transition-colors shadow-lg shadow-[#c4956a]/20 mt-4 flex justify-center items-center"&gt>;
                      Launch to Network <Share2 size={16} className="ml-2"/&gt>;
                    </button&gt>;
                  </div&gt>;
                </div&gt>;
              </div&gt>;
            )}

            {/* NEW SPRINT 3: THE VAULT & AUCTION HOUSE */}
            {activeView === 'vault' && (
              <div className="p-8 relative z-10 flex flex-col h-full overflow-y-auto"&gt>;
                <div className="mb-8 flex justify-between items-end"&gt>;
                  <div&gt>;
                    <h2 className="text-2xl font-bold text-white flex items-center"&gt>;
                      <Database className="mr-3 text-[#c4956a]" size={28} /&gt; Local Hub Vault>
                    </h2&gt>;
                    <p className="text-sm text-[#999999] mt-2 max-w-xl leading-relaxed"&gt;Redeem your accumulated cooperative value for explicit agency perks or review your Patronage share.</p&gt>>;
                  </div&gt>;
                  <div className="bg-[#1a1a1a] border border-[#c4956a]/30 p-4 rounded-xl shadow-[0_0_15px_rgba(196,149,106,0.1)] text-right"&gt>;
                    <div className="text-[10px] uppercase font-bold text-[#999999] tracking-widest mb-1"&gt;Available Purchasing Power</div&gt>>;
                    <div className="text-3xl font-bold text-[#c4956a] flex items-center justify-end"&gt;&lt;Coins size={24} className="mr-2"/&gt; {user.cloud.toLocaleString()}</div&gt>>;
                  </div&gt>;
                </div&gt>;

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"&gt>;
                  <div className="lg:col-span-2"&gt>;
                    <h3 className="text-sm font-bold text-[#c4956a] uppercase tracking-widest mb-4 border-b border-[#333333] pb-2 flex items-center"&gt>;
                      <ShoppingCart size={16} className="mr-2"/&gt; The Auction House>
                    </h3&gt>;
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"&gt>;
                      {AUCTION_ITEMS.map(perk =&gt; {
                        const isOwned = user.ownedPerks.includes(perk.id);
                        const canAfford = user.cloud &gt;= perk.cost;
                        return (
                          <div key={perk.id} className="bg-[#1a1a1a] border border-[#333333] p-5 rounded-xl hover:border-[#c4956a]/40 transition-all flex flex-col h-full relative overflow-hidden"&gt>;
                            {isOwned && <div className="absolute -right-6 top-4 bg-[#c4956a] text-[#0f0f0f] text-[10px] font-bold px-8 py-1 rotate-45"&gt;OWNED</div&gt>>;}
                            <div className="flex items-center space-x-3 mb-3"&gt>;
                              <div className="bg-[#0f0f0f] border border-[#333333] p-2 rounded-lg text-[#c4956a]"&gt;&lt;perk.icon size={20}/&gt;</div&gt>>;
                              <h4 className="font-bold text-white"&gt;{perk.title}</h4&gt>>;
                            </div&gt>;
                            <p className="text-xs text-[#999999] flex-1 mb-4"&gt;{perk.desc}</p&gt>>;
                            <button> 
                              onClick={() =&gt; !isOwned && handleBuyPerk(perk)}
                              disabled={isOwned || !canAfford}
                              className={`w-full py-2 rounded text-sm font-bold transition-colors flex items-center justify-center ${
                                isOwned ? 'bg-[#0f0f0f] text-[#c4956a] border border-[#c4956a]/30' : 
                                canAfford ? 'bg-[#333333] hover:bg-[#c4956a] text-white hover:text-[#0f0f0f]' : 
                                'bg-[#0f0f0f] border border-[#333333] text-[#555555] cursor-not-allowed'
                              }`}
                            &gt;
                              {isOwned ? &lt;&gt;<CheckCircle size={14} className="mr-2"/&gt; Purchased&lt;/&gt; : &lt;&gt;&lt;Coins size={14} className="mr-2"/&gt; Buy for {perk.cost}&lt;/&gt>;}
                            </button&gt>;
                          </div&gt>;
                        )
                      })}
                    </div&gt>;
                  </div&gt>;
                  
                  <div&gt>;
                    <h3 className="text-sm font-bold text-[#c4956a] uppercase tracking-widest mb-4 border-b border-[#333333] pb-2 flex items-center"&gt>;
                      <PieChart size={16} className="mr-2"/&gt; Patronage Snapshot>
                    </h3&gt>;
                    <div className="bg-[#1a1a1a] border border-[#333333] p-6 rounded-xl flex flex-col items-center"&gt>;
                       {/* Mock CSS Pie Chart */}
                       <div className="w-32 h-32 rounded-full mb-6 relative shadow-lg" style={{ background: 'conic-gradient(#c4956a 0% 60%, #333333 60% 85%, #0f0f0f 85% 100%)', border: '4px solid #1a1a1a' }}&gt>;
                         <div className="absolute inset-0 m-auto w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center shadow-inner"&gt>;
                           <span className="text-[#c4956a] font-bold"&gt;100%</span&gt>>;
                         </div&gt>;
                       </div&gt>;
                       <div className="w-full space-y-3"&gt>;
                         <div className="flex justify-between items-center text-xs"&gt;&lt;span className="flex items-center"&gt;&lt;div className="w-3 h-3 bg-[#c4956a] rounded-sm mr-2"&gt;</div&gt;Labor (Quests)&lt;/span&gt;&lt;span className="text-white font-mono"&gt;60%&lt;/span&gt;&lt;/div&gt>>;
                         <div className="flex justify-between items-center text-xs"&gt;&lt;span className="flex items-center"&gt;&lt;div className="w-3 h-3 bg-[#333333] rounded-sm mr-2"&gt;</div&gt;Capital (Assets)&lt;/span&gt;&lt;span className="text-white font-mono"&gt;25%&lt;/span&gt;&lt;/div&gt>>;
                         <div className="flex justify-between items-center text-xs"&gt;&lt;span className="flex items-center"&gt;&lt;div className="w-3 h-3 bg-[#0f0f0f] border border-[#333333] rounded-sm mr-2"&gt;</div&gt;Community (Guilds)&lt;/span&gt;&lt;span className="text-white font-mono"&gt;15%&lt;/span&gt;&lt;/div&gt>>;
                       </div&gt>;
                       <div className="mt-6 w-full text-center text-[10px] text-[#999999] bg-[#0f0f0f] p-3 rounded border border-[#333333]"&gt>;
                         Allocations are recalculated at the end of every Moon Cycle (Sprint) based on verifiable on-chain attestations.
                       </div&gt>;
                    </div&gt>;
                  </div&gt>;
                </div&gt>;
              </div&gt>;
            )}

            {/* SPRINT 2: UPDATED PROFILE VIEW WITH TALENT TREE */}
            {activeView === 'profile' && selectedPeer && (
              <div className="p-8 relative z-10 flex flex-col h-full overflow-y-auto"&gt>;
                <button onClick={() =&gt; setActiveView('quests')} className="flex items-center text-[#999999] hover:text-white transition-colors mb-6 w-fit bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-[#333333]"&gt>;
                  <ArrowLeft size={16} className="mr-2" /&gt; Back to Dashboard>
                </button&gt>;

                <div className="bg-[#1a1a1a] border border-[#333333] rounded-2xl relative overflow-hidden shadow-2xl"&gt>;
                  {/* Decorative Background */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[#c4956a]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"&gt;</div&gt>>;
                  
                  {/* Profile Header */}
                  <div className="p-8 pb-0 flex items-start justify-between relative z-10"&gt>;
                    <div className="flex items-center space-x-6"&gt>;
                      <div className="w-20 h-20 rounded-2xl bg-[#0f0f0f] border-2 border-[#c4956a] flex items-center justify-center shadow-[0_0_20px_rgba(196,149,106,0.2)]"&gt>;
                        <User size={40} className="text-[#c4956a]" strokeWidth={1.5} /&gt>;
                      </div&gt>;
                      <div&gt>;
                        <div className="flex items-center space-x-3 mb-1"&gt>;
                          <h2 className="text-3xl font-bold text-white"&gt;{selectedPeer.name}</h2&gt>>;
                          <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md border ${selectedPeer.rarity === 'Legendary' ? 'bg-amber-900/30 text-amber-400 border-amber-500/50' : 'bg-blue-900/30 text-blue-400 border-blue-500/50'}`}&gt>;
                            {selectedPeer.rarity || 'Common'}
                          </span&gt>;
                        </div&gt>;
                        <div className="text-[#999999] flex items-center space-x-2 mt-2"&gt>;
                          <span className="bg-[#c4956a]/10 text-[#c4956a] text-xs font-bold px-2 py-0.5 rounded border border-[#c4956a]/30"&gt;Lvl {selectedPeer.level}</span&gt>>;
                          <span&gt;•</span&gt;&lt;span className="font-medium text-gray-300"&gt;{selectedPeer.archetype}&lt;/span&gt>>;
                          {selectedPeer.specialization && <span&gt;({selectedPeer.specialization})</span&gt>>;}
                        </div&gt>;
                      </div&gt>;
                    </div&gt>;
                  </div&gt>;

                  {/* Profile Tabs */}
                  <div className="flex px-8 mt-6 border-b border-[#333333] relative z-10"&gt>;
                    <button onClick={() =&gt; setProfileTab('dossier')} className={`pb-3 px-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${profileTab === 'dossier' ? 'border-[#c4956a] text-[#c4956a]' : 'border-transparent text-[#999999] hover:text-white'}`}&gt>;
                      Dossier & Stats
                    </button&gt>;
                    {selectedPeer.name === user.guestname && (
                      <button onClick={() =&gt; setProfileTab('talents')} className={`pb-3 px-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 flex items-center ${profileTab === 'talents' ? 'border-[#c4956a] text-[#c4956a]' : 'border-transparent text-[#999999] hover:text-white'}`}&gt>;
                        Talent Tree <span className="ml-2 bg-[#c4956a] text-[#0f0f0f] rounded-full w-5 h-5 flex items-center justify-center text-[10px]"&gt;{user.skillPoints}</span&gt>>;
                      </button&gt>;
                    )}
                  </div&gt>;

                  {/* Tab Content: Dossier */}
                  {profileTab === 'dossier' && (
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10"&gt>;
                      <div className="lg:col-span-2 space-y-6"&gt>;
                        <div className="bg-[#0f0f0f] border border-[#333333] rounded-xl p-5"&gt>;
                          <h3 className="text-xs font-bold text-[#c4956a] uppercase tracking-widest mb-3 flex items-center"&gt;&lt;BookA size={14} className="mr-2" /&gt; Dossier</h3&gt>>;
                          <p className="text-sm text-[#999999] leading-relaxed"&gt;{selectedPeer.about || 'A dedicated operative within the ecosystem.'}</p&gt>>;
                        </div&gt>;
                        <div className="grid grid-cols-2 gap-4"&gt>;
                          <div className="bg-[#0f0f0f] border border-[#333333] rounded-xl p-5"&gt>;
                            <h3 className="text-xs font-bold text-[#c4956a] uppercase tracking-widest mb-3 flex items-center"&gt;&lt;Shield size={14} className="mr-2" /&gt; Class Identity</h3&gt>>;
                            <div className="space-y-3"&gt>;
                              <div&gt;&lt;div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1"&gt;Primary × Secondary</div&gt;&lt;div className="text-sm text-white font-medium"&gt;{selectedPeer.crafts || 'Unknown'}&lt;/div&gt;&lt;/div&gt>>;
                            </div&gt>;
                          </div&gt>;
                          <div className="bg-[#0f0f0f] border border-[#333333] rounded-xl p-5"&gt>;
                            <h3 className="text-xs font-bold text-[#c4956a] uppercase tracking-widest mb-3 flex items-center"&gt;&lt;Award size={14} className="mr-2" /&gt; Record</h3&gt>>;
                            <div className="space-y-3"&gt>;
                              <div&gt;&lt;div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1"&gt;Contributions</div&gt;&lt;div className="text-sm text-white font-medium"&gt;&lt;Activity size={12} className="inline text-[#c4956a] mr-1" /&gt; {selectedPeer.contributions || 0}&lt;/div&gt;&lt;/div&gt>>;
                            </div&gt>;
                          </div&gt>;
                        </div&gt>;
                      </div&gt>;
                      <div className="space-y-6"&gt>;
                        <div className="bg-[#0f0f0f] border border-[#333333] rounded-xl p-5"&gt>;
                          <h3 className="text-xs font-bold text-[#c4956a] uppercase tracking-widest mb-4 flex items-center"&gt;&lt;BarChart2 size={14} className="mr-2" /&gt; Domain Mastery</h3&gt>>;
                          <div className="space-y-4"&gt>;
                            {selectedPeer.stats && Object.entries(selectedPeer.stats).map(([stat, val]) =&gt; (
                              <div key={stat}&gt>;
                                <div className="flex justify-between text-xs mb-1"&gt;&lt;span className="text-gray-300 capitalize font-medium"&gt;{stat}</span&gt;&lt;span className="text-[#c4956a] font-mono"&gt;{val} XP&lt;/span&gt;&lt;/div&gt>>;
                                <div className="w-full bg-[#333333] rounded-full h-1.5"&gt;&lt;div className="bg-[#c4956a] h-1.5 rounded-full" style={{ width: `${val}%` }}&gt;</div&gt;&lt;/div&gt>>;
                              </div&gt>;
                            ))}
                          </div&gt>;
                        </div&gt>;
                      </div&gt>;
                    </div&gt>;
                  )}

                  {/* Tab Content: Talent Tree (DAG) */}
                  {profileTab === 'talents' && selectedPeer.name === user.guestname && (
                    <div className="p-8 h-96 relative z-10 bg-[#0f0f0f] m-8 mt-4 rounded-xl border border-[#333333] overflow-hidden flex flex-col"&gt>;
                      <div className="text-xs text-[#999999] mb-4 text-center"&gt;Spend Skill Points earned from leveling up to deepen your specialization.</div&gt>>;
                      
                      <div className="flex-1 relative"&gt>;
                        {/* Connecting Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none"&gt>;
                          {talents.map(node =&gt; {
                            if (!node.req) return null;
                            const parent = talents.find(t =&gt; t.id === node.req);
                            if (!parent) return null;
                            const strokeColor = node.status === 'mastered' ? '#c4956a' : '#333333';
                            return <line key={`edge-${node.id}`} x1={`${parent.x}%`} y1={`${parent.y}%`} x2={`${node.x}%`} y2={`${node.y}%`} stroke={strokeColor} strokeWidth="2" strokeDasharray={node.status !== 'mastered' ? '4 4' : 'none'} /&gt>;
                          })}
                        </svg&gt>;

                        {/* Nodes */}
                        {talents.map(node =&gt; {
                          const isMastered = node.status === 'mastered';
                          const isAvailable = node.status === 'available';
                          return (
                            <div> 
                              key={node.id} 
                              className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group ${isAvailable && user.skillPoints &gt; 0 ? 'cursor-pointer' : ''}`}
                              style={{ left: `${node.x}%`, top: `${node.y}%` }}
                              onClick={() =&gt; isAvailable && handleUnlockTalent(node.id)}
                            &gt;
                              <div className={`p-3 rounded-full border-2 transition-all duration-300> ${
                                isMastered ? 'bg-[#c4956a] border-[#c4956a] text-[#0f0f0f] shadow-[0_0_15px_rgba(196,149,106,0.4)]' : 
                                isAvailable ? 'bg-[#1a1a1a] border-[#c4956a]/50 text-[#c4956a] group-hover:bg-[#c4956a]/20' : 
                                'bg-[#0f0f0f] border-[#333333] text-[#333333]'
                              }`}&gt;
                                {isMastered ? <CheckCircle size={20} /&gt; : isAvailable ? &lt;Unlock size={20} /&gt; : &lt;Lock size={20} /&gt>;}
                              </div&gt>;
                              <span className={`mt-2 text-[10px] font-bold uppercase tracking-wider bg-[#0f0f0f] px-2 py-0.5 rounded border ${isMastered ? 'text-[#c4956a] border-[#c4956a]/30' : 'text-[#999999] border-[#333333]'}`}&gt>;
                                {node.label}
                              </span&gt>;
                              {isAvailable && (
                                <span className="absolute -bottom-6 text-[9px] bg-[#c4956a] text-[#0f0f0f] px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"&gt>;
                                  Click to unlock (1 SP)
                                </span&gt>;
                              )}
                            </div&gt>;
                          )
                        })}
                      </div&gt>;
                    </div&gt>;
                  )}
                </div&gt>;
              </div&gt>;
            )}

            {activeView === 'forest' && (
              <div className="p-8 relative z-10 flex flex-col h-full"&gt;&lt;div className="mb-8"&gt;&lt;h2 className="text-2xl font-bold text-white flex items-center"&gt;&lt;Globe className="mr-3 text-[#c4956a]" size={28} /&gt; The Forest Federation</h2&gt;&lt;p className="text-sm text-[#999999] mt-2 max-w-xl leading-relaxed"&gt;Peer-to-peer relationships across autonomous hubs.&lt;/p&gt;&lt;/div&gt;&lt;/div&gt>>;
            )}
            {activeView === 'archetypes' && (
              <div className="p-8 relative z-10 flex flex-col h-full"&gt;&lt;div className="mb-8"&gt;&lt;h2 className="text-2xl font-bold text-white flex items-center"&gt;&lt;Map className="mr-3 text-[#c4956a]" size={28} /&gt; Agency Archetype Codex</h2&gt;&lt;/div&gt;&lt;/div&gt>>;
            )}
            {activeView === 'graph' && (
              <div className="p-8 relative z-10 flex flex-col h-full overflow-hidden"&gt;&lt;div className="mb-6 z-20 pointer-events-none"&gt;&lt;h2 className="text-2xl font-bold text-white flex items-center"&gt;Graph View: {activeLayer} Dimension</h2&gt;&lt;/div&gt;&lt;/div&gt>>;
            )}
          </div&gt>;

          {/* RIGHT SIDEBAR: Peer Network & Combat Log */}
          <aside className="w-80 bg-[#1a1a1a] border-l border-[#333333] flex flex-col shadow-[-4px_0_15px_rgba(0,0,0,0.5)] z-20"&gt>;
            {/* Peer Nodes / Talent Network */}
            <div className="p-5 h-2/5 border-b border-[#333333] overflow-y-auto bg-[#1a1a1a]"&gt>;
              <h3 className="text-[10px] font-bold text-[#999999] uppercase tracking-widest mb-4 flex items-center"&gt>;
                <Globe size={14} className="mr-2 text-[#c4956a]" /&gt; Active Roster>
              </h3&gt>;
              <div className="space-y-3"&gt>;
                {peers.map((peer) =&gt; (
                  <div key={peer.id} onClick={() =&gt; { setSelectedPeer(peer); setActiveView('profile'); }} className="group flex items-center justify-between p-2.5 rounded-lg border border-transparent hover:border-[#c4956a]/30 hover:bg-[#333333]/50 cursor-pointer transition-all"&gt>;
                    <div className="flex-1"&gt>;
                      <div className="text-sm font-bold text-gray-200 flex items-center group-hover:text-white transition-colors"&gt>;
                        <div className={`w-2 h-2 rounded-full mr-2 shadow-sm ${peer.status === 'Online' || peer.status === 'Processing' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : peer.status === 'Resting' ? 'bg-[#c4956a]' : 'bg-[#333333]'}`}&gt;</div&gt>>;
                        {peer.name}
                      </div&gt>;
                      <div className="text-xs text-[#999999] ml-4 mt-0.5 flex justify-between"&gt>;
                        <span&gt;{peer.class}</span&gt>>;
                        <span className="text-[10px] uppercase text-[#999999] font-bold"&gt;{peer.status}</span&gt>>;
                      </div&gt>;
                      <div className="ml-4 mt-2 h-1 w-full bg-[#333333] rounded-full overflow-hidden"&gt>;
                         <div className={`h-full transition-all duration-500 ${peer.mana &lt; 20 ? 'bg-red-500' : 'bg-blue-500/50'}`} style={{ width: `${(peer.mana/peer.maxMana)*100}%` }}&gt;</div&gt>>;
                      </div&gt>;
                    </div&gt>;
                  </div&gt>;
                ))}
              </div&gt>;
            </div&gt>;

            {/* Event Ledger */}
            <div className="p-5 flex-1 overflow-y-auto bg-[#0f0f0f] relative flex flex-col"&gt>;
              <div className="sticky top-0 bg-[#0f0f0f] pb-3 mb-2 z-10 border-b border-[#333333] flex justify-between items-center"&gt>;
                <h3 className="text-[10px] font-bold text-[#999999] uppercase tracking-widest flex items-center"&gt>;
                  <Pickaxe size={14} className="mr-2 text-[#c4956a]" /&gt; Event Ledger>
                </h3&gt>;
                <div className="flex items-center space-x-3"&gt>;
                  <div className="flex items-center bg-[#1a1a1a] rounded border border-[#333333]"&gt>;
                    <button onClick={() =&gt; setLogPage(p =&gt; Math.min(totalLogPages, p + 1))} disabled={logPage === totalLogPages} className="p-1 text-[#999999] hover:text-[#c4956a] disabled:opacity-30"&gt;&lt;ChevronLeft size={12} /&gt;</button&gt>>;
                    <span className="text-[10px] font-mono text-[#999999] px-1"&gt;{logPage}/{totalLogPages}</span&gt>>;
                    <button onClick={() =&gt; setLogPage(p =&gt; Math.max(1, p - 1))} disabled={logPage === 1} className="p-1 text-[#999999] hover:text-[#c4956a] disabled:opacity-30"&gt;&lt;ChevronRight size={12} /&gt;</button&gt>>;
                  </div&gt>;
                  <span className="flex h-2 w-2 relative"&gt>;
                    {simRunning && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c4956a] opacity-75"&gt;</span&gt>>;}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${simRunning ? 'bg-[#c4956a]' : 'bg-[#333333]'}`}&gt;</span&gt>>;
                  </span&gt>;
                </div&gt>;
              </div&gt>;
              
              <div className="space-y-4 pt-2 flex-1"&gt>;
                {paginatedLogs.map((log) =&gt; (
                  <div key={log.id} className="text-sm relative pl-4 border-l-2 border-[#333333] hover:border-[#c4956a]/50 transition-colors py-1"&gt>;
                    <div className="absolute -left-1.5 top-2.5 w-2.5 h-2.5 rounded-full bg-[#0f0f0f] border-2 border-[#333333]"&gt;</div&gt>>;
                    <div className="flex flex-wrap items-baseline gap-1.5 leading-tight"&gt>;
                      <span className={`font-bold ${log.type === 'Loot' ? 'text-[#c4956a]' : log.type === 'System Alert' ? 'text-red-400' : log.type === 'Level Up' ? 'text-blue-400' : 'text-white'}`}&gt;{log.user}</span&gt>>;
                      <span className="text-[#999999] text-xs"&gt;{log.action}</span&gt>>;
                      <span className="font-semibold text-gray-200"&gt;{log.target}</span&gt>>;
                    </div&gt>;
                    <div className="text-[9px] uppercase tracking-wider font-bold text-[#999999] mt-1.5 flex items-center"&gt>;
                      <span className="text-[#999999] opacity-70"&gt;{log.time}</span&gt;&lt;span className="mx-1.5"&gt;•&lt;/span&gt;&lt;span className="font-mono bg-[#1a1a1a] px-1 rounded"&gt;{log.type}&lt;/span&gt>>;
                    </div&gt>;
                  </div&gt>;
                ))}
              </div&gt>;
            </div&gt>;
          </aside&gt>;
        </main&gt>;
      </div&gt>;
    </div&gt>;
  );
}