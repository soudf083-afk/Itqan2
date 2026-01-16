import React, { useState, useRef, useEffect } from 'react';
import { SURAHS } from './constants';
import { Play, Pause, Headphones, Search, X, Volume2, Loader2, User, Music, AlertCircle } from 'lucide-react';

interface RecitersListProps {
  reciters: any[];
}

const RecitersList: React.FC<RecitersListProps> = ({ reciters }) => {
  const [selectedReciter, setSelectedReciter] = useState<any>(null);
  const [selectedSurah, setSelectedSurah] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [surahSearch, setSurahSearch] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredSurahs = SURAHS.filter(s => s.name.includes(surahSearch));

  // Function to handle playing a specific surah by a specific reciter
  const handlePlay = async (reciter: any, surah: any) => {
    setSelectedReciter(reciter);
    setSelectedSurah(surah);
    setLoadingAudio(true);
    setIsPlaying(false);
    setAudioError(null);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
      
      const surahNum = surah.number;
      const paddedSurahNum = String(surahNum).padStart(3, '0');
      
      const sources: string[] = [];

      // Add islamic.network sources (bitrates 128 and 64)
      sources.push(`https://cdn.islamic.network/quran/audio-surah/128/${reciter.identifier}/${surahNum}.mp3`);
      sources.push(`https://cdn.islamic.network/quran/audio-surah/64/${reciter.identifier}/${surahNum}.mp3`);
      
      // Add multiple mp3quran.net server sources if mp3quranId exists
      if (reciter.mp3quranId) {
          for (let i = 6; i <= 16; i++) {
              sources.push(`https://server${i}.mp3quran.net/${reciter.mp3quranId}/${paddedSurahNum}.mp3`);
          }
      }

      // Fallback to older identifier format
      const reciterSubId = reciter.identifier.split('.')[1];
      sources.push(`https://audio.qurancdn.com/${reciterSubId}/mp3/${paddedSurahNum}.mp3`);

      let success = false;
      for (const url of sources) {
        if (success) break;
        try {
          audioRef.current.src = url;
          audioRef.current.load();
          
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            success = true;
            setIsPlaying(true);
            setLoadingAudio(false);
          }
        } catch (err) {
          console.warn(`Source failed: ${url}`);
          continue; // Try next source
        }
      }

      if (!success) {
        setAudioError("عذراً، تلاوة هذه السورة غير متوفرة حالياً لهذا القارئ.");
        setLoadingAudio(false);
      }
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => setAudioError("تعذر استئناف التشغيل. حاول اختيار السورة مجدداً."));
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="p-4 md:p-10 space-y-12 animate-in fade-in duration-700">
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(false)} 
        onError={() => !loadingAudio && setAudioError("حدث خطأ أثناء تشغيل الملف الصوتي.")}
        className="hidden" 
      />

      {/* Header Section */}
      <header className="bg-white p-10 md:p-16 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-right">
            <h2 className="text-5xl font-black text-quiet-green tracking-tight leading-tight">أعلام القراء</h2>
            <p className="text-slate-500 text-lg mt-3 font-medium">اختر قارئك المفضل واستمع لآيات الله بأعذب الأصوات</p>
          </div>
          <div className="flex bg-emerald-50 text-quiet-green px-10 py-5 rounded-[2.5rem] border border-emerald-100 items-center gap-3 font-bold shadow-sm">
            <Headphones size={24} className="text-soft-gold" />
            تلاوات برواية حفص
          </div>
        </div>
      </header>

      {/* Reciters List - Names Only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-40">
        {reciters.map((reciter) => (
          <div 
            key={reciter.id} 
            onClick={() => setSelectedReciter(reciter)}
            className={`group relative bg-white rounded-[2.5rem] p-8 border transition-all duration-500 cursor-pointer overflow-hidden ${
              selectedReciter?.id === reciter.id 
              ? 'ring-4 ring-soft-gold/20 border-soft-gold shadow-xl -translate-y-2' 
              : 'border-slate-100 shadow-sm hover:shadow-xl hover:border-soft-gold/30 hover:-translate-y-2'
            }`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Music size={100} strokeWidth={0.5} />
            </div>

            <div className="flex flex-col h-full relative z-10">
              <div className="w-full h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100">
                <User size={32} className="text-quiet-green" />
              </div>
              
              <div className="space-y-3 flex-1">
                <h4 className="text-2xl font-bold text-slate-800 quran-font group-hover:text-quiet-green transition-colors leading-tight">
                  الشيخ {reciter.name}
                </h4>
                <div className="flex items-center gap-2">
                   <div className="h-1 w-4 bg-soft-gold rounded-full"></div>
                   <p className="text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-colors italic">{reciter.style}</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">اختر سورة</span>
                <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-soft-gold group-hover:text-soft-gold transition-all bg-slate-50">
                   <Play size={18} fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Surah Selection Modal */}
      {selectedReciter && !selectedSurah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-quiet-green/70 backdrop-blur-md" onClick={() => setSelectedReciter(null)}></div>
          <div className="bg-white w-full max-w-5xl max-h-[85vh] overflow-hidden rounded-[4rem] flex flex-col relative z-10 shadow-2xl border-t-[10px] border-soft-gold">
             <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-50/30">
                <div className="flex items-center gap-5">
                   <div className="w-20 h-20 rounded-3xl bg-emerald-100 flex items-center justify-center shadow-xl border border-emerald-200">
                     <User size={32} className="text-quiet-green" />
                   </div>
                   <div>
                      <h3 className="text-4xl font-black text-quiet-green">اختر السورة</h3>
                      <p className="text-slate-500 font-bold text-lg">بصوت الشيخ {selectedReciter.name}</p>
                   </div>
                </div>
                <div className="relative group w-full md:w-96">
                   <Search size={22} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-soft-gold transition-colors" />
                   <input 
                     type="text" 
                     placeholder="ابحث عن سورة..." 
                     value={surahSearch}
                     onChange={(e) => setSurahSearch(e.target.value)}
                     className="w-full bg-white border-2 border-slate-100 rounded-3xl py-4 pr-14 pl-6 text-lg outline-none focus:border-soft-gold transition-all shadow-sm"
                   />
                </div>
                <button onClick={() => setSelectedReciter(null)} className="hidden md:block text-slate-300 hover:text-red-500 transition-colors p-2"><X size={44}/></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 custom-scrollbar bg-white">
                {filteredSurahs.map(s => (
                  <button 
                    key={s.number} 
                    onClick={() => handlePlay(selectedReciter, s)}
                    className="p-8 rounded-[2.5rem] border-2 border-slate-50 hover:border-soft-gold hover:bg-amber-50/50 transition-all text-center group relative overflow-hidden flex flex-col items-center justify-center"
                  >
                     <span className="text-[10px] font-black text-slate-300 mb-2 group-hover:text-soft-gold transition-colors uppercase tracking-widest">SURA {s.number}</span>
                     <p className="quran-font text-3xl font-bold text-slate-800 group-hover:text-quiet-green transition-colors">{s.name}</p>
                     <div className="absolute inset-0 bg-soft-gold opacity-0 group-hover:opacity-5 transition-opacity"></div>
                  </button>
                ))}
                {filteredSurahs.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-slate-400 text-xl font-bold">لم نجد سورة بهذا الاسم..</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* Global Audio Player Bar */}
      {(selectedSurah || audioError) && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-[94%] max-w-2xl bg-quiet-green text-white p-6 md:p-8 rounded-[3rem] shadow-2xl border-b-[6px] border-soft-gold animate-in slide-in-from-bottom duration-700">
           <div className="flex flex-col gap-5">
              {audioError && (
                <div className="flex items-center gap-4 bg-red-500/20 p-5 rounded-3xl text-red-100 border border-red-500/30">
                  <AlertCircle size={28} />
                  <p className="text-base font-bold">{audioError}</p>
                </div>
              )}

              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center relative">
                    {loadingAudio ? <Loader2 className="animate-spin text-soft-gold" size={32} /> : <Volume2 className="text-soft-gold" size={36} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-soft-gold uppercase tracking-widest">سورة {selectedSurah?.name}</p>
                    <p className="font-black text-xl">بصوت {selectedReciter?.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                   <button 
                    onClick={togglePlayback}
                    disabled={loadingAudio}
                    className="w-16 h-16 bg-soft-gold rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all text-white disabled:opacity-50 ring-4 ring-white/5"
                  >
                    {isPlaying ? <Pause fill="currentColor" size={28} /> : <Play fill="currentColor" size={28} className="ml-1" />}
                  </button>
                  <button onClick={() => {
                    if (audioRef.current) audioRef.current.pause();
                    setSelectedSurah(null);
                    setIsPlaying(false);
                  }} className="text-white/30 hover:text-white transition-all p-2 rounded-full">
                    <X size={28} />
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default RecitersList;