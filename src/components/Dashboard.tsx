import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Flame, Droplets, Target, TrendingUp, Award,
  ChevronRight, Zap, Leaf, Timer
} from 'lucide-react';
import { todayMeals, dailyGoals, waterIntake, streakData } from '../data/foodData';

export default function Dashboard() {
  const [animatedCalories, setAnimatedCalories] = useState(0);
  const totalCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = todayMeals.reduce((sum, m) => sum + m.protein, 0);
  const totalFat = todayMeals.reduce((sum, m) => sum + m.fat, 0);
  const totalCarbs = todayMeals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFiber = todayMeals.reduce((sum, m) => sum + m.fiber, 0);
  const totalWater = waterIntake.reduce((sum, w) => sum + w.amount, 0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedCalories(totalCalories), 100);
    return () => clearTimeout(timer);
  }, [totalCalories]);

  const caloriePercent = Math.min((totalCalories / dailyGoals.calories) * 100, 100);
  const circumference = 2 * Math.PI * 58;
  const strokeDashoffset = circumference - (caloriePercent / 100) * circumference;

  const getNutritionScore = () => {
    const proteinScore = Math.min(totalProtein / dailyGoals.protein, 1);
    const fatScore = Math.min(totalFat / dailyGoals.fat, 1);
    const carbScore = Math.min(totalCarbs / dailyGoals.carbs, 1);
    const fiberScore = Math.min(totalFiber / dailyGoals.fiber, 1);
    const avg = (proteinScore + fatScore + carbScore + fiberScore) / 4;
    if (avg >= 0.85) return 'A';
    if (avg >= 0.7) return 'B';
    if (avg >= 0.55) return 'C';
    if (avg >= 0.4) return 'D';
    return 'E';
  };

  const score = getNutritionScore();
  const scoreColor = score === 'A' ? 'text-emerald-500' : score === 'B' ? 'text-green-500' : 'text-yellow-500';

  return (
    <div className="px-4 pb-24 pt-4 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Доброе утро 👋</p>
            <h1 className="text-2xl font-bold text-slate-800">Сегодня</h1>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-700">{streakData.currentStreak} дней</span>
          </div>
        </div>
      </motion.div>

      {/* Main Calorie Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-3xl p-6 mb-4 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="relative">
            <svg width="140" height="140" className="transform -rotate-90">
              <circle cx="70" cy="70" r="58" stroke="#e2e8f0" strokeWidth="10" fill="none" />
              <circle
                cx="70" cy="70" r="58"
                stroke="url(#gradient)"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="progress-ring"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-800">{animatedCalories}</span>
              <span className="text-xs text-slate-500">/ {dailyGoals.calories} ккал</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <MacroBadge label="Белки" value={totalProtein} goal={dailyGoals.protein} unit="г" color="bg-blue-100 text-blue-700" />
            <MacroBadge label="Жиры" value={totalFat} goal={dailyGoals.fat} unit="г" color="bg-amber-100 text-amber-700" />
            <MacroBadge label="Углев." value={totalCarbs} goal={dailyGoals.carbs} unit="г" color="bg-purple-100 text-purple-700" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center`}>
              <span className={`text-sm font-bold ${scoreColor}`}>{score}</span>
            </div>
            <span className="text-sm text-slate-600">Качество питания</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600">
            <Leaf className="w-4 h-4" />
            <span className="text-sm font-medium">Отлично!</span>
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
        <QuickStat icon={<Droplets className="w-5 h-5 text-blue-500" />} label="Вода" value={`${(totalWater / 1000).toFixed(1)} л`} sub={`из ${(dailyGoals.water / 1000).toFixed(1)} л`} />
        <QuickStat icon={<Zap className="w-5 h-5 text-amber-500" />} label="Клетчатка" value={`${totalFiber} г`} sub={`из ${dailyGoals.fiber} г`} />
        <QuickStat icon={<Target className="w-5 h-5 text-emerald-500" />} label="Прогресс" value={`${Math.round(caloriePercent)}%`} sub="цели дня" />
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-4 mb-4 shadow-md"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-slate-800">AI Рекомендация</h3>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Вы набрали 85% от нормы белка. Добавьте порцию творога или яиц на ужин для достижения цели. 
          Потребление Омега-3 сегодня на отличном уровне! 🐟
        </p>
      </motion.div>

      {/* Today's Meals Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-4 shadow-md"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800">Приёмы пищи</h3>
          <button className="text-sm text-emerald-600 flex items-center gap-1">
            Все <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <MealRow icon="🌅" label="Завтрак" time="08:30" calories={400} items="Овсянка, кофе" />
          <MealRow icon="☀️" label="Обед" time="13:15" calories={830} items="Курица, киноа, салат" />
          <MealRow icon="🍎" label="Перекус" time="16:00" calories={130} items="Греческий йогурт" />
          <MealRow icon="🌙" label="Ужин" time="19:30" calories={520} items="Лосось, овощи" />
        </div>
      </motion.div>

      {/* Intermittent Fasting Timer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-4 mt-4 shadow-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Timer className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-medium text-slate-800 text-sm">Интервальное голодание</p>
              <p className="text-xs text-slate-500">16:8 • Окно питания: 10:00 - 18:00</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-indigo-600">14:32</p>
            <p className="text-xs text-slate-500">осталось</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MacroBadge({ label, value, goal, unit, color }: { label: string; value: number; goal: number; unit: string; color: string }) {
  const percent = Math.min((value / goal) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <div className={`px-2 py-1 rounded-lg ${color}`}>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="w-16">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-slate-700">{value}{unit}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function QuickStat({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="glass-card rounded-xl p-3 text-center shadow-sm">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
      <p className="text-[10px] text-slate-400">{sub}</p>
    </div>
  );
}

function MealRow({ icon, label, time, calories, items }: { icon: string; label: string; time: string; calories: number; items: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
      <span className="text-xl">{icon}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-800">{label}</p>
          <p className="text-sm font-semibold text-slate-700">{calories} ккал</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">{items}</p>
          <p className="text-xs text-slate-400">{time}</p>
        </div>
      </div>
    </div>
  );
}
