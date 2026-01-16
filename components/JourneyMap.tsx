import React from 'react';
import { CITIES } from './constants';
import { Lock, CheckCircle, ChevronLeft, Sparkles, MapPin } from 'lucide-react';
import { UserProgress } from '../types';

interface JourneyMapProps {
  onEnterCity: (juzNumber: number) => void;
  userProgress: UserProgress;
}

const UNLOCK_THRESHOLDS = [0, 500, 1500, 3000, 5000];

const JourneyMap: React.FC<JourneyMapProps> = ({ onEnterCity, userProgress }) => {
  return (
    <div className="p-6 md:p-12 min-h-screen bg-[#fdfcf9]">
      <div className="max-w-5xl mx-auto">
        <header className="mb-20 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-soft-gold px-6 py-2 rounded-full border border-soft-gold/20 shadow-sm animate-float">
            <Sparkles size={18} />
            <span className="text-sm font-black uppercase tracking-widest">خريطة الإتقان</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-quiet-green tracking-tight">رحلة الحافظ</h2>
          <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            خمس مدن من النور، آلاف الخطوات نحو الخاتمة. كل مدينة تفتح لك آفاقاً جديدة من طمأنينة الحفظ.
          </p>
        </header>

        <div className="relative">
          {/* Animated Connecting path line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-gradient-to-b from-emerald-100 via-soft-gold/20 to-emerald-100 -translate-x-1/2 -z-10 hidden md:block rounded-full"></div>

          <div className="space-y-24">
            {CITIES.map((city, index) => {
              const isUnlocked = userProgress.totalAyahsMemorized >= UNLOCK_THRESHOLDS[index];
              return (
              <div 
                key={city.id} 
                className={`flex flex-col md:flex-row items-center gap-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* City Node Visual */}
                <div className="relative group cursor-pointer z-10">
                  <div className={`w-32 h-32 md:w-44 md:h-44 rounded-[3rem] border-8 flex items-center justify-center transition-all duration-700 ${
                    isUnlocked 
                    ? 'bg-white border-emerald-500 shadow-[0_30px_60px_-15px_rgba(16,185,129,0.2)] scale-110 rotate-3 group-hover:rotate-0' 
                    : 'bg-slate-100 border-slate-200 grayscale opacity-60'
                  }`}>
                    <div className={`w-24 h-24 md:w-32 md:h-32 rounded-[2.2rem] flex items-center justify-center ${
                      isUnlocked ? 'bg-emerald-50' : 'bg-slate-200'
                    }`}>
                      {isUnlocked ? (
                        <div className="relative">
                           <CheckCircle className="text-emerald-600" size={56} strokeWidth={2.5} />
                           <div className="absolute -inset-4 bg-emerald-400/20 rounded-full animate-ping"></div>
                        </div>
                      ) : (
                        <Lock className="text-slate-400" size={40} />
                      )}
                    </div>
                  </div>
                  
                  {isUnlocked && (
                    <div className="absolute -top-4 -right-4 w-14 h-14 bg-soft-gold rounded-2xl flex items-center justify-center border-4 border-white shadow-xl animate-bounce">
                      <MapPin className="text-white" size={24} />
                    </div>
                  )}
                  
                  {/* City Rank Badge */}
                  <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-black text-xs border-2 shadow-sm ${
                    isUnlocked ? 'bg-quiet-green text-white border-soft-gold' : 'bg-slate-200 text-slate-400 border-slate-300'
                  }`}>
                    المرحلة {index + 1}
                  </div>
                </div>

                {/* City Info Card */}
                <div className={`flex-1 w-full text-center md:text-right p-10 md:p-14 rounded-[4rem] border transition-all duration-500 relative overflow-hidden ${
                  isUnlocked 
                  ? 'bg-white border-emerald-100 shadow-2xl shadow-emerald-900/5 hover:-translate-y-2' 
                  : 'bg-slate-50 border-slate-100 opacity-60'
                }`}>
                  {isUnlocked && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                  )}

                  <div className="relative z-10 space-y-4">
                    <h3 className={`text-3xl md:text-4xl font-black ${isUnlocked ? 'text-quiet-green' : 'text-slate-400'}`}>
                      {city.name}
                    </h3>
                    <p className="text-slate-500 text-lg leading-relaxed font-medium">
                      {city.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-6">
                      <div className={`px-5 py-2 rounded-2xl text-sm font-black flex items-center gap-2 ${
                        isUnlocked ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-500'
                      }`}>
                        الأجزاء: {city.juzRange[0]} - {city.juzRange[1]}
                      </div>
                      
                      {isUnlocked ? (
                        <button 
                          onClick={() => onEnterCity(city.juzRange[0])}
                          className="flex items-center gap-2 bg-soft-gold text-white px-8 py-3 rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-900/10"
                        >
                          دخول المدينة <ChevronLeft size={20} />
                        </button>
                      ) : (
                        <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">تفتح بعد إتمام المرحلة السابقة</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>

        <footer className="mt-32 p-12 bg-quiet-green rounded-[4rem] text-center text-white relative overflow-hidden shadow-2xl border-b-[8px] border-soft-gold">
           <div className="relative z-10 space-y-4">
              <h4 className="text-3xl font-black">طموحك ليس له حدود</h4>
              <p className="text-emerald-100 opacity-70">كل يوم تحفظ فيه آية, تقترب فيه من "جنة الحفاظ" الموعودة.</p>
           </div>
           <div className="absolute bottom-0 right-0 p-10 opacity-10">
              <Sparkles size={150} />
           </div>
        </footer>
      </div>
    </div>
  );
};

export default JourneyMap;