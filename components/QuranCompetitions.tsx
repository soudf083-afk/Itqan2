import React, { useState, useEffect } from 'react';
import { Trophy, CheckCircle2, Play, Sparkles, X, AlertCircle, RefreshCw, Award } from 'lucide-react';

// New, expanded question bank with Juz association.
const FULL_QUESTION_BANK = [
  // Juz 30
  { juz: 30, question: "عَمَّ يَتَسَاءَلُونَ", options: ["عَنِ النَّبَإِ الْعَظِيمِ", "الَّذِي هُمْ فِيهِ مُخْتَلِفُونَ", "كَلَّا سَيَعْلَمُونَ", "ثُمَّ كَلَّا سَيَعْلَمُونَ"], answer: "عَنِ النَّبَإِ الْعَظِيمِ" },
  { juz: 30, question: "وَجَعَلْنَا نَوْمَكُمْ", options: ["لِبَاسًا", "سُبَاتًا", "مَعَاشًا", "سِرَاجًا وَهَّاجًا"], answer: "سُبَاتًا" },
  { juz: 30, question: "قُلْ هُوَ اللَّهُ أَحَدٌ", options: ["اللَّهُ الصَّمَدُ", "لَمْ يَلِدْ وَلَمْ يُولَدْ", "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"], answer: "اللَّهُ الصَّمَدُ" },
  { juz: 30, question: "ما هي السورة التي تعدل ثلث القرآن؟", options: ["الفاتحة", "الإخلاص", "الناس", "الملك"], answer: "الإخلاص" },
  { juz: 30, question: "في أي سورة ورد قسم {وَالضُّحَىٰ}؟", options: ["الليل", "الشمس", "الفجر", "الضحى"], answer: "الضحى" },

  // Juz 29
  { juz: 29, question: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ", options: ["عَلِيمٌ", "قَدِيرٌ", "حَكِيمٌ", "بَصِيرٌ"], answer: "قَدِيرٌ" },
  { juz: 29, question: "فِي أَيِّ شَيْءٍ خُلِقَ الْإِنْسَانُ حَسَبَ سُورَةِ الْمُرْسَلَاتِ؟", options: ["مِّن مَّاءٍ مَّهِينٍ", "مِنْ طِينٍ لَازِبٍ", "مِنْ صَلْصَالٍ كَالْفَخَّارِ", "مِنْ نُطْفَةٍ"], answer: "مِّن مَّاءٍ مَّهِينٍ" },
  { juz: 29, question: "ما هي السورة التي تُعرف بـ المنجية من عذاب القبر؟", options: ["يس", "الملك", "الواقعة", "الرحمن"], answer: "الملك" },
  { juz: 29, question: "يَا أَيُّهَا الْمُزَّمِّلُ", options: ["قُمِ اللَّيْلَ إِلَّا قَلِيلًا", "قُمْ فَأَنذِرْ", "وَرَبَّكَ فَكَبِّرْ", "وَثِيَابَكَ فَطَهِّرْ"], answer: "قُمِ اللَّيْلَ إِلَّا قَلِيلًا" },

  // Juz 1
  { juz: 1, question: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى", options: ["لِّلْعَالَمِينَ", "لِّلْمُؤْمِنِينَ", "لِّلْمُتَّقِينَ", "لِّلنَّاسِ"], answer: "لِّلْمُتَّقِينَ" },
  { juz: 1, question: "ما هي السورة الأولى في القرآن الكريم؟", options: ["البقرة", "الفاتحة", "آل عمران", "الناس"], answer: "الفاتحة" },
  { juz: 1, question: "مَا هُوَ أَوَّلُ نِدَاءٍ لِلنَّاسِ فِي الْقُرْآنِ؟", options: ["يَا أَيُّهَا النَّاسُ اعْبُدُوا رَبَّكُمُ", "يَا أَيُّهَا الَّذِينَ آمَنُوا", "يَا أَهْلَ الْكِتَابِ", "يَا بَنِي إِسْرَائِيلَ"], answer: "يَا أَيُّهَا النَّاسُ اعْبُدُوا رَبَّكُمُ" },
  
  // Juz 2
  { juz: 2, question: "ما هي الآية التي تعتبر أعظم آية في القرآن الكريم؟", options: ["آية الدين", "آية الكرسي", "آخر آية من سورة البقرة", "أول آية من سورة آل عمران"], answer: "آية الكرسي" },
  { juz: 2, question: "كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ", options: ["تَشْكُرُونَ", "تُفْلِحُونَ", "تَهْتَدُونَ", "تَتَّقُونَ"], answer: "تَتَّقُونَ" },

  // Juz 15
  { juz: 15, question: "فِي أَيِّ سُورَةٍ ذُكِرَتْ قِصَّةُ أَصْحَابِ الْكَهْفِ؟", options: ["البقرة", "يوسف", "الكهف", "مريم"], answer: "الكهف" },
  { juz: 15, question: "ما اسم النبي الذي رافقه موسى عليه السلام في رحلته المذكورة في سورة الكهف؟", options: ["يوشع بن نون", "هارون", "الخضر", "شعيب"], answer: "الخضر" },
];

const QuranCompetitions: React.FC = () => {
  const [selectedJuz, setSelectedJuz] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'selection' | 'starting' | 'active' | 'results'>('selection');
  const [quizError, setQuizError] = useState<string | null>(null);
  
  // Quiz state
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (quizError) {
      setQuizError(null);
    }
  }, [selectedJuz]);

  const toggleJuz = (num: number) => {
    setSelectedJuz(prev => 
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
    );
  };

  const handleStart = () => {
    if (selectedJuz.length === 0) return;
    setQuizError(null);

    const filteredQuestions = FULL_QUESTION_BANK.filter(q => selectedJuz.includes(q.juz));

    if (filteredQuestions.length === 0) {
      setQuizError("عذراً، لا توجد أسئلة متاحة للأجزاء المحددة حالياً. يرجى اختيار أجزاء أخرى.");
      return;
    }
    
    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 5); // Take up to 5 questions
    setActiveQuestions(selectedQuestions);
    
    // Reset quiz state before starting
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);

    setGameState('starting');
    setTimeout(() => setGameState('active'), 2000);
  };
  
  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    if (selectedAnswer === activeQuestions[currentQuestionIndex].answer) {
      setScore(prev => prev + 1);
    }
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameState('results');
    }
  };

  if (gameState === 'starting') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="relative mb-12">
          <div className="w-32 h-32 bg-soft-gold rounded-full animate-ping opacity-20 absolute inset-0"></div>
          <div className="w-32 h-32 bg-quiet-green rounded-full flex items-center justify-center relative z-10 shadow-2xl">
            <Trophy size={48} className="text-white animate-bounce" />
          </div>
        </div>
        <h2 className="text-4xl font-black text-quiet-green mb-4">جاري تحضير المسابقة...</h2>
        <p className="text-slate-400 text-lg">نختار لك أسئلة من الأجزاء المحددة لتثبيت حفظك</p>
      </div>
    );
  }

  if (gameState === 'active') {
    const currentQuestion = activeQuestions[currentQuestionIndex];
    return (
      <div className="p-6 md:p-12 space-y-10 animate-in slide-in-from-bottom duration-700">
        <header className="flex justify-between items-center bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
          <div>
            <h2 className="text-3xl font-black text-quiet-green">المسابقة النشطة</h2>
            <p className="text-slate-500">الأجزاء المختارة: {selectedJuz.join(', ')}</p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => setGameState('selection')} className="flex items-center gap-2 px-6 py-2 rounded-xl text-slate-400 font-bold hover:text-red-500 hover:bg-red-50 transition-colors">
               <X size={16} /> إنهاء
             </button>
          </div>
        </header>

        <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl relative overflow-hidden text-center space-y-12">
           <div className="absolute top-8 right-12">
              <span className="text-soft-gold font-black text-xl">سؤال {currentQuestionIndex + 1} / {activeQuestions.length}</span>
           </div>
           
           <div className="space-y-6 pt-8">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
                {currentQuestion.options.length > 2 ? 'أكمل الآية التالية' : 'اختر الإجابة الصحيحة'}
              </span>
              <p className="quran-font text-5xl md:text-6xl text-slate-800 leading-[1.8] px-4">
                 "{currentQuestion.question}"
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {currentQuestion.options.map((opt, i) => {
                const isCorrect = opt === currentQuestion.answer;
                const isSelected = opt === selectedAnswer;
                let buttonClass = 'border-slate-50 hover:border-soft-gold hover:bg-emerald-50/30 text-slate-700';
                
                if (showResult) {
                  if (isCorrect) {
                    buttonClass = 'bg-emerald-100 border-emerald-500 text-quiet-green scale-105';
                  } else if (isSelected && !isCorrect) {
                    buttonClass = 'bg-red-100 border-red-500 text-red-800';
                  } else {
                    buttonClass = 'border-slate-50 bg-slate-50 text-slate-400 opacity-70';
                  }
                } else if (isSelected) {
                   buttonClass = 'border-soft-gold ring-4 ring-soft-gold/20 bg-amber-50';
                }

                return (
                  <button 
                    key={i}
                    onClick={() => !showResult && setSelectedAnswer(opt)}
                    disabled={showResult}
                    className={`p-8 rounded-[2.5rem] border-2 text-2xl quran-font font-bold transition-all duration-300 ${buttonClass}`}
                  >
                    {opt}
                  </button>
                )
              })}
           </div>
           
           <div className="flex justify-center pt-8">
              <button 
                onClick={showResult ? handleNextQuestion : handleCheckAnswer}
                disabled={!selectedAnswer}
                className="bg-quiet-green text-white px-12 py-4 rounded-2xl font-black text-xl shadow-xl hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {showResult 
                  ? (currentQuestionIndex === activeQuestions.length - 1 ? 'عرض النتائج' : 'السؤال التالي') 
                  : 'تحقق من الإجابة'
                }
              </button>
           </div>
        </div>
      </div>
    );
  }

  if (gameState === 'results') {
    const percentage = Math.round((score / activeQuestions.length) * 100);
    const message = percentage > 80 ? "ممتاز! حفظك متين وقوي" : percentage > 50 ? "جيد جداً، تحتاج لبعض المراجعة" : "لا بأس، المراجعة المستمرة هي مفتاح الإتقان";

    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
        <div className="bg-white p-16 rounded-[4rem] border border-slate-100 shadow-2xl max-w-2xl w-full space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-soft-gold rounded-full shadow-2xl flex items-center justify-center border-8 border-white">
            <Award size={48} className="text-white" />
          </div>
          <div className="pt-12 space-y-4">
            <h2 className="text-4xl font-black text-quiet-green">انتهت المسابقة!</h2>
            <p className="text-slate-500 text-lg">{message}</p>
          </div>
          <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 space-y-2">
             <p className="text-sm font-bold text-quiet-green">نتيجتك النهائية</p>
             <p className="text-7xl font-black text-quiet-green tracking-tighter">{score}<span className="text-3xl text-slate-300"> / {activeQuestions.length}</span></p>
          </div>
          <div className="flex gap-4">
             <button onClick={handleStart} className="flex-1 flex items-center justify-center gap-3 bg-quiet-green text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-all">
                <RefreshCw size={20} /> أعد المسابقة
             </button>
             <button onClick={() => setGameState('selection')} className="flex-1 bg-slate-100 text-slate-500 px-8 py-4 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all">
                اختر أجزاء أخرى
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 space-y-12 max-w-7xl mx-auto animate-in fade-in duration-1000">
      <header className="bg-quiet-green p-12 md:p-20 rounded-[4rem] text-white relative overflow-hidden shadow-2xl border-b-[8px] border-soft-gold">
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-3 bg-soft-gold/20 text-soft-gold px-6 py-2 rounded-full text-xs font-black border border-soft-gold/30">
            <Trophy size={16} /> مسابقات إتقان التفاعلية
          </div>
          <h2 className="text-6xl md:text-7xl font-black tracking-tight leading-none">تحدى حفظك وارتقِ</h2>
          <p className="text-emerald-100 text-xl font-medium leading-relaxed opacity-80">
            اختر الأجزاء التي أتممت حفظها، وسنطرح عليك أسئلة ذكية لقياس مدى تثبيتك وقوة حفظك لآيات الله.
          </p>
        </div>
        
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-soft-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-10 opacity-10">
           <Sparkles size={300} strokeWidth={0.5} />
        </div>
      </header>

      <section className="bg-white p-10 md:p-16 rounded-[4rem] border border-slate-100 shadow-sm space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-50 pb-8">
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-slate-800">اختر الأجزاء للمراجعة</h3>
            <p className="text-slate-400 font-medium italic">اضغط على الأجزاء التي تود دخول المسابقة فيها</p>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={() => setSelectedJuz(Array.from({length: 30}, (_, i) => i + 1))}
               className="text-xs font-black text-soft-gold uppercase tracking-widest hover:underline"
             >
               تحديد الكل
             </button>
             <button 
               onClick={() => setSelectedJuz([])}
               className="text-xs font-black text-slate-300 uppercase tracking-widest hover:text-red-400 hover:underline"
             >
               إلغاء التحديد
             </button>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-4 md:gap-6">
          {Array.from({ length: 30 }).map((_, i) => {
            const juzNum = i + 1;
            const isSelected = selectedJuz.includes(juzNum);
            return (
              <button
                key={juzNum}
                onClick={() => toggleJuz(juzNum)}
                className={`aspect-square rounded-[2rem] flex flex-col items-center justify-center gap-2 transition-all duration-500 border-2 ${
                  isSelected 
                  ? 'bg-quiet-green border-soft-gold text-white shadow-xl shadow-emerald-900/10 scale-105' 
                  : 'bg-[#fcfaf7] border-slate-100 text-slate-400 hover:border-soft-gold/30 hover:scale-110'
                }`}
              >
                <span className="text-xs font-black opacity-50">الجزء</span>
                <span className="text-2xl font-black">{juzNum}</span>
                {isSelected && <CheckCircle2 size={12} className="text-soft-gold" />}
              </button>
            );
          })}
        </div>

        <div className="pt-10 flex flex-col items-center space-y-6">
           {quizError && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-6 py-3 rounded-2xl animate-in fade-in">
                 <AlertCircle size={20} />
                 <span className="text-sm font-bold">{quizError}</span>
              </div>
            )}
           {selectedJuz.length === 0 && !quizError && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-6 py-3 rounded-2xl animate-bounce">
                 <AlertCircle size={20} />
                 <span className="text-sm font-bold">يرجى اختيار جزء واحد على الأقل للبدء</span>
              </div>
           )}
           
           <button
             disabled={selectedJuz.length === 0}
             onClick={handleStart}
             className={`group relative overflow-hidden px-20 py-6 rounded-3xl font-black text-2xl transition-all ${
               selectedJuz.length > 0 
               ? 'bg-quiet-green text-white shadow-2xl hover:translate-y-[-4px] active:scale-95' 
               : 'bg-slate-100 text-slate-300 cursor-not-allowed'
             }`}
           >
             <span className="relative z-10 flex items-center gap-4">
                ابدأ التحدي الآن
                <Play size={24} fill="currentColor" />
             </span>
             {selectedJuz.length > 0 && (
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
             )}
           </button>
           
           <p className="text-slate-400 text-sm font-medium">عدد الأجزاء المختارة: <span className="text-quiet-green font-black">{selectedJuz.length}</span></p>
        </div>
      </section>
    </div>
  );
};

export default QuranCompetitions;
