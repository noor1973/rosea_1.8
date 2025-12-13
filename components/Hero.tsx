
import React, { useRef } from 'react';
import { DEFAULT_HERO_IMAGE } from '../constants';
import { useShop } from '../context/ShopContext';

interface HeroProps {
  onShopNow: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNow }) => {
  const { heroImage, updateHeroImage, isAdmin } = useShop();
  const heroInputRef = useRef<HTMLInputElement>(null);

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 1920; 
          
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
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          updateHeroImage(dataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
    if (heroInputRef.current) heroInputRef.current.value = '';
  };

  const displayImage = heroImage || DEFAULT_HERO_IMAGE;

  return (
    <div className="relative bg-stone-900 overflow-hidden h-[600px] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={displayImage}
          alt="Hero Background"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg tracking-tight">
          <span className="block mb-2">اصنعي جمالاً</span>
          <span className="block text-rose-300">لا يذبل أبداً</span>
        </h1>
        <p className="mt-4 text-xl sm:text-2xl text-stone-100 max-w-2xl mx-auto drop-shadow-md font-light leading-relaxed">
          نوفر لكم كل مستلزمات صناعة الورد الابدي في موقع واحد
          <br />
          <span className="text-base sm:text-lg opacity-90 mt-2 block">شرائط ستان، أدوات، وإكسسوارات بجودة عالية</span>
        </p>
        <div className="mt-10">
          <button
            onClick={onShopNow}
            className="px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-rose-500/50 transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            تسوقي الآن
          </button>
        </div>
      </div>

      {/* Edit Button for Admin */}
      {isAdmin && (
        <div className="absolute bottom-6 right-6 z-20">
           <button 
             onClick={() => heroInputRef.current?.click()}
             className="bg-white/90 backdrop-blur text-stone-900 px-5 py-2.5 rounded-full font-bold shadow-xl hover:bg-white hover:text-rose-600 transition-all flex items-center gap-2 group"
           >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:animate-bounce">
               <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
             </svg>
             {heroImage ? 'تغيير الخلفية' : 'تعيين خلفية خاصة'}
           </button>
           <input 
             type="file" 
             ref={heroInputRef}
             onChange={handleHeroImageChange}
             accept="image/*"
             className="hidden"
           />
        </div>
      )}
    </div>
  );
};
