import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Menu, X, Heart, Settings, LogOut, Phone, Search, Plus, Filter, ChevronRight, Pencil, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { INITIAL_PRODUCTS } from './constants';
import { Product, CartItem, ViewMode } from './types';
import { ProductCard } from './components/ProductCard';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  // State
  const [viewMode, setViewMode] = useState<ViewMode>('STORE');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false); // Sidebar state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Category Filter
  
  // Banner State
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Initial Load
  useEffect(() => {
    const storedProducts = localStorage.getItem('rosea_products');
    const storedBanner = localStorage.getItem('rosea_banner');
    
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('rosea_products', JSON.stringify(INITIAL_PRODUCTS));
    }

    if (storedBanner) {
      setBannerImage(storedBanner);
    }
  }, []);

  // Sync Products to LocalStorage
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('rosea_products', JSON.stringify(products));
    }
  }, [products]);

  // Extract Unique Categories
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  // Cart Helpers
  const addToCart = (product: Product, selectedColor: string, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id && p.selectedColor === selectedColor);
      if (existing) {
        return prev.map(p => 
          (p.id === product.id && p.selectedColor === selectedColor) 
          ? { ...p, quantity: p.quantity + quantity } 
          : p
        );
      }
      return [...prev, { ...product, selectedColor, quantity: quantity, cartId: `${product.id}-${Date.now()}` }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    const message = `مرحباً Rosea_18، أرغب بطلب المنتجات التالية:%0a` + 
      cart.map(item => `- ${item.name} (${item.selectedColor}) العدد: ${item.quantity}`).join('%0a') +
      `%0a------------------%0aالمجموع: ${cartTotal.toLocaleString()} د.ع`;
    
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  // Admin Helpers
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    setShowProductModal(false);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  // Category Management (Admin)
  const handleRenameCategory = (oldName: string) => {
    const newName = window.prompt(`تغيير اسم القسم "${oldName}" إلى:`, oldName);
    if (newName && newName.trim() !== "" && newName !== oldName) {
      const confirmUpdate = window.confirm(`سيتم تحديث جميع المنتجات في قسم "${oldName}" إلى "${newName}". هل أنت متأكد؟`);
      if (confirmUpdate) {
        setProducts(prev => prev.map(p => 
          p.category === oldName ? { ...p, category: newName.trim() } : p
        ));
        if (selectedCategory === oldName) setSelectedCategory(newName.trim());
      }
    }
  };

  // Banner Management
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setBannerImage(result);
        localStorage.setItem('rosea_banner', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBanner = () => {
    if(window.confirm('هل تريد حذف صورة الواجهة؟')) {
      setBannerImage(null);
      localStorage.removeItem('rosea_banner');
    }
  };

  // Filter Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.includes(searchQuery);
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-rose-50/30 font-sans flex flex-col">
      
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-rose-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSideMenuOpen(true)} 
                className="p-2 hover:bg-rose-50 rounded-xl transition text-gray-700"
              >
                <Menu className="w-7 h-7" />
              </button>
              
              <h1 
                onClick={() => { setViewMode('STORE'); setSelectedCategory(null); }} 
                className="text-2xl md:text-3xl font-bold text-rose-600 cursor-pointer"
                style={{ fontFamily: 'serif' }}
              >
                Rosea_18
              </h1>
            </div>

            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 border-none rounded-full py-2 px-10 focus:ring-2 focus:ring-rose-300 transition-all"
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {viewMode === 'ADMIN' ? (
                <button 
                  onClick={() => setViewMode('STORE')}
                  className="text-sm font-bold text-gray-600 hover:text-rose-600 flex items-center gap-1 bg-gray-100 px-3 py-2 rounded-full transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">عودة للمتجر</span>
                </button>
              ) : (
                <button 
                  onClick={() => setViewMode('ADMIN')}
                  className="text-gray-500 hover:text-rose-600 transition p-2 rounded-full hover:bg-rose-50"
                  title="الدخول كمسؤول"
                >
                  <Settings className="w-6 h-6" />
                </button>
              )}

              <button 
                className="relative p-2 text-gray-700 hover:text-rose-600 transition"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="w-7 h-7" />
                {cart.length > 0 && (
                  <span className="absolute top-1 right-0 bg-rose-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Side Menu (Categories) */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsSideMenuOpen(false)}></div>
          <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col animate-slideRight">
            <div className="p-6 bg-rose-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">أقسام المتجر</h2>
              <button onClick={() => setIsSideMenuOpen(false)} className="p-2 hover:bg-white rounded-full transition">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <div className="p-4 space-y-2 overflow-y-auto flex-1">
              <button
                onClick={() => { setSelectedCategory(null); setIsSideMenuOpen(false); }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  selectedCategory === null ? 'bg-rose-100 text-rose-800 font-bold' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span>جميع المنتجات</span>
                {selectedCategory === null && <ChevronRight size={18} />}
              </button>
              
              <div className="border-t border-gray-100 my-2"></div>
              
              {categories.map(cat => (
                <div key={cat} className="flex items-center gap-1 group">
                  <button
                    onClick={() => { setSelectedCategory(cat); setIsSideMenuOpen(false); }}
                    className={`flex-1 flex items-center justify-between p-3 rounded-xl transition-all ${
                      selectedCategory === cat ? 'bg-rose-100 text-rose-800 font-bold' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <ChevronRight size={18} />}
                  </button>
                  
                  {viewMode === 'ADMIN' && (
                    <button 
                      onClick={() => handleRenameCategory(cat)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="تعديل اسم القسم"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                </div>
              ))}

              {viewMode === 'ADMIN' && (
                <button
                  onClick={() => { 
                    setShowProductModal(true); 
                    setEditingProduct(null);
                    setIsSideMenuOpen(false); 
                  }}
                  className="w-full mt-4 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-rose-400 hover:text-rose-600 hover:bg-rose-50 transition"
                >
                  <Plus size={18} />
                  <span>إضافة قسم جديد (عبر منتج)</span>
                </button>
              )}
            </div>

             <div className="p-4 bg-gray-50 text-center text-xs text-gray-400">
               Rosea_18 Store &copy; 2024
             </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        
        {/* Banner Section */}
        {!selectedCategory && !searchQuery && (
          <div className="mb-12 relative group rounded-3xl overflow-hidden shadow-md animate-fadeIn">
             {bannerImage ? (
                <div className="relative w-full h-64 md:h-96">
                  <img 
                    src={bannerImage} 
                    alt="Store Banner" 
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay Gradient for text readability if needed later, currently just image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
             ) : (
                // Default Placeholder State
                <div className="w-full h-64 md:h-80 bg-rose-100 rounded-3xl flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-rose-200">
                   <div className="inline-block p-2 px-4 bg-white/50 backdrop-blur text-rose-700 rounded-full text-sm font-bold mb-4 shadow-sm">
                     ✨ كل ما تحتاجه لصناعة الورد الأبدي
                   </div>
                   <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-2">
                     اصنع الجمال بيدك
                   </h2>
                   <p className="text-gray-600 max-w-lg text-lg">
                     متجرنا يوفر جميع مستلزمات صناعة الورد الابدي
                   </p>
                   {viewMode === 'ADMIN' && (
                     <p className="mt-4 text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                       (كمسؤول: اضغط هنا لرفع صورة كبيرة للمتجر)
                     </p>
                   )}
                </div>
             )}

             {/* Admin Controls for Banner */}
             {viewMode === 'ADMIN' && (
               <div className="absolute top-4 left-4 flex gap-2">
                  <button 
                    onClick={() => bannerInputRef.current?.click()}
                    className="bg-white/90 backdrop-blur text-gray-800 px-4 py-2 rounded-full shadow-lg hover:bg-rose-600 hover:text-white transition flex items-center gap-2 text-sm font-bold"
                  >
                    <Upload size={16} />
                    <span>{bannerImage ? 'تغيير الصورة' : 'رفع صورة'}</span>
                  </button>
                  {bannerImage && (
                    <button 
                      onClick={removeBanner}
                      className="bg-white/90 backdrop-blur text-red-500 px-3 py-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <input 
                    type="file" 
                    ref={bannerInputRef}
                    onChange={handleBannerUpload}
                    className="hidden"
                    accept="image/*"
                  />
               </div>
             )}
          </div>
        )}

        {viewMode === 'ADMIN' && (
          <div className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-rose-100 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">لوحة التحكم</h2>
              <p className="text-gray-500">إدارة المنتجات والأسعار</p>
            </div>
            <button 
              onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
              className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-rose-600 transition flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة منتج جديد</span>
            </button>
          </div>
        )}

        {/* Category Header */}
        {(selectedCategory || searchQuery) && (
          <div className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-800 animate-fadeIn">
            {selectedCategory ? (
              <>
                <span className="text-gray-400 font-normal">القسم:</span>
                <span className="text-rose-600">{selectedCategory}</span>
              </>
            ) : (
              <span className="text-gray-600">نتائج البحث</span>
            )}
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory(null)}
                className="mr-auto text-sm text-gray-500 underline hover:text-rose-600"
              >
                عرض الكل
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart}
                isAdmin={viewMode === 'ADMIN'}
                onEdit={openEditModal}
                onDelete={handleDeleteProduct}
              />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
               <Filter className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg">لا توجد منتجات في هذا القسم حالياً.</p>
              <button onClick={() => setSelectedCategory(null)} className="mt-4 text-rose-600 font-bold">عرض جميع المنتجات</button>
            </div>
          )}
        </div>
      </main>

      {/* Social Media Footer */}
      <footer className="bg-white border-t border-rose-100 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">تواصل معنا</h3>
          <p className="text-gray-500 mb-6 max-w-md">
            تابعنا على مواقع التواصل الاجتماعي لرؤية أحدث أعمالنا ومتابعة العروض الحصرية
          </p>
          
          <div className="flex gap-4">
            {/* Instagram */}
            <a href="https://instagram.com/rosea_18" target="_blank" rel="noreferrer" className="group relative w-12 h-12 flex items-center justify-center bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white rounded-full shadow-lg hover:-translate-y-1 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="group relative w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg hover:-translate-y-1 transition-transform duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>

            {/* Telegram */}
            <a href="https://t.me/rosea_18" target="_blank" rel="noreferrer" className="group relative w-12 h-12 flex items-center justify-center bg-sky-500 text-white rounded-full shadow-lg hover:-translate-y-1 transition-transform duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </a>

            {/* TikTok */}
            <a href="https://tiktok.com/@rosea_18" target="_blank" rel="noreferrer" className="group relative w-12 h-12 flex items-center justify-center bg-black text-white rounded-full shadow-lg hover:-translate-y-1 transition-transform duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
            </a>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 w-full text-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Rosea_18. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slideIn">
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                سلة المشتريات
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p>السلة فارغة حالياً</p>
                  <button onClick={() => setIsCartOpen(false)} className="text-rose-600 font-bold hover:underline">تسوق الآن</button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.cartId} className="flex gap-4 bg-gray-50 p-3 rounded-xl">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-white" />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-gray-500 text-xs mt-1">اللون: {item.selectedColor}</p>
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-3 bg-white rounded-lg px-2 py-1 shadow-sm border border-gray-100">
                          <button onClick={() => updateQuantity(item.cartId, -1)} className="text-gray-500 hover:text-rose-600">-</button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartId, 1)} className="text-gray-500 hover:text-rose-600">+</button>
                        </div>
                        <span className="font-bold text-rose-600">{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.cartId)} className="text-gray-400 hover:text-red-500 self-start">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">المجموع الكلي</span>
                  <span className="text-2xl font-bold text-gray-900">{cartTotal.toLocaleString()} <span className="text-sm font-normal text-gray-500">د.ع</span></span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  <span>تثبيت الطلب عبر واتساب</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showProductModal && (
        <AdminPanel 
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onClose={() => { setShowProductModal(false); setEditingProduct(null); }}
          productToEdit={editingProduct}
        />
      )}
    </div>
  );
}
