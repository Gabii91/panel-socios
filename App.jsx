import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Cpu,
  Tv,
  ShoppingBag,
  ShieldCheck,
  Eye,
  Lock,
  Plus,
  Play,
  Pause,
  RefreshCw,
  Edit3,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Info,
  CheckCircle2,
  Sliders,
  DollarSign as CurrencyIcon
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

// --- INITIAL MOCK DATA ---
const INITIAL_FINANCIALS = {
  totalInvestment: 2500,
  spentAI: 680,
  spentAds: 450,
  spentTools: 320,
  incomeAdSense: 1850,
  incomeEcommerce: 3400,
  incomeSponsors: 1200
};

const INITIAL_CHANNELS = [
  { id: 1, name: 'Aetherium Films (Cine IA)', platform: 'YouTube', subs: 18400, views: 245000, monthlyIncome: 920, category: 'Ficción & Películas', color: '#8b5cf6' },
  { id: 2, name: 'Finanzas Sin Filtro', platform: 'YouTube', subs: 9200, views: 11200, monthlyIncome: 450, category: 'Finanzas', color: '#10b981' },
  { id: 3, name: 'Aura Studio Official', platform: 'TikTok / IG', subs: 45200, views: 1200000, monthlyIncome: 800, category: 'Trailers & Ads', color: '#ec4899' },
  { id: 4, name: 'MiniAura Kids (Proximamente)', platform: 'YouTube', subs: 1200, views: 8500, monthlyIncome: 50, category: 'Infantil', color: '#f59e0b' }
];

const INITIAL_AGENTS = [
  { id: 1, name: 'Agente Editor de Guiones & Video', role: 'Higgsfield & CapCut Auto-Pipeline', status: 'Activo', efficiency: 96, tasksCompleted: 142, costPerMonth: 80 },
  { id: 2, name: 'Agente de Ventas E-commerce', role: 'Gestión de tienda & Leads WhatsApp', status: 'Activo', efficiency: 91, tasksCompleted: 89, costPerMonth: 60 },
  { id: 3, name: 'Agente Publicitario Ads Studio', role: 'Generador de Creativos & FB Ads', status: 'En Proceso', efficiency: 88, tasksCompleted: 34, costPerMonth: 50 },
  { id: 4, name: 'Agente Doblaje & LipSync', role: 'ElevenLabs & Hedra Auto-Voice', status: 'Pausado', efficiency: 94, tasksCompleted: 61, costPerMonth: 40 }
];

const INITIAL_HISTORICAL_DATA = [
  { month: 'Ene', ingresos: 1200, gastos: 800, roi: 50 },
  { month: 'Feb', ingresos: 2100, gastos: 950, roi: 121 },
  { month: 'Mar', ingresos: 3800, gastos: 1100, roi: 245 },
  { month: 'Abr', ingresos: 4900, gastos: 1250, roi: 292 },
  { month: 'May', ingresos: 6450, gastos: 1450, roi: 344 }
];

const INITIAL_TRANSACTIONS = [
  { id: 'TX-101', date: '2026-05-18', category: 'Ingreso E-commerce', description: 'Venta Pack Promocional IA (Cliente Local)', amount: 150, type: 'in' },
  { id: 'TX-102', date: '2026-05-17', category: 'Gasto Herramientas', description: 'Suscripción Higgsfield Pro & Credits', amount: -23, type: 'out' },
  { id: 'TX-103', date: '2026-05-15', category: 'Ingreso AdSense', description: 'Pago Mensual YouTube Partner', amount: 890, type: 'in' },
  { id: 'TX-104', date: '2026-05-12', category: 'Gasto API', description: 'Licencia ElevenLabs Voice AI', amount: -45, type: 'out' },
  { id: 'TX-105', date: '2026-05-10', category: 'Ingreso Sponsor', description: 'Patrocinio Integrado en Trailer Cine', amount: 500, type: 'in' }
];

