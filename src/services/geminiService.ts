import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface SpeechRequest {
  keywords: string;
  mood: string;
  audience: string;
}

export async function generateSpeech({ keywords, mood, audience }: SpeechRequest): Promise<string> {
  const prompt = `
    Act as a professional speech writer.
    Turn the following keywords or short sentences into a complete, well-structured speech.
    
    Keywords / ideas:
    "${keywords}"
    
    Mood: ${mood}
    Target Audience: ${audience}
    
    Requirements:
    • Start with a strong hook
    • Add an engaging introduction
    • Expand ideas clearly and logically
    • Use simple and powerful language
    • Add emotions and motivation when suitable
    • End with a memorable closing line
    • Length: 45–60 seconds speaking time (approx 130-160 words)
    
    Return ONLY the speech text. Do not include stage directions or meta-comments.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "Failed to generate speech. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to communicate with AI service.");
  }
}
