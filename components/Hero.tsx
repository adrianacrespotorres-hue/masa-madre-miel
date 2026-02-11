import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-stone-900">
      <img 
        src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2000&auto=format&fit=crop" 
        alt="Pan artesanal de masa madre" 
        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[15s] hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 drop-shadow-2xl">
          El Arte de <br /> <span className="italic font-normal">Crear Paciencia</span>
        </h1>
        <p className="text-xl text-amber-50 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
          Pan artesanal de masa madre y repostería honesta. Sin prisas, sin conservantes, solo ingredientes reales.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#tienda" 
            className="bg-amber-100 text-amber-900 px-10 py-4 rounded-full font-bold hover:bg-white transition-all transform hover:scale-105 shadow-2xl"
          >
            Explorar Tienda
          </a>
          <button className="bg-transparent border border-white/50 text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 backdrop-blur-sm transition-all">
            Nuestra Historia
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;