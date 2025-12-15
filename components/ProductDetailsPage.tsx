
import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailsPageProps {
  product: Product;
  onBack: () => void;
  onNavigate: (view: any) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  onBack,
}) => {
  const { addToCart } = useCart();

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['https://via.placeholder.com/600?text=No+Image'];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [quantities, setQuantities] = useState<number[]>(
    images.map(() => 0)
  );

  const isOutOfStock = product.stock <= 0;

  const totalSelected = quantities.reduce((a, b) => a + b, 0);

  const handleAddToCart = () => {
    images.forEach((img, index) => {
      if (quantities[index] > 0) {
        addToCart(
          {
            ...product,
            selectedImage: img,
          } as any,
          quantities[index]
        );
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">

      {/* زر الرجوع */}
      <button
        onClick={onBack}
        className="mb-6 text-stone-500 hover:text-rose-600 font-medium"
      >
        ← العودة للمتجر
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* الصور */}
        <div className="lg:col-span-8">

          {/* الصورة الرئيسية */}
          <div className="w-full aspect-square bg-stone-100 rounded-3xl overflow-hidden mb-6">
            <img
              src={selectedImage}
              className="w-full h-full object-cover"
            />
          </div>

          {/* الصور المصغرة (الألوان) */}
          <div className="space-y-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white p-3 rounded-2xl border"
              >
                <img
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl object-cover cursor-pointer border-2 ${
                    selectedImage === img
                      ? 'border-rose-600'
                      : 'border-transparent'
                  }`}
                />

                {/* التحكم بالكمية */}
                {!isOutOfStock ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const q = [...quantities];
                        q[index] = Math.max(0, q[index] - 1);
                        setQuantities(q);
                      }}
                      className="w-8 h-8 rounded-full border"
                    >
                      −
                    </button>

                    <span className="w-8 text-center font-bold">
                      {quantities[index]}
                    </span>

                    <button
                      onClick={() => {
                        const q = [...quantities];
                        q[index]++;
                        setQuantities(q);
                      }}
                      className="w-8 h-8 rounded-full border"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className="text-red-600 font-bold">
                    نفذت الكمية
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* زر الإضافة للسلة */}
          <button
            disabled={totalSelected === 0}
            onClick={handleAddToCart}
            className={`mt-6 w-full py-4 rounded-2xl font-bold text-white ${
              totalSelected === 0
                ? 'bg-stone-300 cursor-not-allowed'
                : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            إضافة إلى السلة
          </button>
        </div>

        {/* معلومات المنتج */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white p-6 rounded-3xl border shadow">
            <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-sm font-bold">
              {product.category}
            </span>

            <h1 className="text-2xl font-extrabold mt-4 mb-4">
              {product.name}
            </h1>

            <div className="text-2xl font-bold text-rose-600 mb-4">
              {product.price.toLocaleString()} د.ع
            </div>

            <p className="text-stone-600 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-4 text-sm text-stone-400">
              اختر اللون والكمية من الصور
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
