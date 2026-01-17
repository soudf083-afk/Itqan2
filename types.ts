
export enum UserLevel {
  BEGINNER = 'مبتدئ',
  INTERMEDIATE = 'متوسط',
  ADVANCED = 'متقدم'
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Bookmark {
  type: 'surah' | 'juz';
  number: number;
  name: string;
  page?: number;
}

export interface UserProgress {
  id: string;
  userName: string;
  role: 'admin' | 'user';
  theme: 'green' | 'light' | 'dark';
  currentSurah: number;
  totalAyahsMemorized: number;
  lightPoints: number;
  streak: number;
  level: UserLevel;
  achievements: Achievement[];
  lastBookmark?: Bookmark;
}

export interface City {
  id: number;
  name: string;
  description: string;
  juzRange: [number, number];
}
