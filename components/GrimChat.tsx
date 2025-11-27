import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGhost } from '../services/geminiService';
import { Message } from '../types';

const GrimChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'model',
      text: 'Приветствую.',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const responseText = await sendMessageToGhost(history, userMsg.text);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-[0_0_20px_rgba(50,0,0,1)] border border-red-900 transition-all duration-300 ${isOpen ? 'bg-red-950 rotate-45' : 'bg-dark-800 hover:bg-red-900'}`}
      >
        {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-200"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[90vw] sm:w-96 h-[450px] bg-dark-900 border border-red-900/40 rounded-lg shadow-[0_0_50px_rgba(20,0,0,0.9)] flex flex-col z-50 overflow-hidden font-serif">
          {/* Header */}
          <div className="p-4 bg-black border-b border-red-900/20 flex items-center justify-between">
            <h3 className="text-red-500 font-gothic text-lg tracking-widest">Oracle</h3>
            <div className="w-2 h-2 rounded-full bg-red-700 animate-pulse"></div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-900/95" ref={scrollRef}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 text-sm rounded-sm border ${
                    msg.role === 'user'
                      ? 'bg-red-950 border-red-900 text-gray-300 rounded-tr-none'
                      : 'bg-black border-stone-800 text-stone-400 rounded-tl-none italic'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-black border border-stone-800 p-3 rounded-sm rounded-tl-none">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-red-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-red-800 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-red-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-black border-t border-red-900/20 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Спроси духа..."
              className="flex-1 bg-dark-800 text-gray-300 text-sm p-2 outline-none border border-stone-800 focus:border-red-900 transition-colors placeholder-stone-700"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="ml-2 px-3 py-2 bg-stone-900 border border-stone-800 text-red-700 hover:text-red-500 hover:border-red-900 transition-all disabled:opacity-50"
            >
              ➔
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GrimChat;