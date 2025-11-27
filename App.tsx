import React, { useState, useEffect, useRef } from 'react';
import FlyingBats from './components/FlyingBats';
import GrimChat from './components/GrimChat';

// Text Scrambler Component for the "show-off" factor
const ScrambleText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const [display, setDisplay] = useState(text);
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  
  const scramble = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      
      if (iteration >= text.length) {
        clearInterval(interval);
      }
      
      iteration += 1 / 3;
    }, 30);
  };

  return (
    <span 
      onMouseEnter={scramble} 
      className={`cursor-pointer hover:text-red-500 transition-colors ${className}`}
    >
      {display}
    </span>
  );
};

const App: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    // Set initial center position for mobile look
    setMousePos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText("menace@darkweb.void");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-black text-stone-400 overflow-x-hidden selection:bg-red-900 selection:text-white font-serif">
      
      {/* Dynamic Torch / Spotlight Effect - Z-Index 10 */}
      <div 
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, transparent 10%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.98) 100%)`
        }}
      />

      {/* Static Background Texture - Z-Index 0 */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-30 z-0"></div>
      
      {/* Bats - Z-Index 20 (Above Torch) */}
      <FlyingBats />
      
      {/* Content Container - Z-Index 30 */}
      <main className="relative z-30 min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
        
        {/* The Card */}
        <div className="w-full max-w-md bg-dark-950/90 backdrop-blur-md border border-stone-900 shadow-[0_0_60px_rgba(30,0,0,0.5)] p-8 sm:p-12 relative overflow-hidden group hover:border-red-900/50 transition-colors duration-500">
          
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-red-900 opacity-20"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-red-900 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-red-900 opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-red-900 opacity-20"></div>

          {/* Profile Section */}
          <div className="text-center space-y-8">
            <div className="inline-block relative group">
               {/* Avatar / Icon Placeholder */}
               <div className="w-40 h-40 mx-auto rounded-full bg-black border border-red-900/30 flex items-center justify-center shadow-[0_0_30px_rgba(20,0,0,1)] mb-6 overflow-hidden relative">
                  <img 
                    src="https://i.pinimg.com/1200x/17/30/4b/17304bcfc5f1c9f6b465671f4661faae.jpg" 
                    alt="Avatar" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-700 contrast-125 sepia-[.5] hue-rotate-[-50deg]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
               </div>
               
               {/* Floating Runes */}
               <div className="absolute -top-4 -right-4 text-2xl text-red-900 animate-float opacity-50">†</div>
               <div className="absolute -bottom-2 -left-4 text-2xl text-red-900 animate-float opacity-50" style={{ animationDelay: '2s' }}>⸸</div>
            </div>

            <div>
              {/* Name with Shine Effect */}
              <h1 className="text-5xl sm:text-6xl font-blackletter mb-4 tracking-wider text-shine cursor-default">
                MENACE
              </h1>
              <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-red-900 to-transparent mb-6"></div>
              
              <div className="space-y-3">
                 <ScrambleText text="ARCHITECT OF VOID" className="text-stone-500 text-sm tracking-[0.3em] block" />
                 
                 {/* Updated Tech Stack */}
                 <div className="flex flex-wrap justify-center gap-2 text-[10px] tracking-widest font-gothic uppercase text-red-900/80">
                    <span>REACT</span> <span className="text-stone-800">|</span> 
                    <span>HTML</span> <span className="text-stone-800">|</span>
                    <span>TYPESCRIPT</span> <span className="text-stone-800">|</span>
                    <span>PYTHON</span> <span className="text-stone-800">|</span>
                    <span>C++</span>
                 </div>
              </div>
            </div>

            {/* Stats / Skills Grid */}
            <div className="grid grid-cols-2 gap-px bg-stone-900 border border-stone-900 mt-8">
              <div className="bg-dark-950 p-4 flex flex-col items-center hover:bg-black transition-colors group/stat">
                <span className="font-blackletter text-2xl text-stone-500 group-hover/stat:text-red-500 transition-colors">Avoid</span>
                <span className="text-[10px] uppercase tracking-widest text-stone-700 mt-1">Status</span>
              </div>
              <div className="bg-dark-950 p-4 flex flex-col items-center hover:bg-black transition-colors group/stat">
                <span className="font-blackletter text-2xl text-stone-500 group-hover/stat:text-red-500 transition-colors">0</span>
                <span className="text-[10px] uppercase tracking-widest text-stone-700 mt-1">Years XP</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mt-8">
              <a 
                href="https://github.com/sasuke22233" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-4 bg-black border border-stone-800 hover:border-red-900 text-stone-400 hover:text-red-500 transition-all duration-500 font-gothic tracking-[0.2em] uppercase text-xs flex items-center justify-center gap-3 relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-red-900/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10">Access GitHub</span>
                <svg className="w-4 h-4 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
              
              <div className="flex gap-4">
                <a 
                  href="https://t.me/Menaceeq" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-4 px-4 bg-transparent border border-stone-900 hover:border-red-900 hover:bg-dark-900 text-stone-500 hover:text-red-400 transition-all duration-300 font-gothic tracking-widest uppercase text-[10px] text-center"
                >
                  Telegram
                </a>
                <button 
                  onClick={copyEmail}
                  className="flex-1 py-4 px-4 bg-transparent border border-stone-900 hover:border-red-900 hover:bg-dark-900 text-stone-500 hover:text-red-400 transition-all duration-300 font-gothic tracking-widest uppercase text-[10px] relative overflow-hidden"
                >
                  {copied ? "Decrypted" : "Contact"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center opacity-40 hover:opacity-100 transition-opacity duration-700 relative z-30">
            <p className="text-stone-700 text-[10px] font-gothic tracking-[0.5em] uppercase">
                "Chaos is the only true constant"
            </p>
        </footer>
      </main>

      {/* Floating Chat Interface */}
      <div className="relative z-50">
        <GrimChat />
      </div>
    </div>
  );
};

export default App;