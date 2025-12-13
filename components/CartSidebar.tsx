
import React from 'react';
import { useCart } from '../context/CartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: 'cart' | 'checkout') => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, onNavigate }) => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  const handleNavigate = (view: 'cart' | 'checkout') => {
    onNavigate(view);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[60] overflow-hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />
      
      {/* Sidebar Panel */}
      <div className={`absolute inset-y-0 left-0 max-w-full flex transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-rose-50/50">
            <h2 className="text-xl font-bold text-stone-800">سلة المشتريات</h2>
            <button onClick={onClose} className="text-stone-500 hover:text-rose-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-rose-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
                <p className="text-stone-500 font-medium">السلة فارغة حالياً</p>
                <button 
                  onClick={onClose}
                  className="px-6 py-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition"
                >
                  ابدأ التسوق
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center space-x-4 space-x-reverse bg-white p-2 rounded-xl border border-stone-100 shadow-sm">
                  <div className="w-20 h-20 flex-shrink-0 bg-stone-100 rounded-lg overflow-hidden relative">
                    <img 
                      src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/400'} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-stone-800 line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-rose-600 font-medium mt-1">{item.price.toLocaleString()} د.ع</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                     <div className="flex items-center bg-stone-50 rounded-lg border border-stone-200">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-500 hover:text-rose-600"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                           onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-stone-500 hover:text-rose-600"
                        >
                          +
                        </button>
                     </div>
                     <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-stone-400 underline hover:text-rose-500"
                      >
                        حذف
                      </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-stone-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-stone-500">المجموع الكلي</span>
                <span className="text-2xl font-bold text-stone-900">{totalPrice.toLocaleString()} د.ع</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleNavigate('cart')}
                  className="w-full py-3 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 transition"
                >
                  عرض السلة
                </button>
                <button 
                  onClick={() => handleNavigate('checkout')}
                  className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition shadow-lg shadow-rose-200 active:transform active:scale-95"
                >
                  إتمام الطلب
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
