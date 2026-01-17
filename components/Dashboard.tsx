
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Star, Flame, Target, BookOpen, Crown, ChevronLeft, Sparkles, MapPin, Loader2, Navigation, Heart, Bookmark as BookmarkIcon } from 'lucide-react';
import { getDailyMotivation, findNearbyMosques } from '../services/geminiService';
import { UserProgress, Bookmark } from '../types';

const data = [
  { name: 'الأحد', lines: 5 },
  { name: 'الاثنين', lines: 12 },
  { name: 'الثلاثاء', lines: 8 },
  { name: 'الأربعاء', lines: 15 },
  { name: 'الخميس', lines: 10 },
  { name: 'الجمعة', lines: 5 },
  { name: 'السبت', lines: 20 },
];

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  userProgress: UserProgress;
  onNavigateToBookmark: (bookmark: Bookmark) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, userProgress, onNavigateToBookmark }) => {
  const [motivation, setMotivation] = useState('يرفع الله الذين آمنوا منكم والذين أوتوا العلم درجات...');
  const [loadingMotivation, setLoadingMotivation] = useState(true);
  
  const [mosques, setMosques] = useState<{ text: string, links: any[] } | null>(null);
  const [loadingMosques, setLoadingMosques] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingMotivation(true);
    getDailyMotivation().then(msg => {
      if (msg) setMotivation(msg);
      setLoadingMotivation(false);
    });
  }, []);

  const handleFetchMosques = () => {
    if (!navigator.geolocation) {
      setLocationError("المتصفح لا يدعم تحديد الموقع");
      return;
    }

    setLoadingMosques(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const result = await findNearbyMosques(position.coords.latitude, position.coords.longitude);
        if (result) {
          setMosques(result);
        } else {
          setLocationError("فشل العثور على مساجد قريبة");
        }
        setLoadingMosques(false);
      },
      (err) => {
        setLocationError("يرجى تفعيل صلاحية الموقع للعثور على أقرب المساجد");
        setLoadingMosques(false);
      }
    );
  };

  const handleShare = async () => {
    const shareData = {
      title: 'رسالة السماء لك اليوم من تطبيق إتقان',
      text: `"${motivation}"\n\n- من تطبيق إتقان لتعلم القرآن`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        alert('تم نسخ الرسالة إلى الحافظة!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="p-6 md:p-12 space-y-16 animate-in">
      {/* Welcome & Motivation Header */}
      <section className="bg-quiet-green rounded-[4.5rem] p-12 md:p-24 text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(6,78,59,0.3)] border-b-[10px] border-soft-gold">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-16">
          <div className="space-y-10 flex-1">
            <div className="flex items-center gap-3">
               <div className="bg-soft-gold/20 p-3 rounded-2xl border border-soft-gold/30"><Crown size={24} className="text-soft-gold" /></div>
               <span className="text-emerald-100 text-sm font-black tracking-[0.4em] uppercase">لوحة الإنجاز الملكية</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black mt-2 leading-[1] tracking-tight">
              {userProgress.userName}،<br/>
              <span className="brand-text-gradient">نور قلبك</span> يزداد إشراقاً
            </h2>
            
            <div className="flex flex-wrap gap-6 pt-4">
               <div className="bg-white/5 backdrop-blur-xl px-8 py-4 rounded-[2rem] border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-all">
                  <Flame size={24} className="text-orange-400" />
                  <span className="font-black text-lg">{userProgress.streak} يوماً من الثبات</span>
               </div>
               <div className="bg-white/5 backdrop-blur-xl px-8 py-4 rounded-[2rem] border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-all">
                  <Star size={24} className="text-soft-gold" />
                  <span className="font-black text-lg">{userProgress.lightPoints.toLocaleString()} نقطة إتقان</span>
               </div>
            </div>

            {userProgress.lastBookmark && (
              <div className="pt-8">
                <button 
                  onClick={() => onNavigateToBookmark(userProgress.lastBookmark!)}
                  className="bg-soft-gold text-white px-10 py-5 rounded-[2.5rem] font-black text-xl flex items-center gap-4 shadow-2xl hover:scale-105 transition-all group"
                >
                  <BookmarkIcon size={24} className="group-hover:animate-bounce" />
                  أكمل من حيث توقفت ({userProgress.lastBookmark.name})
                </button>
              </div>
            )}
          </div>

          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white p-12 rounded-[3.5rem] relative group transition-all duration-700 h-full flex flex-col justify-center shadow-2xl">
              <div className="absolute -top-4 right-10 bg-soft-gold text-white text-[10px] font-black px-6 py-2.5 rounded-full shadow-xl flex items-center gap-2 border-2 border-white">
                <Sparkles size={14} /> رسالة السماء لك اليوم
              </div>
              <div className="text-quiet-green">
                {loadingMotivation ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-5 bg-slate-100 rounded-full w-3/4"></div>
                    <div className="h-5 bg-slate-100 rounded-full w-full"></div>
                    <div className="h-5 bg-slate-100 rounded-full w-1/2"></div>
                  </div>
                ) : (
                  <p className="text-3xl md:text-4xl leading-[1.8] quran-font text-quiet-green italic text-center whitespace-pre-line">
                    "{motivation}"
                  </p>
                )}
              </div>
              <div className="mt-10 pt-8 border-t border-slate-100 flex justify-center">
                <button 
                  onClick={handleShare}
                  className="text-soft-gold font-black text-sm uppercase tracking-[0.2em] flex items-center gap-2 hover:translate-x-[-6px] transition-all">
                   مشاركة النور <ChevronLeft size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-soft-gold/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full translate-y-1/2 translate-x-1/2 blur-[120px]"></div>
        <div className="absolute top-1/2 right-10 opacity-5 pointer-events-none">
           <BookOpen size={500} strokeWidth={0.2} />
        </div>
      </section>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
        {[
          { label: 'نقاط الإتقان', value: userProgress.lightPoints.toLocaleString(), sub: '+12 اليوم', icon: Star, color: 'text-soft-gold', bg: 'bg-amber-50', border: 'border-amber-100', tab: 'profile' },
          { label: 'أيام متتالية', value: userProgress.streak.toString(), sub: 'رقم قياسي!', icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', tab: 'profile' },
          { label: 'آيات محفوظة', value: userProgress.totalAyahsMemorized.toLocaleString(), sub: '٨٥٪ من جزء عم', icon: BookOpen, color: 'text-quiet-green', bg: 'bg-emerald-50', border: 'border-emerald-100', tab: 'journey' },
          { label: 'إنجاز الأسبوع', value: '85%', sub: 'مستوى متفوق', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', tab: 'competitions' },
        ].map((stat, i) => (
          <button 
            key={i} 
            onClick={() => setActiveTab(stat.tab)}
            className="theme-card p-12 rounded-[4rem] border shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 group relative overflow-hidden text-right">
            <div className={`w-20 h-20 rounded-[2rem] ${stat.bg} ${stat.color} flex items-center justify-center mb-10 transition-transform group-hover:scale-110 shadow-inner border ${stat.border}`}>
              <stat.icon size={36} strokeWidth={2.5} />
            </div>
            <div className="space-y-3 relative z-10">
              <span className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">{stat.label}</span>
              <p className="text-5xl font-black theme-text tracking-tighter">{stat.value}</p>
              <p className={`text-sm font-bold ${stat.color} opacity-80`}>{stat.sub}</p>
            </div>
            <div className="absolute bottom-[-30px] right-[-30px] opacity-[0.02] group-hover:opacity-10 transition-opacity">
               <stat.icon size={160} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
