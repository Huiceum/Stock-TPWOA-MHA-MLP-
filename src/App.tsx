import React, { useState, useEffect } from 'react';
import {
  Search, TrendingUp, TrendingDown, Target, BrainCircuit, BarChart3,
  Info, ChevronRight, ChevronLeft, Activity, BookOpen, X, Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Metrics {
  lastClose: number;
  priceChange1d: number;
  priceChange5d: number;
  ma5: number;
  ma10: number;
  ma20: number;
  rsi14: number;
  volatility: number;
}

interface PredictionData {
  symbol: string;
  date: string;
  prediction: number;
  confidence: number;
  distribution: number[];
  metrics?: Metrics;
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-xl w-56 text-center z-50 shadow-xl pointer-events-none"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

const colorMap: Record<string, string> = {
  slate: 'text-slate-700',
  green: 'text-green-600',
  red: 'text-red-600',
  amber: 'text-amber-600',
  indigo: 'text-indigo-600',
};

function MetricCard({
  label, value, tooltip, color = 'slate', sub,
}: { label: string; value: string; tooltip: string; color?: string; sub?: string }) {
  return (
    <Tooltip text={tooltip}>
      <div className="p-3 bg-slate-50 hover:bg-indigo-50 rounded-2xl cursor-help transition-colors border border-transparent hover:border-indigo-100">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{label}</div>
        <div className={`text-base font-black ${colorMap[color] ?? 'text-slate-700'}`}>{value}</div>
        {sub && <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>}
      </div>
    </Tooltip>
  );
}

// ─── Tutorial Step Visuals ────────────────────────────────────────────────────

function StepVisual1() {
  const bars = [65, 72, 68, 78, 85, 80, 90, 88, 95, 87, 92, 98];
  return (
    <div className="flex flex-col items-center gap-4 h-full justify-center">
      <div className="flex items-end gap-1 h-24">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: 'easeOut' }}
            className="w-5 rounded-t-sm"
            style={{ background: i % 2 === 0 ? '#22c55e' : '#ef4444', opacity: 0.85 }}
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="flex items-center gap-3 bg-white/20 rounded-xl px-4 py-2 text-white text-xs font-semibold"
      >
        <span>原始數據</span>
        <ChevronRight size={14} />
        <span>Min-Max 標準化</span>
        <ChevronRight size={14} />
        <span>70 / 30 分割</span>
      </motion.div>
    </div>
  );
}

function StepVisual2() {
  const features = ['開盤價', '收盤價', '最高價', '最低價', '成交量', '換手率', 'MA5', 'MA10', 'MA20', 'MA30'];
  return (
    <div className="flex flex-wrap gap-2 justify-center items-center h-full">
      {features.map((f, i) => (
        <motion.div
          key={f}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
          className={`px-3 py-1.5 rounded-xl text-white text-xs font-bold shadow-md ${
            i < 6 ? 'bg-white/25' : 'bg-white/45'
          }`}
        >
          {f}
        </motion.div>
      ))}
    </div>
  );
}

