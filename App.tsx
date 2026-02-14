
import React, { useState, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import AIChat from './components/AIChat';
import VoiceAgent from './components/VoiceAgent';
import { Product, CartItem } from './types';
import { PRODUCTS } from './constants';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  }, []);

  const cartTotal = useMemo(() => 
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const filteredProducts = useMemo(() => 
    activeCategory === 'Todos' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory),
    [activeCategory]
  );

  return (
    <div className="min-h-screen">
      <Header 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
      />
      
      <main className="pb-20">
        <Hero />
        
        <div id="tienda" className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <h2 className="text-4xl font-serif text-amber-900">Nuestras Creaciones</h2>
            <div className="flex flex-wrap gap-2">
              {['Todos', 'Panes', 'Repostería', 'Saludable'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full border transition-all ${
                    activeCategory === cat 
                      ? 'bg-amber-800 text-white border-amber-800 shadow-lg' 
                      : 'border-amber-200 text-amber-900 hover:border-amber-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
        </div>

        {/* Sección de Voice Call con MadreHogaza */}
        <section className="bg-stone-900 py-16 text-amber-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif mb-4">Habla con MadreHogaza</h2>
              <p className="text-stone-400 font-light max-w-lg mx-auto">
                Experimenta una conversación real con voz. Nuestra IA experta, con el corazón de una abuela panadera, está lista para escucharte.
              </p>
            </div>
            <VoiceAgent />
          </div>
        </section>

        <section className="bg-amber-50 py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-serif text-amber-900 mb-6">Artesanía en Cada Miga</h2>
            <p className="text-lg text-amber-800 leading-relaxed mb-8">
              Utilizamos granos de molino de piedra, largas fermentaciones naturales y 
              mucha paciencia. Creemos que la comida debe nutrir tanto el alma como el cuerpo.
              Nuestra repostería equilibra el placer de lo dulce con ingredientes honestos.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="text-4xl mb-4">🌾</div>
                <h3 className="font-serif font-bold text-amber-900 mb-2">Harinas Orgánicas</h3>
                <p className="text-sm text-stone-600">Sin aditivos ni químicos, directas del molino.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="text-4xl mb-4">⌛</div>
                <h3 className="font-serif font-bold text-amber-900 mb-2">Lenta Fermentación</h3>
                <p className="text-sm text-stone-600">Mejor digestión y aroma profundo de verdad.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm">
                <div className="text-4xl mb-4">🍯</div>
                <h3 className="font-serif font-bold text-amber-900 mb-2">Dulzor Consciente</h3>
                <p className="text-sm text-stone-600">Miel pura y frutas de temporada como base.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        total={cartTotal}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />

      <AIChat 
        isOpen={isChatOpen} 
        onToggle={() => setIsChatOpen(!isChatOpen)} 
      />

      <footer className="bg-amber-900 text-amber-50 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-serif mb-4 italic">Masa Madre & Miel</h3>
            <p className="text-amber-200">Panadería y repostería artesana con alma, corazón y mucha harina.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest">Horarios</h4>
            <p className="text-sm">Lun - Vie: 08:00 - 20:00</p>
            <p className="text-sm">Sáb - Dom: 09:00 - 14:00</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-widest">Contacto</h4>
            <p className="text-sm">Calle de la Harina 12, Ciudad Pan.</p>
            <p className="text-sm">hola@masamadremiel.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
