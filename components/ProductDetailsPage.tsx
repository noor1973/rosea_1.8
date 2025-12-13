
import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailsPageProps {
  product: Product;
  onBack: () => void;
  onNavigate: (view: any) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ product, onBack, onNavigate }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const isOutOfStock = product.stock <= 0;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
    // Optional: provide feedback
    // alert("تمت الإضافة للسلة"); 
  };

  // Ensure there's at least one image
  const images = product.images.length > 0 ? product.images : ['https://via.placeholder.com/600?text=No+Image'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumb / Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center text-stone-500 hover:text-rose-600 mb-6 transition-colors font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2 rtl:rotate-180">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        العودة للمتجر
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Right Column: Images with Controls */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {images.map((img, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-6 bg-white p-4 rounded-2xl shadow-sm border border-stone-100 items-start sm:items-center">
              {/* Image Area - Smaller size */}
              <div className="w-full sm:w-48 h-48 bg-stone-100 rounded-xl overflow-hidden shadow-inner flex-shrink-0">
                <img 
                  src={img} 
                  alt={`${product.name} - ${index + 1}`} 
                  className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-75' : ''}`}
                  loading="lazy"
                />
              </div>

              {/* Controls Beside Image */}
              <div className="flex-grow w-full">
                <h3 className="text-lg font-bold text-stone-800 mb-2">خيار {index + 1}</h3>
                <div className="text-xl font-bold text-rose-600 mb-4">
                    {product.price.toLocaleString()} د.ع
                </div>
                
                {!isOutOfStock ? (
                  <div className="flex flex-col gap-4">
                     <div className="flex items-center bg-stone-50 rounded-xl border border-stone-200 p-1 w-fit">
                        <span className="ml-3 mr-2 font-bold text-sm text-stone-600">الكمية:</span>
                        <button 
                          onClick={handleDecrement}
                          className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-rose-600 hover:bg-white rounded-lg transition"
                          disabled={quantity <= 1}
                        > - </button>
                        <span className="w-10 text-center font-bold text-stone-800">{quantity}</span>
                        <button 
                          onClick={handleIncrement}
                          className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-rose-600 hover:bg-white rounded-lg transition"
                          disabled={quantity >= product.stock}
                        > + </button>
                      </div>

                      <button
                        onClick={handleAddToCart}
                        className="w-full sm:w-auto px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition shadow-md hover:shadow-rose-200 flex items-center justify-center gap-2"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        أضف للسلة
                      </button>
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold inline-block border border-red-100">
                    نفذت الكمية
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Left Column: Product Info (Sticky) - Controls removed as requested */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white p-6 rounded-3xl shadow-xl border border-stone-100">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-sm font-bold">
                {product.category}
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-stone-900 mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="text-2xl font-bold text-stone-700 mb-6">
              وصف المنتج
            </div>

            <p className="text-stone-500 leading-relaxed mb-4">
              {product.description}
            </p>
            
            <div className="border-t border-stone-100 pt-4 mt-4 text-sm text-stone-400">
               * يمكنك اختيار الكمية المطلوبة لكل صورة من القائمة الجانبية.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
