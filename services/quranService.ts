import { getCachedSurahAyahs, cacheSurahAyahs, getCachedJuz, cacheJuz } from "./firebaseService";

export async function fetchSurahAyahs(surahNumber: number) {
  try {
    // 1. Check Firestore Cache first
    const cached = await getCachedSurahAyahs(surahNumber);
    if (cached) return cached;

    // 2. Fetch from external API if not cached
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
    if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
    }
    const data = await response.json();
    if (data.code === 200) {
      // 3. Store in Firestore for future use
      await cacheSurahAyahs(surahNumber, data.data);
      return data.data;
    }
    throw new Error(data.data || 'Failed to fetch surah');
  } catch (error) {
    console.error('Error fetching Quran data:', error);
    return null;
  }
}

export async function fetchJuz(juzNumber: number) {
  try {
    // 1. Check Firestore Cache
    const cached = await getCachedJuz(juzNumber);
    if (cached) return cached;

    // 2. Fetch from external API
    const response = await fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/quran-uthmani`);
    if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
    }
    const data = await response.json();
    if (data.code === 200) {
      // 3. Store in Firestore
      await cacheJuz(juzNumber, data.data);
      return data.data;
    }
    throw new Error(data.data || 'Failed to fetch juz');
  } catch (error) {
    console.error('Error fetching Quran Juz data:', error);
    return null;
  }
}
