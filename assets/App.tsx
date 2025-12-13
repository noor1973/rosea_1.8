
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { CartSidebar } from './components/CartSidebar';
import { NavigationDrawer } from './components/NavigationDrawer';
import { AiAssistant } from './components/AiAssistant';
import { ProductFormModal } from './components/ProductFormModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { StaticPages } from './components/StaticPages';
import { Hero } from './components/Hero';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { ProductDetailsPage } from './components/ProductDetailsPage';
import { AdminLoginPage } from './components/auth/AdminLoginPage';
import { OrdersPage } from './components/admin/OrdersPage';
import { Product } from './types';
import { ShopProvider, useShop } from './context/ShopContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function MainLayout() {
  const { 
    products, 
    categories, 
    isAdmin, 
    toggleAdmin, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    addCategory,
    deleteCategory,
    resetData,
    logoutAdmin
  } = useShop();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // View State
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'login' | 'signup' | 'forgot-password' | 'cart' | 'checkout' | 'product-details' | 'admin-login' | 'orders' | 'static-page'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | 'ALL'>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentStaticPage, setCurrentStaticPage] = useState<string>('');
  
  // Shop Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  
  const [deleteConfig, setDeleteConfig] = useState<{
    isOpen: boolean;
    type: 'product' | 'category' | null;
    id: number | string | null;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: null,
    id: null,
    title: '',
    message: ''
  });

  // Secret Admin Trigger via URL hash only
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin-login');
        // Clear hash to prevent stuck state
        history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Check on initial load
    if (window.location.hash === '#admin') {
       handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handlers
  const handleDeleteProductClick = (productId: number) => {
    setDeleteConfig({
      isOpen: true,
      type: 'product',
      id: productId,
      title: 'حذف المنتج',
      message: 'هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.'
    });
  };

  const handleDeleteCategoryClick = (categoryToDelete: string) => {
    setDeleteConfig({
      isOpen: true,
      type: 'category',
      id: categoryToDelete,
      title: 'حذف القسم',
      message: `هل أنت متأكد من حذف قسم "${categoryToDelete}"؟ سيظل المنتجات التابعة له موجودة ولكن بدون تصنيف.`
    });
  };

  const executeDelete = () => {
    if (deleteConfig.type === 'product' && typeof deleteConfig.id === 'number') {
      deleteProduct(deleteConfig.id);
    } else if (deleteConfig.type === 'category' && typeof deleteConfig.id === 'string') {
      deleteCategory(deleteConfig.id);
      if (selectedCategory === deleteConfig.id) setSelectedCategory('ALL');
    }
    setDeleteConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleAddCategoryPrompt = () => {
    const name = window.prompt("أدخل اسم القسم الجديد:");
    if (name && name.trim() !== "") {
      addCategory(name.trim());
    }
  };

  const openAddModal = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateStatic = (page: string) => {
    setCurrentStaticPage(page);
    setCurrentView('static-page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter & Sort Logic
  const getFilteredProducts = () => {
    let result = products;

    // Filter by Category
    if (selectedCategory !== 'ALL') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Sort
    if (sortOption === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else {
      // Newest (Default by ID for now as mock)
      result = [...result].sort((a, b) => b.id - a.id);
    }

    return result;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="min-h-screen bg-stone-50 font-sans relative flex flex-col">
      <Navbar 
        onOpenCart={() => setIsCartOpen(true)} 
        onNavigate={setCurrentView}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={setCurrentView}
        onSelectCategory={setSelectedCategory}
        currentView={currentView === 'product-details' ? 'shop' : currentView} 
        selectedCategory={selectedCategory}
        isAdmin={isAdmin}
        onToggleAdmin={() => {}} /* Deprecated */
        onAddProduct={openAddModal}
        categories={categories}
        onAddCategory={handleAddCategoryPrompt}
        onDeleteCategory={handleDeleteCategoryClick}
        onLogoutAdmin={logoutAdmin}
        onNavigateStatic={handleNavigateStatic}
      />

      <ConfirmationModal
        isOpen={deleteConfig.isOpen}
        onClose={() => setDeleteConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={executeDelete}
        title={deleteConfig.title}
        message={deleteConfig.message}
      />

      <div className="flex-grow">
        {currentView === 'home' && (
          <>
            <Hero onShopNow={() => setCurrentView('shop')} />
            
            <div id="best-sellers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-stone-900">الأكثر مبيعاً</h2>
                <p className="mt-4 text-stone-500">مختارات مميزة لبدء مشروعك الفني</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.slice(0, 4).map(product => (
                  <div key={product.id} className="h-full">
                    <ProductCard 
                      product={product} 
                      onEdit={openEditModal}
                      onDelete={handleDeleteProductClick}
                      onClick={handleProductClick}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {currentView === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
            {/* Search & Sort Controls */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
               <div className="w-full md:w-1/3 relative">
                 <input 
                   type="text" 
                   placeholder="بحث عن منتج..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                 />
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-3 top-2.5 text-stone-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                 </svg>
               </div>

               <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                  <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as any)}
                    className="px-4 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white text-stone-700 font-medium"
                  >
                    <option value="newest">الأحدث</option>
                    <option value="price-asc">الأرخص</option>
                    <option value="price-desc">الأغلى</option>
                  </select>
               </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border ${
                  selectedCategory === 'ALL' 
                    ? 'bg-rose-600 text-white border-rose-600' 
                    : 'bg-white text-stone-600 border-stone-200 hover:border-rose-300'
                }`}
              >
                الكل
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border flex items-center gap-2 group ${
                    selectedCategory === cat 
                      ? 'bg-rose-600 text-white border-rose-600' 
                      : 'bg-white text-stone-600 border-stone-200 hover:border-rose-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filteredProducts.length === 0 ? (
               <div className="text-center py-20 text-stone-500 font-medium">
                 لا توجد منتجات تطابق بحثك
               </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onEdit={openEditModal}
                    onDelete={handleDeleteProductClick}
                    onClick={handleProductClick}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Auth Pages */}
        {currentView === 'login' && <LoginPage onNavigate={setCurrentView} />}
        {currentView === 'signup' && <SignupPage onNavigate={setCurrentView} />}
        {currentView === 'forgot-password' && <ForgotPasswordPage onNavigate={setCurrentView} />}
        
        {/* Admin Pages */}
        {currentView === 'admin-login' && <AdminLoginPage onNavigate={setCurrentView} />}
        {currentView === 'orders' && <OrdersPage onBack={() => setCurrentView('home')} />}
        
        {/* Static Pages */}
        {currentView === 'static-page' && (
          <StaticPages 
            view={currentStaticPage} 
            onBack={() => setCurrentView('home')} 
          />
        )}
        
        {/* Cart & Checkout Pages */}
        {currentView === 'cart' && <CartPage onNavigate={setCurrentView} />}
        {currentView === 'checkout' && <CheckoutPage onNavigate={setCurrentView} />}

        {/* Product Details Page */}
        {currentView === 'product-details' && selectedProduct && (
          <ProductDetailsPage 
            product={selectedProduct} 
            onBack={() => setCurrentView('shop')}
            onNavigate={setCurrentView}
          />
        )}
      </div>

      <footer id="footer" className="bg-white border-t border-stone-100 pt-12 pb-8 mt-auto scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
               <h3 className="text-lg font-bold text-rose-600 mb-4">Rosea_1.8</h3>
               <p className="text-stone-500 text-sm leading-relaxed">
                 متجرك الأول لمستلزمات صناعة الورد الأبدي. نوفر لك أفضل أنواع الستان والأدوات لتصنعي إبداعك بيدك.
               </p>
             </div>
             <div>
               <h3 className="text-lg font-bold text-stone-800 mb-4">روابط سريعة</h3>
               <ul className="space-y-2 text-sm text-stone-500">
                 <li><button onClick={() => setCurrentView('home')} className="hover:text-rose-600">الرئيسية</button></li>
                 <li><button onClick={() => setCurrentView('shop')} className="hover:text-rose-600">المتجر</button></li>
                 <li><button onClick={() => handleNavigateStatic('about')} className="hover:text-rose-600">من نحن</button></li>
               </ul>
             </div>
          </div>
          <div className="mt-8 pt-8 border-t border-stone-100 text-center text-sm text-stone-400">
            &copy; 2024 Rosea_1.8. جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>

      {/* Admin Floating Action Button for Adding Products */}
      {isAdmin && (currentView === 'shop' || currentView === 'home') && (
        <button
          onClick={openAddModal}
          className="fixed bottom-24 left-6 z-40 bg-rose-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-rose-700 hover:scale-110 transition-all flex items-center justify-center font-bold text-2xl"
          title="إضافة منتج جديد"
        >
          +
        </button>
      )}

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onNavigate={setCurrentView}
      />

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={editingProduct ? updateProduct : addProduct}
        initialData={editingProduct}
        categories={categories}
        onAddCategory={handleAddCategoryPrompt}
      />
      
      <AiAssistant />
    </div>
  );
}

function App() {
  return (
    <ShopProvider>
      <AuthProvider>
        <CartProvider>
          <MainLayout />
        </CartProvider>
      </AuthProvider>
    </ShopProvider>
  );
}

export default App;
