
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
import Settings from './components/Settings';
import { RECITERS } from './components/constants';
import { UserProgress, Bookmark } from './types';
import { Loader2, Sparkles, ArrowLeft, UserCircle, Lock, ShieldCheck, PenTool, Star, Compass } from 'lucide-react';
import { getUserProgress, updateUserProgress, syncSurahMetadata } from './services/firebaseService';
import { getPersonalizedWelcome } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reciters, setReciters] = useState(RECITERS);
  const [initialJuzForBrowser, setInitialJuzForBrowser] = useState<number | null>(null);
  const [initialSurahForBrowser, setInitialSurahForBrowser] = useState<number | null>(null);

  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [tempName, setTempName] = useState('');
  
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [loadingWelcome, setLoadingWelcome] = useState(false);
  
  const userId = 'demo-user-001'; 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoadingUser(true);
        await syncSurahMetadata();
        const progress = await getUserProgress(userId);
        setUserProgress(progress);
        
        if (progress && progress.theme && progress.theme !== 'green') {
          document.body.setAttribute('data-theme', progress.theme);
        }

        if (progress && progress.userName && !sessionStorage.getItem('itqan_welcomed')) {
          handleTriggerWelcome(progress.userName);
        }
      } catch (error) {
        console.error("Failed to fetch or create user progress:", error);
      } finally {
        setTimeout(() => setLoadingUser(false), 800);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleTriggerWelcome = async (name: string) => {
    setShowWelcomeOverlay(true);
    setLoadingWelcome(true);
    const msg = await getPersonalizedWelcome(name);
    setWelcomeMessage(msg);
    setLoadingWelcome(false);
    sessionStorage.setItem('itqan_welcomed', 'true');
  };

  const handleSaveName = async () => {
    if (!tempName.trim() || !userProgress) return;
    const updatedData = { userName: tempName.trim() };
    const newProgress = { ...userProgress, ...updatedData };
    setUserProgress(newProgress);
    await updateUserProgress(userId, updatedData);
    handleTriggerWelcome(updatedData.userName);
  };

  const handleUpdateProgress = async (data: Partial<UserProgress>) => {
    if (!userProgress) return;
    const updated = { ...userProgress, ...data };
    setUserProgress(updated);
    await updateUserProgress(userId, data);
  };

  const handleUpdateRole = async (newRole: 'admin' | 'user') => {
    if (!userProgress) return;
    const updatedData = { role: newRole };
    setUserProgress({ ...userProgress, ...updatedData });
    await updateUserProgress(userId, updatedData);
    if (newRole !== 'admin' && activeTab === 'admin') {
      setActiveTab('dashboard');
    }
  };

  const handleNavigateToJuz = (juzNumber: number) => {
    setInitialJuzForBrowser(juzNumber);
    setActiveTab('library');
  };

  const handleNavigateToBookmark = (bookmark: Bookmark) => {
    if (bookmark.type === 'surah') {
      setInitialSurahForBrowser(bookmark.number);
    } else {
      setInitialJuzForBrowser(bookmark.number);
    }
    setActiveTab('library');
  };

  const renderNameEntry = () => (
    <div className="min-h-screen theme-bg flex flex-col items-center justify-center p-4 relative overflow-hidden islamic-pattern">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-soft-gold/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-quiet-green/5 rounded-full blur-[120px] animate-pulse"></div>
      
      <div className="max-w-4xl w-full relative z-10 space-y-16 animate-in">
        <div className="text-center space-y-8">
          <div className="relative inline-block group">
            <div className="absolute -inset-1 bg-gradient-to-r from-soft-gold to-emerald-500 rounded-[3.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative px-16 py-10 itqan-logo-seal rounded-[3rem] items-center justify-center mx-auto transition-all hover:scale-105 duration-500 shadow-2xl flex border-4 border-soft-gold/50">
              <span className="text-white font-bold text-7xl quran-font tracking-wider drop-shadow-lg">إتقان</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-6xl md:text-8xl font-black text-quiet-green tracking-tight leading-tight">
              مرحباً بك في <span className="brand-text-gradient">عصر الإتقان</span>
            </h2>
            <p className="theme-text-muted text-xl md:text-2xl font-medium max-w-xl mx-auto leading-relaxed">
              بوابتك الذكية لصحبة القرآن الكريم بتصميم يعانق الجمال والسكينة
            </p>
          </div>
        </div>

        <div className="theme-card glass-effect rounded-[4.5rem] border shadow-[0_60px_120px_-20px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col md:flex-row items-stretch backdrop-blur-3xl border-white/40">
           <div className="md:w-5/12 bg-quiet-green/5 p-12 md:p-16 border-b md:border-b-0 md:border-l theme-border flex flex-col justify-between space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 bg-white text-soft-gold px-6 py-2.5 rounded-full text-sm font-black shadow-sm border border-soft-gold/10">
                  <ShieldCheck size={18} /> سجل النور المعتمد
                </div>
                <h3 className="text-4xl font-black theme-text leading-tight">رفيق الدرب الخالد</h3>
                <p className="theme-text-muted leading-relaxed text-lg font-medium">
                  الاسم في رحلة القرآن ليس مجرد تعريف، بل هو <span className="text-quiet-green font-bold">بصمتك في مدينة النور</span>. سيرافقك في كل إنجاز، ويحفزك عند كل ختمة.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-6 items-start group">
                  <div className="w-14 h-14 bg-white rounded-[1.2rem] flex items-center justify-center text-soft-gold shadow-md shrink-0 border border-slate-100 group-hover:rotate-12 transition-transform">
                    <Star size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold theme-text text-lg">مقام الإتقان</h4>
                    <p className="text-sm theme-text-muted mt-1 leading-normal">تدرج في مراتب الحفاظ باسمك المفضل.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start group">
                  <div className="w-14 h-14 bg-white rounded-[1.2rem] flex items-center justify-center text-soft-gold shadow-md shrink-0 border border-slate-100 group-hover:-rotate-12 transition-transform">
                    <Compass size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold theme-text text-lg">رحلة موجهة</h4>
                    <p className="text-sm theme-text-muted mt-1 leading-normal">ذكاء اصطناعي يفهم تقدمك ويناديك باسمك.</p>
                  </div>
                </div>
              </div>
           </div>

           <div className="md:w-7/12 p-12 md:p-20 flex flex-col justify-center items-center text-center space-y-12 relative">
              <div className="space-y-4">
                <div className="w-24 h-24 bg-emerald-50 text-quiet-green rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-quiet-green/20 animate-float shadow-inner">
                  <UserCircle size={48} strokeWidth={1.5} />
                </div>
                <h4 className="text-3xl font-black theme-text">كيف نحب أن نناديك؟</h4>
                <p className="text-sm theme-text-muted font-bold">الاسم الذي ستفخر به في لوحات الشرف</p>
              </div>

              <div className="w-full space-y-8 max-w-md">
                <div className="relative group">
                   <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
                     <PenTool className="text-slate-300 group-focus-within:text-soft-gold transition-colors" size={28} />
                   </div>
                   <input 
                      type="text" 
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="اكتب اسمك هنا..."
                      className="w-full bg-white/50 theme-border border-2 rounded-[3rem] py-8 pr-20 pl-10 outline-none focus:border-soft-gold focus:bg-white focus:ring-[15px] ring-soft-gold/5 transition-all text-3xl font-bold text-slate-800 shadow-xl placeholder:text-slate-300 placeholder:font-normal"
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                   />
                </div>
                
                <button 
                  onClick={handleSaveName} 
                  disabled={!tempName.trim()} 
                  className="w-full flex items-center justify-center gap-4 bg-quiet-green text-white py-8 rounded-[3rem] font-black text-3xl shadow-[0_25px_50px_-12px_rgba(6,78,59,0.5)] hover:bg-emerald-900 hover:-translate-y-2 active:scale-95 transition-all disabled:opacity-30 disabled:translate-y-0 group"
                >
                  دخول التطبيق <ArrowLeft size={32} className="group-hover:-translate-x-2 transition-transform" />
                </button>
              </div>

              <div className="pt-6">
                 <p className="text-xs theme-text-muted flex items-center gap-2 justify-center font-black tracking-wide uppercase opacity-60">
                   <Lock size={12} /> بيئة آمنة • خصوصية تامة • بياناتك ملكك
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (!userProgress) return null;

    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} userProgress={userProgress} onNavigateToBookmark={handleNavigateToBookmark} />;
      case 'journey': return <JourneyMap onEnterCity={handleNavigateToJuz} userProgress={userProgress} />;
      case 'competitions': return <QuranCompetitions />;
      case 'recite': return <RecitationRoom />;
      case 'library': return (
        <QuranBrowser 
          reciters={reciters} 
          initialJuz={initialJuzForBrowser} 
          initialSurah={initialSurahForBrowser}
          clearInitialJuz={() => setInitialJuzForBrowser(null)} 
          clearInitialSurah={() => setInitialSurahForBrowser(null)}
          userProgress={userProgress}
          onUpdateProgress={handleUpdateProgress}
        />
      );
      case 'reciters': return <RecitersList reciters={reciters} />;
      case 'azkar': return <AzkarList />;
      case 'settings': return <Settings userProgress={userProgress} onUpdateProgress={handleUpdateProgress} />;
      case 'admin': 
        if (userProgress.role !== 'admin') {
          return (
            <div className="h-screen flex flex-col items-center justify-center p-10 text-center space-y-6 theme-bg">
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center"><Lock size={48} /></div>
              <h3 className="text-3xl font-black theme-text">منطقة محظورة</h3>
              <p className="theme-text-muted font-medium">عذراً، لوحة التحكم مخصصة للمسؤولين فقط.</p>
              <button onClick={() => setActiveTab('dashboard')} className="bg-quiet-green text-white px-8 py-3 rounded-2xl font-bold">العودة للرئيسية</button>
            </div>
          );
        }
        return <AdminPanel reciters={reciters} setReciters={setReciters} userProgress={userProgress} />;
      case 'profile': return (
        <div className="p-8 max-w-2xl mx-auto space-y-6">
          <div className="theme-card p-12 rounded-[4rem] border shadow-sm text-center">
            <div className="w-32 h-32 bg-emerald-100 rounded-[2.5rem] mx-auto mb-6 flex items-center justify-center text-emerald-600 text-5xl font-black shadow-inner border border-emerald-50">{userProgress.userName.charAt(0)}</div>
            <h3 className="text-4xl font-black theme-text leading-tight">{userProgress.userName}</h3>
            <p className="theme-text-muted text-lg mt-2 font-bold">{userProgress.role === 'admin' ? 'مدير المنصة الملكي' : 'خادم القرآن في مدينة النور'}</p>
          </div>
        </div>
      );
      default: return <Dashboard setActiveTab={setActiveTab} userProgress={userProgress} onNavigateToBookmark={handleNavigateToBookmark} />;
    }
  };

  if (loadingUser) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center text-center text-quiet-green gap-10 theme-bg islamic-pattern">
        <div className="relative">
          <div className="absolute inset-0 bg-soft-gold/20 rounded-[2.5rem] blur-2xl animate-pulse"></div>
          <div className="px-12 py-10 itqan-logo-seal rounded-[2.5rem] flex items-center justify-center relative z-10 border-4 border-soft-gold animate-bounce">
            <span className="text-white font-bold text-4xl quran-font">إتقان</span>
          </div>
        </div>
        <div className="space-y-4">
          <Loader2 size={48} className="animate-spin mx-auto text-soft-gold" />
          <p className="text-2xl font-black theme-text tracking-wide">جاري فتح آفاق النور...</p>
        </div>
      </div>
    );
  }

  if (userProgress && !userProgress.userName) {
    return renderNameEntry();
  }

  return (
    <>
      {showWelcomeOverlay && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 glass-effect backdrop-blur-3xl bg-white/40">
          <div className="bg-white w-full max-w-3xl rounded-[5rem] p-16 text-center shadow-[0_80px_160px_rgba(0,0,0,0.3)] relative overflow-hidden border-t-[12px] border-soft-gold islamic-pattern animate-in zoom-in duration-700">
            <div className="relative z-10 space-y-12">
              <div className="px-10 py-6 itqan-logo-seal rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl border-2 border-white/20 scale-110">
                <span className="text-white font-bold text-3xl quran-font">إتقان</span>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-5xl font-black text-quiet-green tracking-tight leading-tight">أهلاً بك في واحة <span className="brand-text-gradient">النور</span></h2>
                <p className="theme-text-muted font-bold text-xl">باسم الله، نخطو معاً أولى خطوات الإتقان</p>
              </div>

              <div className="bg-emerald-50/70 p-12 rounded-[4rem] border-2 border-emerald-100/50 min-h-[200px] flex items-center justify-center shadow-inner overflow-hidden relative group">
                {loadingWelcome ? (
                  <div className="flex flex-col items-center gap-6">
                    <Loader2 className="animate-spin text-soft-gold" size={48} />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">جاري استلهام التحية الملكية...</p>
                  </div>
                ) : (
                  <p className="quran-font text-4xl md:text-5xl leading-[1.8] text-quiet-green italic text-center whitespace-pre-line px-4 animate-in fade-in slide-in-from-bottom duration-1000">
                    {welcomeMessage}
                  </p>
                )}
                <div className="absolute top-4 right-4 text-soft-gold opacity-10 group-hover:opacity-20 transition-opacity">
                   <Sparkles size={120} />
                </div>
              </div>

              <button 
                onClick={() => setShowWelcomeOverlay(false)} 
                className="w-full py-8 bg-quiet-green text-white rounded-[3.5rem] font-black text-3xl shadow-[0_30px_60px_rgba(6,78,59,0.4)] hover:bg-emerald-900 hover:-translate-y-2 transition-all active:scale-95 group"
              >
                فلنبدأ الرحلة <ArrowLeft size={32} className="inline-block mr-4 group-hover:-translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {userProgress && (
        <Layout 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          userProgress={userProgress}
          onUpdateRole={handleUpdateRole}
        >
          {renderContent()}
        </Layout>
      )}
    </>
  );
};

export default App;
