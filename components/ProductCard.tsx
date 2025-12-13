
import React from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
  onClick?: (product: Product) => void; 
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete, onClick }) => {
  const { isAdmin } = useShop();
  
  const isOutOfStock = product.stock <= 0;
  const displayImage = product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400';

  return (
    <div 
      className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 overflow-hidden flex flex-col h-full relative cursor-pointer ${isOutOfStock ? 'opacity-90' : ''}`}
      onClick={() => onClick && onClick(product)}
    >
      <div className="relative overflow-hidden aspect-square bg-stone-100 group-image-container">
        <img 
          src={displayImage} 
          alt={product.name} 
          className={`object-cover w-full h-full transform transition-transform duration-500 ${isOutOfStock ? 'grayscale scale-100' : 'group-hover:scale-105'}`}
          loading="lazy"
        />
        <div className={`absolute inset-0 transition-colors duration-300 ${isOutOfStock ? 'bg-black/10' : 'bg-black/0 group-hover:bg-black/5'}`} />

        {/* Sold Out Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg border-2 border-white transform -rotate-12">
              نفذت الكمية
            </span>
          </div>
        )}

        {/* Admin Actions Overlay */}
        {isAdmin && (
          <div className="absolute top-2 right-2 z-20 flex gap-2">
            {onEdit && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
                className="bg-white/90 backdrop-blur text-stone-700 p-2 rounded-full shadow-md hover:bg-rose-600 hover:text-white transition-all"
                title="تعديل المنتج"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(product.id);
                }}
                className="bg-white/90 backdrop-blur text-red-500 p-2 rounded-full shadow-md hover:bg-red-600 hover:text-white transition-all"
                title="حذف المنتج"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-stone-800 mb-1 line-clamp-1">{product.name}</h3>
          <div className="text-lg font-bold text-rose-600">
             {product.price.toLocaleString()} د.ع
          </div>
        </div>
        
        <div className="flex justify-between items-start mt-auto">
           <div className="text-xs font-medium text-stone-400">{product.category}</div>
           {isAdmin && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {product.stock}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
