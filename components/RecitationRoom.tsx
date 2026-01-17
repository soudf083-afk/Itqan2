
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Loader2, Sparkles, AlertCircle, CheckCircle2, Waves } from 'lucide-react';
import { checkRecitationStream } from '../services/geminiService';
import { SURAHS } from './constants';

// Declare the SpeechRecognition types for window object
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const RecitationRoom: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isBrowserSupported, setIsBrowserSupported] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState('الإخلاص');
  const [ayahNumber, setAyahNumber] = useState(4);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [transcribedText, setTranscribedText] = useState('');
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>('');
  
  // Keep track of recording state for events
  const recordingStateRef = useRef(false);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ar-SA';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        if (finalTranscript) {
           finalTranscriptRef.current += " " + finalTranscript;
        }
        setTranscribedText(finalTranscriptRef.current.trim() + ' ' + interimTranscript);
      };

      recognition.onend = () => {
        // If it ended unexpectedly while we thought we were recording
        if (recordingStateRef.current) {
          setIsRecording(false);
          recordingStateRef.current = false;
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        
        const errorMessages: Record<string, string> = {
          'network': 'حدث خطأ في الاتصال بالشبكة. يرجى التحقق من استقرار الإنترنت والمحاولة مرة أخرى.',
          'no-speech': 'لم يتم اكتشاف أي صوت. يرجى التحدث بوضوح.',
          'audio-capture': 'حدث خطأ في الوصول إلى الميكروفون. يرجى التحقق من الأذونات.',
          'not-allowed': 'تم رفض الوصول للميكروفون. يرجى تفعيل الصلاحية من إعدادات المتصفح.',
          'aborted': 'تم إيقاف التسجيل.'
        };

        if (event.error !== 'aborted') {
          setRecognitionError(errorMessages[event.error] || "حدث خطأ غير متوقع في التعرف على الصوت.");
        }
        
        setIsRecording(false);
        recordingStateRef.current = false;
      };
    } else {
      setIsBrowserSupported(false);
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);
  
  // Process check when recording stops
  useEffect(() => {
    if (!isRecording && transcribedText.trim() !== '' && !loading) {
      handleRecitationCheck();
    }
  }, [isRecording]);

  const handleToggleRecording = () => {
    if (isRecording) {
      // Immediate UI update to prevent "not stopping" feeling
      setIsRecording(false);
      recordingStateRef.current = false;
      
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        recognitionRef.current?.abort();
      }
    } else {
      finalTranscriptRef.current = '';
      setTranscribedText('');
      setFeedback(null);
      setRecognitionError(null);
      
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
        recordingStateRef.current = true;
      } catch (e) {
        console.error("Failed to start recognition:", e);
        setRecognitionError("تعذر بدء التسجيل. يرجى تحديث الصفحة والمحاولة مجدداً.");
      }
    }
  };

  const handleRecitationCheck = async () => {
    const textToSubmit = transcribedText.trim();
    if (!textToSubmit) return;
    
    setLoading(true);
    setFeedback(null);
    
    try {
      const stream = await checkRecitationStream(selectedSurah, ayahNumber, textToSubmit);
      
      let accumulatedText = "";
      setFeedback({ isCorrect: null, feedback: "", correctedText: null });

      for await (const chunk of stream) {
        accumulatedText += chunk.text;
        
        const lines = accumulatedText.split('\n');
        // Initial feedback while streaming
        const feedbackText = lines.slice(1).join('\n').split("التصحيح:")[0].trim();
        setFeedback((prev: any) => ({ ...prev, feedback: feedbackText }));
      }
      
      // Final processing
      const lines = accumulatedText.split('\n');
      const result = lines[0].trim();
      const isCorrect = result === 'صحيح';
      let feedbackBody = lines.slice(1).join('\n').trim();
      let correctedText = null;

      const correctionIndex = feedbackBody.indexOf("التصحيح:");
      if (correctionIndex !== -1) {
        correctedText = feedbackBody.substring(correctionIndex + "التصحيح:".length).trim();
        feedbackBody = feedbackBody.substring(0, correctionIndex).trim();
      }

      setFeedback({ isCorrect, feedback: feedbackBody, correctedText });

    } catch (error) {
      console.error("Recitation room error:", error);
      setFeedback({
        isCorrect: false,
        feedback: "عذراً، واجهنا مشكلة في تحليل التلاوة. يرجى المحاولة مرة أخرى."
      });
    } finally {
      setLoading(false);
      setTranscribedText('');
      finalTranscriptRef.current = '';
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <div className="w-20 h-20 bg-quiet-green/10 border-4 border-soft-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 relative shadow-lg">
            <Sparkles className="text-quiet-green" size={36} />
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/10 animate-ping"></div>
          </div>
          <h2 className="text-5xl font-black text-slate-800">مصحح التلاوة الذكي</h2>
          <p className="text-slate-500 text-xl font-medium">اقرأ من بداية السورة، وسيقوم الذكاء الاصطناعي بمساعدتك على تصحيح الأخطاء</p>
        </header>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-50/30">
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-slate-500 mb-2">السورة</label>
              <select 
                value={selectedSurah}
                onChange={(e) => {
                  const surahData = SURAHS.find(s => s.name === e.target.value);
                  setSelectedSurah(e.target.value);
                  if (surahData) setAyahNumber(surahData.numberOfAyahs);
                }}
                className="w-full bg-white border-2 border-slate-100 text-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-soft-gold focus:ring-4 ring-soft-gold/10 transition-all text-lg font-bold"
              >
                {SURAHS.map(s => <option key={s.number} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="w-full md:w-32">
              <label className="block text-sm font-bold text-slate-500 mb-2">إلى الآية</label>
              <input 
                type="number"
                value={ayahNumber}
                onChange={(e) => setAyahNumber(parseInt(e.target.value))}
                min="1"
                className="w-full bg-white border-2 border-slate-100 text-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-soft-gold focus:ring-4 ring-soft-gold/10 transition-all text-lg font-bold"
              />
            </div>
          </div>

          {!isBrowserSupported && (
            <div className="p-8 bg-red-50 text-red-700 flex items-center gap-4">
              <AlertCircle size={24} />
              <p className="font-bold">عذراً، متصفحك لا يدعم تقنية التعرف على الصوت. يرجى استخدام متصفح Google Chrome للحصول على أفضل تجربة.</p>
            </div>
          )}

          <div className="p-8 md:p-12 text-center space-y-8">
            <div className="relative inline-block">
              <div className={`w-36 h-36 rounded-full flex items-center justify-center border-8 transition-all duration-300 ${
                isRecording ? 'border-quiet-green/20 scale-110' : 'border-slate-50'
              }`}>
                <button
                  onClick={handleToggleRecording}
                  disabled={!isBrowserSupported || loading}
                  className={`w-28 h-28 rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isRecording ? 'bg-red-500 animate-pulse' : 'bg-quiet-green'
                  }`}
                >
                  {isRecording ? <Square size={40} className="text-white" /> : <Mic size={44} className="text-white" />}
                </button>
              </div>
              {isRecording && <div className="absolute -inset-4 rounded-full border-2 border-quiet-green/30 animate-ping"></div>}
            </div>
            
            <p className="text-sm font-black text-slate-400">
              {isRecording ? "اضغط للإيقاف والتحقق" : "اضغط لبدء التلاوة"}
            </p>

            {recognitionError && (
                <div className="flex justify-center items-center gap-3 text-red-600 bg-red-50 px-6 py-4 rounded-2xl border border-red-100 animate-in fade-in duration-300">
                    <AlertCircle size={20} />
                    <span className="font-bold">{recognitionError}</span>
                </div>
            )}

            <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 min-h-[150px] flex items-center justify-center text-center relative">
              {isRecording && (
                <div className="absolute top-4 right-4 flex gap-1">
                   <div className="w-1.5 h-4 bg-quiet-green animate-bounce delay-75"></div>
                   <div className="w-1.5 h-6 bg-quiet-green animate-bounce delay-150"></div>
                   <div className="w-1.5 h-4 bg-quiet-green animate-bounce delay-300"></div>
                </div>
              )}
              <p className="quran-font text-2xl md:text-3xl text-slate-700 leading-relaxed">
                {transcribedText || "سيظهر نص تلاوتك هنا تلقائياً..."}
              </p>
            </div>

            {loading && (
              <div className="flex flex-col items-center gap-4 text-quiet-green font-bold">
                <Loader2 className="animate-spin" size={32} />
                <span className="animate-pulse">جاري تحليل مخارج الحروف والكلمات...</span>
              </div>
            )}
          </div>

          {feedback && (
            <div className={`p-8 md:p-12 border-t-8 transition-all duration-500 animate-in slide-in-from-bottom ${
              feedback.isCorrect === null ? 'bg-slate-50/50 border-slate-200' :
              feedback.isCorrect ? 'bg-emerald-50/50 border-emerald-500' : 'bg-amber-50/50 border-amber-500'
            }`}>
              <div className="flex items-start gap-5">
                <div className={`mt-1 p-3 rounded-2xl transition-colors ${
                  feedback.isCorrect === null ? 'bg-slate-100 text-slate-500' :
                  feedback.isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {feedback.isCorrect === null ? <Loader2 size={28} className="animate-spin" /> :
                   feedback.isCorrect ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />}
                </div>
                <div className="flex-1">
                  <h4 className={`font-black text-2xl transition-colors ${
                    feedback.isCorrect === null ? 'text-slate-800' :
                    feedback.isCorrect ? 'text-emerald-900' : 'text-amber-900'
                  }`}>
                    {feedback.isCorrect === null ? 'جاري التحليل...' :
                     feedback.isCorrect ? 'أحسنت! تلاوة مباركة ومتقنة' : 'تم رصد بعض الملاحظات'}
                  </h4>
                  <p className="text-slate-700 mt-4 text-xl leading-relaxed whitespace-pre-line font-medium">
                    {feedback.feedback || 'يرجى الانتظار قليلاً...'}
                  </p>
                  {feedback.correctedText && (
                    <div className="mt-8 p-8 bg-white rounded-3xl border-2 border-white shadow-xl">
                      <span className="text-xs font-black text-slate-400 block mb-4 uppercase tracking-[0.3em]">التصحيح المعتمد</span>
                      <p className="quran-font text-4xl text-quiet-green leading-loose">{feedback.correctedText}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecitationRoom;
