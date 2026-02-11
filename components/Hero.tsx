
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-stone-900">
      <img 
        src="https://images.unsplash.com/photo-1544434553-94b5bb4bd366?q=80&w=2000&auto=format&fit=crop" 
        alt="Artisan bread background" 
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 drop-shadow-lg">
          El Arte de <br /> <span className="italic font-normal">Crear Paciencia</span>
        </h1>
        <p className="text-xl text-amber-50 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Pan artesanal de masa madre y repostería honesta. Sin prisas, sin conservantes, solo ingredientes reales.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#tienda" 
            className="bg-amber-100 text-amber-900 px-10 py-4 rounded-full font-bold hover:bg-white transition-all transform hover:scale-105 shadow-xl"
          >
            Hacer Pedido
          </a>
          <button className="bg-transparent border border-white text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-all">
            Nuestra Historia
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
