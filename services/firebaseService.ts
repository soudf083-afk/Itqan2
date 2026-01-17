
import { UserProgress, UserLevel } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../components/constants';

/**
 * [Itqan Platform] Local Persistence Service
 * This file replaces Firebase Firestore with Browser LocalStorage to avoid 
 * "Service firestore is not available" errors in restricted browser environments.
 */

const STORAGE_KEYS = {
    USER_PROGRESS: 'itqan_user_progress',
    AYAHS_CACHE: 'itqan_ayahs_cache_',
    JUZ_CACHE: 'itqan_juz_cache_'
};

const initialUserProgress: Omit<UserProgress, 'id'> = {
    userName: '',
    role: 'user',
    theme: 'green',
    currentSurah: 1,
    totalAyahsMemorized: 0,
    lightPoints: 0,
    streak: 0,
    level: UserLevel.BEGINNER,
    achievements: INITIAL_ACHIEVEMENTS,
};

/**
 * Mocks user progress fetching from Firestore using LocalStorage
 */
export async function getUserProgress(userId: string): Promise<UserProgress> {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
        if (stored) {
            return JSON.parse(stored) as UserProgress;
        }
        
        const newUserProgress = { id: userId, ...initialUserProgress };
        localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(newUserProgress));
        return newUserProgress as UserProgress;
    } catch (error) {
        console.warn("[Itqan] LocalStorage read failed, returning defaults.");
        return { id: userId, ...initialUserProgress } as UserProgress;
    }
}

/**
 * Mocks Firestore updateDoc using LocalStorage
 */
export async function updateUserProgress(userId: string, data: Partial<Omit<UserProgress, 'id'>>) {
    try {
        const current = await getUserProgress(userId);
        const updated = { ...current, ...data };
        localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(updated));
    } catch (error) {
        console.error("[Itqan] LocalStorage update failed:", error);
    }
}

/**
 * Placeholder for metadata synchronization
 */
export async function syncSurahMetadata() {
    // In local mode, we use constants.tsx directly. No syncing needed.
    return Promise.resolve();
}

// Fix: Implement missing caching methods needed by quranService.ts

/**
 * Retrieves cached surah ayahs from local storage
 */
export async function getCachedSurahAyahs(surahNumber: number) {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.AYAHS_CACHE + surahNumber);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        return null;
    }
}

/**
 * Caches surah ayahs in local storage
 */
export async function cacheSurahAyahs(surahNumber: number, data: any) {
    try {
        localStorage.setItem(STORAGE_KEYS.AYAHS_CACHE + surahNumber, JSON.stringify(data));
    } catch (error) {
        console.error("[Itqan] Cache storage failed:", error);
    }
}

/**
 * Retrieves cached juz from local storage
 */
export async function getCachedJuz(juzNumber: number) {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.JUZ_CACHE + juzNumber);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        return null;
    }
}

/**
 * Caches juz in local storage
 */
export async function cacheJuz(juzNumber: number, data: any) {
    try {
        localStorage.setItem(STORAGE_KEYS.JUZ_CACHE + juzNumber, JSON.stringify(data));
    } catch (error) {
        console.error("[Itqan] Cache storage failed:", error);
    }
}
