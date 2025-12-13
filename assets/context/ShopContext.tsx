
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, SiteContent } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS, DEFAULT_HERO_IMAGE, ADMIN_PASSWORD, ADMIN_USERNAME, DEFAULT_SITE_CONTENT } from '../constants';
import { storage } from '../services/storage';

interface ShopContextType {
  products: Product[];
  categories: string[];
  heroImage: string | null;
  logo: string | null;
  siteContent: SiteContent;
  isAdmin: boolean;
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  addCategory: (name: string) => void;
  deleteCategory: (name: string) => void;
  updateHeroImage: (url: string | null) => void;
  updateLogo: (url: string | null) => void;
  updateSiteContent: (content: SiteContent) => void;
  resetData: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State Initialization from Storage Service
  const [products, setProducts] = useState<Product[]>(() => 
    storage.get('rosea_products', INITIAL_PRODUCTS)
  );
  const [categories, setCategories] = useState<string[]>(() => 
    storage.get('rosea_categories', Object.values(Category))
  );
  const [heroImage, setHeroImage] = useState<string | null>(() => 
    storage.get('rosea_hero_image', null)
  );
  const [logo, setLogo] = useState<string | null>(() => 
    storage.get('rosea_logo', null)
  );
  const [siteContent, setSiteContent] = useState<SiteContent>(() => 
    storage.get('rosea_site_content', DEFAULT_SITE_CONTENT)
  );
  
  // Admin state persistence
  const [isAdmin, setIsAdmin] = useState<boolean>(() => 
    storage.get('rosea_is_admin', false)
  );

  // Persistence Effects
  useEffect(() => storage.set('rosea_products', products), [products]);
  useEffect(() => storage.set('rosea_categories', categories), [categories]);
  useEffect(() => storage.set('rosea_site_content', siteContent), [siteContent]);
  useEffect(() => {
    if (heroImage) storage.set('rosea_hero_image', heroImage);
    else storage.remove('rosea_hero_image');
  }, [heroImage]);
  useEffect(() => {
    if (logo) storage.set('rosea_logo', logo);
    else storage.remove('rosea_logo');
  }, [logo]);
  
  useEffect(() => storage.set('rosea_is_admin', isAdmin), [isAdmin]);

  // Actions
  const loginAdmin = (username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  const addProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: Math.max(0, ...products.map(p => p.id)) + 1,
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addCategory = (name: string) => {
    if (name && !categories.includes(name)) {
      setCategories(prev => [...prev, name]);
    }
  };

  const deleteCategory = (name: string) => {
    setCategories(prev => prev.filter(c => c !== name));
  };

  const updateHeroImage = (url: string | null) => setHeroImage(url);
  const updateLogo = (url: string | null) => setLogo(url);
  const updateSiteContent = (content: SiteContent) => setSiteContent(content);

  const resetData = () => {
    storage.remove('rosea_products');
    storage.remove('rosea_categories');
    storage.remove('rosea_hero_image');
    storage.remove('rosea_logo');
    storage.remove('rosea_is_admin');
    storage.remove('rosea_site_content');
    window.location.reload();
  };

  return (
    <ShopContext.Provider value={{
      products,
      categories,
      heroImage,
      logo,
      siteContent,
      isAdmin,
      loginAdmin,
      logoutAdmin,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      deleteCategory,
      updateHeroImage,
      updateLogo,
      updateSiteContent,
      resetData
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};
