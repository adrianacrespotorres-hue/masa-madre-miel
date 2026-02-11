
import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  total, 
  onRemove, 
  onUpdateQuantity 
}) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-[#FDFCF8] z-50 shadow-2xl transition-transform duration-500 ease-out transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-amber-100 flex justify-between items-center">
            <h2 className="text-2xl font-serif text-amber-900">Tu Carrito</h2>
            <button onClick={onClose} className="p-2 hover:bg-amber-50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🧺</div>
                <p className="text-amber-800 font-serif italic text-lg">Tu cesta está vacía...</p>
                <button 
                  onClick={onClose}
                  className="mt-6 text-amber-600 font-bold underline"
                >
                  Seguir comprando
                </button>
              </div>
            ) : (
              items.map(item => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="h-20 w-20 flex-shrink-0 bg-stone-100 rounded-lg overflow-hidden">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-bold text-amber-900">{item.name}</h4>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-stone-500 mb-2">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-amber-200 rounded-full px-2 py-0.5">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 hover:text-amber-600"
                        >
                          -
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 hover:text-amber-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-amber-100 bg-amber-50/50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-stone-600 font-medium">Subtotal</span>
                <span className="text-2xl font-bold text-amber-900">${total.toFixed(2)}</span>
              </div>
              <button className="w-full bg-amber-800 text-white font-bold py-4 rounded-xl hover:bg-amber-900 transition-all shadow-lg">
                Finalizar Pedido
              </button>
              <p className="text-center text-xs text-stone-400 mt-4">
                Recogida en tienda o entrega a domicilio disponible.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
