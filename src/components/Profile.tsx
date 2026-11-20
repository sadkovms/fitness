import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Target, Settings, Moon, Sun, Bell,
  ChevronRight, LogOut, Shield, HelpCircle,
  Heart, Zap, Scale, Ruler
} from 'lucide-react';
import { dailyGoals, streakData } from '../data/foodData';

export default function Profile() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const userProfile = {
    name: 'Александр',
    age: 28,
    weight: 76.2,
    height: 180,
    goal: 'Похудение',
    activityLevel: 'Умеренная',
    bmi: 23.5,
  };

  return (
    <div className="px-4 pb-24 pt-4 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-slate-800">Профиль</h1>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-3xl p-6 mb-4 shadow-lg text-center"
      >
        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{userProfile.name}</h2>
        <p className="text-sm text-slate-500">{userProfile.age} лет • {userProfile.height} см • {userProfile.weight} кг</p>
        
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-emerald-50 rounded-xl p-2.5">
            <p className="text-lg font-bold text-emerald-700">{userProfile.bmi}</p>
            <p className="text-[10px] text-emerald-600">ИМТ</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-2.5">
            <p className="text-lg font-bold text-amber-700">{streakData.currentStreak}</p>
            <p className="text-[10px] text-amber-600">Стрик</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-2.5">
            <p className="text-lg font-bold text-blue-700">{streakData.totalDays}</p>
            <p className="text-[10px] text-blue-600">Дней</p>
          </div>
        </div>
      </motion.div>

      {/* Goals Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-4 mb-4 shadow-md"
      >
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-slate-800">Мои цели</h3>
        </div>
        <div className="space-y-3">
          <GoalRow icon={<Zap className="w-4 h-4" />} label="Калории" value={`${dailyGoals.calories} ккал/день`} color="text-emerald-600" />
          <GoalRow icon={<Heart className="w-4 h-4" />} label="Белки" value={`${dailyGoals.protein} г/день`} color="text-blue-600" />
          <GoalRow icon={<Scale className="w-4 h-4" />} label="Целевой вес" value="73 кг" color="text-purple-600" />
          <GoalRow icon={<Ruler className="w-4 h-4" />} label="Активность" value={userProfile.activityLevel} color="text-amber-600" />
        </div>
        <button className="w-full mt-3 py-2.5 bg-emerald-50 rounded-xl text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors">
          Изменить цели
        </button>
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl overflow-hidden mb-4 shadow-md"
      >
        <h3 className="font-semibold text-slate-800 px-4 pt-4 pb-2">Настройки</h3>
        
        <SettingToggle
          icon={darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          label="Тёмная тема"
          enabled={darkMode}
          onToggle={() => setDarkMode(!darkMode)}
        />
        <SettingToggle
          icon={<Bell className="w-5 h-5" />}
          label="Уведомления"
          enabled={notifications}
          onToggle={() => setNotifications(!notifications)}
        />
        <SettingRow icon={<Shield className="w-5 h-5 text-slate-500" />} label="Конфиденциальность" />
        <SettingRow icon={<HelpCircle className="w-5 h-5 text-slate-500" />} label="Помощь и FAQ" />
      </motion.div>

      {/* Integrations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-4 mb-4 shadow-md"
      >
        <h3 className="font-semibold text-slate-800 mb-3">Интеграции</h3>
        <div className="space-y-2">
          <IntegrationRow name="Apple Health" connected={true} />
          <IntegrationRow name="Google Fit" connected={false} />
          <IntegrationRow name="Samsung Health" connected={false} />
          <IntegrationRow name="Умные весы" connected={true} />
        </div>
      </motion.div>

      {/* Export */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl p-4 mb-4 shadow-md"
      >
        <h3 className="font-semibold text-slate-800 mb-3">Экспорт данных</h3>
        <div className="flex gap-2">
          <button className="flex-1 py-2.5 bg-slate-100 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors">
            📄 PDF
          </button>
          <button className="flex-1 py-2.5 bg-slate-100 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors">
            📊 Excel
          </button>
          <button className="flex-1 py-2.5 bg-slate-100 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors">
            📧 Email
          </button>
        </div>
      </motion.div>

      {/* Logout */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full py-3 text-red-500 font-medium text-sm flex items-center justify-center gap-2 hover:bg-red-50 rounded-xl transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Выйти из аккаунта
      </motion.button>
    </div>
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

function SettingToggle({ icon, label, enabled, onToggle }: { icon: React.ReactNode; label: string; enabled: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-slate-500">{icon}</span>
        <span className="text-sm text-slate-700">{label}</span>
      </div>
      <button
        onClick={onToggle}
        className={`w-11 h-6 rounded-full transition-colors relative ${
          enabled ? 'bg-emerald-500' : 'bg-slate-300'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${
            enabled ? 'translate-x-[22px]' : 'translate-x-[2px]'
          }`}
        />
      </button>
    </div>
  );
}

function IntegrationRow({ name, connected }: { name: string; connected: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-slate-700">{name}</span>
      <span className={`text-xs px-2 py-1 rounded-full ${
        connected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
      }`}>
        {connected ? 'Подключено' : 'Подключить'}
      </span>
    </div>
  );
}
