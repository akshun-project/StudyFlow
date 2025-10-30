import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export default client;


 
