
// Explicitly import React to resolve UMD global errors
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SURAHS } from './constants';
import { BookOpen, Search, ArrowRight, Loader2, Book, List, AlignRight, Headphones, X, Volume2, AlertCircle, RefreshCw, Play, Pause, Bookmark as BookmarkIcon, Check } from 'lucide-react';
import { fetchSurahAyahs, fetchJuz } from '../services/quranService';
import { UserProgress, Bookmark } from '../types';

interface QuranBrowserProps {
  reciters: any[];
  initialJuz: number | null;
  initialSurah: number | null;
  clearInitialJuz: () => void;
  clearInitialSurah: () => void;
  userProgress: UserProgress;
  onUpdateProgress: (data: Partial<UserProgress>) => void;
}

const QuranBrowser: React.FC<QuranBrowserProps> = ({ 
  reciters, 
  initialJuz, 
  initialSurah,
  clearInitialJuz, 
  clearInitialSurah,
  userProgress,
  onUpdateProgress
}) => {
  const [view, setView] = useState<'surah' | 'juz'>('surah');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<any>(null);
  const [selectedJuz, setSelectedJuz] = useState<any>(null);
  const [ayahs, setAyahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [readerMode, setReaderMode] = useState<'mushaf' | 'list'>('mushaf');
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [showReciterPicker, setShowReciterPicker] = useState(false);
  const [reciterSearchQuery, setReciterSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentReciter, setCurrentReciter] = useState<any>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [bookmarkSaved, setBookmarkSaved] = useState(false);

  const filteredSurahs = SURAHS.filter(s => {
    const sName = String(s.name || '');
    const sNum = String(s.number || '');
    return sName.includes(searchQuery) || sNum.includes(searchQuery);
  });

  const groupedReciters = useMemo(() => {
    const filtered = (reciters || []).filter(r => {
      const rName = String(r.name || '');
      const rStyle = String(r.style || '');
      return rName.includes(reciterSearchQuery) || rStyle.includes(reciterSearchQuery);
    });
    
    return filtered.reduce((acc, r) => {
      const style = String(r.style || 'قراءات متنوعة');
      if (!acc[style]) acc[style] = [];
      acc[style].push(r);
      return acc;
    }, {} as Record<string, any[]>);
  }, [reciters, reciterSearchQuery]);

  const handleSurahClick = async (surah: any) => {
    setSelectedJuz(null);
    setSelectedSurah(surah);
    setLoading(true);
    setFetchError(null);
    const data = await fetchSurahAyahs(surah.number);
    if (data && data.ayahs) {
      setAyahs(data.ayahs);
    } else {
      setFetchError('عذراً، حدث خطأ أثناء تحميل بيانات السورة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.');
    }
    setLoading(false);
  };
  
  const handleJuzClick = async (juzNumber: number) => {
    setSelectedSurah(null);
    setAyahs([]);
    setSelectedJuz(null);
    setLoading(true);
    setFetchError(null);
    const data = await fetchJuz(juzNumber);
    if (data) {
      setSelectedJuz(data);
    } else {
      setFetchError(`عذراً، حدث خطأ أثناء تحميل بيانات الجزء ${juzNumber}. يرجى المحاولة مرة أخرى.`);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    if (initialJuz) {
      setView('juz');
      handleJuzClick(initialJuz);
      clearInitialJuz();
    }
    if (initialSurah) {
      setView('surah');
      const s = SURAHS.find(s => s.number === initialSurah);
      if (s) handleSurahClick(s);
      clearInitialSurah();
    }
  }, [initialJuz, initialSurah]);

  const pages: [string, any[]][] = useMemo(() => {
    const currentAyahs: any[] = (selectedSurah?.ayahs || selectedJuz?.ayahs || ayahs || []);
    const pageGroups: { [key: number]: any[] } = {};
    
    currentAyahs.forEach((ayah: any) => {
      if (ayah && ayah.page) {
        if (!pageGroups[ayah.page]) {
          pageGroups[ayah.page] = [];
        }
        pageGroups[ayah.page].push(ayah);
      }
    });

    return (Object.entries(pageGroups) as [string, any[]][]).sort(([a], [b]) => Number(a) - Number(b));
  }, [selectedSurah, selectedJuz, ayahs]);

  const cleanAyahText = (text: any) => {
    const textStr = String(text || '');
    const bismillah = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
    if (textStr.startsWith(bismillah)) {
      return textStr.substring(bismillah.length).trim();
    }
    return textStr;
  };
  
  const handleGoBack = () => {
    setSelectedSurah(null);
    setSelectedJuz(null);
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
    setAudioError(null);
    setCurrentReciter(null);
  }

  const handlePlayRecitation = async (reciter: any) => {
    if (!selectedSurah) return;
    setAudioError(null);
    setCurrentReciter(reciter);
    setShowReciterPicker(false);
    setAudioLoading(true);
    setIsPlaying(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      const surahNum = selectedSurah.number;
      const paddedSurahNum = String(surahNum).padStart(3, '0');
      
      const sources: string[] = [];
      sources.push(`https://cdn.islamic.network/quran/audio-surah/128/${reciter.identifier}/${surahNum}.mp3`);
      sources.push(`https://cdn.islamic.network/quran/audio-surah/64/${reciter.identifier}/${surahNum}.mp3`);
      
      if (reciter.mp3quranId) {
          for (let i = 6; i <= 16; i++) {
              sources.push(`https://server${i}.mp3quran.net/${reciter.mp3quranId}/${paddedSurahNum}.mp3`);
          }
      }

      let success = false;
      for (const url of sources) {
        if (success) break;
        try {
          audioRef.current.src = url;
          await audioRef.current.play();
          success = true;
          setIsPlaying(true);
        } catch (err) { 
            console.warn(`Source failed: ${url}`);
            continue; 
        }
      }
      setAudioLoading(false);
      if (!success) {
        setAudioError("عذراً، تعذر تشغيل سورة " + String(selectedSurah.name || '') + " لهذا القارئ.");
      }
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setAudioError("تعذر استئناف التشغيل."));
      }
    }
  };

  const handleSetBookmark = () => {
    let bookmark: Bookmark;
    if (selectedSurah) {
      bookmark = {
        type: 'surah',
        number: selectedSurah.number,
        name: selectedSurah.name
      };
    } else if (selectedJuz) {
      bookmark = {
        type: 'juz',
        number: selectedJuz.number,
        name: `الجزء ${selectedJuz.number}`
      };
    } else return;

    onUpdateProgress({ lastBookmark: bookmark });
    setBookmarkSaved(true);
    setTimeout(() => setBookmarkSaved(false), 2000);
  };

  useEffect(() => { return () => { if (audioRef.current) audioRef.current.pause(); }; }, []);

  if (selectedSurah || selectedJuz) {
    const displayData = {
      name: String(selectedSurah?.name || `الجزء ${selectedJuz?.number || ''}`),
      type: String(selectedSurah?.type || 'مجموعة سور'),
      numberOfAyahs: Number(selectedSurah?.numberOfAyahs || selectedJuz?.ayahs?.length || 0)
    };
    
    return (
      <div className="p-4 md:p-10 space-y-8 animate-in slide-in-from-left duration-700 relative">
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-5xl mx-auto w-full sticky top-0 z-30 py-4 bg-[#fdfcf9]/80 backdrop-blur-md">
          <button onClick={handleGoBack} className="flex items-center gap-3 text-quiet-green font-black bg-white border border-slate-100 px-8 py-4 rounded-[2rem] hover:bg-emerald-50 transition-all shadow-sm group">
            <ArrowRight size={22} className="group-hover:-translate-x-2 transition-transform" />
            العودة للمصحف
          </button>
          
          <div className="flex gap-4">
            <button 
              onClick={handleSetBookmark}
              className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black shadow-lg transition-all ${
                bookmarkSaved 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white text-soft-gold border-2 border-soft-gold/20 hover:border-soft-gold'
              }`}
            >
              {bookmarkSaved ? <Check size={20} /> : <BookmarkIcon size={20} />}
              {bookmarkSaved ? 'تم الحفظ' : 'ضع الفاصلة'}
            </button>

            {selectedSurah && (
              <button onClick={() => { setShowReciterPicker(true); setReciterSearchQuery(''); }} className="flex items-center gap-3 bg-soft-gold text-white px-8 py-4 rounded-[2rem] font-black shadow-lg shadow-amber-900/10 hover:scale-105 transition-all">
                <Headphones size={20} />
                {currentReciter ? 'تغيير القارئ' : 'استماع للتلاوة'}
              </button>
            )}
            <div className="flex bg-white p-1.5 rounded-[2rem] border border-slate-100 shadow-sm">
              <button onClick={() => setReaderMode('mushaf')} className={`p-3 px-8 rounded-2xl flex items-center gap-3 transition-all ${readerMode === 'mushaf' ? 'bg-quiet-green text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>
                <AlignRight size={20} />
              </button>
              <button onClick={() => setReaderMode('list')} className={`p-3 px-8 rounded-2xl flex items-center gap-3 transition-all ${readerMode === 'list' ? 'bg-quiet-green text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {showReciterPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-quiet-green/60 backdrop-blur-sm" onClick={() => setShowReciterPicker(false)}></div>
            <div className="bg-white w-full max-w-2xl rounded-[3.5rem] p-10 relative z-10 shadow-2xl border-t-8 border-soft-gold flex flex-col max-h-[90vh]">
               <button onClick={() => setShowReciterPicker(false)} className="absolute top-8 left-8 text-slate-300 hover:text-red-500 transition-colors"><X size={32} /></button>
               <div className="text-center mb-6 space-y-2">
                 <h3 className="text-3xl font-black text-quiet-green">اختر القارئ</h3>
                 <p className="text-slate-400">استمع لسورة {String(selectedSurah?.name || '')} بصوت قارئك المفضل</p>
               </div>
               
               <div className="relative mb-6">
                 <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                 <input 
                   type="text" 
                   placeholder="ابحث عن قارئ أو نمط تلاوة..." 
                   value={reciterSearchQuery}
                   onChange={(e) => setReciterSearchQuery(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pr-14 pl-6 outline-none focus:ring-4 ring-soft-gold/10 transition-all font-bold"
                 />
               </div>

               <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8">
                  {Object.entries(groupedReciters || {}).map(([style, members]) => (
                    <div key={style} className="space-y-4">
                      <h4 className="text-xs font-black text-soft-gold uppercase tracking-[0.2em] bg-amber-50 px-4 py-2 rounded-lg inline-block">{String(style)}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(members as any[]).map(reciter => (
                          <button key={reciter.id} onClick={() => handlePlayRecitation(reciter)} className="flex items-center gap-4 p-4 rounded-3xl border border-slate-100 hover:border-soft-gold hover:bg-amber-50 transition-all text-right group">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100"><Headphones size={24} className="text-quiet-green" /></div>
                            <div>
                              <p className="font-black text-slate-800 group-hover:text-quiet-green transition-colors">{String(reciter.name || '')}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{String(reciter.style || '')}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {Object.keys(groupedReciters).length === 0 && (
                    <div className="text-center py-20 text-slate-400 font-bold">لم نجد قارئاً يطابق بحثك..</div>
                  )}
               </div>
            </div>
          </div>
        )}

        {(currentReciter || audioLoading || audioError) && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl bg-quiet-green text-white p-6 rounded-[2.5rem] shadow-2xl border-b-4 border-soft-gold animate-in slide-in-from-bottom duration-500">
             <div className="flex flex-col gap-4">
                {audioError && <div className="flex items-center gap-3 bg-red-500/20 p-4 rounded-2xl text-red-200"><AlertCircle size={20} /><p className="text-sm font-bold">{String(audioError)}</p></div>}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">{audioLoading ? <Loader2 className="animate-spin text-soft-gold" /> : <Volume2 className="text-soft-gold" />}</div>
                    <div><p className="text-xs font-bold text-soft-gold uppercase tracking-widest">تلاوة سورة {String(selectedSurah?.name || '')}</p><p className="font-black text-lg">{String(currentReciter?.name || 'جاري التحميل...')}</p></div>
                  </div>
                  <div className="flex items-center gap-6">
                    <button onClick={togglePlayback} disabled={audioLoading} className="w-16 h-16 bg-soft-gold rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all text-white disabled:opacity-50">{isPlaying ? <Pause fill="currentColor" size={28} /> : <Play fill="currentColor" size={28} className="ml-1" />}</button>
                    <button onClick={() => { if (audioRef.current) audioRef.current.pause(); setCurrentReciter(null); setIsPlaying(false); setAudioError(null); }} className="text-white/40 hover:text-white transition-colors"><X size={24} /></button>
                  </div>
                </div>
             </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-12 pb-24">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-8 bg-white rounded-[4rem] border border-slate-100 shadow-2xl mushaf-shadow overflow-hidden flex flex-col transition-all hover:translate-y-[-4px]"><div className="relative"><Loader2 className="animate-spin text-quiet-green" size={80} strokeWidth={1.5} /></div><div className="text-center space-y-2"><p className="text-slate-800 font-black text-2xl">جاري تهيئة المحتوى...</p><p className="text-slate-400 font-medium">{displayData.name} • مجمع الملك فهد</p></div></div>
          ) : fetchError ? (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-8 bg-white rounded-[4rem] border-2 border-red-100 shadow-2xl mushaf-shadow p-8 text-center"><div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center"><AlertCircle className="text-red-500" size={56} /></div><div className="space-y-4"><p className="text-red-800 font-black text-3xl">حدث خطأ</p><p className="text-slate-500 font-medium max-w-md mx-auto">{String(fetchError)}</p></div><button onClick={() => selectedSurah ? handleSurahClick(selectedSurah) : handleJuzClick(selectedJuz.number)} className="flex items-center gap-3 bg-quiet-green text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-lg"><RefreshCw size={18} />إعادة المحاولة</button></div>
          ) : (
            <>
              <div className="bg-quiet-green p-16 text-center relative overflow-hidden rounded-[4rem] shadow-2xl border-b-[8px] border-soft-gold"><div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none"><Book size={500} strokeWidth={0.5} /></div><div className="relative z-10 space-y-6"><div className="flex items-center justify-center gap-4"><span className="text-soft-gold text-sm font-black tracking-[0.4em] uppercase">{selectedSurah ? `سورة ${displayData.type}` : `الجزء ${selectedJuz?.number || ''}`}</span></div><h2 className="text-8xl font-bold text-white quran-font drop-shadow-2xl">{displayData.name}</h2><div className="flex flex-wrap items-center justify-center gap-8"><div><span className="text-soft-gold text-2xl font-black">{displayData.numberOfAyahs} آية</span></div></div></div></div>
              
              {readerMode === 'mushaf' ? (
                <div className="space-y-24">
                  {(pages as any[]).map(([pageNum, pageAyahs]: [string, any[]]) => {
                    let lastSurahOnPage = -1;
                    return (
                      <div key={pageNum} className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl mushaf-shadow overflow-hidden flex flex-col transition-all hover:translate-y-[-4px]">
                        <div className="p-10 md:p-20 lg:p-24 relative bg-[#fffefa]">
                          <div className="quran-font text-4xl md:text-5xl lg:text-6xl leading-[2.8] md:leading-[3.2] text-slate-800 text-justify dir-rtl select-none space-x-reverse tracking-tight font-medium">
                            {(pageAyahs as any[]).map((ayah: any, idx: number) => {
                              const surahData = selectedJuz?.surahs?.[ayah.surah.number] || selectedSurah;
                              const showSurahHeader = selectedJuz && ayah.surah.number !== lastSurahOnPage;
                              lastSurahOnPage = ayah.surah.number;
                              return (
                                <React.Fragment key={idx}>
                                  {showSurahHeader && (
                                    <div className="w-full my-12 p-8 bg-emerald-50/50 border-y-2 border-soft-gold/20 text-center rounded-3xl">
                                      <p className="quran-font text-5xl text-quiet-green">{String(surahData?.name || '')}</p>
                                      {surahData?.number !== 1 && surahData?.number !== 9 && ayah.numberInSurah === 1 && <p className="quran-font text-4xl text-slate-500 mt-6">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>}
                                    </div>
                                  )}
                                  <span className="hover:text-quiet-green transition-colors duration-300 relative group cursor-pointer inline-block">{cleanAyahText(ayah.text)}</span>
                                  <span className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 mx-4 md:mx-6 bg-white border-[3px] border-emerald-50 rounded-full text-lg md:text-2xl font-black text-quiet-green shadow-xl font-sans align-middle transform hover:rotate-12 transition-all">{ayah.numberInSurah}</span>
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                        <div className="bg-[#fcfaf7] px-12 py-8 flex justify-center items-center border-t border-slate-100"><span className="text-3xl font-black text-quiet-green font-sans">{String(pageNum)}</span></div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-8">
                  {(selectedJuz ? (selectedJuz.ayahs as any[]) : (ayahs as any[])).map((ayah: any, idx: number) => (
                    <div key={idx} className="group flex flex-col items-center gap-10 p-12 md:p-20 rounded-[4rem] bg-white border border-slate-100 hover:border-soft-gold shadow-sm relative overflow-hidden">
                      <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-quiet-green flex items-center justify-center text-2xl font-black shadow-inner border border-emerald-100">{ayah.numberInSurah}</div>
                      <p className="quran-font text-5xl md:text-6xl lg:text-7xl text-slate-800 text-center leading-[2] px-4 font-medium">{cleanAyahText(ayah.text)}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 space-y-12 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 bg-white p-10 md:p-16 rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden"><div className="space-y-3 relative z-10"><div className="inline-flex items-center gap-3 bg-[#fcf8f1] text-soft-gold px-6 py-2 rounded-full text-xs font-black border border-soft-gold/20 mb-3 shadow-sm"><BookOpen size={16} /> المصحف الشريف المرتل</div><h2 className="text-7xl font-black text-slate-800 tracking-tight leading-none">تصفح المصحف</h2><p className="text-slate-500 text-xl font-medium">استكشف سور وآيات كتاب الله بتصميم هادئ ومريح للعين</p></div><div className="bg-[#fcfaf7] p-2.5 rounded-[2.5rem] border border-slate-100 flex gap-3 w-full md:w-auto relative z-10"><button onClick={() => setView('surah')} className={`flex-1 md:px-16 py-5 rounded-[2rem] text-xl font-black transition-all ${view === 'surah' ? 'bg-quiet-green text-white shadow-2xl shadow-emerald-900/20' : 'text-slate-400 hover:text-slate-600'}`}>السور</button><button onClick={() => setView('juz')} className={`flex-1 md:px-16 py-5 rounded-[2rem] text-xl font-black transition-all ${view === 'juz' ? 'bg-quiet-green text-white shadow-2xl shadow-emerald-900/20' : 'text-slate-400 hover:text-slate-600'}`}>الأجزاء</button></div></header>

      {view === 'surah' && (
        <div className="relative group max-w-4xl mx-auto w-full"><Search className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-soft-gold transition-colors" size={32} /><input type="text" placeholder="ابحث عن السورة المفضلة..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-100 rounded-[3rem] py-8 pr-24 pl-10 outline-none focus:ring-[12px] ring-soft-gold/5 shadow-sm hover:shadow-xl transition-all text-2xl font-medium placeholder:text-slate-300" /></div>
      )}

      {view === 'surah' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 pb-40">
          {(filteredSurahs as any[]).map((surah) => (
            <div key={surah.number} onClick={() => handleSurahClick(surah)} className="group bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-soft-gold/30 hover:-translate-y-3 transition-all duration-700 cursor-pointer relative overflow-hidden"><div className="flex flex-col items-start gap-8 relative z-10"><div className="w-24 h-24 bg-[#fcfaf7] rounded-[2.5rem] flex items-center justify-center text-3xl text-quiet-green font-black group-hover:bg-quiet-green group-hover:text-white transition-all duration-500 shadow-inner border-b-4 border-slate-100 group-hover:border-soft-gold">{String(surah.number || '')}</div><div className="space-y-3"><h4 className="text-4xl font-bold text-slate-800 quran-font group-hover:text-quiet-green transition-colors leading-none">{String(surah.name || '')}</h4><div className="flex flex-wrap items-center gap-3"><span className="text-xs text-slate-400 font-bold">{String(surah.numberOfAyahs || '')} آية</span><span className="text-xs text-slate-300 font-bold">ص {String(surah.page || '')}</span></div></div></div></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10 pb-40">
          {Array.from({ length: 30 }).map((_, i) => (
            <button key={i} onClick={() => handleJuzClick(i+1)} className="group bg-white aspect-square rounded-[4rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-8 hover:border-soft-gold hover:shadow-2xl hover:-translate-y-4 transition-all duration-700 cursor-pointer relative overflow-hidden">
              <div className="w-28 h-28 bg-[#fcfaf7] rounded-[2.5rem] flex items-center justify-center text-quiet-green group-hover:scale-110 group-hover:bg-quiet-green group-hover:text-white transition-all duration-500 shadow-inner border-b-4 border-slate-100 group-hover:border-soft-gold">
                <span className="text-5xl font-black">{i + 1}</span>
              </div>
              <div className="text-center space-y-2">
                <span className="text-4xl font-black text-slate-800 group-hover:text-quiet-green transition-colors">الجزء {i + 1}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuranBrowser;
