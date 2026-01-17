
import { GoogleGenAI } from "@google/genai";

/**
 * Refactored to follow strict guidelines: initialize ai instance inside each function call
 * to ensure the latest API key is used and avoid reusing model instances incorrectly.
 */

export async function getDailyMotivation() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "قم بتوليد رسالة تحفيزية قصيرة جداً (أقل من 20 كلمة) لشخص يحفظ القرآن الكريم اليوم، ابدأ بآية قرآنية مناسبة تلهم الصبر والمداومة.",
      config: {
        temperature: 0.8,
      },
    });
    return response.text || "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ";
  } catch (error) {
    console.warn("Daily motivation failed:", error instanceof Error ? error.message : "API Error");
    return "ورتل القرآن ترتيلاً.. استمر في رحلة النور اليوم.";
  }
}

export async function getPersonalizedWelcome(userName: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `قم بتوليد تحية ترحيبية إيمانية حارة للمستخدم "${userName}" الذي عاد لتطبيق "إتقان" لمواصلة حفظ القرآن. اجعلها قصيرة، ملهمة، وتحتوي على دعاء بالتوفيق أو آية قصيرة عن فضل العلم. (الحد الأقصى 25 كلمة)`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text || `مرحباً بك يا ${userName} في رحاب القرآن.`;
  } catch (error) {
    return `مرحباً بك يا ${userName}، أنار الله قلبك بنور القرآن.`;
  }
}

export async function checkRecitationStream(surah: string, ayahNumber: number, transcribedText: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const stream = await ai.models.generateContentStream({
      model: "gemini-3-pro-preview",
      contents: `أنا أحفظ سورة ${surah}، قرأت من الآية رقم 1 إلى الآية رقم ${ayahNumber} كالتالي: "${transcribedText}". هل قراءتي صحيحة؟ ركز على الحركات والكلمات. ابدأ ردك بكلمة واحدة فقط: "صحيح" أو "خطأ". ثم في سطر جديد، قدم ملاحظاتك بإيجاز شديد. إذا كانت هناك أخطاء، فاذكر النص الصحيح في سطر جديد يبدأ بـ "التصحيح:".`,
      config: {
        temperature: 0.2,
      }
    });
    return stream;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "حدث خطأ غير متوقع";
    console.error("Recitation check failed:", errorMsg);
    throw new Error("عذراً، واجهنا صعوبة في الاتصال بالخادم الذكي الآن.");
  }
}

export async function findNearbyMosques(latitude: number, longitude: number) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "ما هي أقرب 3 مساجد أو مصليات من موقعي الحالي؟ اذكر أسمائهم ومواقعهم باختصار.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude, longitude }
          }
        }
      },
    });
    
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const links = chunks
      .filter(c => c.maps)
      .map(c => ({
        title: c.maps?.title || "رابط المسجد",
        uri: c.maps?.uri
      }));

    return {
      text: response.text,
      links: links
    };
  } catch (error) {
    console.error("Maps grounding failed:", error);
    return null;
  }
}
