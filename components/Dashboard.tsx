import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Star, Flame, Target, BookOpen, Crown, ChevronLeft, Sparkles } from 'lucide-react';
import { getDailyMotivation } from '../services/geminiService';
import { UserProgress } from '../types';

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
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, userProgress }) => {
  const [motivation, setMotivation] = useState('يرفع الله الذين آمنوا منكم والذين أوتوا العلم درجات...');
  const [loadingMotivation, setLoadingMotivation] = useState(true);

  useEffect(() => {
    setLoadingMotivation(true);
    getDailyMotivation().then(msg => {
      if (msg) setMotivation(msg);
      setLoadingMotivation(false);
    });
  }, []);

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
      alert('عذراً، حدث خطأ أثناء محاولة المشاركة.');
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-12">
      {/* Welcome & Motivation Header */}
      <section className="bg-quiet-green rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(30,63,28,0.3)] border-b-[8px] border-soft-gold">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-12">
          <div className="space-y-8 flex-1">
            <div className="flex items-center gap-3">
               <div className="bg-soft-gold p-2.5 rounded-xl shadow-lg"><Crown size={20} className="text-white" /></div>
               <span className="text-emerald-100 text-sm font-black tracking-[0.3em] uppercase">لوحة الإنجاز الشخصية</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black mt-2 leading-[1.1] tracking-tight">سعود فهد،<br/><span className="text-soft-gold">نور قلبك</span> يزداد إشراقاً</h2>
            
            <div className="flex flex-wrap gap-4 pt-4">
               <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 flex items-center gap-3">
                  <Flame size={20} className="text-orange-400" />
                  <span className="font-bold text-sm">{userProgress.streak} يوماً من الثبات</span>
               </div>
               <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 flex items-center gap-3">
                  <Star size={20} className="text-soft-gold" />
                  <span className="font-bold text-sm">{userProgress.lightPoints.toLocaleString()} نقطة إتقان</span>
               </div>
            </div>
          </div>

          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/10 relative group hover:bg-white/10 transition-all duration-500 h-full flex flex-col justify-center">
              <div className="absolute -top-4 right-10 bg-soft-gold text-white text-[10px] font-black px-5 py-2 rounded-full shadow-lg flex items-center gap-2">
                <Sparkles size={12} /> رسالة السماء لك اليوم
              </div>
              {loadingMotivation ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-4 bg-white/20 rounded w-3/4"></div>
                  <div className="h-4 bg-white/20 rounded w-full"></div>
                  <div className="h-4 bg-white/20 rounded w-1/2"></div>
                </div>
              ) : (
                <p className="text-2xl md:text-3xl leading-[1.8] quran-font text-emerald-50 italic text-center">
                  "{motivation}"
                </p>
              )}
              <div className="mt-8 pt-8 border-t border-white/10 flex justify-center">
                <button 
                  onClick={handleShare}
                  className="text-soft-gold font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:translate-x-[-4px] transition-all">
                   مشاركة النور <ChevronLeft size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-soft-gold/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
        <div className="absolute top-1/2 right-0 opacity-5 pointer-events-none">
           <BookOpen size={400} strokeWidth={0.3} />
        </div>
      </section>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'نقاط الإتقان', value: userProgress.lightPoints.toLocaleString(), sub: '+12 اليوم', icon: Star, color: 'text-soft-gold', bg: 'bg-[#fcf8f1]', border: 'border-amber-100', tab: 'profile' },
          { label: 'أيام متتالية', value: userProgress.streak.toString(), sub: 'رقم قياسي!', icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', tab: 'profile' },
          { label: 'آيات محفوظة', value: userProgress.totalAyahsMemorized.toLocaleString(), sub: '٨٥٪ من جزء عم', icon: BookOpen, color: 'text-quiet-green', bg: 'bg-emerald-50', border: 'border-emerald-100', tab: 'journey' },
          { label: 'إنجاز الأسبوع', value: '85%', sub: 'مستوى متفوق', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', tab: 'competitions' },
        ].map((stat, i) => (
          <button 
            key={i} 
            onClick={() => setActiveTab(stat.tab)}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden text-right">
            <div className={`w-16 h-16 rounded-[1.5rem] ${stat.bg} ${stat.color} flex items-center justify-center mb-8 transition-transform group-hover:scale-110 shadow-inner border ${stat.border}`}>
              <stat.icon size={32} strokeWidth={2.5} />
            </div>
            <div className="space-y-2 relative z-10">
              <span className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</span>
              <p className="text-4xl font-black text-slate-800 tracking-tight">{stat.value}</p>
              <p className={`text-xs font-bold ${stat.color} opacity-80`}>{stat.sub}</p>
            </div>
            <div className="absolute bottom-[-20px] right-[-20px] opacity-[0.03] group-hover:opacity-10 transition-opacity">
               <stat.icon size={120} />
            </div>
          </button>
        ))}
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-slate-800">بيان العزيمة</h3>
              <p className="text-slate-400 font-medium">تحليل دقيق لنشاطك اليومي في الحفظ</p>
            </div>
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
               <button className="px-6 py-2 bg-white text-quiet-green shadow-sm rounded-xl text-xs font-black">آخر أسبوع</button>
               <button className="px-6 py-2 text-slate-400 text-xs font-black">آخر شهر</button>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLines" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a059" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLines2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3f1c" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1e3f1c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold', fill: '#94a3b8'}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold', fill: '#94a3b8'}} dx={-15} />
                <Tooltip 
                  cursor={{stroke: '#e2e8f0', strokeWidth: 2}}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '20px' }} 
                  labelStyle={{ fontWeight: 'black', marginBottom: '8px', color: '#1e3f1c', fontSize: '16px' }}
                />
                <Area type="monotone" dataKey="lines" stroke="#c5a059" strokeWidth={6} fillOpacity={1} fill="url(#colorLines)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Up Next / Challenges */}
        <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-8">
           <h3 className="text-2xl font-black text-slate-800">تحديات الحافظ</h3>
           <div className="space-y-4">
              {[
                { title: 'وسام الثبات', progress: 75, target: '7 أيام متواصلة', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
                { title: 'بطل جزء عم', progress: 92, target: 'إكمال الجزء 30', icon: Crown, color: 'text-soft-gold', bg: 'bg-amber-50' },
                { title: 'سيد المراجعة', progress: 40, target: 'مراجعة 50 آية', icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              ].map((challenge, i) => (
                <div key={i} className="p-6 rounded-3xl border border-slate-50 bg-slate-50/30 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${challenge.bg} ${challenge.color} flex items-center justify-center shadow-sm`}>
                       <challenge.icon size={22} />
                    </div>
                    <div>
                       <p className="font-black text-slate-800 text-sm">{challenge.title}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{challenge.target}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-400">
                       <span>{challenge.progress}%</span>
                       <span>المسافة المتبقية</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                       <div className={`h-full ${challenge.color.replace('text', 'bg')} transition-all duration-1000`} style={{ width: `${challenge.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
           </div>
           <button 
             onClick={() => setActiveTab('competitions')}
             className="w-full py-5 bg-quiet-green text-white rounded-2xl font-black shadow-xl hover:shadow-emerald-900/20 transition-all flex items-center justify-center gap-3">
             استكشف جميع المسابقات <ChevronLeft size={18} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;