export default function App() {
  // --- ROLE CONTROL ---
  const [role, setRole] = useState('admin'); // 'admin' or 'investor'

  // --- STATE DATA ---
  const [financials, setFinancials] = useState(INITIAL_FINANCIALS);
  const [channels, setChannels] = useState(INITIAL_CHANNELS);
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // --- MODALS / EDIT STATES ---
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'channels', 'agents', 'finance'
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showEditFinancesModal, setShowEditFinancesModal] = useState(false);

  // New Transaction Form State
  const [newTx, setNewTx] = useState({
    description: '',
    category: 'Ingreso E-commerce',
    amount: '',
    type: 'in'
  });

  // Edit Finances Form State
  const [tempFinances, setTempFinances] = useState({ ...financials });

  // --- CALCULATED VALUES ---
  const totalSpent = useMemo(() => financials.spentAI + financials.spentAds + financials.spentTools, [financials]);
  const totalIncome = useMemo(() => financials.incomeAdSense + financials.incomeEcommerce + financials.incomeSponsors, [financials]);
  const netProfit = useMemo(() => totalIncome - totalSpent, [totalIncome, totalSpent]);
  const currentROI = useMemo(() => {
    if (financials.totalInvestment === 0) return 0;
    return (((totalIncome - totalSpent) / financials.totalInvestment) * 100).toFixed(1);
  }, [financials.totalInvestment, totalIncome, totalSpent]);

  const totalSubs = useMemo(() => channels.reduce((acc, c) => acc + c.subs, 0), [channels]);
  const totalViews = useMemo(() => channels.reduce((acc, c) => acc + c.views, 0), [channels]);

  // --- HANDLERS ---
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newTx.description || !newTx.amount) return;

    const val = parseFloat(newTx.amount);
    const finalAmount = newTx.type === 'out' ? -Math.abs(val) : Math.abs(val);

    const createdTx = {
      id: `TX-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      category: newTx.category,
      description: newTx.description,
      amount: finalAmount,
      type: newTx.type
    };

    setTransactions([createdTx, ...transactions]);

    // Update global financials accordingly
    if (newTx.type === 'in') {
      if (newTx.category.includes('AdSense')) {
        setFinancials(prev => ({ ...prev, incomeAdSense: prev.incomeAdSense + val }));
      } else if (newTx.category.includes('E-commerce')) {
        setFinancials(prev => ({ ...prev, incomeEcommerce: prev.incomeEcommerce + val }));
      } else {
        setFinancials(prev => ({ ...prev, incomeSponsors: prev.incomeSponsors + val }));
      }
    } else {
      if (newTx.category.includes('Herramientas') || newTx.category.includes('API')) {
        setFinancials(prev => ({ ...prev, spentTools: prev.spentTools + val }));
      } else if (newTx.category.includes('Ads')) {
        setFinancials(prev => ({ ...prev, spentAds: prev.spentAds + val }));
      } else {
        setFinancials(prev => ({ ...prev, spentAI: prev.spentAI + val }));
      }
    }

    setNewTx({ description: '', category: 'Ingreso E-commerce', amount: '', type: 'in' });
    setShowTransactionModal(false);
  };

  const handleSaveFinances = (e) => {
    e.preventDefault();
    setFinancials({ ...tempFinances });
    setShowEditFinancesModal(false);
  };

  const toggleAgentStatus = (id) => {
    if (role !== 'admin') return;
    setAgents(agents.map(agent => {
      if (agent.id === id) {
        const nextStatus = agent.status === 'Activo' ? 'Pausado' : 'Activo';
        return { ...agent, status: nextStatus };
      }
      return agent;
    }));
  };

  // Pie chart data for breakdown
  const pieDataIncome = [
    { name: 'AdSense YouTube', value: financials.incomeAdSense, color: '#8b5cf6' },
    { name: 'Ventas E-commerce / Ads', value: financials.incomeEcommerce, color: '#10b981' },
    { name: 'Sponsors & Afiliados', value: financials.incomeSponsors, color: '#3b82f6' }
  ];

  const pieDataExpenses = [
    { name: 'Créditos IA (Higgsfield/Eleven)', value: financials.spentAI, color: '#ec4899' },
    { name: 'Herramientas & Hosting', value: financials.spentTools, color: '#f59e0b' },
    { name: 'Inversión Ads / Tráfico', value: financials.spentAds, color: '#06b6d4' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white pb-12">
      {/* --- TOP HEADER & BAR --- */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">AuraMedia</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">OS v2.4</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Panel de Control de Ecosistema IA & Automatización</p>
            </div>
          </div>

          {/* Role Switcher & Status */}
          <div className="flex items-center gap-3">
            {/* Mode Banner Indicator */}
            {role === 'investor' ? (
              <div className="hidden md:flex items-center gap-1.5 text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg">
                <Lock className="w-3.5 h-3.5" />
                <span className="font-medium">Modo Inversor (Vista de Solo Lectura)</span>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-medium">Modo Administrador (Acceso Total)</span>
              </div>
            )}

            {/* Toggle Button */}
            <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex items-center">
              <button
                onClick={() => setRole('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  role === 'admin'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Administrador</span>
              </button>
              <button
                onClick={() => setRole('investor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  role === 'investor'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-900/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Socio / Inversor</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- SUB-NAVIGATION TABS --- */}
      <div className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 overflow-x-auto py-2">
          {[
            { id: 'overview', label: 'Resumen General', icon: Activity },
            { id: 'channels', label: 'Canales & Audiencia', icon: Tv },
            { id: 'agents', label: 'Agentes de IA Operativos', icon: Cpu },
            { id: 'finance', label: 'Inversiones & Transacciones', icon: DollarSign }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-800 text-purple-400 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* --- BANNER FOR READ-ONLY NOTICE --- */}
        {role === 'investor' && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between text-amber-200 text-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-xl">
                <Lock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-amber-300">Modo de Exhibición para Socios / Inversores</p>
                <p className="text-xs text-amber-200/80">Estás visualizando las métricas en tiempo real de los canales y agentes de IA. Las opciones de edición están restringidas.</p>
              </div>
            </div>
            <span className="text-xs font-mono bg-amber-500/20 px-2.5 py-1 rounded-md text-amber-300 border border-amber-500/30">READ-ONLY</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & DASHBOARD SUMMARY */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Inversión vs Gastos */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Inversión / Gastos Totales</p>
                    <h3 className="text-2xl font-bold text-white mt-1">${totalSpent.toLocaleString()} USD</h3>
                  </div>
                  <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Capital Base: <strong className="text-slate-200">${financials.totalInvestment}</strong></span>
                  <span className="text-purple-400 font-medium">IA + Herramientas + Ads</span>
                </div>
              </div>

              {/* Card 2: Ingresos Brutos */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Ingresos Generados</p>
                    <h3 className="text-2xl font-bold text-emerald-400 mt-1">${totalIncome.toLocaleString()} USD</h3>
                  </div>
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +28.4% este mes
                  </span>
                  <span className="text-slate-400">YouTube + E-comm</span>
                </div>
              </div>

              {/* Card 3: Balance Neto / Ganancia */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Ganancia Neta (Profit)</p>
                    <h3 className="text-2xl font-bold text-blue-400 mt-1">${netProfit.toLocaleString()} USD</h3>
                  </div>
                  <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-slate-400">ROI Estimado:</span>
                  <span className="text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    +{currentROI}%
                  </span>
                </div>
              </div>

              {/* Card 4: Alcance Total Redes */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-all" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Audiencia Total Acumulada</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{totalSubs.toLocaleString()}</h3>
                  </div>
                  <div className="p-2.5 bg-pink-500/10 border border-pink-500/20 rounded-xl text-pink-400">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Vistas acumuladas:</span>
                  <span className="text-pink-400 font-medium">{totalViews > 1000000 ? `${(totalViews / 1000000).toFixed(1)}M` : totalViews.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Admin Bar */}
            {role === 'admin' && (
              <div className="bg-gradient-to-r from-purple-900/40 via-slate-900 to-slate-900 border border-purple-500/20 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500/20 text-purple-300 rounded-xl">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Panel de Control de Administrador Activo</h4>
                    <p className="text-xs text-slate-400">Añada ingresos/gastos nuevos o actualice las metas presupuestarias.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setTempFinances({ ...financials });
                      setShowEditFinancesModal(true);
                    }}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-700 transition-all"
                  >
                    <Edit3 className="w-4 h-4 text-purple-400" />
                    Ajustar Métricas Financieras
                  </button>
                  <button
                    onClick={() => setShowTransactionModal(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium px-4 py-2 rounded-xl shadow-lg shadow-purple-600/30 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Registrar Transacción
                  </button>
                </div>
              </div>
            )}

            {/* Main Evolution Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-semibold text-white">Evolución Financiera (Ingresos vs Gastos)</h3>
                    <p className="text-xs text-slate-400">Rendimiento mensual consolidado de todas las fuentes</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Ingresos
                    </span>
                    <span className="flex items-center gap-1.5 text-purple-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Gastos
                    </span>
                  </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={INITIAL_HISTORICAL_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                        formatter={(value) => [`$${value} USD`, '']}
                      />
                      <Area type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#incomeGrad)" name="Ingresos ($ USD)" />
                      <Area type="monotone" dataKey="gastos" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#expenseGrad)" name="Gastos ($ USD)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Income Sources Distribution */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">Distribución de Ingresos</h3>
                  <p className="text-xs text-slate-400 mb-4">Desglose por unidades de negocio automatizadas</p>
                  <div className="h-48 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieDataIncome}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieDataIncome.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  {pieDataIncome.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-slate-300">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                      <span className="font-semibold text-white">${item.value.toLocaleString()} USD</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Agents & Channels Status Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mini Channels Overview */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Tv className="w-5 h-5 text-purple-400" />
                    <h3 className="text-base font-semibold text-white">Canales & Redes en Producción</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('channels')}
                    className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                  >
                    Ver detalles →
                  </button>
                </div>
                <div className="space-y-3">
                  {channels.map((ch) => (
                    <div key={ch.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ch.color }} />
                        <div>
                          <p className="text-xs font-semibold text-white">{ch.name}</p>
                          <p className="text-[11px] text-slate-400">{ch.platform} • {ch.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-white">{ch.subs.toLocaleString()} subs</p>
                        <p className="text-[11px] text-emerald-400">+${ch.monthlyIncome}/mes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Active AI Agents */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-semibold text-white">Estado de Agentes IA de Trabajo</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('agents')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    Gestionar Agentes →
                  </button>
                </div>
                <div className="space-y-3">
                  {agents.map((ag) => (
                    <div key={ag.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-white">{ag.name}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            ag.status === 'Activo'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : ag.status === 'En Proceso'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {ag.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{ag.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono text-purple-400 font-medium">{ag.efficiency}% Eficiencia</p>
                        <p className="text-[11px] text-slate-500">{ag.tasksCompleted} tareas ejecutadas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CHANNELS & SOCIAL MEDIA */}
        {/* ========================================================================= */}
        {activeTab === 'channels' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Rendimiento de Canales & Redes Sociales</h2>
                <p className="text-xs text-slate-400">Seguimiento de audiencia, reproducciones e ingresos por cada canal del ecosistema.</p>
              </div>
              {role === 'admin' && (
                <button
                  onClick={() => {
                    const name = prompt('Nombre del nuevo canal:');
                    if (name) {
                      setChannels([
                        ...channels,
                        {
                          id: Date.now(),
                          name,
                          platform: 'YouTube',
                          subs: 0,
                          views: 0,
                          monthlyIncome: 0,
                          category: 'Ficción',
                          color: '#ec4899'
                        }
                      ]);
                    }
                  }}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-md transition-all self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Nuevo Canal
                </button>
              )}
            </div>

            {/* Channels Detailed Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {channels.map((ch) => (
                <div key={ch.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800" style={{ color: ch.color }}>
                        <Tv className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">{ch.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">{ch.platform}</span>
                          <span className="text-xs text-slate-400">• {ch.category}</span>
                        </div>
                      </div>
                    </div>
                    {role === 'admin' && (
                      <button
                        onClick={() => {
                          const newSubs = prompt(`Nuevos suscriptores para ${ch.name}:`, ch.subs);
                          if (newSubs !== null) {
                            setChannels(channels.map(c => c.id === ch.id ? { ...c, subs: parseInt(newSubs) || 0 } : c));
                          }
                        }}
                        className="text-xs text-slate-400 hover:text-white p-1.5 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all"
                        title="Editar métricas del canal"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      <p className="text-[11px] text-slate-400">Suscriptores</p>
                      <p className="text-base font-bold text-white mt-1">{ch.subs.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      <p className="text-[11px] text-slate-400">Visualizaciones</p>
                      <p className="text-base font-bold text-white mt-1">{ch.views.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      <p className="text-[11px] text-slate-400">Ingreso Est. / mes</p>
                      <p className="text-base font-bold text-emerald-400 mt-1">${ch.monthlyIncome}</p>
                    </div>
                  </div>

                  {/* Progress / Status Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Automatización de Subida Activa
                    </span>
                    <span>Flujo de trabajo IA al 100%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Platform Comparison Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-2">Comparativa de Alcance por Canal</h3>
              <p className="text-xs text-slate-400 mb-6">Comparación de suscriptores y visualizaciones en la red.</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={channels} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }} />
                    <Bar dataKey="subs" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Suscriptores Totales" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: OPERATIONAL AI AGENTS */}
        {/* ========================================================================= */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Agentes de Inteligencia Artificial Operativos</h2>
                <p className="text-xs text-slate-400">Los robots y agentes virtuales que ejecutan guiones, edición, voces y ventas por ti.</p>
              </div>
            </div>

            {/* Agents List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agents.map((ag) => (
                <div key={ag.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
                          <Cpu className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base">{ag.name}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">{ag.role}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                        ag.status === 'Activo'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : ag.status === 'En Proceso'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {ag.status}
                      </span>
                    </div>

                    {/* Progress Efficiency Bar */}
                    <div className="mt-6 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Nivel de Eficiencia Racional</span>
                        <span className="font-mono text-emerald-400 font-bold">{ag.efficiency}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${ag.efficiency}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                        <span className="text-[11px] text-slate-500 block">Tareas Ejecutadas</span>
                        <span className="text-sm font-bold text-white mt-1 block">{ag.tasksCompleted} acciones</span>
                      </div>
                      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                        <span className="text-[11px] text-slate-500 block">Costo de Operación</span>
                        <span className="text-sm font-bold text-purple-400 mt-1 block">${ag.costPerMonth} USD/mes</span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Button for Admin */}
                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Estado operativo del agente</span>
                    {role === 'admin' ? (
                      <button
                        onClick={() => toggleAgentStatus(ag.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          ag.status === 'Activo'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                        }`}
                      >
                        {ag.status === 'Activo' ? (
                          <>
                            <Pause className="w-3.5 h-3.5" /> Pausar Agente
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" /> Recomenzar Agente
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 italic">Modo lectura</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: FINANCES & TRANSACTIONS */}
        {/* ========================================================================= */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Historial de Inversiones & Transacciones</h2>
                <p className="text-xs text-slate-400">Auditoría detallada de cada ingreso generado y gasto de herramientas/anuncios.</p>
              </div>
              {role === 'admin' && (
                <button
                  onClick={() => setShowTransactionModal(true)}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-md transition-all self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  Añadir Transacción
                </button>
              )}
            </div>

            {/* Expenses Breakdown Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-base font-bold text-white mb-1">Desglose de Gastos en IA & Herramientas</h3>
                <p className="text-xs text-slate-400 mb-4">Uso de presupuesto en plataformas (Higgsfield, ElevenLabs, Ads)</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieDataExpenses}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieDataExpenses.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  {pieDataExpenses.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-slate-300">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                      <span className="font-semibold text-white">${item.value.toLocaleString()} USD</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Balance Summary Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-4">Resumen de Cuenta del Negocio</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400">Inversión Inicial Aportada</span>
                      <span className="text-sm font-mono font-bold text-white">${financials.totalInvestment.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400">Ingresos Totales Acumulados</span>
                      <span className="text-sm font-mono font-bold text-emerald-400">+${totalIncome.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400">Egresos & Costos Operativos</span>
                      <span className="text-sm font-mono font-bold text-purple-400">-${totalSpent.toLocaleString()} USD</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-300">Balance Neto Disponible</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">${netProfit.toLocaleString()} USD</span>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-base font-bold text-white">Registro de Movimientos Financieros</h3>
                <span className="text-xs text-slate-500 font-mono">{transactions.length} registros</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-medium uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-4">ID / Fecha</th>
                      <th className="p-4">Categoría</th>
                      <th className="p-4">Descripción</th>
                      <th className="p-4 text-right">Monto (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/40 transition-all">
                        <td className="p-4 font-mono text-slate-400">
                          <span className="text-white font-semibold block">{tx.id}</span>
                          <span className="text-[11px] text-slate-500">{tx.date}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                            {tx.category}
                          </span>
                        </td>
                        <td className="p-4 text-slate-200 font-medium">{tx.description}</td>
                        <td className={`p-4 text-right font-mono text-sm font-bold ${
                          tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {tx.amount > 0 ? `+$${tx.amount}` : `-$${Math.abs(tx.amount)}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD TRANSACTION (ADMIN ONLY) */}
      {/* ========================================================================= */}
      {showTransactionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1">Registrar Nueva Transacción</h3>
            <p className="text-xs text-slate-400 mb-5">Ingrese los detalles de ingresos o egresos en tiempo real.</p>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Tipo de Movimiento</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTx({ ...newTx, type: 'in', category: 'Ingreso E-commerce' })}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      newTx.type === 'in'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    + Ingreso
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTx({ ...newTx, type: 'out', category: 'Gasto Herramientas' })}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                      newTx.type === 'out'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    - Gasto
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Categoría</label>
                <select
                  value={newTx.category}
                  onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  {newTx.type === 'in' ? (
                    <>
                      <option value="Ingreso AdSense">Ingreso AdSense YouTube</option>
                      <option value="Ingreso E-commerce">Ingreso Venta Publicidad / E-commerce</option>
                      <option value="Ingreso Sponsor">Ingreso Sponsor / Afiliados</option>
                    </>
                  ) : (
                    <>
                      <option value="Gasto Herramientas">Gasto Higgsfield / Herramientas</option>
                      <option value="Gasto API">Gasto ElevenLabs / Voz AI</option>
                      <option value="Gasto Ads">Inversión Publicidad en Facebook/TikTok</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Descripción</label>
                <input
                  type="text"
                  placeholder="Ej: Pago mensual por video de cliente local"
                  value={newTx.description}
                  onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Monto ($ USD)</label>
                <input
                  type="number"
                  placeholder="25.00"
                  value={newTx.amount}
                  onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTransactionModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-md"
                >
                  Guardar Transacción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT FINANCIAL OVERVIEW (ADMIN ONLY) */}
      {/* ========================================================================= */}
      {showEditFinancesModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1">Ajustar Totales Financieros</h3>
            <p className="text-xs text-slate-400 mb-5">Actualización rápida de montos consolidados.</p>

            <form onSubmit={handleSaveFinances} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Inversión Base ($ USD)</label>
                  <input
                    type="number"
                    value={tempFinances.totalInvestment}
                    onChange={(e) => setTempFinances({ ...tempFinances, totalInvestment: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Gasto en IA ($ USD)</label>
                  <input
                    type="number"
                    value={tempFinances.spentAI}
                    onChange={(e) => setTempFinances({ ...tempFinances, spentAI: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Ingresos AdSense ($ USD)</label>
                  <input
                    type="number"
                    value={tempFinances.incomeAdSense}
                    onChange={(e) => setTempFinances({ ...tempFinances, incomeAdSense: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Ingresos E-commerce ($ USD)</label>
                  <input
                    type="number"
                    value={tempFinances.incomeEcommerce}
                    onChange={(e) => setTempFinances({ ...tempFinances, incomeEcommerce: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditFinancesModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-md"
                >
                  Actualizar Métricas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
