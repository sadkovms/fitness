import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, Droplets, Target, Zap, Leaf, Timer,
  Plus, Minus, Play, Pause, RotateCcw, Trophy,
  TrendingDown, TrendingUp, Scale
} from 'lucide-react';
import { useStoreContext } from '../store/StoreContext';

export default function Dashboard() {
  const store = useStoreContext();
  const { state, totalCalories, totalProtein, totalFat, totalCarbs, totalFiber, totalWater,
    addWater, removeWater, startFasting, stopFasting, setFastingHours, addWeight } = store;
  const { goals, fasting, streak, weightHistory } = state;

  const [animatedCalories, setAnimatedCalories] = useState(0);
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [fastingElapsed, setFastingElapsed] = useState(0);

  // Animate calories on load
  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const increment = totalCalories / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= totalCalories) {
        setAnimatedCalories(totalCalories);
        clearInterval(timer);
      } else {
        setAnimatedCalories(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [totalCalories]);

  // Fasting timer
  useEffect(() => {
    if (!fasting.isActive || !fasting.startTime) return;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - fasting.startTime!) / 1000 / 60 / 60;
      setFastingElapsed(elapsed);
    }, 1000);
    return () => clearInterval(interval);
  }, [fasting.isActive, fasting.startTime]);

  const caloriePercent = Math.min((totalCalories / goals.calories) * 100, 100);
  const circumference = 2 * Math.PI * 58;
  const strokeDashoffset = circumference - (caloriePercent / 100) * circumference;

  const getNutritionScore = () => {
    const proteinScore = Math.min(totalProtein / goals.protein, 1);
    const fatScore = Math.min(totalFat / goals.fat, 1);
    const carbScore = Math.min(totalCarbs / goals.carbs, 1);
    const fiberScore = Math.min(totalFiber / goals.fiber, 1);
    const avg = (proteinScore + fatScore + carbScore + fiberScore) / 4;
    if (avg >= 0.85) return { grade: 'A', color: 'text-emerald-500', bg: 'bg-emerald-100' };
    if (avg >= 0.7) return { grade: 'B', color: 'text-green-500', bg: 'bg-green-100' };
    if (avg >= 0.55) return { grade: 'C', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    if (avg >= 0.4) return { grade: 'D', color: 'text-orange-500', bg: 'bg-orange-100' };
    return { grade: 'E', color: 'text-red-500', bg: 'bg-red-100' };
  };

  const score = getNutritionScore();
  const fastingPercent = fasting.isActive ? Math.min((fastingElapsed / fasting.targetHours) * 100, 100) : 0;
  const latestWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : goals.weight;
  const weightDiff = weightHistory.length >= 2
    ? weightHistory[weightHistory.length - 1].weight - weightHistory[0].weight
    : 0;

  const formatFastingTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <div className="px-4 pb-24 pt-4 max-w-lg mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Доброе утро 👋</p>
            <h1 className="text-2xl font-bold text-slate-800">Сегодня</h1>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-700">{streak} дней</span>
          </div>
        </div>
      </motion.div>

      {/* Main Calorie Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-3xl p-5 mb-4 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="relative">
            <svg width="140" height="140" className="transform -rotate-90">
              <circle cx="70" cy="70" r="58" stroke="#e2e8f0" strokeWidth="10" fill="none" />
              <circle
                cx="70" cy="70" r="58"
                stroke="url(#calorieGradient)"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="progress-ring"
              />
              <defs>
                <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-800">{animatedCalories}</span>
              <span className="text-xs text-slate-500">/ {goals.calories} ккал</span>
              <span className="text-[10px] text-emerald-600 font-medium mt-0.5">
                {totalCalories < goals.calories ? `Осталось ${goals.calories - totalCalories}` : 'Цель достигнута!'}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <MacroBadge label="Белки" value={totalProtein} goal={goals.protein} unit="г" color="bg-blue-100 text-blue-700" />
            <MacroBadge label="Жиры" value={totalFat} goal={goals.fat} unit="г" color="bg-amber-100 text-amber-700" />
            <MacroBadge label="Углев." value={totalCarbs} goal={goals.carbs} unit="г" color="bg-purple-100 text-purple-700" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full ${score.bg} flex items-center justify-center`}>
              <span className={`text-sm font-bold ${score.color}`}>{score.grade}</span>
            </div>
            <span className="text-sm text-slate-600">Качество питания</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600">
            <Leaf className="w-4 h-4" />
            <span className="text-sm font-medium">
              {score.grade === 'A' ? 'Отлично!' : score.grade === 'B' ? 'Хорошо' : 'Норма'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3 mb-4"
      >
        <button onClick={() => setShowWaterModal(true)} className="glass-card rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-shadow">
          <Droplets className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className="text-xs text-slate-500">Вода</p>
          <p className="text-sm font-bold text-slate-800">{(totalWater / 1000).toFixed(1)} л</p>
          <p className="text-[10px] text-slate-400">из {(goals.water / 1000).toFixed(1)} л</p>
        </button>
        <div className="glass-card rounded-xl p-3 text-center shadow-sm">
          <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <p className="text-xs text-slate-500">Клетчатка</p>
          <p className="text-sm font-bold text-slate-800">{totalFiber} г</p>
          <p className="text-[10px] text-slate-400">из {goals.fiber} г</p>
        </div>
        <button onClick={() => setShowWeightModal(true)} className="glass-card rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-shadow">
          <Scale className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
          <p className="text-xs text-slate-500">Вес</p>
          <p className="text-sm font-bold text-slate-800">{latestWeight} кг</p>
          <p className="text-[10px] flex items-center justify-center gap-0.5">
            {weightDiff <= 0 ? (
              <><TrendingDown className="w-3 h-3 text-emerald-500" /><span className="text-emerald-600">{weightDiff.toFixed(1)}</span></>
            ) : (
              <><TrendingUp className="w-3 h-3 text-red-500" /><span className="text-red-600">+{weightDiff.toFixed(1)}</span></>
            )}
          </p>
        </button>
      </motion.div>

      {/* Fasting Timer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-4 mb-4 shadow-md"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Timer className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">Интервальное голодание</p>
              <p className="text-xs text-slate-500">{fasting.targetHours}:{24 - fasting.targetHours} • Цель: {fasting.targetHours}ч</p>
            </div>
          </div>
          <div className="flex gap-1">
            {!fasting.isActive ? (
              <button onClick={startFasting} className="px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-indigo-600 transition-colors">
                <Play className="w-3 h-3" /> Старт
              </button>
            ) : (
              <button onClick={stopFasting} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-red-600 transition-colors">
                <Pause className="w-3 h-3" /> Стоп
              </button>
            )}
          </div>
        </div>

        {fasting.isActive ? (
          <>
            <div className="text-center mb-2">
              <p className="text-3xl font-bold text-indigo-600">{formatFastingTime(fastingElapsed)}</p>
              <p className="text-xs text-slate-500">из {fasting.targetHours}:00 часов</p>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
                animate={{ width: `${fastingPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-slate-400">0ч</span>
              <span className="text-[10px] text-slate-400">{fasting.targetHours}ч</span>
            </div>
          </>
        ) : (
          <div className="text-center py-2">
            <p className="text-sm text-slate-500">Нажмите "Старт" для начала голодания</p>
            <div className="flex justify-center gap-2 mt-2">
              {[12, 14, 16, 18, 20].map(h => (
                <button
                  key={h}
                  onClick={() => setFastingHours(h)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    fasting.targetHours === h
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {h}ч
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-4 mb-4 shadow-md"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-slate-800">AI Рекомендация</h3>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          {totalProtein < goals.protein * 0.8
            ? `Вы набрали ${totalProtein}г из ${goals.protein}г белка. Добавьте порцию творога или яиц для достижения цели.`
            : totalCalories > goals.calories * 0.9
            ? 'Вы почти достигли дневной нормы калорий. Рекомендуем лёгкий ужин с овощами.'
            : 'Отличный прогресс! Продолжайте в том же духе. Не забывайте пить воду.'}
        </p>
      </motion.div>

      {/* Meals Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-4 shadow-md"
      >
        <h3 className="font-semibold text-slate-800 mb-3">Приёмы пищи сегодня</h3>
        <div className="space-y-2.5">
          <MealRow icon="🌅" label="Завтрак" items={store.mealsByType.breakfast} />
          <MealRow icon="☀️" label="Обед" items={store.mealsByType.lunch} />
          <MealRow icon="🍎" label="Перекус" items={store.mealsByType.snack} />
          <MealRow icon="🌙" label="Ужин" items={store.mealsByType.dinner} />
        </div>
      </motion.div>

      {/* Water Modal */}
      <AnimatePresence>
        {showWaterModal && (
          <Modal onClose={() => setShowWaterModal(false)} title="💧 Трекер воды">
            <div className="space-y-3">
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-blue-600">{(totalWater / 1000).toFixed(2)} л</p>
                <p className="text-sm text-slate-500">из {(goals.water / 1000).toFixed(1)} л</p>
                <div className="w-full h-3 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all"
                    style={{ width: `${Math.min((totalWater / goals.water) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                {[150, 200, 250, 300, 500].map(amount => (
                  <button
                    key={amount}
                    onClick={() => addWater(amount)}
                    className="px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl text-sm font-medium text-blue-700 transition-colors"
                  >
                    +{amount} мл
                  </button>
                ))}
              </div>
              <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                {state.waterEntries.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between py-1.5 px-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-slate-700">{entry.amount} мл</span>
                      <span className="text-xs text-slate-400">{entry.time}</span>
                    </div>
                    <button onClick={() => removeWater(entry.id)} className="text-red-400 hover:text-red-600">
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Weight Modal */}
      <AnimatePresence>
        {showWeightModal && (
          <Modal onClose={() => setShowWeightModal(false)} title="⚖️ Записать вес">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-slate-800">{latestWeight}</p>
                <p className="text-sm text-slate-500">кг (текущий)</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder="Новый вес"
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-slate-500">кг</span>
              </div>
              <button
                onClick={() => {
                  if (weightInput) {
                    addWeight(parseFloat(weightInput));
                    setWeightInput('');
                    setShowWeightModal(false);
                  }
                }}
                className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
              >
                Сохранить
              </button>
              <div className="mt-3">
                <p className="text-xs text-slate-500 mb-2">История:</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {weightHistory.slice(-7).reverse().map((w, i) => (
                    <div key={i} className="flex justify-between text-sm py-1 border-b border-slate-50">
                      <span className="text-slate-500">{new Date(w.date).toLocaleDateString('ru-RU')}</span>
                      <span className="font-medium text-slate-700">{w.weight} кг</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function MacroBadge({ label, value, goal, unit, color }: { label: string; value: number; goal: number; unit: string; color: string }) {
  const percent = Math.min((value / goal) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <div className={`px-2 py-0.5 rounded-lg ${color}`}>
        <span className="text-[10px] font-medium">{label}</span>
      </div>
      <div className="w-16">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-slate-700">{Math.round(value)}{unit}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-0.5">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}

function MealRow({ icon, label, items }: { icon: string; label: string; items: any[] }) {
  const totalCal = items.reduce((s, m) => s + m.calories, 0);
  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
      <span className="text-xl">{icon}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-800">{label}</p>
          <p className="text-sm font-semibold text-slate-700">{totalCal} ккал</p>
        </div>
        <p className="text-xs text-slate-500">
          {items.length > 0 ? items.map(i => i.name).join(', ').slice(0, 40) + '...' : 'Нет записей'}
        </p>
      </div>
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200">
            <span className="text-slate-500">✕</span>
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
