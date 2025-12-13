
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordPageProps {
  onNavigate: (view: any) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    await resetPassword(email);
    setIsLoading(false);
    setIsSent(true);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-stone-100">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-stone-900">استعادة كلمة المرور</h2>
          <p className="mt-2 text-sm text-stone-600">
            أدخلي بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
          </p>
        </div>
        
        {isSent ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center border border-green-100 animate-in fade-in zoom-in duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl">✓</div>
            <p className="font-bold">تم إرسال الرابط!</p>
            <p className="text-sm mt-1">يرجى التحقق من صندوق الوارد في بريدك الإلكتروني.</p>
            <button 
              onClick={() => onNavigate('login')}
              className="mt-4 text-sm font-bold text-green-700 hover:text-green-800 underline"
            >
              العودة لتسجيل الدخول
            </button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                placeholder="name@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-70 transition-all shadow-lg shadow-rose-200"
            >
              {isLoading ? 'جاري الإرسال...' : 'إرسال الرابط'}
            </button>
            
            <div className="text-center">
              <button 
                type="button"
                onClick={() => onNavigate('login')}
                className="text-sm text-stone-500 hover:text-rose-600 transition-colors"
              >
                العودة للخلف
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
