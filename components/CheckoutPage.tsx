
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storage';
import { Order, CustomerDetails } from '../types';

interface CheckoutPageProps {
  onNavigate: (view: any) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState<CustomerDetails>({
    fullName: currentUser?.name || '',
    governorate: '',
    landmark: '',
    phone: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // If accessed with empty cart, redirect back
  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <p className="text-xl text-stone-600 mb-4">السلة فارغة، لا يمكن إتمام الطلب.</p>
        <button onClick={() => onNavigate('shop')} className="text-rose-600 font-bold underline">
          العودة للمتجر
        </button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-green-100 shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-stone-900 mb-2">تم استلام طلبك بنجاح!</h2>
        <p className="text-stone-500 mb-8 text-center max-w-md">
          شكراً لتسوقك من Rosea_1.8. سيقوم فريقنا بالتواصل معك قريباً لتأكيد الطلب وتفاصيل التوصيل.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-8 py-3 bg-rose-600 text-white rounded-full font-bold hover:bg-rose-700 transition shadow-lg"
        >
          تابع رحلة التسوق
        </button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null); // Clear error on typing
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim() || !formData.governorate.trim() || !formData.landmark.trim() || !formData.phone.trim()) {
      setError("يرجى ملء جميع الحقول لإتمام الطلب");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Create Order Object
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customer: formData,
      items: [...cartItems],
      totalPrice: totalPrice,
      date: new Date().toISOString(),
      status: 'new'
    };

    // Save to simulated DB
    const existingOrders = storage.get<Order[]>('rosea_orders', []);
    storage.set('rosea_orders', [newOrder, ...existingOrders]);

    // Clear Cart and Show Success
    clearCart();
    setIsSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-stone-900">إتمام الطلب</h1>
        <p className="text-stone-500 mt-2">يرجى تعبئة بيانات التوصيل بدقة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-stone-100">
            
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span className="font-bold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="الاسم الثلاثي"
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  المحافظة <span className="text-red-500">*</span>
                </label>
                <select
                  name="governorate"
                  value={formData.governorate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none transition-all bg-white"
                >
                  <option value="">اختر المحافظة...</option>
                  <option value="بغداد">بغداد</option>
                  <option value="البصرة">البصرة</option>
                  <option value="نينوى">نينوى</option>
                  <option value="أربيل">أربيل</option>
                  <option value="النجف">النجف</option>
                  <option value="كربلاء">كربلاء</option>
                  <option value="كركوك">كركوك</option>
                  <option value="ديالى">ديالى</option>
                  <option value="الأنبار">الأنبار</option>
                  <option value="بابل">بابل</option>
                  <option value="واسط">واسط</option>
                  <option value="صلاح الدين">صلاح الدين</option>
                  <option value="دهوك">دهوك</option>
                  <option value="القادسية">القادسية</option>
                  <option value="المثنى">المثنى</option>
                  <option value="ميسان">ميسان</option>
                  <option value="ذي قار">ذي قار</option>
                  <option value="السليمانية">السليمانية</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  أقرب نقطة دالة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  placeholder="مثال: قرب مستشفى الزهراء / مقابل جامع..."
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  رقم الهاتف <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="07xxxxxxxxx"
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none transition-all dir-ltr text-right"
                  dir="ltr"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 mt-6">
                <button
                  type="submit"
                  className="w-full py-4 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition shadow-lg shadow-rose-200 active:transform active:scale-95 text-lg"
                >
                  إتمام الطلب ({totalPrice.toLocaleString()} د.ع)
                </button>
                <p className="text-center text-xs text-stone-400 mt-3">الدفع يكون نقداً عند الاستلام</p>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary Side */}
        <div className="md:col-span-1">
          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 sticky top-24">
            <h3 className="font-bold text-stone-800 mb-4 pb-2 border-b border-stone-200">محتويات الطلب</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4 pr-1 scrollbar-thin">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-stone-200">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-stone-700 line-clamp-1">{item.name}</p>
                    <p className="text-stone-500 text-xs">الكمية: {item.quantity}</p>
                  </div>
                  <div className="font-bold text-rose-600">
                    {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-200 pt-4 space-y-2">
              <div className="flex justify-between font-bold text-stone-900 text-lg">
                <span>المجموع الكلي</span>
                <span>{totalPrice.toLocaleString()} د.ع</span>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('cart')}
              className="w-full mt-6 text-sm text-stone-500 hover:text-rose-600 underline"
            >
              تعديل السلة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
