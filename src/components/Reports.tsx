import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, TrendingDown, Calendar,
  Award, Target, AlertTriangle, CheckCircle, Download
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { useStoreContext } from '../store/StoreContext';
import { micronutrientDB } from '../store/useStore';

type Period = 'week' | 'month';

export default function Reports() {
  const store = useStoreContext();
  const { state, totalCalories, totalProtein, totalFat, totalCarbs, totalFiber } = store;
  const { goals, weightHistory, streak } = state;
  const [period, setPeriod] = useState<Period>('week');
  const [activeTab, setActiveTab] = useState<'macros' | 'micros' | 'trends'>('macros');

  // Simulated weekly data
  const weeklyData = [
    { day: 'Пн', calories: 2100, protein: 115, fat: 70, carbs: 260 },
    { day: 'Вт', calories: 2350, protein: 128, fat: 78, carbs: 290 },
    { day: 'Ср', calories: 1980, protein: 105, fat: 65, carbs: 240 },
    { day: 'Чт', calories: 2200, protein: 120, fat: 73, carbs: 275 },
    { day: 'Пт', calories: 2400, protein: 132, fat: 80, carbs: 295 },
    { day: 'Сб', calories: 2150, protein: 118, fat: 72, carbs: 265 },
    { day: 'Вс', calories: totalCalories, protein: totalProtein, fat: totalFat, carbs: totalCarbs },
  ];

  const macrosPieData = [
    { name: 'Белки', value: totalProtein, color: '#3b82f6' },
    { name: 'Жиры', value: totalFat, color: '#f59e0b' },
    { name: 'Углеводы', value: totalCarbs, color: '#8b5cf6' },
  ];

  // Simulated micro intake
  const microIntake = micronutrientDB.map(m => ({
    ...m,
    current: Math.round(m.dailyValue * (0.4 + Math.random() * 0.8) * 10) / 10,
    percent: Math.round((0.4 + Math.random() * 0.8) * 100),
  }));

  const deficiencies = microIntake.filter(m => m.percent < 60);
  const sufficient = microIntake.filter(m => m.percent >= 80 && m.percent <= 120);
  const excess = microIntake.filter(m => m.percent > 130);

  const exportData = () => {
    const data = {
      date: new Date().toISOString(),
      goals,
      todayIntake: { calories: totalCalories, protein: totalProtein, fat: totalFat, carbs: totalCarbs, fiber: totalFiber },
      weightHistory,
      streak,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutrivision_report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 pb-24 pt-4 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Аналитика</h1>
        <p className="text-sm text-slate-500">Отслеживайте прогресс питания</p>
      </motion.div>

      {/* Period Toggle */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-2 mb-4">
        <button onClick={() => setPeriod('week')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${period === 'week' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white/60 text-slate-600'}`}>
          <Calendar className="w-4 h-4 inline mr-1.5" />Неделя
        </button>
        <button onClick={() => setPeriod('month')} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${period === 'month' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white/60 text-slate-600'}`}>
          <BarChart3 className="w-4 h-4 inline mr-1.5" />Месяц
        </button>
      </motion.div>

      {/* Streak Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-4 mb-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{streak}</p>
              <p className="text-xs text-slate-500">дней подряд</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-700">87%</p>
            <p className="text-xs text-slate-500">выполнение целей</p>
          </div>
        </div>
        <div className="mt-3 flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`flex-1 h-2 rounded-full ${i < streak % 7 ? 'bg-emerald-400' : i === streak % 7 ? 'bg-emerald-200' : 'bg-slate-100'}`} />
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white/50 p-1 rounded-xl">
        {[{ key: 'macros', label: 'Макросы' }, { key: 'micros', label: 'Микро' }, { key: 'trends', label: 'Тренды' }].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Macros Tab */}
      {activeTab === 'macros' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="glass-card rounded-2xl p-4 shadow-md">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Калории за неделю</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="calories" fill="url(#barGradient)" radius={[6, 6, 0, 0]} name="Калории" />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-500">Цель: {goals.calories} ккал</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 shadow-md">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Распределение макросов сегодня</h3>
            <div className="flex items-center">
              <ResponsiveContainer width="50%" height={150}>
                <PieChart>
                  <Pie data={macrosPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {macrosPieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {macrosPieData.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-slate-600">{item.name}</span>
                    <span className="text-xs font-semibold text-slate-800 ml-auto">{Math.round(item.value)}г</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 shadow-md">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Тренд БЖУ за неделю</h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="protein" stroke="#3b82f6" strokeWidth={2} dot={false} name="Белки" />
                <Line type="monotone" dataKey="fat" stroke="#f59e0b" strokeWidth={2} dot={false} name="Жиры" />
                <Line type="monotone" dataKey="carbs" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Углев." />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <button onClick={exportData} className="w-full py-3 bg-white rounded-2xl border border-slate-200 text-sm font-medium text-slate-700 flex items-center justify-center gap-2 hover:bg-slate-50">
            <Download className="w-4 h-4" /> Экспорт данных (JSON)
          </button>
        </motion.div>
      )}

      {/* Micros Tab */}
      {activeTab === 'micros' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="glass-card rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-red-500">{deficiencies.length}</p>
              <p className="text-[10px] text-slate-500">Дефицит</p>
            </div>
            <div className="glass-card rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-emerald-500">{sufficient.length}</p>
              <p className="text-[10px] text-slate-500">Норма</p>
            </div>
            <div className="glass-card rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-blue-500">{excess.length}</p>
              <p className="text-[10px] text-slate-500">Избыток</p>
            </div>
          </div>

          {deficiencies.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-semibold text-amber-800">Дефицит нутриентов</h4>
              </div>
              <div className="space-y-1.5">
                {deficiencies.slice(0, 5).map(n => (
                  <div key={n.name} className="flex items-center justify-between">
                    <span className="text-xs text-amber-700">{n.name}</span>
                    <span className="text-xs font-medium text-amber-600">{n.percent}% нормы</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vitamins */}
          <div className="glass-card rounded-2xl p-4 shadow-md">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Витамины</h3>
            <div className="space-y-2">
              {microIntake.filter(m => m.category === 'vitamin').map(n => (
                <div key={n.name} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-28 truncate">{n.name}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${n.percent >= 80 ? 'bg-emerald-400' : n.percent >= 50 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${Math.min(n.percent, 100)}%` }} />
                  </div>
                  <span className="text-xs font-medium text-slate-700 w-10 text-right">{n.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Minerals */}
          <div className="glass-card rounded-2xl p-4 shadow-md">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Минералы</h3>
            <div className="space-y-2">
              {microIntake.filter(m => m.category === 'mineral').map(n => (
                <div key={n.name} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-28 truncate">{n.name}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${n.percent >= 80 ? 'bg-emerald-400' : n.percent >= 50 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${Math.min(n.percent, 100)}%` }} />
                  </div>
                  <span className="text-xs font-medium text-slate-700 w-10 text-right">{n.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amino Acids */}
          <div className="glass-card rounded-2xl p-4 shadow-md">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Аминокислоты</h3>
            <div className="space-y-2">
              {microIntake.filter(m => m.category === 'amino').map(n => (
                <div key={n.name} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-28 truncate">{n.name}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${n.percent >= 80 ? 'bg-emerald-400' : n.percent >= 50 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${Math.min(n.percent, 100)}%` }} />
                  </div>
                  <span className="text-xs font-medium text-slate-700 w-10 text-right">{n.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="glass-card rounded-2xl p-4 shadow-md">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500" /> Тренд веса
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={weightHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" tickFormatter={(v) => new Date(v).getDate().toString()} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="weight" stroke="#10b981" fill="url(#weightGradient)" strokeWidth={2.5} name="Вес (кг)" />
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 mt-2">
              {weightHistory.length >= 2 && (
                <div className="flex items-center gap-1">
                  {weightHistory[weightHistory.length - 1].weight < weightHistory[0].weight ? (
                    <><TrendingDown className="w-4 h-4 text-emerald-500" /><span className="text-xs text-emerald-600 font-medium">{(weightHistory[weightHistory.length - 1].weight - weightHistory[0].weight).toFixed(1)} кг</span></>
                  ) : (
                    <><TrendingUp className="w-4 h-4 text-red-500" /><span className="text-xs text-red-600 font-medium">+{(weightHistory[weightHistory.length - 1].weight - weightHistory[0].weight).toFixed(1)} кг</span></>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 shadow-md">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Паттерны питания</h3>
            <div className="space-y-3">
              <PatternItem label="Среднее время завтрака" value="08:45" emoji="🌅" />
              <PatternItem label="Самый калорийный приём" value="Обед (830 ккал)" emoji="☀️" />
              <PatternItem label="Частота перекусов" value="1-2 раза/день" emoji="🍎" />
              <PatternItem label="Последний приём пищи" value="20:15 (среднее)" emoji="🌙" />
              <PatternItem label="Любимый продукт" value="Куриная грудка" emoji="🍗" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 shadow-md bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
            <h3 className="font-semibold text-slate-800 mb-2 text-sm flex items-center gap-2">
              <span className="text-lg">🤖</span> AI-резюме за неделю
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Отличная неделя! Среднее потребление калорий {Math.round(weeklyData.reduce((s, d) => s + d.calories, 0) / 7)} ккал.
              Белок в норме 6 из 7 дней. Обратите внимание на витамин D — он ниже нормы.
              Рекомендую добавить жирную рыбу или яйца. Тренд веса: {weightHistory.length >= 2 ? `${(weightHistory[weightHistory.length - 1].weight - weightHistory[0].weight).toFixed(1)} кг` : 'нет данных'}.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function PatternItem({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-2">
        <span>{emoji}</span>
        <span className="text-xs text-slate-600">{label}</span>
      </div>
      <span className="text-xs font-medium text-slate-800">{value}</span>
    </div>
  );
}
