
import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';

interface AdminLoginPageProps {
  onNavigate: (view: any) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginAdmin } = useShop();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(username, password)) {
      // Redirect to Home instead of Dashboard, as requested by "Inline Admin Controls" requirement
      onNavigate('home'); 
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-900">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl border-2 border-stone-800">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-red-700 rounded-lg flex items-center justify-center mb-4 transform rotate-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-stone-900">بوابة المشرفين</h2>
          <p className="mt-2 text-xs font-bold text-red-600 uppercase tracking-widest">
            منطقة محظورة - للمصرح لهم فقط
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-bold border-r-4 border-red-600 shadow-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-stone-700 mb-1">
              اسم المستخدم (Admin Username)
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-800 focus:outline-none font-mono"
              placeholder="admin"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-stone-700 mb-1">
              كلمة المرور (Password)
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-800 focus:outline-none font-mono"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-stone-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900 transition-all shadow-lg"
          >
            دخول آمن
          </button>
          
          <div className="text-center mt-4">
             <button
               type="button"
               onClick={() => onNavigate('home')}
               className="text-stone-400 hover:text-stone-600 text-sm underline"
             >
               العودة للموقع الرئيسي
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};
