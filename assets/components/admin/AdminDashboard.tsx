
import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';

interface AdminDashboardProps {
  onNavigate: (view: any) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onAddProduct: () => void;
  onDeleteCategory: (cat: string) => void;
  onAddCategory: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onNavigate, 
  onEditProduct, 
  onDeleteProduct,
  onAddProduct,
  onDeleteCategory,
  onAddCategory
}) => {
  const { products, categories, resetData, logoutAdmin, siteContent, updateSiteContent } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'content'>('products');

  // Content editing state
  const [contentForm, setContentForm] = useState(siteContent);
  const [isSaved, setIsSaved] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.includes(searchTerm) || p.category.includes(searchTerm)
  );

  const handleSaveContent = () => {
    updateSiteContent(contentForm);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900">لوحة الإدارة</h1>
          <p className="text-stone-500 mt-1">إدارة المنتجات والأقسام ومحتوى الموقع</p>
        </div>
        <div className="flex flex-wrap gap-3">
           <button 
            onClick={onNavigate.bind(null, 'home')}
            className="bg-white border border-stone-300 text-stone-600 px-4 py-2 rounded-lg font-bold hover:bg-stone-50 transition"
          >
            عرض الموقع
          </button>
          <button 
            onClick={() => {
              if(window.confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                logoutAdmin();
                onNavigate('home');
              }
            }}
            className="bg-stone-200 text-stone-700 px-4 py-2 rounded-lg font-bold hover:bg-stone-300 transition"
          >
            تسجيل خروج
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'products' ? 'bg-rose-600 text-white shadow-md' : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'}`}
        >
          📦 المنتجات والأقسام
        </button>
        <button 
          onClick={() => setActiveTab('content')}
          className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'content' ? 'bg-rose-600 text-white shadow-md' : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'}`}
        >
          📝 محتوى الصفحات
        </button>
      </div>

      {activeTab === 'products' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-stone-500 font-medium">إجمالي المنتجات</p>
                <h3 className="text-3xl font-bold text-stone-900">{products.length}</h3>
              </div>
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 text-xl font-bold">
                📦
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-stone-500 font-medium">الأقسام</p>
                <h3 className="text-3xl font-bold text-stone-900">{categories.length}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold">
                📑
              </div>
            </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-stone-500 font-medium">تنبيهات المخزون</p>
                <h3 className="text-3xl font-bold text-red-600">{products.filter(p => p.stock <= 0).length}</h3>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 text-xl font-bold">
                ⚠️
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input 
              type="text" 
              placeholder="بحث عن منتج..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <button 
              onClick={onAddProduct}
              className="bg-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-700 transition shadow-md flex items-center justify-center gap-2"
            >
              <span>+</span> إضافة منتج جديد
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-stone-700">المنتج</th>
                    <th className="px-6 py-4 font-bold text-stone-700">السعر</th>
                    <th className="px-6 py-4 font-bold text-stone-700">التصنيف</th>
                    <th className="px-6 py-4 font-bold text-stone-700">المخزون</th>
                    <th className="px-6 py-4 font-bold text-stone-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-stone-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-12 h-12 rounded-lg object-cover border border-stone-200" 
                          />
                          <span className="font-medium text-stone-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-stone-600 font-bold">{product.price.toLocaleString()} د.ع</td>
                      <td className="px-6 py-4">
                        <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-bold">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => onEditProduct(product)}
                            className="p-2 text-stone-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="تعديل"
                          >
                            ✎
                          </button>
                          <button 
                            onClick={() => onDeleteProduct(product.id)}
                            className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="حذف"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredProducts.length === 0 && (
              <div className="p-8 text-center text-stone-500">لا توجد منتجات مطابقة للبحث</div>
            )}
          </div>

          {/* Categories Management */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-stone-900">إدارة الأقسام</h2>
              <button 
                onClick={onAddCategory}
                className="text-rose-600 font-bold text-sm hover:underline"
              >
                + إضافة قسم
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                 <div key={cat} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-stone-200 shadow-sm">
                   <span className="font-medium text-stone-700">{cat}</span>
                   <button 
                    onClick={() => onDeleteCategory(cat)}
                    className="text-stone-400 hover:text-red-600 transition"
                   >
                     &times;
                   </button>
                 </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 mb-12 animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-stone-900">تعديل محتوى الصفحات</h2>
            <button 
              onClick={handleSaveContent}
              className={`px-6 py-2 rounded-xl font-bold text-white transition-all shadow-md ${isSaved ? 'bg-green-600' : 'bg-rose-600 hover:bg-rose-700'}`}
            >
              {isSaved ? 'تم الحفظ بنجاح ✓' : 'حفظ التغييرات'}
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">من نحن</label>
              <textarea 
                value={contentForm.about}
                onChange={(e) => setContentForm({...contentForm, about: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">الشروط والأحكام</label>
              <textarea 
                value={contentForm.terms}
                onChange={(e) => setContentForm({...contentForm, terms: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">سياسة الخصوصية</label>
              <textarea 
                value={contentForm.privacy}
                onChange={(e) => setContentForm({...contentForm, privacy: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">سياسة الاستبدال والاسترجاع</label>
              <textarea 
                value={contentForm.returns}
                onChange={(e) => setContentForm({...contentForm, returns: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
            
            <div className="bg-stone-50 p-4 rounded-xl text-sm text-stone-500">
               * ملاحظة: الأسئلة الشائعة حالياً يتم تعديلها من الكود المصدري، سيتم إضافة محرر لها قريباً.
            </div>
          </div>
        </div>
      )}

       {/* System Actions */}
       <div className="border-t border-stone-200 pt-8">
        <h2 className="text-xl font-bold text-stone-900 mb-4">إجراءات النظام</h2>
        <button 
          onClick={() => {
             if(window.confirm("تحذير: هذا سيقوم بمسح جميع التعديلات وإعادة الموقع لحالته الأصلية. هل أنت متأكد؟")) {
               resetData();
             }
          }}
          className="bg-red-50 text-red-700 border border-red-200 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition"
        >
          ⚠️ إعادة ضبط المصنع (Reset Data)
        </button>
       </div>

    </div>
  );
};
