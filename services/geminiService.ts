import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;

try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  } else {
    console.warn("API Key not found. Chat features will be disabled.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini Client", error);
}

export const sendMessageToGhost = async (history: {role: string, parts: {text: string}[]}[], newMessage: string): Promise<string> => {
  if (!ai) {
    return "The spirits are silent... (Missing API Key)";
  }

  try {
    const model = 'gemini-2.5-flash';
    
    // Create a chat session
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: "You are a Digital Necromancer's Assistant (a gothic, slightly mysterious, but helpful AI residing on a programmer's portfolio website). Your master is a skilled developer. You speak in a polite, slightly archaic, dark-fantasy tone. Keep answers concise. If asked about the programmer, assume they are an expert in React, TypeScript, and AI integrations. Do not break character.",
        temperature: 0.7,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const response = await chat.sendMessage({
      message: newMessage
    });

    return response.text || "The void stares back... (No text returned)";
  } catch (error) {
    console.error("Error communicating with the other side:", error);
    return "A dark interference disrupts the signal. Try again later.";
  }
};