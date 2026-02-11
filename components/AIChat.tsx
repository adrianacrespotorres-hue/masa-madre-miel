
import React, { useState, useRef, useEffect } from 'react';
import { getBakeryResponse } from '../services/gemini';
import { ChatMessage } from '../types';

interface AIChatProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '¡Hola! Soy Aura. ¿Te apetece una hogaza recién horneada hoy o buscas algo dulce y saludable?', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue('');
    const userMsg: ChatMessage = { role: 'user', text: userText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const aiResponseText = await getBakeryResponse(userText, history);
    
    setMessages(prev => [...prev, { 
      role: 'model', 
      text: aiResponseText, 
      timestamp: new Date() 
    }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Bubble Toggle */}
      <button 
        onClick={onToggle}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform ${
          isOpen ? 'bg-amber-900 rotate-90 scale-90' : 'bg-amber-800 hover:scale-110 active:scale-95'
        }`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      <div className={`absolute bottom-20 right-0 w-[350px] sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-amber-100 flex flex-col transition-all duration-500 origin-bottom-right ${
        isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'
      }`}>
        {/* Header */}
        <div className="p-4 bg-amber-900 rounded-t-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-xl">👩‍🍳</div>
          <div>
            <h3 className="text-white font-serif font-bold text-sm">Aura</h3>
            <p className="text-amber-200 text-[10px] uppercase tracking-wider">Experta en Masa Madre</p>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 h-[400px] overflow-y-auto p-4 space-y-4 bg-stone-50/50"
        >
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-amber-800 text-white rounded-br-none' 
                  : 'bg-white text-stone-800 shadow-sm border border-stone-100 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-stone-100 flex gap-1">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-amber-50 bg-white rounded-b-2xl">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pregúntame sobre nuestros panes..."
              className="flex-1 bg-stone-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="bg-amber-800 text-white p-2 rounded-full hover:bg-amber-900 disabled:opacity-50 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-center text-stone-400 mt-2 italic">
            Potenciado por Aura AI • Masa Madre & Miel
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
