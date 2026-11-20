import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Scan, Check, X, Plus, Minus,
  Sparkles, RotateCcw, Info, ChevronDown, ChevronUp
} from 'lucide-react';
import { recognizedFoods } from '../data/foodData';

type AnalysisState = 'idle' | 'scanning' | 'results';

export default function FoodAnalysis() {
  const [state, setState] = useState<AnalysisState>('idle');
  const [showDetails, setShowDetails] = useState(false);
  const [portions, setPortions] = useState<Record<string, number>>({});

  const startScan = () => {
    setState('scanning');
    setTimeout(() => setState('results'), 2500);
  };

  const reset = () => {
    setState('idle');
    setShowDetails(false);
    setPortions({});
  };

  const adjustPortion = (name: string, delta: number) => {
    setPortions(prev => ({
      ...prev,
      [name]: Math.max(0.5, (prev[name] || 1) + delta * 0.25)
    }));
  };

  const totalCalories = recognizedFoods.reduce((sum, f) => {
    const mult = portions[f.name] || 1;
    return sum + Math.round(f.calories * mult);
  }, 0);

  const totalProtein = recognizedFoods.reduce((sum, f) => {
    const mult = portions[f.name] || 1;
    return sum + Math.round(f.protein * mult);
  }, 0);

  const totalFat = recognizedFoods.reduce((sum, f) => {
    const mult = portions[f.name] || 1;
    return sum + Math.round(f.fat * mult * 10) / 10;
  }, 0);

  const totalCarbs = recognizedFoods.reduce((sum, f) => {
    const mult = portions[f.name] || 1;
    return sum + Math.round(f.carbs * mult);
  }, 0);

  return (
    <div className="px-4 pb-24 pt-4 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-slate-800">AI Анализ</h1>
        <p className="text-sm text-slate-500">Сфотографируйте блюдо для анализа</p>
      </motion.div>

      {/* Camera View / Photo Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-3xl overflow-hidden mb-6 shadow-xl"
      >
        <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 relative flex items-center justify-center">
          {state === 'idle' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center border-2 border-dashed border-white/30">
                <Camera className="w-8 h-8 text-white/70" />
              </div>
              <p className="text-white/60 text-sm">Нажмите для фото</p>
            </div>
          )}

          {state === 'scanning' && (
            <div className="absolute inset-0">
              {/* Simulated food image */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-amber-900/30 to-green-900/40" />
              
              {/* Scanning animation */}
              <motion.div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              
              {/* Corner markers */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-400" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded-full px-4 py-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-white text-sm font-medium">Анализируем...</span>
                </div>
              </div>
            </div>
          )}

          {state === 'results' && (
            <div className="absolute inset-0">
              {/* Simulated food image */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-800/60 via-amber-700/40 to-green-800/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-2">🐟</div>
                  <div className="bg-black/40 rounded-full px-3 py-1">
                    <span className="text-white text-xs">4 компонента обнаружено</span>
                  </div>
                </div>
              </div>
              
              {/* Detection boxes */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute top-[15%] left-[10%] w-[45%] h-[40%] border-2 border-emerald-400 rounded-lg"
              >
                <span className="absolute -top-5 left-0 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded">Лосось 96%</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute top-[20%] right-[10%] w-[30%] h-[35%] border-2 border-blue-400 rounded-lg"
              >
                <span className="absolute -top-5 left-0 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded">Брокколи 93%</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute bottom-[15%] left-[15%] w-[35%] h-[25%] border-2 border-amber-400 rounded-lg"
              >
                <span className="absolute -top-5 left-0 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded">Рис 89%</span>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      {state === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 mb-6"
        >
          <button
            onClick={startScan}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
          >
            <Camera className="w-5 h-5" />
            Сфотографировать
          </button>
          <button
            onClick={startScan}
            className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-slate-100 active:scale-95 transition-transform"
          >
            <Scan className="w-5 h-5 text-slate-600" />
          </button>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {state === 'results' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {/* Summary Card */}
            <div className="glass-card rounded-2xl p-4 mb-4 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  Результат анализа
                </h3>
                <button onClick={reset} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
                  <RotateCcw className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-2 mb-4">
                <NutrientBox label="Калории" value={totalCalories} unit="ккал" color="text-emerald-600" bg="bg-emerald-50" />
                <NutrientBox label="Белки" value={totalProtein} unit="г" color="text-blue-600" bg="bg-blue-50" />
                <NutrientBox label="Жиры" value={totalFat} unit="г" color="text-amber-600" bg="bg-amber-50" />
                <NutrientBox label="Углев." value={totalCarbs} unit="г" color="text-purple-600" bg="bg-purple-50" />
              </div>

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-center gap-1 py-2 text-sm text-emerald-600 font-medium"
              >
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showDetails ? 'Скрыть детали' : 'Подробнее'}
              </button>
            </div>

            {/* Detected Foods */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="glass-card rounded-2xl p-4 mb-4 shadow-md">
                    <h4 className="font-semibold text-slate-800 mb-3 text-sm">Обнаруженные продукты</h4>
                    <div className="space-y-3">
                      {recognizedFoods.map((food, idx) => (
                        <motion.div
                          key={food.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-slate-800">{food.name}</p>
                              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                                {food.confidence}%
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {food.calories} ккал • Б:{food.protein}г • Ж:{food.fat}г • У:{food.carbs}г
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => adjustPortion(food.name, -1)}
                              className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-medium w-8 text-center">
                              {((portions[food.name] || 1) * 100).toFixed(0)}%
                            </span>
                            <button
                              onClick={() => adjustPortion(food.name, 1)}
                              className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add to Diary Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 active:scale-95 transition-transform mb-3"
            >
              <Check className="w-5 h-5" />
              Добавить в дневник
            </motion.button>

            {/* AI Insight */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="glass-card rounded-2xl p-4 shadow-md"
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-700 font-medium mb-1">AI Заметка</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Отличный выбор! Лосось богат Омега-3 жирными кислотами. Брокколи обеспечивает 
                    витамином C и клетчаткой. Это сбалансированный приём пищи с хорошим соотношением БЖУ.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Input Hint */}
      {state === 'idle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-slate-400 mb-2">или используйте другие методы</p>
          <div className="flex justify-center gap-4">
            <button className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-colors">
              <span className="text-lg">🎤</span>
              <span className="text-[10px] text-slate-500">Голос</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-colors">
              <span className="text-lg">⌨️</span>
              <span className="text-[10px] text-slate-500">Текст</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/50 hover:bg-white/80 transition-colors">
              <span className="text-lg">📊</span>
              <span className="text-[10px] text-slate-500">Штрих-код</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function NutrientBox({ label, value, unit, color, bg }: { label: string; value: number; unit: string; color: string; bg: string }) {
  return (
    <div className={`${bg} rounded-xl p-2 text-center`}>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-slate-500">{unit}</p>
      <p className="text-[10px] text-slate-400">{label}</p>
    </div>
  );
}
