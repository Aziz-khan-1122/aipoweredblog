
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Initialized GoogleGenAI strictly following the provided guidelines: new GoogleGenAI({ apiKey: process.env.API_KEY })
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateSummary(content: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Please provide a concise, professional, and engaging summary of the following blog post content in maximum 3 sentences. Do not include meta-text like "Here is a summary".\n\nContent:\n${content}`,
        config: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
        },
      });

      // Correctly access .text property from GenerateContentResponse as per guidelines
      return response.text || "Could not generate summary.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "An error occurred while generating the AI summary.";
    }
  }

  async extractTags(content: string): Promise<string[]> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Suggest 3-5 relevant single-word tags for this blog content. Return ONLY the tags separated by commas.\n\nContent:\n${content}`,
      });

      // Correctly access .text property from GenerateContentResponse
      const tags = response.text?.split(',').map(t => t.trim()) || [];
      return tags.slice(0, 5);
    } catch (error) {
      return [];
    }
  }
}
