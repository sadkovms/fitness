import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Camera, BookOpen, BarChart3, User } from 'lucide-react';
import { useStore } from './store/useStore';
import { StoreContext } from './store/StoreContext';
import Dashboard from './components/Dashboard';
import FoodAnalysis from './components/FoodAnalysis';
import Diary from './components/Diary';
import Reports from './components/Reports';
import Profile from './components/Profile';

type Tab = 'home' | 'scan' | 'diary' | 'reports' | 'profile';

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'home', label: 'Главная', icon: <Home className="w-5 h-5" /> },
  { key: 'scan', label: 'Анализ', icon: <Camera className="w-5 h-5" /> },
  { key: 'diary', label: 'Дневник', icon: <BookOpen className="w-5 h-5" /> },
  { key: 'reports', label: 'Отчёты', icon: <BarChart3 className="w-5 h-5" /> },
  { key: 'profile', label: 'Профиль', icon: <User className="w-5 h-5" /> },
];

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard />;
      case 'scan': return <FoodAnalysis />;
      case 'diary': return <Diary />;
      case 'reports': return <Reports />;
      case 'profile': return <Profile />;
    }
  };

  return (
    <div className="h-full flex flex-col min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-amber-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 px-4 py-3 glass-card border-b border-white/20 dark:border-slate-700/30">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-lg">NutriVision</span>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full font-medium">AI</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center">
              <span className="text-sm">🔥</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-lg mx-auto">
          <div className="glass-card border-t border-white/20 dark:border-slate-700/30 px-2 pb-2 pt-1 mx-2 mb-2 rounded-2xl shadow-xl">
            <div className="flex items-center justify-around">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all ${
                    activeTab === tab.key
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <div className={`p-1.5 rounded-xl transition-all ${
                    activeTab === tab.key ? 'bg-emerald-100 dark:bg-emerald-900/50' : ''
                  }`}>
                    {tab.key === 'scan' ? (
                      <div className={`w-10 h-10 -mt-4 rounded-full flex items-center justify-center shadow-lg transition-all ${
                        activeTab === tab.key
                          ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white'
                          : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                      }`}>
                        {tab.icon}
                      </div>
                    ) : (
                      tab.icon
                    )}
                  </div>
                  {tab.key !== 'scan' && (
                    <span className="text-[10px] font-medium">{tab.label}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  const store = useStore();

  return (
    <StoreContext.Provider value={store}>
      <AppContent />
    </StoreContext.Provider>
  );
}
