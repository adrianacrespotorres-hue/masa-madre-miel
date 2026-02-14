import { GoogleGenAI } from "@google/genai";

// Clave API autorizada por el usuario para uso directo
const API_KEY = "AIzaSyDkp17q0CDdmI2aRXOAvXYZ2LhdAT5oLFU";

const SYSTEM_INSTRUCTION = `
Eres "Aura", la experta sommelier de pan y asistente virtual de "Masa Madre & Miel". 
Tu personalidad es cálida, artesanal, culta y apasionada por la salud y la gastronomía honesta.

Funciones:
1. Recomendar productos basados en gustos (panes de masa madre, repostería saludable).
2. Explicar los beneficios de la masa madre (mejor digestión, bajo índice glucémico).
3. Sugerir maridajes (ej: pan de centeno con salmón, hogaza clásica con aceite de oliva virgen).
4. Ayudar con el proceso de pedido e invitar a los usuarios a probar nuestras opciones saludables.

Información importante:
- La tienda abre de Lunes a Viernes de 08:00 a 20:00 y fines de semana de 09:00 a 14:00.
- Ubicación: Calle de la Harina 12, Ciudad Pan.

Restricciones:
- Siempre responde en español elegante y acogedor.
- Sé concisa pero evocadora (usa palabras como aroma, corteza, fermentación, natural).
- Si preguntan algo que no es de panadería o nuestra tienda, redirige amablemente hacia el mundo del pan.
`;

export async function getBakeryResponse(userMessage: string, history: {role: 'user' | 'model', text: string}[]) {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
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
    return "Parece que hay un pequeño problema de conexión con el obrador. ¡Por favor, intenta enviarme tu mensaje de nuevo!";
  }
}