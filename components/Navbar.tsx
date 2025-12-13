
import React, { useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenCart: () => void;
  onNavigate: (view: any) => void;
  onOpenMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenCart, 
  onNavigate, 
  onOpenMenu,
}) => {
  const { totalItems } = useCart();
  const { isAdmin, logo, updateLogo } = useShop();
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 200;
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
          updateLogo(canvas.toDataURL('image/png'));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Hamburger Menu Button */}
            <button 
              onClick={onOpenMenu}
              className="p-2 -mr-2 ml-2 text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors focus:outline-none"
              aria-label="القائمة الجانبية"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* Logo Area */}
            <div className="flex-shrink-0 flex items-center gap-2">
              {isAdmin && (
                <>
                  <button 
                    onClick={() => logoInputRef.current?.click()}
                    title="تغيير الشعار"
                    className="p-1.5 bg-stone-100 hover:bg-rose-100 text-stone-500 hover:text-rose-600 rounded-full transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                  <input 
                    type="file" 
                    ref={logoInputRef} 
                    onChange={handleLogoChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </>
              )}
              
              <div 
                className="flex items-center gap-2 cursor-pointer" 
                onClick={() => onNavigate('home')}
              >
                {logo ? (
                  <img src={logo} alt="Logo" className="h-10 w-auto object-contain rounded-md" />
                ) : null}
                <span className="text-2xl font-bold text-rose-600">Rosea_1.8</span>
              </div>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 space-x-reverse">
            
            {/* User Account */}
            {isAuthenticated ? (
               <div className="relative">
                 <button
                   onClick={() => setShowUserMenu(!showUserMenu)}
                   className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-stone-50 transition-colors"
                 >
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">
                      {currentUser?.name.charAt(0).toUpperCase()}
                    </div>
                 </button>
                 
                 {showUserMenu && (
                   <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-100 py-1 z-[60] animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                     <div className="px-4 py-2 border-b border-stone-100 mb-1">
                       <p className="font-bold text-sm text-stone-800">{currentUser?.name}</p>
                       <p className="text-xs text-stone-500 truncate">{currentUser?.email}</p>
                     </div>
                     <button
                       onClick={() => {
                         logout();
                         setShowUserMenu(false);
                         onNavigate('home');
                       }}
                       className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                     >
                       تسجيل خروج
                     </button>
                   </div>
                 )}
                 {/* Backdrop to close menu */}
                 {showUserMenu && <div className="fixed inset-0 z-[55]" onClick={() => setShowUserMenu(false)} />}
               </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="text-sm font-bold text-stone-600 hover:text-rose-600 px-3 py-2 rounded-lg hover:bg-rose-50 transition-colors hidden sm:block"
              >
                تسجيل دخول زبون
              </button>
            )}

            {/* Cart Icon */}
            <button 
              onClick={onOpenCart}
              className="relative p-2 text-stone-600 hover:text-rose-600 transition-colors duration-200 focus:outline-none"
              aria-label="عربة التسوق"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-rose-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
