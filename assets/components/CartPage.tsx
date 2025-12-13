
import React from 'react';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  onNavigate: (view: any) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
        <div className="w-32 h-32 bg-rose-50 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-rose-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-2">السلة فارغة</h2>
        <p className="text-stone-500 mb-8 text-center max-w-md">
          يبدو أنك لم تقومي بإضافة أي منتجات إلى السلة بعد. تصفحي متجرنا واختاري ما يناسب إبداعك.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-8 py-3 bg-rose-600 text-white rounded-full font-bold hover:bg-rose-700 transition shadow-lg hover:shadow-rose-300 transform hover:-translate-y-1"
        >
          تابع رحلة التسوق
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-stone-900 mb-8 border-b border-stone-200 pb-4">سلة المشتريات</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="lg:w-2/3 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex flex-col sm:flex-row items-center gap-4 transition hover:shadow-md">
              <div className="w-full sm:w-24 h-24 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0">
                <img 
                  src={item.images[0] || 'https://via.placeholder.com/150'} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-grow text-center sm:text-right">
                <h3 className="font-bold text-lg text-stone-800">{item.name}</h3>
                <p className="text-stone-500 text-sm mb-2">{item.category}</p>
                <div className="font-bold text-rose-600">
                  {item.price.toLocaleString()} د.ع
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-stone-50 rounded-xl border border-stone-200 p-1">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-rose-600 hover:bg-white rounded-lg transition"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-stone-800">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-rose-600 hover:bg-white rounded-lg transition"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                  title="حذف المنتج"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-rose-100 sticky top-24">
            <h3 className="text-xl font-bold text-stone-900 mb-6">ملخص الطلب</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-stone-600">
                <span>عدد المنتجات</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>الشحن</span>
                <span>يحدد عند الدفع</span>
              </div>
              <div className="border-t border-stone-100 pt-3 flex justify-between font-bold text-lg text-stone-900">
                <span>المجموع</span>
                <span className="text-rose-600">{totalPrice.toLocaleString()} د.ع</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('checkout')}
              className="w-full py-4 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition shadow-lg shadow-rose-200 active:transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>إتمام الطلب</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
            
            <button
              onClick={() => onNavigate('shop')}
              className="w-full mt-3 py-3 text-stone-500 font-medium hover:text-rose-600 transition"
            >
              مواصلة التسوق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
