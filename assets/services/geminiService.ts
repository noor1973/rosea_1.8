import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize only if key exists to avoid immediate errors, handle checks later
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getFloristAdvice = async (userMessage: string): Promise<string> => {
  if (!ai) {
    return "عذراً، خدمة المساعد الذكي غير متوفرة حالياً (مفتاح API مفقود).";
  }

  try {
    const model = ai.models;
    
    const systemInstruction = `
      أنت مساعد ذكي ومتخصص في "الورد الأبدي" (Eternal Roses) المصنوع من شرائط الستان.
      اسمك "مساعد وردة".
      دورك هو مساعدة العملاء في:
      1. اختيار تنسيقات الألوان (مثلاً: ما الذي يليق مع الأحمر؟).
      2. حساب الكميات (مثلاً: كم متر ستان أحتاج لعمل باقة من 50 وردة؟). 
         (قاعدة عامة: الوردة الواحدة تستهلك حوالي 1.5 إلى 2 متر من الشريط مقاس 4 سم).
      3. تقديم نصائح للصناعة والتغليف.
      
      تحدث باللغة العربية بلهجة ودودة ومشجعة.
      اجعل اجاباتك مختصرة ومفيدة.
      لا تقترح شراء منتجات من خارج المتجر، ركز على الستان، الورق، السيقان، والشمع.
    `;

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "عذراً، لم أتمكن من فهم طلبك.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "واجهت مشكلة تقنية بسيطة، يرجى المحاولة مرة أخرى لاحقاً.";
  }
};
