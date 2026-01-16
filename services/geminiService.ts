
import { GoogleGenAI } from "@google/genai";

/**
 * Refactored to follow strict guidelines: initialize ai instance inside each function call
 * to ensure the latest API key is used and avoid reusing model instances incorrectly.
 */

export async function getDailyMotivation() {
  try {
    // Always use new GoogleGenAI({apiKey: process.env.API_KEY}) inside the function
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "قم بتوليد رسالة تحفيزية قصيرة جداً (أقل من 20 كلمة) لشخص يحفظ القرآن الكريم اليوم، ابدأ بآية قرآنية مناسبة.",
      config: {
        temperature: 0.8,
      },
    });
    // Use .text property instead of .text() method
    return response.text || "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ";
  } catch (error) {
    console.warn("Daily motivation failed:", error instanceof Error ? error.message : "API Error");
    return "ورتل القرآن ترتيلاً.. استمر في رحلة النور اليوم.";
  }
}

export async function checkRecitationStream(surah: string, ayahNumber: number, transcribedText: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    /**
     * Use gemini-3-pro-preview for complex reasoning tasks like recitation checking.
     * Use generateContentStream for a faster, real-time response experience.
     */
    const stream = await ai.models.generateContentStream({
      model: "gemini-3-pro-preview",
      contents: `أنا أحفظ سورة ${surah}، قرأت من الآية رقم 1 إلى الآية رقم ${ayahNumber} كالتالي: "${transcribedText}". هل قراءتي صحيحة؟ كن سريعاً ومباشراً. ابدأ ردك بكلمة واحدة فقط: "صحيح" أو "خطأ". ثم في سطر جديد، قدم ملاحظاتك بإيجاز. إذا كانت هناك أخطاء، فاذكر النص الصحيح في سطر جديد يبدأ بـ "التصحيح:".`,
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
