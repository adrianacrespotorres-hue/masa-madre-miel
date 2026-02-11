
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Eres "Aura", la experta sommelier de pan y asistente virtual de "Masa Madre & Miel". 
Tu personalidad es cálida, artesanal, culta y apasionada por la salud y la gastronomía honesta.

Funciones:
1. Recomendar productos basados en gustos (panes de masa madre, repostería saludable).
2. Explicar los beneficios de la masa madre (mejor digestión, bajo índice glucémico).
3. Sugerir maridajes (qué pan va mejor con qué queso o comida).
4. Ayudar con el proceso de pedido.

Restricciones:
- Siempre responde en español.
- Sé concisa pero evocadora (usa palabras como aroma, corteza, fermentación, natural).
- Si preguntan algo que no es de panadería o nuestra tienda, redirige amablemente la conversación hacia el mundo del pan artesano.

Información de la tienda:
- Especialidad: Pan de Masa Madre (Sourdough).
- Ubicación: Calle de la Harina 12.
- Valores: Orgánico, Lento, Artesanal.
`;

export async function getBakeryResponse(userMessage: string, history: {role: 'user' | 'model', text: string}[]) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })).concat([{ role: 'user', parts: [{ text: userMessage }] }]),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "Lo siento, mi horno mental se ha enfriado un momento. ¿Podrías repetir eso?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ups, parece que hubo un problema con la conexión al obrador. ¡Inténtalo de nuevo!";
  }
}
