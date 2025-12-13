
import React from 'react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: any) => void;
  onSelectCategory: (category: string | 'ALL') => void;
  currentView: string;
  selectedCategory: string | 'ALL';
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onAddProduct: () => void;
  categories: string[];
  onAddCategory: () => void;
  onDeleteCategory: (category: string) => void;
  onLogoutAdmin: () => void;
  onNavigateStatic: (page: string) => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectCategory,
  currentView,
  selectedCategory,
  isAdmin,
  categories,
  onLogoutAdmin,
  onNavigateStatic
}) => {
  const handleNavigation = (view: string, category?: string | 'ALL') => {
    onNavigate(view);
    if (category) {
      onSelectCategory(category);
    }
    onClose();
  };

  const handleStaticClick = (page: string) => {
    if (page === 'notifications' || page === 'language') {
      alert('هذه الميزة ستكون متاحة قريباً');
    } else {
      onNavigateStatic(page);
      onClose();
    }
  };

  const scrollToSection = (id: string) => {
    onNavigate('home');
    onClose();
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Common arrow icon
  const ArrowIcon = () => (
    <span className="text-stone-400 mr-auto text-lg">➜</span>
  );

  return (
    <div className={`fixed inset-0 z-[60] overflow-hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div className={`absolute inset-y-0 right-0 max-w-[300px] w-full bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100 bg-rose-50/30">
          <span className="text-xl font-bold text-rose-600">القائمة</span>
          <button onClick={onClose} className="p-2 text-stone-500 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          <div className="px-4 space-y-2">
            
            {/* Admin Section - Inline Controls */}
            {isAdmin && (
               <div className="mb-6 space-y-2 bg-stone-900 p-3 rounded-xl border border-stone-800 shadow-xl">
                  <div className="text-xs font-bold text-rose-500 mb-1 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                     أدوات المشرف
                  </div>
                  
                  <button
                    onClick={() => handleNavigation('orders')}
                    className="w-full text-right px-4 py-2 rounded-lg transition-colors font-bold flex items-center gap-3 bg-stone-800 text-white hover:bg-stone-700"
                  >
                    <span>📦</span>
                    <span>إدارة الطلبات</span>
                    <ArrowIcon />
                  </button>

                  <button
                    onClick={() => {
                       onLogoutAdmin();
                       handleNavigation('home');
                    }}
                    className="w-full text-right px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-3 text-red-400 hover:bg-stone-800"
                  >
                    <span>🚪</span>
                    <span>تسجيل خروج</span>
                  </button>
               </div>
            )}

            {/* Main Navigation */}
            <button
              onClick={() => handleNavigation('home')}
              className={`w-full text-right px-4 py-3 rounded-xl transition-colors font-medium flex items-center justify-between ${
                currentView === 'home' ? 'bg-rose-50 text-rose-700' : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span>الرئيسية</span>
              </div>
              <ArrowIcon />
            </button>

             <button
              onClick={() => scrollToSection('best-sellers')}
              className="w-full text-right px-4 py-3 rounded-xl transition-colors font-medium flex items-center justify-between text-stone-600 hover:bg-stone-50"
            >
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                </svg>
                <span>الأكثر مبيعاً</span>
              </div>
              <ArrowIcon />
            </button>

            <button
              onClick={() => handleNavigation('shop', 'ALL')}
              className={`w-full text-right px-4 py-3 rounded-xl transition-colors font-medium flex items-center justify-between ${
                currentView === 'shop' && selectedCategory === 'ALL' ? 'bg-rose-50 text-rose-700' : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                 </svg>
                 <span>كل المنتجات</span>
              </div>
              <ArrowIcon />
            </button>
            
            <button
               onClick={() => handleNavigation('cart')}
               className="w-full text-right px-4 py-3 rounded-xl transition-colors font-medium flex items-center justify-between text-stone-600 hover:bg-stone-50"
            >
               <div className="flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  <span>السلة</span>
               </div>
               <ArrowIcon />
            </button>

            <div className="border-t border-stone-100 my-4 mx-4" />
            <p className="px-4 text-xs font-bold text-stone-400 mb-2">أقسام المتجر</p>

            {/* Category Links */}
            {categories.map((category) => (
              <div key={category} className="flex items-center gap-1 group w-full px-1">
                <button
                  onClick={() => handleNavigation('shop', category)}
                  className={`flex-grow text-right px-4 py-2 rounded-xl transition-colors text-sm flex items-center justify-between ${
                    currentView === 'shop' && selectedCategory === category 
                      ? 'bg-rose-50 text-rose-700 font-bold' 
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full ml-3 ${
                      currentView === 'shop' && selectedCategory === category ? 'bg-rose-500' : 'bg-stone-300'
                    }`} />
                    {category}
                  </div>
                  <ArrowIcon />
                </button>
              </div>
            ))}

            <div className="border-t border-stone-100 my-4 mx-4" />
            <p className="px-4 text-xs font-bold text-stone-400 mb-2">معلومات</p>

            {/* Additional Menu Items */}
            <div className="space-y-1">
              <button onClick={() => handleStaticClick('notifications')} className="w-full text-right px-4 py-2.5 rounded-xl transition-colors font-medium flex items-center justify-between text-stone-600 hover:bg-stone-50">
                 <div className="flex items-center gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                   </svg>
                   <span>الإشعارات</span>
                 </div>
                 <ArrowIcon />
              </button>

              <button onClick={() => handleStaticClick('language')} className="w-full text-right px-4 py-2.5 rounded-xl transition-colors font-medium flex items-center justify-between text-stone-600 hover:bg-stone-50">
                 <div className="flex items-center gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S12 3 12 3m0-18a9 9 0 018.716 6.747M12 3a9 9 0 00-8.716 6.747M12 3v18" />
                   </svg>
                   <span>اللغة</span>
                 </div>
                 <ArrowIcon />
              </button>

              <button onClick={() => handleStaticClick('about')} className="w-full text-right px-4 py-2.5 rounded-xl transition-colors font-medium flex items-center justify-between text-stone-600 hover:bg-stone-50">
                 <div className="flex items-center gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                   </svg>
                   <span>من نحن</span>
                 </div>
                 <ArrowIcon />
              </button>

              <button onClick={() => handleStaticClick('partners')} className="w-full text-right px-4 py-2.5 rounded-xl transition-colors font-medium flex items-center justify-between text-stone-600 hover:bg-stone-50">
                 <div className="flex items-center gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                   </svg>
                   <span>شركاؤنا</span>
                 </div>
                 <ArrowIcon />
              </button>

              <button onClick={() => handleStaticClick('terms')} className="w-full text-right px-4 py-2.5 rounded-xl transition-colors font-medium flex items-center justify-between text-stone-600 hover:bg-stone-50">
                 <div className="flex items-center gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                   </svg>
                   <span>الشروط والأحكام</span>
                 </div>
                 <ArrowIcon />
              </button>

              <button onClick={() => handleStaticClick('privacy')} className="w-full text-right px-4 py-2.5 rounded-xl transition-colors font-medium flex items-center justify-between text-stone-600 hover:bg-stone-50">
                 <div className="flex items-center gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                   </svg>
                   <span>سياسة الخصوصية</span>
                 </div>
                 <ArrowIcon />
              </button>

              <button onClick={() => handleStaticClick('returns')} className="w-full text-right px-4 py-2.5 rounded-xl transition-colors font-medium flex items-center justify-between text-stone-600 hover:bg-stone-50">
                 <div className="flex items-center gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                   </svg>
                   <span>سياسة الاستبدال والاسترجاع</span>
                 </div>
                 <ArrowIcon />
              </button>

              <button onClick={() => handleStaticClick('faq')} className="w-full text-right px-4 py-2.5 rounded-xl transition-colors font-medium flex items-center justify-between text-stone-600 hover:bg-stone-50">
                 <div className="flex items-center gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                   </svg>
                   <span>الأسئلة الشائعة</span>
                 </div>
                 <ArrowIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 text-center">
          <p className="text-xs text-stone-500 font-bold mb-1">Rosea_1.8 © 2024</p>
          <p className="text-[10px] text-stone-400">الإصدار 1.8.0</p>
        </div>
      </div>
    </div>
  );
};
