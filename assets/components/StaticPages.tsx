
import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { SiteContent } from '../types';

interface StaticPagesProps {
  view: string;
  onBack: () => void;
}

export const StaticPages: React.FC<StaticPagesProps> = ({ view, onBack }) => {
  const { siteContent, updateSiteContent, isAdmin } = useShop();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const handleEditClick = (currentText: string) => {
    setEditValue(currentText);
    setIsEditing(true);
  };

  const handleSave = () => {
    let updatedContent = { ...siteContent };
    
    // Map view to siteContent key
    switch (view) {
      case 'about': updatedContent.about = editValue; break;
      case 'terms': updatedContent.terms = editValue; break;
      case 'privacy': updatedContent.privacy = editValue; break;
      case 'returns': updatedContent.returns = editValue; break;
    }
    
    updateSiteContent(updatedContent);
    setIsEditing(false);
  };

  const EditButton = ({ text }: { text: string }) => (
    isAdmin ? (
      <button 
        onClick={() => handleEditClick(text)}
        className="mb-4 flex items-center gap-2 text-sm bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg font-bold hover:bg-rose-100 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
        تعديل النص
      </button>
    ) : null
  );

  const renderContent = () => {
    switch (view) {
      case 'about':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-stone-900">من نحن</h2>
              <EditButton text={siteContent.about} />
            </div>
            <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed whitespace-pre-wrap">
              {siteContent.about}
            </div>
          </div>
        );

      case 'partners':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-stone-900">شركاؤنا</h2>
            <p className="text-stone-600">نعتز بشراكتنا مع نخبة من الموردين والمبدعين في مجال الأعمال اليدوية.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex items-center justify-center h-32 hover:shadow-md transition">
                  <div className="text-stone-300 font-bold text-xl">شريك {i}</div>
                </div>
              ))}
            </div>
            {isAdmin && <p className="text-xs text-stone-400 mt-4">* إدارة الشركاء ستتوفر قريباً</p>}
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-stone-900">الشروط والأحكام</h2>
              <EditButton text={siteContent.terms} />
            </div>
            <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed whitespace-pre-wrap">
              {siteContent.terms}
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-stone-900">سياسة الخصوصية</h2>
              <EditButton text={siteContent.privacy} />
            </div>
            <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed whitespace-pre-wrap">
              {siteContent.privacy}
            </div>
          </div>
        );

      case 'returns':
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-stone-900">سياسة الاستبدال والاسترجاع</h2>
              <EditButton text={siteContent.returns} />
            </div>
            <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed whitespace-pre-wrap bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
              {siteContent.returns}
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-stone-900">الأسئلة الشائعة</h2>
            <div className="space-y-4">
              {siteContent.faq.map((item, index) => (
                <details key={index} className="bg-white p-4 rounded-xl border border-stone-200 group cursor-pointer">
                  <summary className="font-bold text-stone-800 list-none flex justify-between items-center">
                    {item.question}
                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-stone-600">{item.answer}</p>
                </details>
              ))}
            </div>
            {isAdmin && <p className="text-xs text-stone-400 mt-4">* تعديل الأسئلة الشائعة متاح من الكود حالياً</p>}
          </div>
        );

      default:
        return <div>الصفحة غير موجودة</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center text-stone-500 hover:text-rose-600 mb-8 transition-colors font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2 rtl:rotate-180">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        العودة للرئيسية
      </button>

      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-lg border border-stone-100 relative">
        {renderContent()}
      </div>

      {/* Inline Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsEditing(false)}></div>
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative z-10 animate-in zoom-in-95">
             <h3 className="font-bold text-lg mb-4">تعديل المحتوى</h3>
             <textarea 
               value={editValue}
               onChange={(e) => setEditValue(e.target.value)}
               className="w-full h-64 border border-stone-300 rounded-xl p-4 focus:ring-2 focus:ring-rose-500 outline-none"
             />
             <div className="flex gap-3 justify-end mt-4">
               <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-stone-100 rounded-lg text-stone-700 font-bold">إلغاء</button>
               <button onClick={handleSave} className="px-4 py-2 bg-rose-600 rounded-lg text-white font-bold">حفظ التغييرات</button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};
