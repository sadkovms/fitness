import { useState, useEffect, useCallback } from 'react';

// ============ TYPES ============
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  sugar: number;
  sodium: number;
  portion: string;
  portionGrams: number;
  time: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  gi?: number;
  image?: string;
  verified?: boolean;
}

export interface WaterEntry {
  id: string;
  time: string;
  amount: number;
}

export interface UserGoals {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  water: number;
  weight: number;
  targetWeight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
}

export interface FastingState {
  isActive: boolean;
  startTime: number | null;
  targetHours: number;
  currentHours: number;
  completedToday: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export interface AppState {
  meals: FoodItem[];
  waterEntries: WaterEntry[];
  goals: UserGoals;
  fasting: FastingState;
  achievements: Achievement[];
  streak: number;
  longestStreak: number;
  totalDays: number;
  theme: 'light' | 'dark';
  notifications: boolean;
  selectedDate: string;
  weightHistory: { date: string; weight: number }[];
}

// ============ DEFAULTS ============
const defaultGoals: UserGoals = {
  calories: 2200,
  protein: 120,
  fat: 73,
  carbs: 275,
  fiber: 30,
  water: 2500,
  weight: 76.2,
  targetWeight: 73,
  height: 180,
  age: 28,
  gender: 'male',
  activityLevel: 'moderate',
  goal: 'lose',
};

const defaultFasting: FastingState = {
  isActive: false,
  startTime: null,
  targetHours: 16,
  currentHours: 0,
  completedToday: 0,
};

const defaultAchievements: Achievement[] = [
  { id: '1', title: 'Первый день', description: 'Заполните первый дневник', icon: '🎯', unlocked: true, unlockedAt: '2024-01-01', progress: 1, target: 1 },
  { id: '2', title: 'Неделя подряд', description: '7 дней логирования', icon: '🔥', unlocked: true, unlockedAt: '2024-01-07', progress: 7, target: 7 },
  { id: '3', title: 'Месяц дисциплины', description: '30 дней подряд', icon: '💎', unlocked: false, progress: 12, target: 30 },
  { id: '4', title: 'Мастер белка', description: '100г белка 10 дней', icon: '💪', unlocked: false, progress: 6, target: 10 },
  { id: '5', title: 'Водный баланс', description: 'Норма воды 14 дней', icon: '💧', unlocked: true, unlockedAt: '2024-01-14', progress: 14, target: 14 },
  { id: '6', title: 'Фото-мастер', description: '100 фото-анализов', icon: '📸', unlocked: false, progress: 45, target: 100 },
  { id: '7', title: 'Исследователь', description: 'Попробовать 50 разных блюд', icon: '🔬', unlocked: false, progress: 28, target: 50 },
  { id: '8', title: 'Марафонец', description: '90 дней в приложении', icon: '🏆', unlocked: false, progress: 45, target: 90 },
];

const defaultWeightHistory = [
  { date: '2024-01-01', weight: 78.2 },
  { date: '2024-01-05', weight: 77.8 },
  { date: '2024-01-10', weight: 77.5 },
  { date: '2024-01-15', weight: 77.1 },
  { date: '2024-01-20', weight: 76.8 },
  { date: '2024-01-25', weight: 76.5 },
  { date: '2024-01-30', weight: 76.2 },
];

const today = new Date().toISOString().split('T')[0];

const defaultMeals: FoodItem[] = [
  { id: '1', name: 'Овсянка с ягодами', calories: 320, protein: 12, fat: 8, carbs: 52, fiber: 7, sugar: 12, sodium: 5, portion: '300 г', portionGrams: 300, time: '08:30', mealType: 'breakfast', gi: 42, verified: true },
  { id: '2', name: 'Кофе с молоком', calories: 80, protein: 4, fat: 3, carbs: 8, fiber: 0, sugar: 8, sodium: 30, portion: '250 мл', portionGrams: 250, time: '08:30', mealType: 'breakfast', verified: true },
  { id: '3', name: 'Куриная грудка на гриле', calories: 280, protein: 42, fat: 8, carbs: 0, fiber: 0, sugar: 0, sodium: 65, portion: '200 г', portionGrams: 200, time: '13:15', mealType: 'lunch', gi: 0, verified: true },
  { id: '4', name: 'Киноа отварная', calories: 200, protein: 8, fat: 4, carbs: 38, fiber: 5, sugar: 1, sodium: 5, portion: '150 г', portionGrams: 150, time: '13:15', mealType: 'lunch', gi: 35, verified: true },
  { id: '5', name: 'Салат Цезарь', calories: 350, protein: 22, fat: 18, carbs: 25, fiber: 4, sugar: 3, sodium: 480, portion: '250 г', portionGrams: 250, time: '13:15', mealType: 'lunch', gi: 30, verified: true },
  { id: '6', name: 'Греческий йогурт', calories: 130, protein: 15, fat: 5, carbs: 8, fiber: 0, sugar: 6, sodium: 50, portion: '200 г', portionGrams: 200, time: '16:00', mealType: 'snack', verified: true },
  { id: '7', name: 'Лосось на гриле', calories: 320, protein: 34, fat: 18, carbs: 0, fiber: 0, sugar: 0, sodium: 60, portion: '180 г', portionGrams: 180, time: '19:30', mealType: 'dinner', gi: 0, verified: true },
  { id: '8', name: 'Брокколи на пару', calories: 55, protein: 4, fat: 0.5, carbs: 11, fiber: 5, sugar: 2, sodium: 30, portion: '150 г', portionGrams: 150, time: '19:30', mealType: 'dinner', gi: 10, verified: true },
  { id: '9', name: 'Бурый рис', calories: 180, protein: 4, fat: 1.5, carbs: 38, fiber: 3, sugar: 0.5, sodium: 5, portion: '150 г', portionGrams: 150, time: '19:30', mealType: 'dinner', gi: 50, verified: true },
];

const defaultWater: WaterEntry[] = [
  { id: 'w1', time: '08:00', amount: 250 },
  { id: 'w2', time: '10:00', amount: 300 },
  { id: 'w3', time: '12:00', amount: 250 },
  { id: 'w4', time: '14:00', amount: 350 },
  { id: 'w5', time: '16:00', amount: 250 },
];

// ============ FOOD DATABASE ============
export const foodDatabase: Omit<FoodItem, 'id' | 'time' | 'mealType'>[] = [
  { name: 'Куриная грудка отварная', calories: 165, protein: 31, fat: 3.6, carbs: 0, fiber: 0, sugar: 0, sodium: 74, portion: '100 г', portionGrams: 100, gi: 0, verified: true },
  { name: 'Куриная грудка на гриле', calories: 140, protein: 28, fat: 2.5, carbs: 0, fiber: 0, sugar: 0, sodium: 65, portion: '100 г', portionGrams: 100, gi: 0, verified: true },
  { name: 'Говядина варёная', calories: 250, protein: 26, fat: 15, carbs: 0, fiber: 0, sugar: 0, sodium: 60, portion: '100 г', portionGrams: 100, gi: 0, verified: true },
  { name: 'Лосось запечённый', calories: 177, protein: 20, fat: 10, carbs: 0, fiber: 0, sugar: 0, sodium: 59, portion: '100 г', portionGrams: 100, gi: 0, verified: true },
  { name: 'Тунец консервированный', calories: 116, protein: 26, fat: 1, carbs: 0, fiber: 0, sugar: 0, sodium: 320, portion: '100 г', portionGrams: 100, gi: 0, verified: true },
  { name: 'Яйцо куриное варёное', calories: 155, protein: 13, fat: 11, carbs: 1.1, fiber: 0, sugar: 1.1, sodium: 124, portion: '2 шт (120 г)', portionGrams: 120, gi: 0, verified: true },
  { name: 'Овсянка на воде', calories: 68, protein: 2.4, fat: 1.4, carbs: 12, fiber: 1.7, sugar: 0.5, sodium: 5, portion: '100 г', portionGrams: 100, gi: 55, verified: true },
  { name: 'Овсянка с молоком', calories: 102, protein: 4, fat: 2.5, carbs: 16, fiber: 1.5, sugar: 5, sodium: 30, portion: '200 г', portionGrams: 200, gi: 42, verified: true },
  { name: 'Гречка отварная', calories: 110, protein: 4.2, fat: 1.1, carbs: 21, fiber: 3.7, sugar: 0.5, sodium: 3, portion: '100 г', portionGrams: 100, gi: 40, verified: true },
  { name: 'Рис белый отварной', calories: 130, protein: 2.7, fat: 0.3, carbs: 28, fiber: 0.4, sugar: 0, sodium: 1, portion: '100 г', portionGrams: 100, gi: 70, verified: true },
  { name: 'Рис бурый отварной', calories: 123, protein: 2.6, fat: 1, carbs: 26, fiber: 1.8, sugar: 0.4, sodium: 1, portion: '100 г', portionGrams: 100, gi: 50, verified: true },
  { name: 'Киноа отварная', calories: 120, protein: 4.4, fat: 1.9, carbs: 21, fiber: 2.8, sugar: 0.9, sodium: 7, portion: '100 г', portionGrams: 100, gi: 35, verified: true },
  { name: 'Макароны отварные', calories: 131, protein: 5, fat: 1.1, carbs: 25, fiber: 1.8, sugar: 0.6, sodium: 1, portion: '100 г', portionGrams: 100, gi: 55, verified: true },
  { name: 'Картофель варёный', calories: 82, protein: 2, fat: 0.1, carbs: 17, fiber: 2.2, sugar: 0.8, sodium: 4, portion: '100 г', portionGrams: 100, gi: 65, verified: true },
  { name: 'Брокколи на пару', calories: 35, protein: 2.4, fat: 0.4, carbs: 7, fiber: 2.6, sugar: 1.4, sodium: 33, portion: '100 г', portionGrams: 100, gi: 10, verified: true },
  { name: 'Помидор свежий', calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9, fiber: 1.2, sugar: 2.6, sodium: 5, portion: '1 шт (150 г)', portionGrams: 150, gi: 15, verified: true },
  { name: 'Огурец свежий', calories: 15, protein: 0.7, fat: 0.1, carbs: 3.6, fiber: 0.5, sugar: 1.7, sodium: 2, portion: '1 шт (200 г)', portionGrams: 200, gi: 15, verified: true },
  { name: 'Авокадо', calories: 160, protein: 2, fat: 15, carbs: 9, fiber: 7, sugar: 0.7, sodium: 7, portion: '1 шт (150 г)', portionGrams: 150, gi: 15, verified: true },
  { name: 'Банан', calories: 89, protein: 1.1, fat: 0.3, carbs: 23, fiber: 2.6, sugar: 12, sodium: 1, portion: '1 шт (120 г)', portionGrams: 120, gi: 51, verified: true },
  { name: 'Яблоко', calories: 52, protein: 0.3, fat: 0.2, carbs: 14, fiber: 2.4, sugar: 10, sodium: 1, portion: '1 шт (180 г)', portionGrams: 180, gi: 38, verified: true },
  { name: 'Творог 5%', calories: 121, protein: 17, fat: 5, carbs: 1.8, fiber: 0, sugar: 1.8, sodium: 40, portion: '200 г', portionGrams: 200, verified: true },
  { name: 'Греческий йогурт', calories: 59, protein: 10, fat: 0.4, carbs: 3.6, fiber: 0, sugar: 3.2, sodium: 45, portion: '100 г', portionGrams: 100, verified: true },
  { name: 'Молоко 2.5%', calories: 52, protein: 2.8, fat: 2.5, carbs: 4.7, fiber: 0, sugar: 4.7, sodium: 50, portion: '200 мл', portionGrams: 200, verified: true },
  { name: 'Кефир 1%', calories: 40, protein: 3, fat: 1, carbs: 4, fiber: 0, sugar: 4, sodium: 50, portion: '200 мл', portionGrams: 200, verified: true },
  { name: 'Сыр твёрдый', calories: 350, protein: 25, fat: 27, carbs: 0, fiber: 0, sugar: 0, sodium: 600, portion: '30 г', portionGrams: 30, verified: true },
  { name: 'Хлеб цельнозерновой', calories: 250, protein: 9, fat: 3, carbs: 45, fiber: 7, sugar: 4, sodium: 450, portion: '1 ломтик (35 г)', portionGrams: 35, gi: 45, verified: true },
  { name: 'Миндаль', calories: 579, protein: 21, fat: 50, carbs: 22, fiber: 12, sugar: 4, sodium: 1, portion: '30 г', portionGrams: 30, verified: true },
  { name: 'Грецкие орехи', calories: 654, protein: 15, fat: 65, carbs: 14, fiber: 7, sugar: 2.6, sodium: 2, portion: '30 г', portionGrams: 30, verified: true },
  { name: 'Оливковое масло', calories: 884, protein: 0, fat: 100, carbs: 0, fiber: 0, sugar: 0, sodium: 2, portion: '1 ст.л. (15 мл)', portionGrams: 15, verified: true },
  { name: 'Салат Цезарь', calories: 140, protein: 9, fat: 7, carbs: 10, fiber: 1.6, sugar: 1.2, sodium: 192, portion: '100 г', portionGrams: 100, gi: 30, verified: true },
  { name: 'Борщ', calories: 49, protein: 1.8, fat: 2.2, carbs: 5.4, fiber: 1.3, sugar: 2.5, sodium: 280, portion: '300 мл', portionGrams: 300, verified: true },
  { name: 'Плов', calories: 150, protein: 5, fat: 6, carbs: 18, fiber: 0.8, sugar: 1, sodium: 200, portion: '250 г', portionGrams: 250, verified: true },
  { name: 'Пельмени', calories: 275, protein: 12, fat: 13, carbs: 27, fiber: 0.8, sugar: 1, sodium: 400, portion: '200 г', portionGrams: 200, verified: true },
  { name: 'Пицца Маргарита', calories: 266, protein: 11, fat: 10, carbs: 33, fiber: 2.3, sugar: 3.6, sodium: 551, portion: '1 кусок (120 г)', portionGrams: 120, verified: true },
  { name: 'Суши роллы', calories: 145, protein: 5, fat: 3, carbs: 25, fiber: 1, sugar: 3, sodium: 350, portion: '6 шт (200 г)', portionGrams: 200, verified: true },
  { name: 'Кофе чёрный', calories: 2, protein: 0.3, fat: 0, carbs: 0, fiber: 0, sugar: 0, sodium: 2, portion: '200 мл', portionGrams: 200, verified: true },
  { name: 'Чай зелёный', calories: 1, protein: 0, fat: 0, carbs: 0, fiber: 0, sugar: 0, sodium: 1, portion: '200 мл', portionGrams: 200, verified: true },
  { name: 'Сок апельсиновый', calories: 45, protein: 0.7, fat: 0.2, carbs: 10, fiber: 0.2, sugar: 8, sodium: 1, portion: '200 мл', portionGrams: 200, gi: 40, verified: true },
  { name: 'Протеиновый коктейль', calories: 120, protein: 24, fat: 1.5, carbs: 3, fiber: 1, sugar: 1, sodium: 150, portion: '1 порция (30 г)', portionGrams: 30, verified: true },
];

// ============ MEAL PLANS ============
export interface MealPlan {
  id: string;
  name: string;
  description: string;
  icon: string;
  calories: number;
  meals: { type: string; items: string[] }[];
  tags: string[];
}

export const mealPlans: MealPlan[] = [
  {
    id: '1', name: 'Сбалансированный', description: 'Классический план для поддержания формы', icon: '⚖️', calories: 2200,
    meals: [
      { type: 'Завтрак', items: ['Овсянка с молоком', 'Банан', 'Кофе с молоком'] },
      { type: 'Обед', items: ['Куриная грудка на гриле', 'Киноа отварная', 'Салат из овощей'] },
      { type: 'Перекус', items: ['Греческий йогурт', 'Миндаль 30г'] },
      { type: 'Ужин', items: ['Лосось запечённый', 'Брокколи на пару', 'Бурый рис'] },
    ],
    tags: ['БЖУ', 'Сбалансированное'],
  },
  {
    id: '2', name: 'Высокобелковый', description: 'Для набора мышечной массы', icon: '💪', calories: 2800,
    meals: [
      { type: 'Завтрак', items: ['Яйцо куриное варёное 4шт', 'Хлеб цельнозерновой', 'Творог 5%'] },
      { type: 'Обед', items: ['Говядина варёная 250г', 'Гречка отварная', 'Брокколи'] },
      { type: 'Перекус', items: ['Протеиновый коктейль', 'Банан'] },
      { type: 'Ужин', items: ['Куриная грудка 300г', 'Киноа', 'Овощной салат'] },
    ],
    tags: ['Белок', 'Спорт'],
  },
  {
    id: '3', name: 'Низкоуглеводный', description: 'Для снижения веса', icon: '🥑', calories: 1800,
    meals: [
      { type: 'Завтрак', items: ['Яйцо куриное варёное 3шт', 'Авокадо', 'Зелёный чай'] },
      { type: 'Обед', items: ['Лосось запечённый', 'Салат Цезарь без соуса'] },
      { type: 'Перекус', items: ['Греческий йогурт', 'Грецкие орехи'] },
      { type: 'Ужин', items: ['Тунец консервированный', 'Овощи на пару'] },
    ],
    tags: ['Кето', 'Похудение'],
  },
  {
    id: '4', name: 'Средиземноморский', description: 'Для здоровья сердца', icon: '🫒', calories: 2100,
    meals: [
      { type: 'Завтрак', items: ['Греческий йогурт', 'Мёд', 'Грецкие орехи', 'Ягоды'] },
      { type: 'Обед', items: ['Лосось на гриле', 'Оливковое масло', 'Салат из овощей'] },
      { type: 'Перекус', items: ['Миндаль', 'Яблоко'] },
      { type: 'Ужин', items: ['Тунец', 'Цельнозерновой хлеб', 'Овощи'] },
    ],
    tags: ['Сердце', 'Омега-3'],
  },
  {
    id: '5', name: 'Вегетарианский', description: 'Без мяса, полноценный белок', icon: '🌱', calories: 2000,
    meals: [
      { type: 'Завтрак', items: ['Овсянка на молоке', 'Банан', 'Миндаль'] },
      { type: 'Обед', items: ['Киноа', 'Фасоль', 'Овощной салат'] },
      { type: 'Перекус', items: ['Творог 5%', 'Яблоко'] },
      { type: 'Ужин', items: ['Тофу на гриле', 'Бурый рис', 'Брокколи'] },
    ],
    tags: ['Веган', 'Эко'],
  },
];

// ============ MICRONUTRIENT DATABASE ============
export interface Micronutrient {
  name: string;
  unit: string;
  dailyValue: number;
  category: 'vitamin' | 'mineral' | 'amino' | 'fatty' | 'other';
}

export const micronutrientDB: Micronutrient[] = [
  { name: 'Витамин A', unit: 'мкг', dailyValue: 900, category: 'vitamin' },
  { name: 'Витамин B1', unit: 'мг', dailyValue: 1.2, category: 'vitamin' },
  { name: 'Витамин B2', unit: 'мг', dailyValue: 1.3, category: 'vitamin' },
  { name: 'Витамин B3', unit: 'мг', dailyValue: 16, category: 'vitamin' },
  { name: 'Витамин B5', unit: 'мг', dailyValue: 5, category: 'vitamin' },
  { name: 'Витамин B6', unit: 'мг', dailyValue: 1.7, category: 'vitamin' },
  { name: 'Витамин B9', unit: 'мкг', dailyValue: 400, category: 'vitamin' },
  { name: 'Витамин B12', unit: 'мкг', dailyValue: 2.4, category: 'vitamin' },
  { name: 'Витамин C', unit: 'мг', dailyValue: 90, category: 'vitamin' },
  { name: 'Витамин D', unit: 'мкг', dailyValue: 20, category: 'vitamin' },
  { name: 'Витамин E', unit: 'мг', dailyValue: 15, category: 'vitamin' },
  { name: 'Витамин K', unit: 'мкг', dailyValue: 120, category: 'vitamin' },
  { name: 'Холин', unit: 'мг', dailyValue: 550, category: 'vitamin' },
  { name: 'Кальций', unit: 'мг', dailyValue: 1000, category: 'mineral' },
  { name: 'Железо', unit: 'мг', dailyValue: 18, category: 'mineral' },
  { name: 'Магний', unit: 'мг', dailyValue: 420, category: 'mineral' },
  { name: 'Фосфор', unit: 'мг', dailyValue: 700, category: 'mineral' },
  { name: 'Калий', unit: 'мг', dailyValue: 4700, category: 'mineral' },
  { name: 'Натрий', unit: 'мг', dailyValue: 2300, category: 'mineral' },
  { name: 'Цинк', unit: 'мг', dailyValue: 11, category: 'mineral' },
  { name: 'Медь', unit: 'мг', dailyValue: 0.9, category: 'mineral' },
  { name: 'Марганец', unit: 'мг', dailyValue: 2.3, category: 'mineral' },
  { name: 'Селен', unit: 'мкг', dailyValue: 55, category: 'mineral' },
  { name: 'Йод', unit: 'мкг', dailyValue: 150, category: 'mineral' },
  { name: 'Хром', unit: 'мкг', dailyValue: 35, category: 'mineral' },
  { name: 'Молибден', unit: 'мкг', dailyValue: 45, category: 'mineral' },
  { name: 'Лизин', unit: 'мг', dailyValue: 3000, category: 'amino' },
  { name: 'Лейцин', unit: 'мг', dailyValue: 3900, category: 'amino' },
  { name: 'Изолейцин', unit: 'мг', dailyValue: 2000, category: 'amino' },
  { name: 'Валин', unit: 'мг', dailyValue: 2600, category: 'amino' },
  { name: 'Треонин', unit: 'мг', dailyValue: 1500, category: 'amino' },
  { name: 'Триптофан', unit: 'мг', dailyValue: 250, category: 'amino' },
  { name: 'Метионин', unit: 'мг', dailyValue: 1040, category: 'amino' },
  { name: 'Фенилаланин', unit: 'мг', dailyValue: 2500, category: 'amino' },
  { name: 'Гистидин', unit: 'мг', dailyValue: 980, category: 'amino' },
  { name: 'Омега-3 (EPA+DHA)', unit: 'мг', dailyValue: 250, category: 'fatty' },
  { name: 'Омега-3 (ALA)', unit: 'мг', dailyValue: 1600, category: 'fatty' },
  { name: 'Омега-6', unit: 'мг', dailyValue: 17000, category: 'fatty' },
  { name: 'Насыщенные жиры', unit: 'г', dailyValue: 20, category: 'fatty' },
  { name: 'Мононенасыщенные', unit: 'г', dailyValue: 25, category: 'fatty' },
  { name: 'Полиненасыщенные', unit: 'г', dailyValue: 7, category: 'fatty' },
  { name: 'Трансжиры', unit: 'г', dailyValue: 2, category: 'fatty' },
  { name: 'Холестерин', unit: 'мг', dailyValue: 300, category: 'other' },
  { name: 'Кофеин', unit: 'мг', dailyValue: 400, category: 'other' },
  { name: 'Вода', unit: 'мл', dailyValue: 2500, category: 'other' },
  { name: 'Пурины', unit: 'мг', dailyValue: 400, category: 'other' },
];

// ============ STORE HOOK ============
const STORAGE_KEY = 'nutrivision_state';

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return {
    meals: defaultMeals,
    waterEntries: defaultWater,
    goals: defaultGoals,
    fasting: defaultFasting,
    achievements: defaultAchievements,
    streak: 12,
    longestStreak: 28,
    totalDays: 45,
    theme: 'light',
    notifications: true,
    selectedDate: today,
    weightHistory: defaultWeightHistory,
  };
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function useStore() {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Meals
  const addMeal = useCallback((meal: FoodItem) => {
    setState(prev => ({ ...prev, meals: [...prev.meals, meal] }));
  }, []);

  const removeMeal = useCallback((id: string) => {
    setState(prev => ({ ...prev, meals: prev.meals.filter(m => m.id !== id) }));
  }, []);

  const updateMeal = useCallback((id: string, updates: Partial<FoodItem>) => {
    setState(prev => ({
      ...prev,
      meals: prev.meals.map(m => m.id === id ? { ...m, ...updates } : m)
    }));
  }, []);

  // Water
  const addWater = useCallback((amount: number) => {
    const entry: WaterEntry = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      amount,
    };
    setState(prev => ({ ...prev, waterEntries: [...prev.waterEntries, entry] }));
  }, []);

