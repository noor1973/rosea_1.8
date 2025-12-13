
import { Product, Category, SiteContent } from './types';

export const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1490750967868-58cb75065ed6?q=80&w=2070&auto=format&fit=crop';

// Admin Credentials
export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = '123456'; 

export const DEFAULT_SITE_CONTENT: SiteContent = {
  about: `أهلاً بك في Rosea_1.8، وجهتك الأولى لكل ما يتعلق بفن صناعة الورد الأبدي.
  
بدأت قصتنا من شغف بسيط بالأعمال اليدوية وتحويل شرائط الستان إلى تحف فنية تدوم للأبد. لاحظنا ندرة في توفر المواد الأولية عالية الجودة وتشتت الأدوات في أماكن مختلفة، فقررنا جمع كل ما تحتاجه صانعة الورد في مكان واحد.

نحن نؤمن بأن كل مبدعة تستحق أفضل الأدوات لتطلق العنان لخيالها. لذلك، ننتقي منتجاتنا بعناية فائقة، من أشرطة الستان ذات الملمس الحريري والألوان الثابتة، إلى أدوات القص واللصق الاحترافية.`,
  
  terms: `1. المقدمة: أهلاً بكم في Rosea. باستعمالكم لهذا الموقع، فإنكم توافقون على الالتزام بهذه الشروط والأحكام.
2. المنتجات: نسعى لعرض ألوان المنتجات وصورها بدقة، ولكن قد تختلف قليلاً حسب إضاءة الشاشة.
3. الأسعار: جميع الأسعار بالدينار العراقي وقابلة للتغيير دون إشعار مسبق.
4. الطلب: يعتبر الطلب مؤكداً بعد التواصل معكم من قبل خدمة العملاء.`,

  privacy: `نحن في Rosea نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.
- نجمع المعلومات الأساسية (الاسم، العنوان، الهاتف) فقط لغرض توصيل الطلب.
- لا نقوم بمشاركة بياناتك مع أي طرف ثالث لأغراض تسويقية.
- نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربة التصفح وحفظ السلة.`,

  returns: `1. يسمح بالاستبدال أو الاسترجاع خلال 3 أيام من تاريخ استلام الطلب.
2. يجب أن يكون المنتج بحالته الأصلية ولم يتم قصه أو استخدامه (خاصة أشرطة الستان).
3. يتحمل العميل تكاليف التوصيل في حالة الاستبدال لغير عيوب التصنيع.`,

  faq: [
    { question: "كم يستغرق التوصيل؟", answer: "التوصيل داخل بغداد خلال 24 ساعة، وللمحافظات خلال 2-3 أيام عمل." },
    { question: "كيف يمكنني حساب كمية الستان للوردة؟", answer: "يمكنك استخدام 'مساعد التنسيق الذكي' في الموقع، أو اتباع القاعدة العامة: الوردة الجورية الواحدة تستهلك حوالي 1.5 إلى 2 متر." },
    { question: "هل تتوفر خدمة الدفع الإلكتروني؟", answer: "حالياً الدفع يكون نقداً عند الاستلام (Cash on Delivery) لضمان راحتكم." }
  ]
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'شريط ستان',
    price: 1500,
    category: Category.RIBBONS,
    images: [
      'https://picsum.photos/id/1080/400/400',
      'https://picsum.photos/id/1081/400/400',
      'https://picsum.photos/id/1082/400/400'
    ],
    description: 'شريط ستان عالي الجودة، مثالي لصناعة الورد الجوري الكلاسيكي. الطول 25 ياردة.',
    stock: 50
  },
  {
    id: 2,
    name: 'شريط ستان ألوان فاتحة',
    price: 1500,
    category: Category.RIBBONS,
    images: [
      'https://picsum.photos/id/360/400/400',
      'https://picsum.photos/id/361/400/400'
    ],
    description: 'ألوان ناعمة للمناسبات السعيدة وهدايا المواليد. ملمس ناعم ولامع.',
    stock: 35
  },
  {
    id: 3,
    name: 'شريط ستان ألوان عصرية',
    price: 1500,
    category: Category.RIBBONS,
    images: ['https://picsum.photos/id/400/400/400'],
    description: 'ألوان مميزة وغير تقليدية لباقات الورد العصرية.',
    stock: 20
  },
  {
    id: 4,
    name: 'أعواد حديد خضراء (100 قطعة)',
    price: 5000,
    category: Category.TOOLS,
    images: ['https://picsum.photos/id/106/400/400'],
    description: 'سيقان حديدية مغلفة باللون الأخضر، مرنة وقوية لتشكيل الباقة.',
    stock: 15
  },
  {
    id: 5,
    name: 'مسدس شمع حراري احترافي',
    price: 12000,
    category: Category.TOOLS,
    images: ['https://picsum.photos/id/250/400/400'],
    description: 'مسدس شمع سريع التسخين مع زر أمان، ضروري لتثبيت البتلات.',
    stock: 5
  },
  {
    id: 6,
    name: 'ورق تغليف كوري شفاف',
    price: 2500,
    category: Category.WRAPPING,
    images: ['https://picsum.photos/id/160/400/400'],
    description: 'ورق تغليف عالي الجودة مقاوم للماء بحواف ذهبية.',
    stock: 100
  },
  {
    id: 7,
    name: 'فراشات للزينة (12 قطعة)',
    price: 3000,
    category: Category.ACCESSORIES,
    images: ['https://picsum.photos/id/152/400/400'],
    description: 'فراشات معدنية ثلاثية الأبعاد لإضافة لمسة سحرية للباقة.',
    stock: 0
  },
  {
    id: 8,
    name: 'لؤلؤ نصف دائري (علبة)',
    price: 2000,
    category: Category.ACCESSORIES,
    images: ['https://picsum.photos/id/60/400/400'],
    description: 'حبيبات لؤلؤ لتزيين قلب الزهرة أو ورق التغليف.',
    stock: 25
  },
  {
    id: 9,
    name: 'شريط ستان عريض (5 سم)',
    price: 2000,
    category: Category.RIBBONS,
    images: ['https://picsum.photos/id/660/400/400'],
    description: 'شريط عريض لعمل فيونكات كبيرة وتغليف الهدايا.',
    stock: 40
  }
];
