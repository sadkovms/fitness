import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, TrendingDown, Calendar,
  Award, Target, AlertTriangle, CheckCircle
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { weeklyData, nutrientDetails, streakData } from '../data/foodData';

type Period = 'week' | 'month';

export default function Reports() {
  const [period, setPeriod] = useState<Period>('week');
  const [activeTab, setActiveTab] = useState<'macros' | 'micros' | 'trends'>('macros');

  const macrosPieData = [
    { name: 'Белки', value: 118, color: '#3b82f6' },
    { name: 'Жиры', value: 72, color: '#f59e0b' },
    { name: 'Углеводы', value: 265, color: '#8b5cf6' },
  ];

  const vitaminData = nutrientDetails.filter(n => n.category === 'vitamin');
  const mineralData = nutrientDetails.filter(n => n.category === 'mineral');

  const getDeficiencies = () => {
    return nutrientDetails.filter(n => n.dailyValue < 60);
  };

  const getExcesses = () => {
    return nutrientDetails.filter(n => n.dailyValue > 130);
  };

  return (
    <div className="px-4 pb-24 pt-4 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h1 className="text-2xl font-bold text-slate-800">Аналитика</h1>
        <p className="text-sm text-slate-500">Отслеживайте прогресс питания</p>
      </motion.div>

      {/* Period Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-4"
      >
        <button
          onClick={() => setPeriod('week')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            period === 'week'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
              : 'bg-white/60 text-slate-600 hover:bg-white/80'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-1.5" />
          Неделя
        </button>
        <button
          onClick={() => setPeriod('month')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            period === 'month'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
              : 'bg-white/60 text-slate-600 hover:bg-white/80'
          }`}
        >
          <BarChart3 className="w-4 h-4 inline mr-1.5" />
          Месяц
        </button>
      </motion.div>

      {/* Streak Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card rounded-2xl p-4 mb-4 shadow-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{streakData.currentStreak}</p>
              <p className="text-xs text-slate-500">дней подряд</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-700">{streakData.completionRate}%</p>
            <p className="text-xs text-slate-500">выполнение целей</p>
          </div>
        </div>
        <div className="mt-3 flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full ${
                i < streakData.currentStreak % 7 ? 'bg-emerald-400' : i === streakData.currentStreak % 7 ? 'bg-emerald-200' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white/50 p-1 rounded-xl">
        {[
          { key: 'macros', label: 'Макросы' },
          { key: 'micros', label: 'Микронутриенты' },
          { key: 'trends', label: 'Тренды' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Macros Tab */}
      {activeTab === 'macros' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Calories Chart */}
          <div className="glass-card rounded-2xl p-4 shadow-md">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Калории за неделю</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [`${value} ккал`, 'Калории']}
                />
                <Bar dataKey="calories" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
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
              <span className="text-xs text-slate-500">Цель: 2200 ккал</span>
            </div>
          </div>

          {/* Macro Distribution Pie */}
          <div className="glass-card rounded-2xl p-4 shadow-md">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Распределение макросов</h3>
            <div className="flex items-center">
              <ResponsiveContainer width="50%" height={150}>
                <PieChart>
                  <Pie
                    data={macrosPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {macrosPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {macrosPieData.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-slate-600">{item.name}</span>
                    <span className="text-xs font-semibold text-slate-800 ml-auto">{item.value}г</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Macros Trend */}
          <div className="glass-card rounded-2xl p-4 shadow-md">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Тренд БЖУ</h3>
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
        </motion.div>
      )}

      {/* Micros Tab */}
      {activeTab === 'micros' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Deficiencies Alert */}
          {getDeficiencies().length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-semibold text-amber-800">Дефицит нутриентов</h4>
              </div>
              <div className="space-y-1.5">
                {getDeficiencies().map(n => (
                  <div key={n.name} className="flex items-center justify-between">
                    <span className="text-xs text-amber-700">{n.name}</span>
                    <span className="text-xs font-medium text-amber-600">{n.dailyValue}% нормы</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Excess Alert */}
          {getExcesses().length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-semibold text-blue-800">Превышение нормы</h4>
              </div>
              <div className="space-y-1.5">
                {getExcesses().map(n => (
                  <div key={n.name} className="flex items-center justify-between">
                    <span className="text-xs text-blue-700">{n.name}</span>
                    <span className="text-xs font-medium text-blue-600">{n.dailyValue}% нормы</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vitamins */}
          <div className="glass-card rounded-2xl p-4 shadow-md">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Витамины</h3>
            <div className="space-y-2.5">
              {vitaminData.map(n => (
                <div key={n.name} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-24 truncate">{n.name}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        n.dailyValue >= 80 ? 'bg-emerald-400' : n.dailyValue >= 50 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${Math.min(n.dailyValue, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-700 w-10 text-right">{n.dailyValue}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Minerals */}
          <div className="glass-card rounded-2xl p-4 shadow-md">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Минералы</h3>
            <div className="space-y-2.5">
              {mineralData.map(n => (
                <div key={n.name} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-24 truncate">{n.name}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        n.dailyValue >= 80 ? 'bg-emerald-400' : n.dailyValue >= 50 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${Math.min(n.dailyValue, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-700 w-10 text-right">{n.dailyValue}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Weight Trend */}
          <div className="glass-card rounded-2xl p-4 shadow-md">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500" />
              Тренд веса
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={[
                { day: '1', weight: 78.2 },
                { day: '5', weight: 77.8 },
                { day: '10', weight: 77.5 },
                { day: '15', weight: 77.1 },
                { day: '20', weight: 76.8 },
                { day: '25', weight: 76.5 },
                { day: '30', weight: 76.2 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 3 }} name="Вес (кг)" />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-emerald-600 font-medium">-2.0 кг за месяц</span>
              </div>
            </div>
          </div>

          {/* Eating Patterns */}
          <div className="glass-card rounded-2xl p-4 shadow-md">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm">Паттерны питания</h3>
            <div className="space-y-3">
              <PatternItem label="Среднее время завтрака" value="08:45" emoji="🌅" />
              <PatternItem label="Самый калорийный приём" value="Обед (830 ккал)" emoji="☀️" />
              <PatternItem label="Частота перекусов" value="1-2 раза/день" emoji="🍎" />
              <PatternItem label="Последний приём пищи" value="20:15 (среднее)" emoji="🌙" />
            </div>
          </div>

          {/* AI Summary */}
          <div className="glass-card rounded-2xl p-4 shadow-md bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
            <h3 className="font-semibold text-slate-800 mb-2 text-sm flex items-center gap-2">
              <span className="text-lg">🤖</span>
              AI-резюме за неделю
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Отличная неделя! Вы стабильно держите калорийность в рамках цели. 
              Белок в норме 6 из 7 дней. Обратите внимание на потребление витамина D — 
              он ниже нормы. Рекомендую добавить жирную рыбу или яйца в рацион. 
              Тренд веса положительный: -2 кг за месяц при соблюдении дефицита.
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