function StepVisual3() {
  const layers: [string, number][] = [
    ['輸入\n10維', 3],
    ['MHA\nN頭', 4],
    ['MLP\nM層', 3],
    ['輸出\n3類', 1],
  ];
  const layerColors = ['bg-blue-400', 'bg-violet-400', 'bg-indigo-400', 'bg-rose-400'];
  return (
    <div className="flex items-center justify-center h-full gap-3">
      {layers.map(([label, nodeCount], li) => (
        <div key={li} className="flex flex-col items-center gap-2">
          {Array.from({ length: nodeCount }).map((_, ni) => (
            <motion.div
              key={ni}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: li * 0.2 + ni * 0.07, type: 'spring', stiffness: 280 }}
              className={`w-8 h-8 rounded-full ${layerColors[li]} shadow-lg`}
            />
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: li * 0.2 + 0.5 }}
            className="text-white/80 text-[10px] text-center whitespace-pre-line mt-1 font-semibold"
          >
            {label}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

function StepVisual4() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => (t + 1) % 22), 180);
    return () => clearInterval(id);
  }, []);

  const whales = [
    { sx: 18, sy: 18 }, { sx: 82, sy: 14 }, { sx: 14, sy: 76 },
    { sx: 84, sy: 82 }, { sx: 50, sy: 8  }, { sx: 8,  sy: 50 },
    { sx: 88, sy: 44 },
  ];
  const progress = Math.min(tick / 16, 1);
  const tx = 55, ty = 45;

  return (
    <div className="flex flex-col items-center gap-3 h-full justify-center">
      <div className="relative w-52 h-36 bg-white/10 rounded-2xl overflow-hidden">
        {[25, 50, 75].map(p => (
          <div key={p} className="absolute bg-white/10 top-0 bottom-0 w-px" style={{ left: `${p}%` }} />
        ))}
        {[33, 66].map(p => (
          <div key={p} className="absolute bg-white/10 left-0 right-0 h-px" style={{ top: `${p}%` }} />
        ))}
        <motion.div
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          className="absolute w-5 h-5 bg-yellow-300 rounded-full shadow-lg border-2 border-yellow-100"
          style={{ left: `${tx}%`, top: `${ty}%`, transform: 'translate(-50%,-50%)' }}
        />
        {whales.map((w, i) => {
          const x = w.sx + (tx - w.sx) * progress * (0.72 + i * 0.04);
          const y = w.sy + (ty - w.sy) * progress * (0.72 + i * 0.04);
          return (
            <div
              key={i}
              className="absolute w-3 h-3 bg-white rounded-full shadow-md transition-all duration-180"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }}
            />
          );
        })}
      </div>
      <div className="text-white/75 text-xs text-center">鯨群探索解空間 → 最優 N*, M*（黃點）</div>
    </div>
  );
}

