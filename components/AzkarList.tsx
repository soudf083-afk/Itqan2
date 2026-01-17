
import React, { useState, useEffect } from 'react';
import { AZKAR } from './constants';
import { Share2, Copy, BookOpen, RotateCcw, Check, Sparkles, Bell, BellOff, Clock, Calendar, X } from 'lucide-react';

const AzkarList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(AZKAR[0].category);
  const [remindersEnabled, setRemindersEnabled] = useState<{ [key: string]: boolean }>({
    "أذكار الصباح": false,
    "أذكار المساء": false,
  });
  const [showSettings, setShowSettings] = useState(false);
  
  const currentAzkar = AZKAR.find(a => a.category === selectedCategory);
  
  // Track counts locally for the current session
  const [counts, setCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Reset or initialize counts when category changes
    const initialCounts: { [key: string]: number } = {};
    currentAzkar?.items.forEach((item, idx) => {
      initialCounts[`${selectedCategory}-${idx}`] = item.count;
    });
    setCounts(initialCounts);
  }, [selectedCategory]);

  const handleDecrement = (id: string) => {
    setCounts(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1)
    }));
  };

  const handleReset = (id: string, initialCount: number) => {
    setCounts(prev => ({
      ...prev,
      [id]: initialCount
    }));
  };

  const toggleReminder = async (category: string) => {
    const isCurrentlyEnabled = remindersEnabled[category];

    // If we are disabling, just disable it
    if (isCurrentlyEnabled) {
      setRemindersEnabled(prev => ({ ...prev, [category]: false }));
      return;
    }

    // If we are enabling, check for browser support and permissions
    if (!("Notification" in window)) {
      alert("عذراً، متصفحك الحالي لا يدعم خاصية الإشعارات.");
      return;
    }

    try {
      // Show immediate feedback by toggling (optimistic update)
      // but only if permission is potentially available
      if (Notification.permission === "granted") {
        setRemindersEnabled(prev => ({ ...prev, [category]: true }));
      } else if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setRemindersEnabled(prev => ({ ...prev, [category]: true }));
        } else {
          alert("لتفعيل التنبيهات، يرجى السماح بالإشعارات من إعدادات المتصفح.");
        }
      } else {
        alert("الإشعارات محظورة في متصفحك. يرجى تفعيلها من إعدادات الموقع لتلقي التنبيهات.");
      }
    } catch (error) {
      console.error("Notification toggle error:", error);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header & Reminder Management */}
      <header className="relative flex flex-col md:flex-row justify-between items-center gap-8 theme-card p-10 rounded-[3.5rem] border shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20"></div>
        
        <div className="text-center md:text-right relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-quiet-green px-4 py-1.5 rounded-full text-xs font-black mb-4 border border-emerald-100">
            <Sparkles size={14} className="text-soft-gold" /> حصن المسلم
          </div>
          <h2 className="text-4xl font-black theme-text">الأذكار اليومية</h2>
          <p className="theme-text-muted mt-2 text-lg font-medium">بذكر الله تطمئن القلوب وتنشرح الصدور</p>
        </div>

        <div className="flex gap-4 relative z-10">
           <button 
             onClick={() => setShowSettings(!showSettings)}
             className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-black transition-all shadow-lg ${
               showSettings ? 'bg-soft-gold text-white' : 'bg-quiet-green text-white hover:bg-emerald-800'
             }`}
           >
             {showSettings ? <X size={20} /> : <Bell size={20} className={Object.values(remindersEnabled).some(v => v) ? 'animate-bounce' : ''} />}
             تنبيهات الأذكار
           </button>
        </div>
      </header>

      {/* Quick Settings Panel */}
      {showSettings && (
        <div className="theme-card p-8 rounded-[3rem] border-2 border-soft-gold/20 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top duration-500">
          <div className="space-y-4">
             <h4 className="font-black text-quiet-green flex items-center gap-2">
               <Clock size={18} className="text-soft-gold" /> جدولة التنبيهات
             </h4>
             <p className="text-xs theme-text-muted font-bold">فعل التنبيهات لتذكيرك في الأوقات الفاضلة</p>
             
             <div className="space-y-3">
               {["أذكار الصباح", "أذكار المساء"].map(cat => (
                 <div key={cat} className="flex items-center justify-between p-5 bg-slate-50/50 theme-border border rounded-2xl transition-colors hover:bg-slate-50">
                    <span className="font-bold theme-text">{cat}</span>
                    <button 
                      onClick={() => toggleReminder(cat)}
                      className={`w-14 h-7 rounded-full relative transition-all duration-300 flex items-center px-1 cursor-pointer ${
                        remindersEnabled[cat] ? 'bg-quiet-green justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 transform"></div>
                    </button>
                 </div>
               ))}
             </div>
          </div>
          <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 flex flex-col items-center justify-center text-center gap-3">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-soft-gold shadow-sm">
                <Calendar size={24} />
             </div>
             <p className="text-sm font-bold text-quiet-green">التنبيهات تساعدك على بناء عادة يومية لا تنقطع</p>
             <button className="text-xs font-black text-soft-gold underline hover:text-quiet-green transition-colors">تغيير أوقات التنبيه</button>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-3 justify-start md:justify-center overflow-x-auto pb-4 no-scrollbar">
        {AZKAR.map((group) => (
          <button
            key={group.category}
            onClick={() => setSelectedCategory(group.category)}
            className={`px-8 py-4 rounded-[1.5rem] whitespace-nowrap text-sm font-black transition-all duration-300 border-2 ${
              selectedCategory === group.category
                ? 'bg-quiet-green border-quiet-green text-white shadow-xl -translate-y-1'
                : 'theme-card theme-text-muted border-slate-100 hover:border-soft-gold/30 hover:text-quiet-green'
            }`}
          >
            {group.category}
          </button>
        ))}
      </div>

      {/* Azkar Items List */}
      <div className="grid grid-cols-1 gap-8">
        {currentAzkar?.items.map((zikr, idx) => {
          const id = `${selectedCategory}-${idx}`;
          const currentCount = counts[id] ?? zikr.count;
          const isDone = currentCount === 0;

          return (
            <div 
              key={idx} 
              className={`group theme-card rounded-[3rem] p-8 md:p-12 border transition-all duration-500 relative overflow-hidden ${
                isDone ? 'border-soft-gold bg-amber-50/10' : 'theme-border shadow-sm hover:shadow-2xl hover:border-soft-gold/20'
              }`}
            >
              {/* Progress indicator */}
              <div className="absolute top-0 left-0 w-2 h-full bg-slate-50 overflow-hidden">
                <div 
                  className="w-full bg-soft-gold transition-all duration-700" 
                  style={{ height: `${((zikr.count - currentCount) / zikr.count) * 100}%` }}
                />
              </div>

              {zikr.type && (
                <span className="absolute top-8 left-8 text-[10px] font-black uppercase tracking-[0.2em] text-soft-gold bg-white px-4 py-2 rounded-full border border-soft-gold/10 shadow-sm">
                  {zikr.type}
                </span>
              )}

              <div className="flex flex-col gap-10">
                <div className="relative">
                  <p className="quran-font text-3xl md:text-4xl leading-[2] theme-text text-center md:text-right px-4 md:px-12 select-none">
                    {zikr.text}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/50 p-6 rounded-[2.5rem] border theme-border">
                  <div className="flex gap-3">
                    <button title="مشاركة" className="w-14 h-14 flex items-center justify-center theme-card text-slate-400 rounded-2xl hover:bg-emerald-50 hover:text-quiet-green transition-all shadow-sm border theme-border">
                      <Share2 size={22} />
                    </button>
                    <button title="نسخ" className="w-14 h-14 flex items-center justify-center theme-card text-slate-400 rounded-2xl hover:bg-emerald-50 hover:text-quiet-green transition-all shadow-sm border theme-border">
                      <Copy size={22} />
                    </button>
                    <button 
                      onClick={() => handleReset(id, zikr.count)}
                      title="إعادة التكرار" 
                      className="w-14 h-14 flex items-center justify-center theme-card text-slate-400 rounded-2xl hover:bg-amber-50 hover:text-soft-gold transition-all shadow-sm border theme-border"
                    >
                      <RotateCcw size={22} />
                    </button>
                  </div>

                  <div className="flex items-center gap-10">
                    <div className="flex flex-col items-center md:items-end">
                      <span className="text-[10px] font-black theme-text-muted uppercase tracking-widest mb-1">المتبقي</span>
                      <div className="flex items-center gap-2">
                         <span className={`text-4xl font-black ${isDone ? 'text-soft-gold' : 'theme-text'}`}>
                           {currentCount}
                         </span>
                         <span className="text-sm theme-text-muted font-bold">/ {zikr.count}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDecrement(id)}
                      disabled={isDone}
                      className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all shadow-2xl active:scale-90 overflow-hidden cursor-pointer ${
                        isDone 
                        ? 'bg-soft-gold text-white cursor-default scale-110' 
                        : 'bg-white border-[6px] border-quiet-green text-quiet-green hover:bg-emerald-50'
                      }`}
                    >
                      {isDone ? (
                        <Check size={44} className="animate-in zoom-in duration-500" strokeWidth={3} />
                      ) : (
                        <>
                          <span className="text-4xl font-black leading-none">{currentCount}</span>
                          <span className="text-[10px] font-black uppercase mt-1">تكرار</span>
                        </>
                      )}
                      {!isDone && (
                        <div className="absolute inset-0 rounded-full border-4 border-quiet-green opacity-10 animate-ping" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info Section */}
      <footer className="theme-card p-12 rounded-[3.5rem] border text-center space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-24 bg-soft-gold/5 rounded-full blur-2xl"></div>
        <BookOpen className="mx-auto text-soft-gold mb-2" size={32} />
        <p className="text-sm theme-text-muted font-medium leading-relaxed max-w-2xl mx-auto">
          جميع الأذكار مأخوذة من كتاب <span className="text-quiet-green font-bold">"حصن المسلم"</span> من أذكار الكتاب والسنة، للشيخ سعيد بن علي بن وهف القحطاني رحمه الله.
        </p>
      </footer>
    </div>
  );
};

export default AzkarList;
