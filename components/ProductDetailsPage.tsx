
import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

export const ProductDetailsPage = ({ product, onBack }: any) => {
  const { addToCart } = useCart();

  // نحول الصور إلى variants
  const variants = product.images.map((img: string, index: number) => ({
    id: index,
    image: img,
    qty: 0
  }));

  const [activeImage, setActiveImage] = useState(variants[0].image);
  const [items, setItems] = useState(variants);

  const changeQty = (id: number, delta: number) => {
    setItems(prev =>
      prev.map(v =>
        v.id === id ? { ...v, qty: Math.max(0, v.qty + delta) } : v
      )
    );
  };

  const handleAddToCart = () => {
    items.forEach(v => {
      if (v.qty > 0) {
        addToCart(
          {
            ...product,
            images: [v.image] // اللون المختار فقط
          },
          v.qty
        );
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button onClick={onBack} className="mb-4 text-rose-600 font-bold">
        ← رجوع
      </button>

      {/* الصورة الرئيسية */}
      <div className="mb-6">
        <img
          src={activeImage}
          className="w-full h-96 object-cover rounded-2xl border"
        />
      </div>

      {/* الألوان + الكميات */}
      <div className="space-y-4">
        {items.map((v, i) => (
          <div
            key={v.id}
            className="flex items-center gap-4 bg-white p-3 rounded-xl border shadow-sm"
          >
            <img
              src={v.image}
              onClick={() => setActiveImage(v.image)}
              className="w-20 h-20 object-cover rounded-lg cursor-pointer border"
            />

            <div className="flex-1 font-bold">
              لون {i + 1}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => changeQty(v.id, -1)}
                className="w-8 h-8 rounded-full border"
              >−</button>

              <span className="w-6 text-center">{v.qty}</span>

              <button
                onClick={() => changeQty(v.id, 1)}
                className="w-8 h-8 rounded-full border"
              >+</button>
            </div>
          </div>
        ))}
      </div>

      {/* إضافة للسلة */}
      <button
        onClick={handleAddToCart}
        className="mt-6 w-full bg-rose-600 text-white py-4 rounded-2xl font-bold text-lg"
      >
        أضف للسلة
      </button>
    </div>
  );
};
