
import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import { Order } from '../../types';

interface OrdersPageProps {
  onBack: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onBack }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadedOrders = storage.get<Order[]>('rosea_orders', []);
    setOrders(loadedOrders);
  }, []);

  const updateStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    storage.set('rosea_orders', updatedOrders);
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'new': return { text: 'جديد', color: 'bg-blue-100 text-blue-800' };
      case 'processing': return { text: 'قيد التجهيز', color: 'bg-yellow-100 text-yellow-800' };
      case 'shipped': return { text: 'تم الإرسال', color: 'bg-indigo-100 text-indigo-800' };
      case 'completed': return { text: 'مكتمل', color: 'bg-green-100 text-green-800' };
      case 'cancelled': return { text: 'ملغي', color: 'bg-red-100 text-red-800' };
      default: return { text: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-stone-900">إدارة الطلبات</h1>
        <button 
          onClick={onBack}
          className="text-stone-500 hover:text-rose-600 font-bold"
        >
          العودة للمتجر
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-100">
          <p className="text-xl text-stone-500">لا توجد طلبات حتى الآن.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const statusStyle = getStatusLabel(order.status);
            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                {/* Header */}
                <div className="bg-stone-50 px-6 py-4 flex flex-wrap justify-between items-center border-b border-stone-200 gap-4">
                  <div className="flex gap-4 items-center">
                    <span className="font-mono font-bold text-stone-700">#{order.id}</span>
                    <span className="text-sm text-stone-500">{new Date(order.date).toLocaleDateString('ar-EG')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold border-none outline-none cursor-pointer ${statusStyle.color}`}
                    >
                      <option value="new">جديد</option>
                      <option value="processing">قيد التجهيز</option>
                      <option value="shipped">تم الإرسال</option>
                      <option value="completed">مكتمل</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 grid md:grid-cols-2 gap-8">
                  {/* Customer Info */}
                  <div>
                    <h3 className="text-sm font-bold text-stone-400 uppercase mb-3">بيانات الزبون</h3>
                    <div className="space-y-2 text-stone-800">
                      <p><span className="font-bold">الاسم:</span> {order.customer.fullName}</p>
                      <p><span className="font-bold">العنوان:</span> {order.customer.governorate} - {order.customer.landmark}</p>
                      <p><span className="font-bold">الهاتف:</span> <span dir="ltr">{order.customer.phone}</span></p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="text-sm font-bold text-stone-400 uppercase mb-3">المنتجات ({order.totalPrice.toLocaleString()} د.ع)</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm bg-stone-50 p-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-xs font-bold">{item.quantity}x</span>
                            <span>{item.name}</span>
                          </div>
                          <span className="font-bold text-stone-600">{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
