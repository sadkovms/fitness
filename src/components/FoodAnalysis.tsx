import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Scan, Check, Plus, Minus,
  Sparkles, RotateCcw, Info, ChevronDown, ChevronUp,
  Search, X, Mic, Barcode
} from 'lucide-react';
import { useStoreContext } from '../store/StoreContext';
import { foodDatabase } from '../store/useStore';

type AnalysisState = 'idle' | 'scanning' | 'results';
type InputMode = 'photo' | 'search' | 'voice' | 'barcode';

export default function FoodAnalysis() {
  const store = useStoreContext();
  const { addMeal } = store;
  const [state, setState] = useState<AnalysisState>('idle');
  const [inputMode, setInputMode] = useState<InputMode>('photo');
  const [showDetails, setShowDetails] = useState(false);
  const [portions, setPortions] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<typeof foodDatabase>([]);
  const [voiceInput, setVoiceInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [addedToDiary, setAddedToDiary] = useState(false);

  // Simulated AI recognition results
  const recognizedFoods = [
    { name: 'Лосось на гриле', confidence: 96, calories: 280, protein: 34, fat: 16, carbs: 0, fiber: 0, sugar: 0, sodium: 60, portion: '180 г', portionGrams: 180, gi: 0, verified: true },
    { name: 'Брокколи на пару', confidence: 93, calories: 55, protein: 4, fat: 0.5, carbs: 11, fiber: 5, sugar: 2, sodium: 30, portion: '150 г', portionGrams: 150, gi: 10, verified: true },
    { name: 'Бурый рис', confidence: 89, calories: 180, protein: 4, fat: 1.5, carbs: 38, fiber: 3, sugar: 0.5, sodium: 5, portion: '150 г', portionGrams: 150, gi: 50, verified: true },
    { name: 'Лимонный соус', confidence: 78, calories: 45, protein: 0.5, fat: 4, carbs: 2, fiber: 0, sugar: 1, sodium: 120, portion: '30 мл', portionGrams: 30, verified: true },
  ];

  const startScan = () => {
    setState('scanning');
    setTimeout(() => {
      setState('results');
      setSelectedFoods(recognizedFoods as any);
    }, 2500);
  };

  const reset = () => {
    setState('idle');
    setShowDetails(false);
    setPortions({});
    setSelectedFoods([]);
    setAddedToDiary(false);
    setSearchQuery('');
    setVoiceInput('');
  };

  const adjustPortion = (name: string, delta: number) => {
    setPortions(prev => ({
      ...prev,
      [name]: Math.max(0.25, (prev[name] || 1) + delta * 0.25)
    }));
  };

  const filteredFoods = foodDatabase.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addFromSearch = (food: typeof foodDatabase[0]) => {
    setSelectedFoods(prev => [...prev, food as any]);
    setSearchQuery('');
  };

  const removeFromSelected = (index: number) => {
    setSelectedFoods(prev => prev.filter((_, i) => i !== index));
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setVoiceInput('Овсянка с бананом и мёдом, кофе с молоком');
      setIsListening(false);
      // Auto-add foods based on voice
      const matched = foodDatabase.filter(f =>
        f.name.toLowerCase().includes('овсянка') ||
        f.name.toLowerCase().includes('банан') ||
        f.name.toLowerCase().includes('кофе')
      );
      setSelectedFoods(prev => [...prev, ...matched.slice(0, 3) as any]);
    }, 2000);
  };

  const simulateBarcode = () => {
    setState('scanning');
    setTimeout(() => {
      setState('results');
      setSelectedFoods([{
        name: 'Греческий йогурт "Активиа" 2.5%',
        confidence: 100,
        calories: 82,
        protein: 5.3,
        fat: 2.5,
        carbs: 10,
        fiber: 0,
        sugar: 8,
        sodium: 60,
        portion: '1 порция (150 г)',
        portionGrams: 150,
        verified: true,
      } as any]);
    }, 1500);
  };

  const addToDiary = () => {
    const mealType = getMealType();
    selectedFoods.forEach((food, idx) => {
      const mult = portions[food.name] || 1;
      addMeal({
        id: Date.now().toString() + idx,
        name: food.name,
        calories: Math.round(food.calories * mult),
        protein: Math.round(food.protein * mult * 10) / 10,
        fat: Math.round(food.fat * mult * 10) / 10,
        carbs: Math.round(food.carbs * mult),
        fiber: Math.round(food.fiber * mult * 10) / 10,
        sugar: Math.round(food.sugar * mult * 10) / 10,
        sodium: Math.round(food.sodium * mult),
        portion: food.portion,
        portionGrams: food.portionGrams,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        mealType,
        gi: food.gi,
        verified: food.verified,
      });
    });
    setAddedToDiary(true);
    setTimeout(() => reset(), 2000);
  };

  const getMealType = (): 'breakfast' | 'lunch' | 'dinner' | 'snack' => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 15) return 'lunch';
    if (hour >= 15 && hour < 18) return 'snack';
    return 'dinner';
  };

  const totalCalories = selectedFoods.reduce((sum, f) => {
    const mult = portions[f.name] || 1;
    return sum + Math.round(f.calories * mult);
  }, 0);
  const totalProtein = selectedFoods.reduce((sum, f) => {
    const mult = portions[f.name] || 1;
    return sum + Math.round(f.protein * mult * 10) / 10;
  }, 0);
  const totalFat = selectedFoods.reduce((sum, f) => {
    const mult = portions[f.name] || 1;
    return sum + Math.round(f.fat * mult * 10) / 10;
  }, 0);
  const totalCarbs = selectedFoods.reduce((sum, f) => {
    const mult = portions[f.name] || 1;
    return sum + Math.round(f.carbs * mult);
  }, 0);
  const totalFiber = selectedFoods.reduce((sum, f) => {
    const mult = portions[f.name] || 1;
    return sum + Math.round(f.fiber * mult * 10) / 10;
  }, 0);

  return (
    <div className="px-4 pb-24 pt-4 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <h1 className="text-2xl font-bold text-slate-800">AI Анализ</h1>
        <p className="text-sm text-slate-500">Добавьте блюдо любым удобным способом</p>
      </motion.div>

      {/* Input Mode Tabs */}
      {state === 'idle' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-1 mb-4 bg-white/50 p-1 rounded-xl">
          {[
            { key: 'photo', label: '📷 Фото', mode: 'photo' as InputMode },
            { key: 'search', label: '🔍 Поиск', mode: 'search' as InputMode },
            { key: 'voice', label: '🎤 Голос', mode: 'voice' as InputMode },
            { key: 'barcode', label: '📊 Штрих', mode: 'barcode' as InputMode },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setInputMode(tab.mode)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                inputMode === tab.mode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>
      )}

      {/* Camera / Photo Mode */}
      {inputMode === 'photo' && state === 'idle' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden shadow-xl">
            <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 relative flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center border-2 border-dashed border-white/30">
                  <Camera className="w-8 h-8 text-white/70" />
                </div>
                <p className="text-white/60 text-sm">Нажмите для фото</p>
                <p className="text-white/40 text-xs mt-1">или загрузите из галереи</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={startScan} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 active:scale-95 transition-transform">
              <Camera className="w-5 h-5" /> Сфотографировать
            </button>
            <button onClick={startScan} className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-slate-100 active:scale-95 transition-transform">
              <Scan className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Search Mode */}
      {inputMode === 'search' && state === 'idle' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск продукта..."
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              autoFocus
            />
          </div>
          
          {/* Selected Foods */}
          {selectedFoods.length > 0 && (
            <div className="glass-card rounded-2xl p-3 shadow-md">
              <p className="text-xs font-medium text-slate-500 mb-2">Выбрано: {selectedFoods.length}</p>
              <div className="space-y-1.5">
                {selectedFoods.map((food, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5 px-2 bg-emerald-50 rounded-lg">
                    <span className="text-sm text-slate-700">{food.name}</span>
                    <button onClick={() => removeFromSelected(idx)} className="text-red-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          <div className="glass-card rounded-2xl p-3 shadow-md max-h-80 overflow-y-auto">
            {searchQuery.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">Начните вводить название продукта</p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center">
                  {['Курица', 'Рис', 'Яйца', 'Авокадо', 'Творог'].map(tag => (
                    <button key={tag} onClick={() => setSearchQuery(tag)} className="px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600 hover:bg-slate-200">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredFoods.map((food, idx) => (
                  <button
                    key={idx}
                    onClick={() => addFromSearch(food)}
                    className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-emerald-50 rounded-xl transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">{food.name}</p>
                      <p className="text-xs text-slate-500">{food.portion} • {food.calories} ккал</p>
                    </div>
                    <Plus className="w-4 h-4 text-emerald-500" />
                  </button>
                ))}
                {filteredFoods.length === 0 && (
                  <p className="text-center text-sm text-slate-400 py-4">Ничего не найдено</p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Voice Mode */}
      {inputMode === 'voice' && state === 'idle' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card rounded-3xl p-8 shadow-md text-center">
            <button
              onClick={simulateVoiceInput}
              className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 transition-all ${
                isListening
                  ? 'bg-red-500 animate-pulse-soft scale-110'
                  : 'bg-gradient-to-br from-emerald-400 to-teal-500 hover:scale-105'
              }`}
            >
              <Mic className="w-10 h-10 text-white" />
            </button>
            <p className="font-medium text-slate-800 mb-1">
              {isListening ? 'Слушаю...' : 'Нажмите для записи'}
            </p>
            <p className="text-xs text-slate-500">
              Например: "съел два яйца пашот и тост с авокадо"
            </p>
          </div>
          
          {voiceInput && (
            <div className="glass-card rounded-2xl p-4 shadow-md">
              <p className="text-xs text-slate-500 mb-1">Распознано:</p>
              <p className="text-sm text-slate-800 italic">"{voiceInput}"</p>
            </div>
          )}

          {selectedFoods.length > 0 && (
            <div className="glass-card rounded-2xl p-3 shadow-md">
              <p className="text-xs font-medium text-slate-500 mb-2">Найденные продукты:</p>
              <div className="space-y-1.5">
                {selectedFoods.map((food, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5 px-2 bg-emerald-50 rounded-lg">
                    <div>
                      <span className="text-sm text-slate-700">{food.name}</span>
                      <span className="text-xs text-slate-500 ml-2">{food.calories} ккал</span>
                    </div>
                    <button onClick={() => removeFromSelected(idx)} className="text-red-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Barcode Mode */}
      {inputMode === 'barcode' && state === 'idle' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden shadow-xl">
            <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 relative flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center border-2 border-dashed border-white/30">
                  <Barcode className="w-8 h-8 text-white/70" />
                </div>
                <p className="text-white/60 text-sm">Наведите на штрих-код</p>
              </div>
            </div>
          </div>
          <button onClick={simulateBarcode} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 active:scale-95 transition-transform">
            <Barcode className="w-5 h-5" /> Сканировать штрих-код
          </button>
          <div className="glass-card rounded-2xl p-4 shadow-md">
            <p className="text-xs text-slate-500 mb-2">Подсказка</p>
            <p className="text-sm text-slate-600">Наведите камеру на штрих-код продукта для автоматического определения состава из базы данных</p>
          </div>
        </motion.div>
      )}

      {/* Scanning Animation */}
      {state === 'scanning' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl overflow-hidden shadow-xl mb-4">
          <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-amber-900/30 to-green-900/40" />
            <motion.div
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-400" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full px-4 py-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-white text-sm font-medium">
                  {inputMode === 'barcode' ? 'Считываем данные...' : 'Анализируем блюдо...'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {state === 'results' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            {/* Photo result with detection boxes */}
            {inputMode === 'photo' && (
              <div className="relative rounded-3xl overflow-hidden shadow-xl mb-4">
                <div className="aspect-[4/3] bg-gradient-to-br from-orange-800/60 via-amber-700/40 to-green-800/50 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl mb-2">🐟</div>
                      <div className="bg-black/40 rounded-full px-3 py-1">
                        <span className="text-white text-xs">{selectedFoods.length} компонентов</span>
                      </div>
                    </div>
                  </div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="absolute top-[15%] left-[10%] w-[45%] h-[40%] border-2 border-emerald-400 rounded-lg">
                    <span className="absolute -top-5 left-0 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded">Лосось 96%</span>
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute top-[20%] right-[10%] w-[30%] h-[35%] border-2 border-blue-400 rounded-lg">
                    <span className="absolute -top-5 left-0 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded">Брокколи 93%</span>
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="absolute bottom-[15%] left-[15%] w-[35%] h-[25%] border-2 border-amber-400 rounded-lg">
                    <span className="absolute -top-5 left-0 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded">Рис 89%</span>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Summary Card */}
            <div className="glass-card rounded-2xl p-4 mb-4 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  Результат анализа
                </h3>
                <button onClick={reset} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200">
                  <RotateCcw className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-1.5 mb-3">
                <NutrientBox label="Ккал" value={totalCalories} unit="" color="text-emerald-600" bg="bg-emerald-50" />
                <NutrientBox label="Белки" value={totalProtein} unit="г" color="text-blue-600" bg="bg-blue-50" />
                <NutrientBox label="Жиры" value={totalFat} unit="г" color="text-amber-600" bg="bg-amber-50" />
                <NutrientBox label="Углев." value={totalCarbs} unit="г" color="text-purple-600" bg="bg-purple-50" />
                <NutrientBox label="Клетч." value={totalFiber} unit="г" color="text-green-600" bg="bg-green-50" />
              </div>
              <button onClick={() => setShowDetails(!showDetails)} className="w-full flex items-center justify-center gap-1 py-2 text-sm text-emerald-600 font-medium">
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showDetails ? 'Скрыть' : 'Подробнее'}
              </button>
            </div>

            {/* Details */}
            <AnimatePresence>
              {showDetails && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="glass-card rounded-2xl p-4 mb-4 shadow-md">
                    <h4 className="font-semibold text-slate-800 mb-3 text-sm">Обнаруженные продукты</h4>
                    <div className="space-y-2.5">
                      {selectedFoods.map((food, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="p-3 bg-slate-50 rounded-xl">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-slate-800">{food.name}</p>
                              {(food as any).confidence && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">{(food as any).confidence}%</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => adjustPortion(food.name, -1)} className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-medium w-10 text-center">{((portions[food.name] || 1) * 100).toFixed(0)}%</span>
                              <button onClick={() => adjustPortion(food.name, 1)} className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500">
                            {food.portion} • {food.calories} ккал • Б:{food.protein}г Ж:{food.fat}г У:{food.carbs}г
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add to Diary */}
            {!addedToDiary ? (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={addToDiary}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 active:scale-95 transition-transform mb-3"
              >
                <Check className="w-5 h-5" />
                Добавить в дневник ({getMealTypeLabel(getMealType())})
              </motion.button>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full bg-emerald-100 text-emerald-700 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 mb-3">
                <Check className="w-5 h-5" /> Добавлено в дневник!
              </motion.div>
            )}

            {/* AI Insight */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="glass-card rounded-2xl p-4 shadow-md">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-700 font-medium mb-1">AI Заметка</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Сбалансированный приём пищи! Лосось богат Омега-3 и белком. Брокколи обеспечивает клетчаткой и витамином C. 
                    {totalFiber < 5 ? ' Рекомендую добавить больше овощей для клетчатки.' : ' Хороший уровень клетчатки!'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NutrientBox({ label, value, unit, color, bg }: { label: string; value: number; unit: string; color: string; bg: string }) {
  return (
    <div className={`${bg} rounded-lg p-1.5 text-center`}>
      <p className={`text-sm font-bold ${color}`}>{value}</p>
      <p className="text-[9px] text-slate-500">{unit}{label}</p>
    </div>
  );
}

function getMealTypeLabel(type: string): string {
  switch (type) {
    case 'breakfast': return 'Завтрак';
    case 'lunch': return 'Обед';
    case 'snack': return 'Перекус';
    case 'dinner': return 'Ужин';
    default: return '';
  }
}
