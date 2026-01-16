import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import QuranCompetitions from './components/QuranCompetitions';
import RecitationRoom from './components/RecitationRoom';
import QuranBrowser from './components/QuranBrowser';
import RecitersList from './components/RecitersList';
import AzkarList from './components/AzkarList';
import JourneyMap from './components/JourneyMap';
import AdminPanel from './components/AdminPanel';
import { RECITERS } from './components/constants';
import { UserProgress } from './types';
import { Loader2 } from 'lucide-react';
import { getUserProgress, updateUserProgress, syncSurahMetadata } from './services/firebaseService';


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reciters, setReciters] = useState(RECITERS);
  const [initialJuzForBrowser, setInitialJuzForBrowser] = useState<number | null>(null);

  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const userId = 'demo-user-001'; // In production, this would come from Firebase Auth.

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingUser(true);
        // Ensure Surah data is available in Firestore
        await syncSurahMetadata();
        
        const progress = await getUserProgress(userId);
        setUserProgress(progress);
      } catch (error) {
        console.error("Failed to fetch or create user progress:", error);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleProgressUpdate = async (data: Partial<UserProgress>) => {
    if (!userProgress) return;
    const updatedProgress = { ...userProgress, ...data };
    setUserProgress(updatedProgress); // Optimistic UI update
    await updateUserProgress(userId, data);
  };
  
  const handleNavigateToJuz = (juzNumber: number) => {
    setInitialJuzForBrowser(juzNumber);
    setActiveTab('library');
  };

  const renderContent = () => {
    if (loadingUser) {
      return (
        <div className="flex h-screen w-full items-center justify-center text-center text-quiet-green gap-4">
          <Loader2 size={32} className="animate-spin" />
          <p className="text-xl font-bold">جاري الاتصال بقاعدة البيانات...</p>
        </div>
      );
    }
    
    if (!userProgress) {
        return <div className="p-8 text-center text-red-600">عذراً، لم نتمكن من الاتصال بـ Firestore. يرجى التحقق من إعدادات Firebase.</div>;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} userProgress={userProgress} />;
      case 'journey':
        return <JourneyMap onEnterCity={handleNavigateToJuz} userProgress={userProgress} />;
      case 'competitions':
        return <QuranCompetitions />;
      case 'recite':
        return <RecitationRoom />;
      case 'library':
        return (
          <QuranBrowser 
            reciters={reciters} 
            initialJuz={initialJuzForBrowser}
            clearInitialJuz={() => setInitialJuzForBrowser(null)} 
          />
        );
      case 'reciters':
        return <RecitersList reciters={reciters} />;
      case 'azkar':
        return <AzkarList />;
      case 'admin':
        return <AdminPanel reciters={reciters} setReciters={setReciters} />;
      case 'profile':
        return (
          <div className="p-8 max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
              <div className="w-24 h-24 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center text-emerald-600 text-3xl font-bold">س</div>
              <h3 className="text-2xl font-bold">سعود فهد</h3>
              <p className="text-slate-500">حافظ في رحلة مدينة النور</p>
              <div className="mt-6 flex justify-center gap-4">
                 <div className="bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium">{userProgress.level}</div>
                 <div className="bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium">
                    {userProgress.totalAyahsMemorized > 0 
                      ? `${Math.round((userProgress.totalAyahsMemorized / 6236) * 100)}% إنجاز`
                      : 'بداية الرحلة'}
                 </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800">الأوسمة المحققة</h4>
              <div className="grid grid-cols-3 gap-4">
                {userProgress.achievements.filter(a => a.unlocked).map(achievement => (
                  <div key={achievement.id} className="aspect-square bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2 p-2 text-center">
                    <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">⭐</div>
                    <span className="text-[10px] font-bold text-slate-600">{achievement.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard setActiveTab={setActiveTab} userProgress={userProgress} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-in fade-in duration-500">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;