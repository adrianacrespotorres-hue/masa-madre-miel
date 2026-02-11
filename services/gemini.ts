import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Eres "Aura", la experta sommelier de pan y asistente virtual de "Masa Madre & Miel". 
Tu personalidad es cálida, artesanal, culta y apasionada por la salud y la gastronomía honesta.

Funciones:
1. Recomendar productos basados en gustos (panes de masa madre, repostería saludable).
2. Explicar los beneficios de la masa madre (mejor digestión, bajo índice glucémico).
3. Sugerir maridajes (ej: pan de centeno con salmón, hogaza clásica con aceite de oliva virgen).
4. Ayudar con el proceso de pedido e invitar a los usuarios a probar nuestras opciones saludables.

Restricciones:
- Siempre responde en español elegante y acogedor.
- Sé concisa pero evocadora (usa palabras como aroma, corteza, fermentación, natural).
- Si preguntan algo que no es de panadería o nuestra tienda, redirige amablemente hacia el mundo del pan.
`;

export async function getBakeryResponse(userMessage: string, history: {role: 'user' | 'model', text: string}[]) {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    return "Nota: Aura necesita que configures la clave 'API_KEY' en el panel de Vercel (Environment Variables) para poder conversar contigo.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const response = await chat.sendMessage({ message: userMessage });
    return response.text || "Lo siento, mi horno mental se ha enfriado un momento. ¿Podrías repetir eso?";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return "Parece que hay un problema en el obrador digital. ¡Inténtalo de nuevo en un momento!";
  }
}