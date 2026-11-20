import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Clock, ChevronLeft, ChevronRight, Flame,
  Beef, Droplet, Wheat, Trash2, Edit3, Check, X
} from 'lucide-react';
import { useStoreContext } from '../store/StoreContext';
import { foodDatabase } from '../store/useStore';

const mealTypes = [
  { key: 'breakfast' as const, label: 'Завтрак', icon: '🌅' },
  { key: 'lunch' as const, label: 'Обед', icon: '☀️' },
  { key: 'snack' as const, label: 'Перекус', icon: '🍎' },
  { key: 'dinner' as const, label: 'Ужин', icon: '🌙' },
];

export default function Diary() {
  const store = useStoreContext();
  const { state, removeMeal, updateMeal, totalCalories, totalProtein, totalFat, totalCarbs, mealsByType } = store;
  const { goals } = state;

  const [expandedMeal, setExpandedMeal] = useState<string | null>('breakfast');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPortion, setEditPortion] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMealType, setAddMealType] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner'>('breakfast');
  const [addSearch, setAddSearch] = useState('');

  const handleDelete = (id: string) => {
    removeMeal(id);
  };

  const handleEdit = (id: string, currentMult: number) => {
    setEditingId(id);
    setEditPortion(currentMult);
  };

  const handleSaveEdit = (meal: any) => {
    updateMeal(meal.id, {
      calories: Math.round(meal.calories * editPortion),
      protein: Math.round(meal.protein * editPortion * 10) / 10,
      fat: Math.round(meal.fat * editPortion * 10) / 10,
      carbs: Math.round(meal.carbs * editPortion),
      fiber: Math.round(meal.fiber * editPortion * 10) / 10,
      portion: `${Math.round(meal.portionGrams * editPortion)} г`,
    });
    setEditingId(null);
  };

  const filteredForAdd = foodDatabase.filter(f =>
    f.name.toLowerCase().includes(addSearch.toLowerCase())
  );

  const handleAddFood = (food: typeof foodDatabase[0]) => {
    store.addMeal({
      id: Date.now().toString(),
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      fat: food.fat,
      carbs: food.carbs,
      fiber: food.fiber,
      sugar: food.sugar,
      sodium: food.sodium,
      portion: food.portion,
      portionGrams: food.portionGrams,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      mealType: addMealType,
      gi: food.gi,
      verified: food.verified,
    });
    setShowAddModal(false);
    setAddSearch('');
  };

  const caloriePercent = Math.min((totalCalories / goals.calories) * 100, 100);
  const remaining = Math.max(0, goals.calories - totalCalories);

  return (
    <div className="px-4 pb-24 pt-4 max-w-lg mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Дневник</h1>
        <p className="text-sm text-slate-500">
          {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </motion.div>

      {/* Daily Summary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-4 mb-4 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-emerald-500" />
            <span className="font-semibold text-slate-800">{totalCalories} / {goals.calories} ккал</span>
          </div>
          <span className="text-sm text-slate-500">Осталось: {remaining}</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${caloriePercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${caloriePercent > 100 ? 'bg-gradient-to-r from-red-400 to-red-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <MacroProgress icon={<Beef className="w-4 h-4" />} label="Белки" current={totalProtein} goal={goals.protein} unit="г" color="bg-blue-500" />
          <MacroProgress icon={<Droplet className="w-4 h-4" />} label="Жиры" current={totalFat} goal={goals.fat} unit="г" color="bg-amber-500" />
          <MacroProgress icon={<Wheat className="w-4 h-4" />} label="Углев." current={totalCarbs} goal={goals.carbs} unit="г" color="bg-purple-500" />
        </div>
      </motion.div>

      {/* Meals List */}
      <div className="space-y-3">
        {mealTypes.map((mt, idx) => {
          const items = mealsByType[mt.key];
          const mealCalories = items.reduce((s, m) => s + m.calories, 0);
          return (
            <motion.div
              key={mt.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.05 }}
              className="glass-card rounded-2xl overflow-hidden shadow-md"
            >
              <button
                onClick={() => setExpandedMeal(expandedMeal === mt.key ? null : mt.key)}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{mt.icon}</span>
                  <div className="text-left">
                    <p className="font-semibold text-slate-800">{mt.label}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {items.length > 0 ? items[0].time : '--:--'}
                      {items.length > 0 && ` • ${items.length} прод.`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700">{mealCalories} ккал</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setAddMealType(mt.key); setShowAddModal(true); }}
                    className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center hover:bg-emerald-200 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>
              </button>

              <AnimatePresence>
                {expandedMeal === mt.key && items.length > 0 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-100">
                    {items.map((item) => (
                      <div key={item.id} className="px-4 py-3 hover:bg-slate-50/50 transition-colors">
                        {editingId === item.id ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-slate-700">{item.name}</p>
                              <div className="flex gap-1">
                                <button onClick={() => handleSaveEdit(item)} className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                </button>
                                <button onClick={() => setEditingId(null)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                                  <X className="w-3.5 h-3.5 text-slate-500" />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">Порция:</span>
                              <div className="flex items-center gap-1">
                                <button onClick={() => setEditPortion(Math.max(0.25, editPortion - 0.25))} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center">
                                  <span className="text-xs">−</span>
                                </button>
                                <span className="text-xs font-medium w-12 text-center">{(editPortion * 100).toFixed(0)}%</span>
                                <button onClick={() => setEditPortion(editPortion + 0.25)} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center">
                                  <span className="text-xs">+</span>
                                </button>
                              </div>
                              <span className="text-xs text-slate-500 ml-2">
                                = {Math.round(item.calories * editPortion)} ккал
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-700">{item.name}</p>
                              <p className="text-xs text-slate-400">{item.portion} • Б:{item.protein}г Ж:{item.fat}г У:{item.carbs}г</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-slate-700">{item.calories}</span>
                              <button onClick={() => handleEdit(item.id, 1)} className="p-1.5 rounded-lg hover:bg-blue-50">
                                <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                              </button>
                              <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50">
                                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="px-4 py-2 bg-slate-50/50 flex items-center justify-between">
                      <div className="flex gap-3">
                        <span className="text-xs text-blue-600 font-medium">Б: {items.reduce((s, i) => s + i.protein, 0).toFixed(0)}г</span>
                        <span className="text-xs text-amber-600 font-medium">Ж: {items.reduce((s, i) => s + i.fat, 0).toFixed(0)}г</span>
                        <span className="text-xs text-purple-600 font-medium">У: {items.reduce((s, i) => s + i.carbs, 0)}г</span>
                      </div>
                      <span className="text-xs font-medium text-slate-600">{mealCalories} ккал</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Water Tracker */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-2xl p-4 mt-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💧</span>
            <h3 className="font-semibold text-slate-800">Вода</h3>
          </div>
          <span className="text-sm text-slate-500">
            {(state.waterEntries.reduce((s, w) => s + w.amount, 0) / 1000).toFixed(1)} / {(goals.water / 1000).toFixed(1)} л
          </span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: 10 }).map((_, i) => {
            const waterPercent = (state.waterEntries.reduce((s, w) => s + w.amount, 0) / goals.water) * 10;
            return (
              <div key={i} className={`flex-1 h-8 rounded-lg transition-colors ${i < waterPercent ? 'bg-blue-400' : 'bg-slate-100'}`} />
            );
          })}
        </div>
        <div className="flex gap-2 mt-3">
          {[200, 250, 300].map(amount => (
            <button
              key={amount}
              onClick={() => store.addWater(amount)}
              className="flex-1 py-2 bg-blue-50 rounded-xl text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
            >
              +{amount} мл
            </button>
          ))}
        </div>
      </motion.div>

      {/* Add Food Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Добавить продукт</h3>
                <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
              <div className="relative mb-3">
                <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={addSearch}
                  onChange={(e) => setAddSearch(e.target.value)}
                  placeholder="Поиск..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>
              <div className="flex-1 overflow-y-auto space-y-1">
                {(addSearch ? filteredForAdd : foodDatabase.slice(0, 15)).map((food, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddFood(food)}
                    className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-emerald-50 rounded-xl transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">{food.name}</p>
                      <p className="text-xs text-slate-500">{food.portion} • {food.calories} ккал</p>
                    </div>
                    <Plus className="w-4 h-4 text-emerald-500" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MacroProgress({ icon, label, current, goal, unit, color }: {
  icon: React.ReactNode; label: string; current: number; goal: number; unit: string; color: string;
}) {
  const percent = Math.min((current / goal) * 100, 100);
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 mb-1">
        <span className="text-slate-500">{icon}</span>
        <span className="text-[10px] text-slate-500">{label}</span>
      </div>
      <p className="text-sm font-bold text-slate-800">{Math.round(current)}<span className="text-[10px] text-slate-400">{unit}</span></p>
      <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
