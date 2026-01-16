
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

export interface UserProgress {
  id: string;
  currentSurah: number;
  totalAyahsMemorized: number;
  lightPoints: number;
  streak: number;
  level: UserLevel;
  achievements: Achievement[];
}

export interface City {
  id: number;
  name: string;
  description: string;
  juzRange: [number, number];
}