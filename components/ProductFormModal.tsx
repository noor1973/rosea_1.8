import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';

import { db } from '../firebase';
import {
  addDoc,
  updateDoc,
  doc,
  collection
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id'>) => void;
  initialData?: Product;
  categories: string[];
  onAddCategory: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSubmit, initialData, categories, onAddCategory }) => {
  const [formData, setFormData] = useState<{
    name: string;
    price: number;
    category: string;
    images: string[];
    description: string;
    stock: number;
  }>({
    name: '',
    price: 0,
    category: categories[0] || '',
    images: [],
    description: '',
    stock: 10,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
        category: initialData.category,
        images: initialData.images || [],
        description: initialData.description,
        stock: initialData.stock || 0,
      });
    } else {
      setFormData({
        name: '',
        price: 0,
        category: categories[0] || '',
        images: [], 
        description: '',
        stock: 10,
      });
    }
  }, [initialData, isOpen, categories]);

  if (!isOpen) return null;

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const finalData = {
    name: formData.name,
    price: formData.price,
    category: formData.category,
    images: formData.images.length > 0
      ? formData.images
      : ['https://via.placeholder.com/400?text=No+Image'],
    description: formData.description,
    stock: formData.stock,
    createdAt: new Date(),
  };

  try {
    if (initialData?.id) {
      // تعديل منتج
      const ref = doc(db, 'products', initialData.id);
      await updateDoc(ref, finalData);
    } else {
      // إضافة منتج جديد
      await addDoc(collection(db, 'products'), finalData);
    }

    onClose();
  } catch (error) {
    console.error('Firebase error:', error);
    alert('صار خطأ أثناء حفظ المنتج');
  }
};


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 800; 
          
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setFormData(prev => ({ ...prev, images: [...prev.images, dataUrl] }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-stone-900 opacity-75 backdrop-blur-sm"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start sm:flex-row-reverse">
              <div className="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right w-full">
                <h3 className="text-xl leading-6 font-bold text-stone-900 mb-6 flex items-center gap-2">
                  {initialData ? (
                    <><span className="text-rose-600">✎</span> تعديل المنتج</>
                  ) : (
                    <><span className="text-rose-600">+</span> إضافة منتج جديد</>
                  )}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                       صور المنتج (الألوان والأشكال)
                       <span className="block text-xs text-stone-400 font-normal mt-1">كل صورة تضاف ستظهر كخيار منفصل للشراء (لتمثيل الألوان أو الأشكال المختلفة)</span>
                    </label>
                    
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {formData.images.map((imgUrl, idx) => (
                          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-stone-200 group">
                            <img src={imgUrl} alt={`Option ${idx + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-1">
                              خيار {idx + 1}
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-white/90 text-rose-600 rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-rose-600 hover:text-white transition-colors"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer group flex flex-col items-center justify-center relative rounded-2xl border-2 border-dashed border-stone-300 hover:border-rose-500 hover:bg-rose-50 transition-all duration-300 bg-stone-50 overflow-hidden py-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-white shadow-sm text-stone-400 rounded-full flex items-center justify-center mb-2 group-hover:text-rose-500 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </div>
                        <p className="text-sm font-bold text-stone-700">أضف صورة (لون/شكل)</p>
                      </div>
                      
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">اسم المنتج</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">السعر (د.ع)</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">الكمية (المخزون)</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none bg-rose-50/50 font-medium text-rose-800"
                      />
                    </div>
                  </div>

                   <div className="grid grid-cols-1 gap-4">
                    <div>
                       <label className="block text-sm font-medium text-stone-700 mb-1">التصنيف</label>
                       <div className="flex gap-2">
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={onAddCategory}
                          className="px-3 py-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-200 hover:bg-rose-100 font-bold"
                          title="إضافة قسم جديد"
                        >
                          +
                        </button>
                       </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">الوصف</label>
                    <textarea 
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      placeholder="اكتبي وصفاً جذاباً للمنتج..."
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>

                  <div className="mt-6 flex flex-row-reverse gap-3">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-3 bg-rose-600 text-base font-medium text-white hover:bg-rose-700 focus:outline-none sm:w-auto sm:text-sm"
                    >
                      {initialData ? 'حفظ التعديلات' : 'إضافة المنتج'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 w-full inline-flex justify-center rounded-xl border border-stone-300 shadow-sm px-4 py-3 bg-white text-base font-medium text-stone-700 hover:bg-stone-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
