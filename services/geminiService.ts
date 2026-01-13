
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getRegionInsights(locationDescription: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a planetary expert. Provide a concise, poetic, and scientifically accurate 1-2 sentence description of the natural wonders or geographic significance of the location or region described as: "${locationDescription}". Focus on nature, climate, and geology. Avoid political commentary.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 100,
      }
    });
    
    return response.text?.trim() || "Information about this beautiful region is currently being cataloged.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "The stars are currently misaligned. Please try again later.";
  }
}
