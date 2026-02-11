
import React from 'react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-100 py-4 px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-serif font-bold italic text-amber-900">Masa Madre & Miel</span>
        </div>
        
        <nav className="hidden md:flex gap-8 items-center text-amber-900 font-medium">
          <a href="#" className="hover:text-amber-600 transition-colors">Inicio</a>
          <a href="#tienda" className="hover:text-amber-600 transition-colors">Tienda</a>
          <a href="#" className="hover:text-amber-600 transition-colors">Filosofía</a>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenCart}
            className="relative p-2 text-amber-900 hover:text-amber-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
