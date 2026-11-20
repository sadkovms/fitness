export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  portion: string;
  portionGrams: number;
  image?: string;
  time: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  gi?: number;
}

export interface DailyGoals {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  water: number;
}

export interface NutrientDetail {
  name: string;
  amount: number;
  unit: string;
  dailyValue: number;
  category: 'vitamin' | 'mineral' | 'amino' | 'fatty';
}

export const dailyGoals: DailyGoals = {
  calories: 2200,
  protein: 120,
  fat: 73,
  carbs: 275,
  fiber: 30,
  water: 2500,
};

export const todayMeals: FoodItem[] = [
  {
    id: '1',
    name: 'Овсянка с ягодами',
    calories: 320,
    protein: 12,
    fat: 8,
    carbs: 52,
    fiber: 7,
    portion: '300 г',
    portionGrams: 300,
    time: '08:30',
    mealType: 'breakfast',
    gi: 42,
  },
  {
    id: '2',
    name: 'Кофе с молоком',
    calories: 80,
    protein: 4,
    fat: 3,
    carbs: 8,
    fiber: 0,
    portion: '250 мл',
    portionGrams: 250,
    time: '08:30',
    mealType: 'breakfast',
  },
  {
    id: '3',
    name: 'Куриная грудка с киноа',
    calories: 480,
    protein: 42,
    fat: 12,
    carbs: 48,
    fiber: 5,
    portion: '350 г',
    portionGrams: 350,
    time: '13:15',
    mealType: 'lunch',
    gi: 35,
  },
  {
    id: '4',
    name: 'Салат Цезарь',
    calories: 350,
    protein: 22,
    fat: 18,
    carbs: 25,
    fiber: 4,
    portion: '250 г',
    portionGrams: 250,
    time: '13:15',
    mealType: 'lunch',
    gi: 30,
  },
  {
    id: '5',
    name: 'Греческий йогурт',
    calories: 130,
    protein: 15,
    fat: 5,
    carbs: 8,
    fiber: 0,
    portion: '200 г',
    portionGrams: 200,
    time: '16:00',
    mealType: 'snack',
  },
  {
    id: '6',
    name: 'Лосось на гриле с овощами',
    calories: 520,
    protein: 38,
    fat: 28,
    carbs: 22,
    fiber: 6,
    portion: '400 г',
    portionGrams: 400,
    time: '19:30',
    mealType: 'dinner',
    gi: 25,
  },
];

export const weeklyData = [
  { day: 'Пн', calories: 2100, protein: 115, fat: 70, carbs: 260 },
  { day: 'Вт', calories: 2350, protein: 128, fat: 78, carbs: 290 },
  { day: 'Ср', calories: 1980, protein: 105, fat: 65, carbs: 240 },
  { day: 'Чт', calories: 2200, protein: 120, fat: 73, carbs: 275 },
  { day: 'Пт', calories: 2400, protein: 132, fat: 80, carbs: 295 },
  { day: 'Сб', calories: 2150, protein: 118, fat: 72, carbs: 265 },
  { day: 'Вс', calories: 1880, protein: 108, fat: 68, carbs: 230 },
];

export const nutrientDetails: NutrientDetail[] = [
  { name: 'Витамин A', amount: 850, unit: 'мкг', dailyValue: 94, category: 'vitamin' },
  { name: 'Витамин B1', amount: 1.4, unit: 'мг', dailyValue: 117, category: 'vitamin' },
  { name: 'Витамин B2', amount: 1.8, unit: 'мг', dailyValue: 138, category: 'vitamin' },
  { name: 'Витамин B6', amount: 1.9, unit: 'мг', dailyValue: 112, category: 'vitamin' },
  { name: 'Витамин B12', amount: 4.2, unit: 'мкг', dailyValue: 175, category: 'vitamin' },
  { name: 'Витамин C', amount: 72, unit: 'мг', dailyValue: 80, category: 'vitamin' },
  { name: 'Витамин D', amount: 8.5, unit: 'мкг', dailyValue: 43, category: 'vitamin' },
  { name: 'Витамин E', amount: 11.2, unit: 'мг', dailyValue: 75, category: 'vitamin' },
  { name: 'Витамин K', amount: 95, unit: 'мкг', dailyValue: 79, category: 'vitamin' },
  { name: 'Железо', amount: 14.2, unit: 'мг', dailyValue: 79, category: 'mineral' },
  { name: 'Кальций', amount: 920, unit: 'мг', dailyValue: 92, category: 'mineral' },
  { name: 'Магний', amount: 340, unit: 'мг', dailyValue: 81, category: 'mineral' },
  { name: 'Цинк', amount: 9.8, unit: 'мг', dailyValue: 89, category: 'mineral' },
  { name: 'Калий', amount: 3200, unit: 'мг', dailyValue: 68, category: 'mineral' },
  { name: 'Натрий', amount: 1850, unit: 'мг', dailyValue: 80, category: 'mineral' },
  { name: 'Фосфор', amount: 1100, unit: 'мг', dailyValue: 157, category: 'mineral' },
  { name: 'Селен', amount: 52, unit: 'мкг', dailyValue: 95, category: 'mineral' },
  { name: 'Омега-3', amount: 2.1, unit: 'г', dailyValue: 131, category: 'fatty' },
  { name: 'Омега-6', amount: 8.5, unit: 'г', dailyValue: 65, category: 'fatty' },
];

export const recognizedFoods = [
  {
    name: 'Лосось на гриле',
    confidence: 96,
    calories: 280,
    protein: 34,
    fat: 16,
    carbs: 0,
    portion: '180 г',
  },
  {
    name: 'Брокколи на пару',
    confidence: 93,
    calories: 55,
    protein: 4,
    fat: 0.5,
    carbs: 11,
    portion: '150 г',
  },
  {
    name: 'Коричневый рис',
    confidence: 89,
    calories: 180,
    protein: 4,
    fat: 1.5,
    carbs: 38,
    portion: '150 г',
  },
  {
    name: 'Лимонный соус',
    confidence: 78,
    calories: 45,
    protein: 0.5,
    fat: 4,
    carbs: 2,
    portion: '30 мл',
  },
];

export const waterIntake = [
  { time: '08:00', amount: 250 },
  { time: '10:00', amount: 300 },
  { time: '12:00', amount: 250 },
  { time: '14:00', amount: 350 },
  { time: '16:00', amount: 250 },
  { time: '18:00', amount: 300 },
];

export const streakData = {
  currentStreak: 12,
  longestStreak: 28,
  totalDays: 45,
  completionRate: 87,
};