function StepVisual5() {
  const items = [
    { label: '下跌 Class 0', pct: 12, color: 'bg-red-400' },
    { label: '盤整 Class 1', pct: 23, color: 'bg-gray-300' },
    { label: '上漲 Class 2', pct: 65, color: 'bg-green-400' },
  ];
  return (
    <div className="flex flex-col gap-3 justify-center h-full px-6">
      {items.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between text-white/90 text-xs mb-1 font-semibold">
            <span>{item.label}</span>
            <span>{item.pct}%</span>
          </div>
          <div className="h-4 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.pct}%` }}
              transition={{ delay: i * 0.2 + 0.4, duration: 0.7, ease: 'easeOut' }}
              className={`h-full ${item.color} rounded-full`}
            />
          </div>
        </div>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="mt-1 p-2 bg-white/20 rounded-xl text-center text-white text-xs font-bold"
      >
        預測：上漲 ↑ ｜ 信心度：65% ｜ A 股準確率 71%
      </motion.div>
    </div>
  );
}

// ─── Tutorial Steps Config ────────────────────────────────────────────────────

const tutorialSteps = [
  {
    title: '第一步：數據收集與預處理',
    subtitle: 'Data Collection & Preprocessing',
    description:
      '收集 A 股或美股歷史交易數據，包含 6 個基礎指標：開盤價、最高價、最低價、收盤價、成交量與換手率。原始數據透過 Min-Max 標準化消除量綱差異，再依 70/30 比例分割為訓練集與測試集。',
    highlight: '758 支 A 股 × 2433 交易日 × 6 個特徵',
    gradient: 'from-blue-500 to-cyan-500',
    Visual: StepVisual1,
  },
  {
    title: '第二步：特徵工程',
    subtitle: 'Feature Engineering',
    description:
      '在 6 個基礎指標之上，額外計算 4 種不同時間窗口的移動平均線（MA5, MA10, MA20, MA30），共構成 10 維特徵向量。移動平均線能平滑短期噪聲，揭示中長期價格趨勢結構。',
    highlight: '6 基礎特徵 + 4 移動平均 = 10 維輸入向量',
    gradient: 'from-violet-500 to-purple-500',
    Visual: StepVisual2,
  },
  {
    title: '第三步：MHA-MLP 神經網絡',
    subtitle: 'Multi-Head Attention + MLP',
    description:
      '模型核心由兩部分組成：多頭注意力層（N 個頭）並行捕捉不同時間尺度的特徵關聯；倒金字塔型全連接隱藏層（M 層）逐步壓縮特徵維度。殘差連接（Skip Connection）解決深度網絡的梯度消失問題，LeakyReLU 與 Dropout 提升泛化能力。',
    highlight: '殘差連接 + LeakyReLU + Dropout + AdamW 優化器',
    gradient: 'from-indigo-500 to-blue-600',
    Visual: StepVisual3,
  },
  {
    title: '第四步：TPWOA 超參數優化',
    subtitle: 'Chaotic Whale Optimization',
    description:
      '改進混沌鯨魚算法 (TPWOA) 模擬座頭鯨的獵食行為，自動搜索最佳超參數 N*（注意力頭數）與 M*（隱藏層數）。三大核心策略協同運作：Circle 混沌映射增強種群多樣性、T 分布小波突變平衡全局與局部搜索、多項式差分學習加速種群收斂。',
    highlight: '收斂迭代減少 32%，適應度精度提升 19%',
    gradient: 'from-emerald-500 to-teal-500',
    Visual: StepVisual4,
  },
  {
    title: '第五步：趨勢預測輸出',
    subtitle: 'Trend Prediction Output',
    description:
      '模型輸出三分類預測：Class 0（下跌）、Class 1（盤整）、Class 2（上漲），並附帶各類別的概率分布（信心指數）。在 A 股數據集達 71% 準確率、70% F1 分數，超越所有對比基準模型；美股數據集同樣達 62.24% 領先準確率，驗證跨市場泛化能力。',
    highlight: 'A 股準確率 71% ｜ 美股準確率 62.24%',
    gradient: 'from-rose-500 to-pink-500',
    Visual: StepVisual5,
  },
];

// ─── Tutorial Modal ───────────────────────────────────────────────────────────

function TutorialModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const cur = tutorialSteps[step];
  const Visual = cur.Visual;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Visual header */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.22 }}
            className={`bg-linear-to-br ${cur.gradient} h-52 p-6 relative`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <Visual />
          </motion.div>
        </AnimatePresence>

        {/* Text content */}
        <div className="p-6 pb-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                {cur.subtitle} · {step + 1} / {tutorialSteps.length}
              </div>
              <h2 className="text-xl font-black text-slate-800 mb-3">{cur.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{cur.description}</p>
              <div className={`px-4 py-2 rounded-xl bg-linear-to-r ${cur.gradient} text-white text-xs font-bold`}>
                {cur.highlight}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex gap-1.5">
            {tutorialSteps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ChevronLeft size={16} /> 上一步
              </button>
            )}
            {step < tutorialSteps.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-1 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                下一步 <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-1 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                開始使用 <Zap size={16} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

const labelsMap = [
  { label: '下跌 (Trend Down)', icon: <TrendingDown className="text-red-500" />, color: 'bg-red-500' },
  { label: '盤整 (Sideways)',   icon: <Activity     className="text-gray-500" />, color: 'bg-gray-500' },
  { label: '上漲 (Trend Up)',   icon: <TrendingUp   className="text-green-500" />, color: 'bg-green-500' },
];

export default function App() {
  const [symbol, setSymbol]         = useState('AAPL');
  const [loading, setLoading]       = useState(false);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [error, setError]           = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/predict/${symbol.toUpperCase()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '無法獲取預測數據，請檢查代碼或網路');
      setPrediction(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { handlePredict(); }, []);

  const m = prediction?.metrics;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">

      {/* ── Header ── */}
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <BrainCircuit size={28} />
            </div>
            AI 股票研究實驗室
          </h1>
          <p className="text-slate-500 mt-1">基於 TPWOA-MHA-MLP 架構的深度學習預測平台</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTutorial(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-indigo-200 text-indigo-600 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition-colors"
          >
            <BookOpen size={16} /> 模型原理
          </button>
          <div className="relative">
            <input
              type="text"
              value={symbol}
              onChange={e => setSymbol(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handlePredict()}
              className="pl-11 pr-32 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
              placeholder="代碼 (例: AAPL)"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <button
              onClick={handlePredict}
              className="absolute right-2 top-1.5 bottom-1.5 px-4 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              {loading ? '預測中...' : '開始預測'}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-red-50 border border-red-100 rounded-3xl text-red-600 flex items-start gap-4"
              >
                <Info size={24} className="shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold">預測失敗</h3>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              </motion.div>
            ) : loading ? (
              <div
                key="loading"
                className="h-96 bg-white border border-slate-200 rounded-3xl animate-pulse flex flex-col items-center justify-center text-slate-400 gap-4"
              >
                <BrainCircuit size={48} className="animate-spin text-indigo-200" />
                <p className="text-sm font-medium">模型權重載入中，正在執行推理運算...</p>
              </div>
            ) : prediction ? (
              <motion.div
                key="prediction"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm"
              >
                <div className="p-8">
                  {/* Badge row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full tracking-wider uppercase">
                      Next Day Forecast · {prediction.symbol}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(prediction.date).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* ── Metrics grid ── */}
                  {m && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-7">
                      <MetricCard
                        label="收盤價"
                        value={`$${m.lastClose}`}
                        tooltip="最新交易日收盤價格（美元）"
                      />
                      <MetricCard
                        label="日漲跌 %"
                        value={`${m.priceChange1d > 0 ? '+' : ''}${m.priceChange1d}%`}
                        tooltip="相較前一交易日的價格變化百分比，正值代表上漲"
                        color={m.priceChange1d >= 0 ? 'green' : 'red'}
                      />
                      <MetricCard
                        label="5 日漲跌 %"
                        value={`${m.priceChange5d > 0 ? '+' : ''}${m.priceChange5d}%`}
                        tooltip="近 5 個交易日累計價格變化，反映短期動能強弱"
                        color={m.priceChange5d >= 0 ? 'green' : 'red'}
                      />
                      <MetricCard
                        label="RSI (14)"
                        value={m.rsi14.toFixed(1)}
                        tooltip="相對強弱指數（14日）：數值 > 70 為超買（可能回落）、< 30 為超賣（可能反彈）、50 附近為中性"
                        color={m.rsi14 > 70 ? 'red' : m.rsi14 < 30 ? 'green' : 'amber'}
                        sub={m.rsi14 > 70 ? '超買區間' : m.rsi14 < 30 ? '超賣區間' : '中性區間'}
                      />
                      <MetricCard
                        label="MA5"
                        value={`$${m.ma5}`}
                        tooltip="5 日移動平均線：短期趨勢指標。收盤價高於 MA5 視為短期多頭信號"
                        color={m.lastClose > m.ma5 ? 'green' : 'red'}
                        sub={m.lastClose > m.ma5 ? '價格 > MA5 ✓' : '價格 < MA5'}
                      />
                      <MetricCard
                        label="MA10"
                        value={`$${m.ma10}`}
                        tooltip="10 日移動平均線：中短期趨勢基準，常用於確認短期趨勢是否持續"
                        color={m.lastClose > m.ma10 ? 'green' : 'red'}
                        sub={m.lastClose > m.ma10 ? '價格 > MA10' : '價格 < MA10'}
                      />
                      <MetricCard
                        label="MA20"
                        value={`$${m.ma20}`}
                        tooltip="20 日移動平均線：中期趨勢基準。MA5 高於 MA20 形成黃金交叉，為看漲信號"
                        color={m.ma5 > m.ma20 ? 'green' : 'red'}
                        sub={m.ma5 > m.ma20 ? '黃金交叉 ✓' : '死亡交叉'}
                      />
                      <MetricCard
                        label="年化波動率"
                        value={`${m.volatility}%`}
                        tooltip="近 20 日日收益率的年化標準差，衡量股票風險程度：< 20% 低波動、20–40% 中等、> 40% 高波動"
                        color={m.volatility > 40 ? 'red' : m.volatility < 20 ? 'green' : 'amber'}
                        sub={m.volatility > 40 ? '高風險' : m.volatility < 20 ? '低波動' : '中等波動'}
                      />
                    </div>
                  )}

                  {/* ── Prediction visual ── */}
                  <div className="flex flex-col md:flex-row items-center gap-10">
                    {/* Confidence ring */}
                    <div className="relative shrink-0 w-40 h-40">
                      <div className="w-40 h-40 rounded-full border-8 border-slate-50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-black text-indigo-600">
                            {(prediction.confidence * 100).toFixed(1)}%
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">
                            Confidence
                          </div>
                        </div>
                      </div>
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="80" cy="80" r="76" fill="none" stroke="currentColor"
                          className="text-indigo-600 opacity-20" strokeWidth="8" />
                        <circle cx="80" cy="80" r="76" fill="none" stroke="currentColor"
                          className="text-indigo-600" strokeWidth="8"
                          strokeDasharray="477"
                          strokeDashoffset={477 * (1 - prediction.confidence)}
                          strokeLinecap="round" />
                      </svg>
                    </div>

                    {/* Bars */}
                    <div className="flex-1 w-full">
                      <h2 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">趨勢預測</h2>
                      <div className="flex items-center gap-4 mb-5">
                        <div className="p-3 bg-slate-50 rounded-2xl">
                          {labelsMap[prediction.prediction].icon}
                        </div>
                        <div className="text-2xl font-black tracking-tight">
                          {labelsMap[prediction.prediction].label}
                        </div>
                      </div>
                      <div className="space-y-3">
                        {labelsMap.map((item, idx) => (
                          <div key={idx}>
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-slate-600">{item.label}</span>
                              <span className="text-slate-400">
                                {(prediction.distribution[idx] * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${prediction.distribution[idx] * 100}%` }}
                                transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.1 + 0.2 }}
                                className={`h-full ${item.color}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 border-t border-slate-100 p-5 flex items-center justify-between">
                  <div className="flex gap-5">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Target size={15} />
                      <span className="text-xs font-medium">MHA-MLP-v2.1</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <BarChart3 size={15} />
                      <span className="text-xs font-medium">TPWOA 優化</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTutorial(true)}
                    className="text-indigo-600 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    查看模型原理 <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Research info */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Info className="text-indigo-500" size={20} />
              模型運行機制
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: '數據預處理', desc: '抓取近 2 年歷史數據，進行 Min-Max 標準化，並提取 10 維特徵向量。' },
                { title: 'MHA 特徵提取', desc: '多頭注意力機制並行捕捉長短週期時間特徵，搭配殘差連接穩定梯度。' },
                { title: 'TPWOA 推理', desc: 'Circle 混沌映射 + T 分布突變 + 多項式差分學習，自動優化 N 與 M。' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl">
                  <ChevronRight className="text-indigo-400" size={16} />
                  <h4 className="font-bold text-sm mt-2">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-linear-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-lg shadow-indigo-200">
            <h3 className="text-xl font-black mb-4">實戰操作建議</h3>
            <ul className="space-y-4 text-indigo-100 text-sm leading-relaxed">
              <li className="flex gap-3">
                <span className="font-bold text-indigo-300">01.</span>
                信心指數 &gt; 70% 代表模型捕捉到強烈結構性信號，可作為進場參考。
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-indigo-300">02.</span>
                黃金交叉（MA5 &gt; MA20）搭配上漲預測，信號可靠性更高。
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-indigo-300">03.</span>
                本預測未涵蓋宏觀新聞影響，務必搭配止損策略控制風險。
              </li>
            </ul>
          </div>

          {/* Model perf card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6">
            <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-4">論文驗證指標</h4>
            <div className="space-y-3">
              {[
                { label: 'A 股準確率',  value: '71.0%', pct: 71,   color: 'bg-indigo-500' },
                { label: 'A 股 F1',     value: '70.0%', pct: 70,   color: 'bg-violet-500' },
                { label: '美股準確率',  value: '62.2%', pct: 62.2, color: 'bg-blue-500'   },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="text-slate-800">{item.value}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ delay: i * 0.15 + 0.5, duration: 0.8, ease: 'easeOut' }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowTutorial(true)}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold transition-colors"
            >
              <BookOpen size={14} /> 了解 TPWOA-MHA-MLP
            </button>
          </div>

          {/* Toolbox */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6">
            <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-4">研究工具箱</h4>
            <div className="space-y-2">
              {['查看文獻源碼 (.py)', 'TPWOA 參數日誌', '歷史回測報告'].map((label, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                >
                  <span className="text-sm font-medium">{label}</span>
                  <ChevronRight size={16} className="text-slate-300" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Tutorial overlay */}
      <AnimatePresence>
        {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
      </AnimatePresence>
    </div>
  );
}
