import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Target, Moon, Sun, Bell,
  ChevronRight, LogOut, Shield, HelpCircle,
  Heart, Zap, Scale, Ruler, Download,
  Award, Lock, X, Check, Utensils
} from 'lucide-react';
import { useStoreContext } from '../store/StoreContext';
import { mealPlans } from '../store/useStore';

export default function Profile() {
  const store = useStoreContext();
  const { state, updateState, updateGoals, resetAll } = store;
  const { goals, achievements, streak, totalDays, theme, notifications } = state;

  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [tempGoals, setTempGoals] = useState(goals);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const userProfile = {
    name: 'Александр',
    bmi: Math.round((goals.weight / ((goals.height / 100) ** 2)) * 10) / 10,
  };

  const handleSaveGoals = () => {
    updateGoals(tempGoals);
    setShowGoalsModal(false);
  };

  const exportAllData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      profile: { name: userProfile.name, ...goals },
      achievements,
      streak,
      totalDays,
      meals: state.meals,
      water: state.waterEntries,
      weightHistory: state.weightHistory,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutrivision_full_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 pb-24 pt-4 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Профиль</h1>
      </motion.div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-3xl p-6 mb-4 shadow-lg text-center">
        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{userProfile.name}</h2>
        <p className="text-sm text-slate-500">{goals.age} лет • {goals.height} см • {goals.weight} кг</p>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-emerald-50 rounded-xl p-2.5">
            <p className="text-lg font-bold text-emerald-700">{userProfile.bmi}</p>
            <p className="text-[10px] text-emerald-600">ИМТ</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-2.5">
            <p className="text-lg font-bold text-amber-700">{streak}</p>
            <p className="text-[10px] text-amber-600">Стрик</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-2.5">
            <p className="text-lg font-bold text-blue-700">{totalDays}</p>
            <p className="text-[10px] text-blue-600">Дней</p>
          </div>
        </div>
      </motion.div>

      {/* Goals */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-4 mb-4 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-slate-800">Мои цели</h3>
        </div>
        <div className="space-y-3">
          <GoalRow icon={<Zap className="w-4 h-4" />} label="Калории" value={`${goals.calories} ккал/день`} color="text-emerald-600" />
          <GoalRow icon={<Heart className="w-4 h-4" />} label="Белки" value={`${goals.protein} г/день`} color="text-blue-600" />
          <GoalRow icon={<Scale className="w-4 h-4" />} label="Целевой вес" value={`${goals.targetWeight} кг`} color="text-purple-600" />
          <GoalRow icon={<Ruler className="w-4 h-4" />} label="Активность" value={getActivityLabel(goals.activityLevel)} color="text-amber-600" />
        </div>
        <button onClick={() => { setTempGoals(goals); setShowGoalsModal(true); }} className="w-full mt-3 py-2.5 bg-emerald-50 rounded-xl text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors">
          Изменить цели
        </button>
      </motion.div>

      {/* Meal Plans */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-4 mb-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-slate-800">Планы питания</h3>
          </div>
          <button onClick={() => setShowPlansModal(true)} className="text-xs text-emerald-600 font-medium">
            Смотреть все
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {mealPlans.slice(0, 3).map(plan => (
            <div key={plan.id} className="flex-shrink-0 w-32 bg-slate-50 rounded-xl p-3">
              <span className="text-2xl">{plan.icon}</span>
              <p className="text-xs font-medium text-slate-800 mt-1">{plan.name}</p>
              <p className="text-[10px] text-slate-500">{plan.calories} ккал</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-4 mb-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-slate-800">Достижения</h3>
          </div>
          <span className="text-xs text-slate-500">
            {achievements.filter(a => a.unlocked).length}/{achievements.length}
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {achievements.slice(0, 5).map(a => (
            <div key={a.id} className={`flex-shrink-0 w-16 text-center ${a.unlocked ? '' : 'opacity-50'}`}>
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-xl ${a.unlocked ? 'bg-amber-100' : 'bg-slate-100'}`}>
                {a.icon}
              </div>
              <p className="text-[9px] text-slate-500 mt-1 truncate">{a.title}</p>
            </div>
          ))}
        </div>
        <button onClick={() => setShowAchievementsModal(true)} className="w-full mt-3 py-2 bg-amber-50 rounded-xl text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors">
          Все достижения
        </button>
      </motion.div>

      {/* Settings */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card rounded-2xl overflow-hidden mb-4 shadow-md">
        <h3 className="font-semibold text-slate-800 px-4 pt-4 pb-2">Настройки</h3>
        <SettingToggle icon={theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />} label="Тёмная тема" enabled={theme === 'dark'} onToggle={() => updateState({ theme: theme === 'dark' ? 'light' : 'dark' })} />
        <SettingToggle icon={<Bell className="w-5 h-5" />} label="Уведомления" enabled={notifications} onToggle={() => updateState({ notifications: !notifications })} />
        <SettingRow icon={<Shield className="w-5 h-5 text-slate-500" />} label="Конфиденциальность" />
        <SettingRow icon={<Lock className="w-5 h-5 text-slate-500" />} label="Безопасность" />
        <SettingRow icon={<HelpCircle className="w-5 h-5 text-slate-500" />} label="Помощь и FAQ" />
      </motion.div>

      {/* Integrations */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-4 mb-4 shadow-md">
        <h3 className="font-semibold text-slate-800 mb-3">Интеграции</h3>
        <div className="space-y-2">
          <IntegrationRow name="Apple Health" connected={true} />
          <IntegrationRow name="Google Fit" connected={false} />
          <IntegrationRow name="Samsung Health" connected={false} />
          <IntegrationRow name="Умные весы" connected={true} />
        </div>
      </motion.div>

      {/* Export */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card rounded-2xl p-4 mb-4 shadow-md">
        <h3 className="font-semibold text-slate-800 mb-3">Экспорт данных</h3>
        <div className="flex gap-2">
          <button onClick={exportAllData} className="flex-1 py-2.5 bg-slate-100 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1">
            <Download className="w-4 h-4" /> JSON
          </button>
          <button className="flex-1 py-2.5 bg-slate-100 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors">
            📄 PDF
          </button>
          <button className="flex-1 py-2.5 bg-slate-100 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors">
            📊 Excel
          </button>
        </div>
      </motion.div>

      {/* Reset */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={() => setShowResetConfirm(true)}
        className="w-full py-3 text-red-500 font-medium text-sm flex items-center justify-center gap-2 hover:bg-red-50 rounded-xl transition-colors"
      >
        <LogOut className="w-4 h-4" /> Сбросить все данные
      </motion.button>

      {/* Goals Modal */}
      <AnimatePresence>
        {showGoalsModal && (
          <Modal onClose={() => setShowGoalsModal(false)} title="🎯 Мои цели">
            <div className="space-y-4">
              <GoalInput label="Калории (ккал/день)" value={tempGoals.calories} onChange={v => setTempGoals({ ...tempGoals, calories: v })} />
              <GoalInput label="Белки (г/день)" value={tempGoals.protein} onChange={v => setTempGoals({ ...tempGoals, protein: v })} />
              <GoalInput label="Жиры (г/день)" value={tempGoals.fat} onChange={v => setTempGoals({ ...tempGoals, fat: v })} />
              <GoalInput label="Углеводы (г/день)" value={tempGoals.carbs} onChange={v => setTempGoals({ ...tempGoals, carbs: v })} />
              <GoalInput label="Клетчатка (г/день)" value={tempGoals.fiber} onChange={v => setTempGoals({ ...tempGoals, fiber: v })} />
              <GoalInput label="Вода (мл/день)" value={tempGoals.water} onChange={v => setTempGoals({ ...tempGoals, water: v })} step={100} />
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Цель</label>
                <div className="flex gap-2">
                  {[{ key: 'lose', label: 'Похудение' }, { key: 'maintain', label: 'Поддержка' }, { key: 'gain', label: 'Набор' }].map(g => (
                    <button key={g.key} onClick={() => setTempGoals({ ...tempGoals, goal: g.key as any })} className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${tempGoals.goal === g.key ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">Уровень активности</label>
                <select value={tempGoals.activityLevel} onChange={e => setTempGoals({ ...tempGoals, activityLevel: e.target.value as any })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="sedentary">Сидячий образ жизни</option>
                  <option value="light">Лёгкая активность</option>
                  <option value="moderate">Умеренная активность</option>
                  <option value="active">Высокая активность</option>
                  <option value="very_active">Очень высокая</option>
                </select>
              </div>
              <button onClick={handleSaveGoals} className="w-full py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors">
                Сохранить
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Plans Modal */}
      <AnimatePresence>
        {showPlansModal && (
          <Modal onClose={() => setShowPlansModal(false)} title="🍽 Планы питания">
            <div className="space-y-3">
              {mealPlans.map(plan => (
                <div key={plan.id} className="p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{plan.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{plan.name}</p>
                      <p className="text-xs text-slate-500">{plan.calories} ккал • {plan.description}</p>
                    </div>
                  </div>
                  <div className="space-y-1 ml-9">
                    {plan.meals.map((meal, i) => (
                      <div key={i} className="text-xs text-slate-600">
                        <span className="font-medium">{meal.type}:</span> {meal.items.join(', ')}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1 mt-2 ml-9">
                    {plan.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Achievements Modal */}
      <AnimatePresence>
        {showAchievementsModal && (
          <Modal onClose={() => setShowAchievementsModal(false)} title="🏆 Достижения">
            <div className="space-y-2">
              {achievements.map(a => (
                <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl ${a.unlocked ? 'bg-amber-50' : 'bg-slate-50'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${a.unlocked ? 'bg-amber-200' : 'bg-slate-200'}`}>
                    {a.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">{a.title}</p>
                    <p className="text-xs text-slate-500">{a.description}</p>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(a.progress / a.target) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{a.progress}/{a.target}</span>
                </div>
              ))}
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Reset Confirm */}
      <AnimatePresence>
        {showResetConfirm && (
          <Modal onClose={() => setShowResetConfirm(false)} title="⚠️ Подтверждение">
            <p className="text-sm text-slate-600 mb-4">Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-medium text-slate-700">
                Отмена
              </button>
              <button onClick={() => { resetAll(); setShowResetConfirm(false); }} className="flex-1 py-3 bg-red-500 rounded-xl font-medium text-white">
                Удалить
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function GoalRow({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={color}>{icon}</span>
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      <span className="text-sm font-medium text-slate-800">{value}</span>
    </div>
  );
}

function GoalInput({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <div>
      <label className="text-sm text-slate-600 mb-1 block">{label}</label>
      <input type="number" step={step} value={value} onChange={e => onChange(parseInt(e.target.value) || 0)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
    </div>
  );
}

function SettingToggle({ icon, label, enabled, onToggle }: { icon: React.ReactNode; label: string; enabled: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-slate-500">{icon}</span>
        <span className="text-sm text-slate-700">{label}</span>
      </div>
      <button onClick={onToggle} className={`w-11 h-6 rounded-full transition-colors relative ${enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}>
        <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${enabled ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
      </button>
    </div>
  );
}

function SettingRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-slate-500">{icon}</span>
        <span className="text-sm text-slate-700">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400" />
    </button>
  );
}

function IntegrationRow({ name, connected }: { name: string; connected: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-slate-700">{name}</span>
      <span className={`text-xs px-2 py-1 rounded-full ${connected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
        {connected ? '✓ Подключено' : 'Подключить'}
      </span>
    </div>
  );
}

function getActivityLabel(level: string): string {
  const map: Record<string, string> = {
    sedentary: 'Сидячий',
    light: 'Лёгкая',
    moderate: 'Умеренная',
    active: 'Высокая',
    very_active: 'Очень высокая',
  };
  return map[level] || level;
}