  const removeWater = useCallback((id: string) => {
    setState(prev => ({ ...prev, waterEntries: prev.waterEntries.filter(w => w.id !== id) }));
  }, []);

  // Fasting
  const startFasting = useCallback(() => {
    setState(prev => ({
      ...prev,
      fasting: { ...prev.fasting, isActive: true, startTime: Date.now() }
    }));
  }, []);

  const stopFasting = useCallback(() => {
    setState(prev => ({
      ...prev,
      fasting: { ...prev.fasting, isActive: false, startTime: null, completedToday: prev.fasting.completedToday + 1 }
    }));
  }, []);

  const setFastingHours = useCallback((hours: number) => {
    setState(prev => ({
      ...prev,
      fasting: { ...prev.fasting, targetHours: hours }
    }));
  }, []);

  // Weight
  const addWeight = useCallback((weight: number) => {
    const entry = { date: today, weight };
    setState(prev => ({
      ...prev,
      weightHistory: [...prev.weightHistory.filter(w => w.date !== today), entry]
    }));
  }, []);

  // Goals
  const updateGoals = useCallback((goals: Partial<UserGoals>) => {
    setState(prev => ({ ...prev, goals: { ...prev.goals, ...goals } }));
  }, []);

  // Reset
  const resetAll = useCallback(() => {
    const fresh: AppState = {
      meals: [],
      waterEntries: [],
      goals: defaultGoals,
      fasting: defaultFasting,
      achievements: defaultAchievements,
      streak: 0,
      longestStreak: 0,
      totalDays: 0,
      theme: state.theme,
      notifications: true,
      selectedDate: today,
      weightHistory: [],
    };
    setState(fresh);
  }, [state.theme]);

