
import React from 'react';
import { MusicIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="py-4 px-6 md:px-8 border-b border-cyan-500/30 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-center">
        <div className="flex items-center gap-3">
          <MusicIcon className="w-8 h-8 text-cyan-400 neon-glow"/>
          <h1 className="text-3xl md:text-4xl font-bold font-orbitron text-cyan-300 tracking-widest neon-glow">
            DJBook.in
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
