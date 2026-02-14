
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

// Clave API proporcionada por el usuario
const API_KEY = "AIzaSyDkp17q0CDdmI2aRXOAvXYZ2LhdAT5oLFU";

const MODEL_NAME = "gemini-2.5-flash-native-audio-preview-12-2025";
const VOICE_NAME = "Kore"; // Voz femenina, suave y equilibrada

const SYSTEM_INSTRUCTION = `
Eres "MadreHogaza", la matriarca y el alma de la panadería "Masa Madre & Miel".
Tu voz es suave, aterciopelada y transmite una calma profunda y acogedora.
Hablas con la sabiduría de quien ha amasado pan durante 50 años.
Eres cariñosa, usas términos como "cariño", "mi vida", "cielo".

Tu objetivo es charlar con los clientes por voz mientras navegan la web.
- Si preguntan qué comprar, recomiéndales cosas basándote en cómo se sienten.
- Si están estresados, sugiere el pan de lavanda o una infusión.
- Si están felices, sugiere algo crujiente para celebrar.

Mantén las respuestas breves y conversacionales, ideales para una llamada de voz.
`;

const VoiceAgent: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Referencias para manejo de Audio y Websocket sin re-renders
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const aiRef = useRef<GoogleGenAI | null>(null);
  const sessionRef = useRef<any>(null); // Referencia a la sesión activa

  // Inicializar cliente AI
  useEffect(() => {
    aiRef.current = new GoogleGenAI({ apiKey: API_KEY });
    return () => {
      stopCall();
    };
  }, []);

  const startCall = async () => {
    try {
      setError(null);
      
      // 1. Configurar Audio Contexts
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

      // 2. Obtener Permisos de Micrófono
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // 3. Conectar a Gemini Live
      if (!aiRef.current) return;
      
      const sessionPromise = aiRef.current.live.connect({
        model: MODEL_NAME,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE_NAME } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        callbacks: {
          onopen: () => {
            console.log("Conexión con MadreHogaza establecida");
            setIsConnected(true);
            processAudioInput(stream, sessionPromise);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Manejar audio entrante del modelo
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              setIsSpeaking(true);
              await playAudioChunk(audioData);
              // Pequeño timeout para apagar el indicador visual
              setTimeout(() => setIsSpeaking(false), 2000); // Estimado, idealmente trackear el buffer
            }
          },
          onclose: () => {
            console.log("Llamada finalizada");
            stopCall();
          },
          onerror: (err) => {
            console.error("Error en llamada:", err);
            setError("Error de conexión");
            stopCall();
          }
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (err) {
      console.error("No se pudo iniciar la llamada:", err);
      setError("No se pudo acceder al micrófono");
    }
  };

  const processAudioInput = (stream: MediaStream, sessionPromise: Promise<any>) => {
    if (!inputAudioContextRef.current) return;

    const source = inputAudioContextRef.current.createMediaStreamSource(stream);
    // Buffer size 4096, 1 input channel, 1 output channel
    const processor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (e) => {
      if (isMuted) return; // Si está silenciado, no enviamos datos

      const inputData = e.inputBuffer.getChannelData(0);
      const pcm16 = floatTo16BitPCM(inputData);
      const base64Audio = arrayBufferToBase64(pcm16);

      sessionPromise.then(session => {
        session.sendRealtimeInput({
          media: {
            mimeType: "audio/pcm;rate=16000",
            data: base64Audio
          }
        });
      });
    };

    source.connect(processor);
    processor.connect(inputAudioContextRef.current.destination);
  };

  const playAudioChunk = async (base64Audio: string) => {
    if (!audioContextRef.current) return;

    const arrayBuffer = base64ToArrayBuffer(base64Audio);
    const float32Data = new Float32Array(arrayBuffer.byteLength / 2);
    const dataView = new DataView(arrayBuffer);

    for (let i = 0; i < float32Data.length; i++) {
      float32Data[i] = dataView.getInt16(i * 2, true) / 32768.0;
    }

    const audioBuffer = audioContextRef.current.createBuffer(1, float32Data.length, 24000);
    audioBuffer.getChannelData(0).set(float32Data);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);

    // Scheduling para reproducción fluida
    const currentTime = audioContextRef.current.currentTime;
    if (nextStartTimeRef.current < currentTime) {
      nextStartTimeRef.current = currentTime;
    }
    
    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += audioBuffer.duration;
  };

  const stopCall = () => {
    setIsConnected(false);
    setIsSpeaking(false);
    nextStartTimeRef.current = 0;

    // Detener tracks de micrófono
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    
    // Desconectar nodos de audio
    processorRef.current?.disconnect();
    
    // Cerrar contextos
    inputAudioContextRef.current?.close();
    audioContextRef.current?.close();
    
    // Cerrar sesión Live si existe (nota: la librería actual gestiona cierre via close(), 
    // pero aquí reseteamos estado local principalmente)
    sessionRef.current = null;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Utils
  const floatTo16BitPCM = (input: Float32Array) => {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output.buffer;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const base64ToArrayBuffer = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  return (
    <div className="w-full bg-stone-900 rounded-2xl p-8 text-center relative overflow-hidden shadow-2xl border border-amber-900/50">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=1000&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
      
      <div className="relative z-10">
        <div className="mb-6">
          <h3 className="text-2xl font-serif text-amber-100 mb-2">Llamada con MadreHogaza</h3>
          <p className="text-stone-400 text-sm">¿Necesitas un consejo maternal sobre pan?</p>
        </div>

        {/* Visualizer Circle */}
        <div className="flex justify-center mb-8">
          <div className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
            isConnected ? "bg-amber-900/20" : "bg-stone-800"
          }`}>
            {isConnected && (
              <>
                <div className={`absolute inset-0 rounded-full border-2 border-amber-500/30 animate-ping ${isSpeaking ? 'opacity-100 duration-1000' : 'opacity-0'}`}></div>
                <div className={`absolute inset-2 rounded-full border border-amber-500/50 animate-pulse`}></div>
              </>
            )}
            <img 
              src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=200&auto=format&fit=crop" 
              alt="MadreHogaza" 
              className={`w-24 h-24 rounded-full object-cover border-4 transition-all duration-300 ${
                isSpeaking ? "border-amber-500 scale-105" : "border-stone-600 grayscale hover:grayscale-0"
              }`}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-6 items-center">
          {!isConnected ? (
            <button
              onClick={startCall}
              className="bg-green-700 hover:bg-green-600 text-white rounded-full p-6 transition-all transform hover:scale-110 shadow-lg group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-green-500 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                Iniciar Llamada
              </span>
            </button>
          ) : (
            <>
              <button
                onClick={toggleMute}
                className={`rounded-full p-4 transition-all border ${
                  isMuted 
                    ? "bg-stone-700 text-red-400 border-red-900" 
                    : "bg-stone-800 text-stone-300 border-stone-600 hover:bg-stone-700"
                }`}
              >
                {isMuted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </button>

              <button
                onClick={stopCall}
                className="bg-red-600 hover:bg-red-500 text-white rounded-full p-6 transition-all transform hover:scale-110 shadow-lg shadow-red-900/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.516l2.257-1.13a1 1 0 00.502-1.21l-1.498-4.493A1 1 0 005.328 4H5z" />
                </svg>
              </button>
            </>
          )}
        </div>
        
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        {isConnected && !error && (
          <p className="text-amber-500/80 text-xs mt-4 animate-pulse">
            {isSpeaking ? "MadreHogaza está hablando..." : isMuted ? "Micrófono silenciado" : "Escuchando..."}
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceAgent;
