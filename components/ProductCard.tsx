
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-amber-50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
      <div className="relative h-72 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-amber-900/80 backdrop-blur-sm text-amber-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            {product.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-serif font-bold text-amber-900 group-hover:text-amber-700 transition-colors">
            {product.name}
          </h3>
          <span className="text-lg font-bold text-amber-800">${product.price.toFixed(2)}</span>
        </div>
        
        <p className="text-stone-500 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        {product.nutritionInfo && (
          <div className="bg-amber-50/50 p-2 rounded-lg mb-4">
            <p className="text-[10px] text-amber-700 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Nota de Salud
            </p>
            <p className="text-[11px] text-stone-600 italic leading-tight">{product.nutritionInfo}</p>
          </div>
        )}

        <button 
          onClick={onAddToCart}
          className="w-full bg-amber-100 hover:bg-amber-900 hover:text-white text-amber-900 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Añadir al Carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
