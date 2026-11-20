import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Clock, ChevronLeft, ChevronRight, Flame,
  Beef, Droplet, Wheat, Trash2
} from 'lucide-react';
import { todayMeals, dailyGoals } from '../data/foodData';

const mealTypes = [
  { key: 'breakfast', label: 'Завтрак', icon: '🌅', time: '08:30' },
  { key: 'lunch', label: 'Обед', icon: '☀️', time: '13:15' },
  { key: 'snack', label: 'Перекус', icon: '🍎', time: '16:00' },
  { key: 'dinner', label: 'Ужин', icon: '🌙', time: '19:30' },
];

export default function Diary() {
  const [selectedDate] = useState(new Date());
  const [expandedMeal, setExpandedMeal] = useState<string | null>('lunch');

  const mealsByType = mealTypes.map(mt => ({
    ...mt,
    items: todayMeals.filter(m => m.mealType === mt.key),
    totalCalories: todayMeals.filter(m => m.mealType === mt.key).reduce((s, m) => s + m.calories, 0),
  }));

  const totalCalories = todayMeals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = todayMeals.reduce((s, m) => s + m.protein, 0);
  const totalFat = todayMeals.reduce((s, m) => s + m.fat, 0);
  const totalCarbs = todayMeals.reduce((s, m) => s + m.carbs, 0);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div className="px-4 pb-24 pt-4 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h1 className="text-2xl font-bold text-slate-800">Дневник</h1>
        <div className="flex items-center justify-between mt-2">
          <button className="p-2 rounded-lg hover:bg-white/50 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="text-center">
            <p className="font-semibold text-slate-800 capitalize">{formatDate(selectedDate)}</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-white/50 transition-colors">
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </motion.div>

      {/* Daily Summary Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-4 mb-4 shadow-md"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-emerald-500" />
            <span className="font-semibold text-slate-800">{totalCalories} / {dailyGoals.calories} ккал</span>
          </div>
          <span className="text-sm text-slate-500">
            Осталось: {Math.max(0, dailyGoals.calories - totalCalories)} ккал
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((totalCalories / dailyGoals.calories) * 100, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
          />
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-3">
          <MacroProgress icon={<Beef className="w-4 h-4" />} label="Белки" current={totalProtein} goal={dailyGoals.protein} unit="г" color="bg-blue-500" />
          <MacroProgress icon={<Droplet className="w-4 h-4" />} label="Жиры" current={totalFat} goal={dailyGoals.fat} unit="г" color="bg-amber-500" />
          <MacroProgress icon={<Wheat className="w-4 h-4" />} label="Углев." current={totalCarbs} goal={dailyGoals.carbs} unit="г" color="bg-purple-500" />
        </div>
      </motion.div>

      {/* Meals List */}
      <div className="space-y-3">
        {mealsByType.map((meal, idx) => (
          <motion.div
            key={meal.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + idx * 0.05 }}
            className="glass-card rounded-2xl overflow-hidden shadow-md"
          >
            {/* Meal Header */}
            <button
              onClick={() => setExpandedMeal(expandedMeal === meal.key ? null : meal.key)}
              className="w-full flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{meal.icon}</span>
                <div className="text-left">
                  <p className="font-semibold text-slate-800">{meal.label}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {meal.items.length > 0 ? meal.items[0].time : meal.time}
                    {meal.items.length > 1 && ` • ${meal.items.length} продуктов`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">{meal.totalCalories} ккал</span>
                <Plus className="w-5 h-5 text-emerald-500" />
              </div>
            </button>

            {/* Expanded Items */}
            {expandedMeal === meal.key && meal.items.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="border-t border-slate-100"
              >
                {meal.items.map((item, i) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.portion}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-700">{item.calories}</p>
                        <p className="text-[10px] text-slate-400">ккал</p>
                      </div>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Macros breakdown for meal */}
                <div className="px-4 py-3 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex gap-4">
                    <span className="text-xs text-blue-600 font-medium">Б: {meal.items.reduce((s, i) => s + i.protein, 0)}г</span>
                    <span className="text-xs text-amber-600 font-medium">Ж: {meal.items.reduce((s, i) => s + i.fat, 0)}г</span>
                    <span className="text-xs text-purple-600 font-medium">У: {meal.items.reduce((s, i) => s + i.carbs, 0)}г</span>
                  </div>
                  {meal.items[0].gi && (
                    <span className="text-xs text-slate-500">ГИ: {meal.items[0].gi}</span>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Water Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-4 mt-4 shadow-md"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💧</span>
            <h3 className="font-semibold text-slate-800">Вода</h3>
          </div>
          <span className="text-sm text-slate-500">1.7 / 2.5 л</span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-8 rounded-lg transition-colors ${
                i < 7 ? 'bg-blue-400' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-slate-400">0 мл</span>
          <span className="text-[10px] text-slate-400">2500 мл</span>
        </div>
      </motion.div>
    </div>
  );
}

function MacroProgress({ icon, label, current, goal, unit, color }: {
  icon: React.ReactNode;
  label: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
}) {
  const percent = Math.min((current / goal) * 100, 100);
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 mb-1">
        <span className="text-slate-500">{icon}</span>
        <span className="text-[10px] text-slate-500">{label}</span>
      </div>
      <p className="text-sm font-bold text-slate-800">{current}<span className="text-[10px] text-slate-400">{unit}</span></p>
      <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