  // Computed values
  const todayMeals = state.meals;
  const totalCalories = todayMeals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = todayMeals.reduce((s, m) => s + m.protein, 0);
  const totalFat = todayMeals.reduce((s, m) => s + m.fat, 0);
  const totalCarbs = todayMeals.reduce((s, m) => s + m.carbs, 0);
  const totalFiber = todayMeals.reduce((s, m) => s + m.fiber, 0);
  const totalWater = state.waterEntries.reduce((s, w) => s + w.amount, 0);

  const mealsByType = {
    breakfast: todayMeals.filter(m => m.mealType === 'breakfast'),
    lunch: todayMeals.filter(m => m.mealType === 'lunch'),
    snack: todayMeals.filter(m => m.mealType === 'snack'),
    dinner: todayMeals.filter(m => m.mealType === 'dinner'),
  };

  return {
    state,
    updateState,
    addMeal,
    removeMeal,
    updateMeal,
    addWater,
    removeWater,
    startFasting,
    stopFasting,
    setFastingHours,
    addWeight,
    updateGoals,
    resetAll,
    todayMeals,
    mealsByType,
    totalCalories,
    totalProtein,
    totalFat,
    totalCarbs,
    totalFiber,
    totalWater,
  };
}

export type Store = ReturnType<typeof useStore>;
