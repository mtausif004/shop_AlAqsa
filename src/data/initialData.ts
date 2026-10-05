import { Category, Product, Courier, Banner, Combo, Coupon } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    categoryId: 'pickle-chutney',
    bengaliName: 'আচার ও চাটনি',
    englishName: 'Pickle & Chutney',
    slug: 'pickle-chutney',
    subcategories: ['বার্মিজ আচার', 'বয়ম আচার', 'চাটনি'],
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    active: true,
    order: 1
  },
  {
    categoryId: 'sweet-tamarind',
    bengaliName: 'মিষ্টি তেঁতুল',
    englishName: 'Sweet Tamarind',
    slug: 'sweet-tamarind',
    subcategories: ['বক্স', 'প্যাকেট'],
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    active: true,
    order: 2
  },
  {
    categoryId: 'balachaw',
    bengaliName: 'বালাচাও',
    englishName: 'Balachaw',
    slug: 'balachaw',
    subcategories: ['স্পেশাল বালাচাও'],
    image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=600&q=80',
    active: true,
    order: 3
  },
  {
    categoryId: 'chocolate-confectionery',
    bengaliName: 'চকলেট ও কনফেকশনারি',
    englishName: 'Chocolate & Confectionery',
    slug: 'chocolate-confectionery',
    subcategories: ['Marshmallow', 'Jelly', 'Soft Candy', 'Hard Candy', 'Nougat', 'Crispy', 'Lollipop', 'Dark Chocolate', 'Oat / Oats Bar'],
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
    active: true,
    order: 4
  },
  {
    categoryId: 'skincare-cosmetics',
    bengaliName: 'স্কিন কেয়ার ও কসমেটিকস',
    englishName: 'Skin Care & Cosmetics',
    slug: 'skincare-cosmetics',
    subcategories: ['Sunscreen', 'Soaps', 'Lotion & Facewash'],
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    active: true,
    order: 5
  },
  {
    categoryId: 'chandan-thanaka',
    bengaliName: 'চন্দন ও থানাকা',
    englishName: 'Chandan & Thanaka',
    slug: 'chandan-thanaka',
    subcategories: ['চন্দন কাঠ', 'চন্দন গুঁড়া', 'থানাকা', 'শঙ্খ গুঁড়া', 'থানাকা কেক/বার', 'চন্দন লোশন', 'চন্দন ফেসওয়াস'],
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    active: true,
    order: 6
  },
  {
    categoryId: 'balm',
    bengaliName: 'বাম (Balm)',
    englishName: 'Balm',
    slug: 'balm',
    subcategories: ['বার্মিজ হারবাল বাম'],
    image: 'https://images.unsplash.com/photo-1608248597359-57352345091a?auto=format&fit=crop&w=600&q=80',
    active: true,
    order: 7
  },
  {
    categoryId: 'coffee-healthcare',
    bengaliName: 'কফি ও হেলথ কেয়ার',
    englishName: 'Coffee & Health Care',
    slug: 'coffee-healthcare',
    subcategories: ['বার্মিজ কাফি', 'ক্যালসিয়াস সাপ্লিমেন্ট'],
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    active: true,
    order: 8
  },
  {
    categoryId: 'dry-foods-nuts',
    bengaliName: 'ড্রাই ফুডস ও বাদাম',
    englishName: 'Dry Foods & Nuts',
    slug: 'dry-foods-nuts',
    subcategories: ['সাকুরা প্লাম / Sakura Pulm', 'Red Pulm', 'Mixed Pulm', 'ড্রাই ফুডস / Dry Foods', 'বিভিন্ন প্রকার বাদাম'],
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80',
    active: true,
    order: 9
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    productId: 'PICK-0001',
    bengaliName: 'বার্মিজ স্পেশাল তেঁতুলের মিষ্টি ও ঝাল আচার',
    englishName: 'Burmese Sweet & Spicy Tamarind Pickle',
    brand: 'Al Aqsa Royal',
    categoryId: 'pickle-chutney',
    subcategoryId: 'বার্মিজ আচার',
    shortDescription: 'খাঁটি তেঁতুল ও বিশেষ বার্মিজ মশলায় তৈরি ঐতিহ্যবাহী মুখরোচক চাটনি ও আচার।',
    description: 'আমাদের এই আচারটি সরাসরি মিয়ানমারের ঐতিহ্যবাহী পারিবারিক রেসিপিতে তৈরি। খাঁটি কাঁচা পাকা তেঁতুলের সাথে দেশীয় ও বার্মিজ মসলার দারুণ সংমিশ্রণে এটি মুখের রুচি বাড়ায় বহুগুণ। কোনো ক্ষতিকর কৃত্রিম রঙ বা প্রিজারভেটিভ ব্যবহার করা হয়নি।',
    price: 280,
    mrp: 350,
    discount: 70,
    stock: 65,
    sku: 'PICK-BUR-01',
    weight: '400',
    unit: 'gm',
    ingredients: 'তেঁতুল, সরিষার তেল, পাঁচফোড়ন, বিট লবণ, বার্মিজ লাল মরিচ, চিনি ও গুড়।',
    origin: 'Myanmar (Burma)',
    images: [
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    bestSeller: true,
    offer: true,
    active: true,
    seoTitle: 'বার্মিজ স্পেশাল তেঁতুলের আচার - আল আকসা বার্মিজ শপ',
    seoDescription: 'কক্সবাজারের আসল বার্মিজ তেঁতুলের মিষ্টি ও ঝাল আচার কিনুন সাশ্রয়ী মূল্যে।'
  },
  {
    productId: 'SWT-0001',
    bengaliName: 'থাই প্রিমিয়াম মিষ্টি তেঁতুল (বক্স প্যাক)',
    englishName: 'Thai Premium Sweet Tamarind Box',
    brand: 'Golden Sweet',
    categoryId: 'sweet-tamarind',
    subcategoryId: 'বক্স',
    shortDescription: 'শতভাগ মিষ্টি, মাংসল ও বীজবিহীন বড় দানার প্রিমিয়াম থাই তেঁতুল।',
    description: 'থাইল্যান্ড থেকে সরাসরি আমদানিকৃত সেরা মানের মিষ্টি তেঁতুল। কোনো প্রকার টক ভাব নেই, সম্পূর্ণ প্রাকৃতিক মিষ্টতায় ভরপুর। স্বাস্থ্যকর স্ন্যাক্স হিসেবে বয়স্ক ও বাচ্চাদের কাছে অত্যন্ত প্রিয়।',
    price: 450,
    mrp: 520,
    discount: 70,
    stock: 42,
    sku: 'SWT-THAI-01',
    weight: '500',
    unit: 'gm',
    ingredients: '১০০% প্রাকৃতিক মিষ্টি তেঁতুল।',
    origin: 'Thailand',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    bestSeller: true,
    offer: false,
    active: true,
    seoTitle: 'থাই প্রিমিয়াম মিষ্টি তেঁতুল বক্স - আল আকসা',
    seoDescription: 'খাঁটি মিষ্টি তেঁতুলের বক্স অর্ডার করুন হোম ডেলিভারিতে।'
  },
  {
    productId: 'BAL-0001',
    bengaliName: 'কক্সবাজার স্পেশাল ক্রিস্পি চিংড়ি বালাচাও',
    englishName: 'Crispy Prawn Balachaw Special',
    brand: 'Al Aqsa Signature',
    categoryId: 'balachaw',
    subcategoryId: 'স্পেশাল বালাচাও',
    shortDescription: 'সমুদ্রের তাজা চিংড়ি শুঁটকি ও পেঁয়াজ-রসুনের মুচমুচে ফ্রাই করা বালাচাও।',
    description: 'গরম ভাতের সাথে এক চামচ ক্রিস্পি চিংড়ি বালাচাও খাবার টেবিলে এক রাজকীয় স্বাদ তৈরি করে। এতে ব্যবহার করা হয়েছে সাগরের বাছাই করা তাজা লাল চিংড়ি শুঁটকি, খাঁটি সরিষার তেলে কড়া ফ্রাই করা বেরেস্তা ও রসুন কুচি। কোনো কেমিক্যাল নেই।',
    price: 380,
    mrp: 450,
    discount: 70,
    stock: 55,
    sku: 'BAL-SHRIMP-01',
    weight: '250',
    unit: 'gm',
    ingredients: 'সাগরের লাল চিংড়ি শুঁটকি, পেঁয়াজ বেরেস্তা, রসুন কুচি, সরিষার তেল, শুকনো মরিচ ও স্পেশাল মসলা।',
    origin: 'Cox\'s Bazar, Bangladesh',
    images: [
      'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    bestSeller: true,
    offer: true,
    active: true,
    seoTitle: 'কক্সবাজারের আসল চিংড়ি বালাচাও - আল আকসা শপ',
    seoDescription: 'ক্রিস্পি ও মুখরোচক কক্সবাজারের বিখ্যাত চিংড়ি বালাচাও।'
  },
  {
    productId: 'THAN-0001',
    bengaliName: 'খাঁটি প্রাকৃতিক বার্মিজ থানাকা কেক / বার',
    englishName: 'Original Myanmar Natural Thanaka Cake',
    brand: 'Shwe Pyi Nann',
    categoryId: 'chandan-thanaka',
    subcategoryId: 'থানাকা কেক/বার',
    shortDescription: 'মিয়ানমারের শতভাগ খাঁটি থানাকা কাঠের তৈরি প্রাকৃতিক ফেসপ্যাক ও সান প্রোটেক্টর।',
    description: 'ত্বকের ব্রণ দূর করতে, রোদে পোড়া দাগ হালকা করতে এবং ত্বককে প্রাকৃতিক শীতলতা দিতে বার্মিজ থানাকার কোনো বিকল্প নেই। এটি শত শত বছর ধরে মায়ানমারের নারীদের সৌন্দর্যের প্রধান গোপন রহস্য। সব ধরণের ত্বকে ব্যবহার উপযোগী।',
    price: 320,
    mrp: 400,
    discount: 80,
    stock: 80,
    sku: 'THAN-CAKE-01',
    weight: '140',
    unit: 'gm',
    ingredients: '১০০% প্রাকৃতিক বার্মিজ থানাকা কাঠের গুঁড়া ও প্রাকৃতিক নির্যাস।',
    origin: 'Myanmar (Burma)',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    bestSeller: true,
    offer: false,
    active: true,
    seoTitle: 'আসল বার্মিজ থানাকা কেক - Shwe Pyi Nann',
    seoDescription: 'ন্যাচারাল বার্মিজ থানাকা কেক দিয়ে রূপচর্চা করুন প্রাকৃতিক উপায়ে।'
  },
  {
    productId: 'COF-0001',
    bengaliName: 'বার্মিজ রিচ প্রিমিয়াম ৩-ইন-১ কফি (৩০ স্যাচেট)',
    englishName: 'Myanmar Rich 3-in-1 Premium Coffee Bag',
    brand: 'Rich Coffee',
    categoryId: 'coffee-healthcare',
    subcategoryId: 'বার্মিজ কাফি',
    shortDescription: 'উচ্চমানের রোস্টেড কফির তীব্র সুবাস ও ক্রিমি স্বাদের বার্মিজ রিচ কফি।',
    description: 'ক্লান্তি দূর করে তাৎক্ষণিক সতেজতা ফিরিয়ে আনতে বার্মিজ রিচ কফি অনন্য। প্রতি কাপে পাওয়া যায় খাঁটি কফির নিখুঁত ব্লেন্ড ও মনোরম অ্যারোমা। ১ ব্যাগে রয়েছে ৩০টি স্যাচেট।',
    price: 750,
    mrp: 850,
    discount: 100,
    stock: 35,
    sku: 'COF-RICH-30',
    weight: '600',
    unit: 'gm',
    ingredients: 'রোস্টেড কফি বিনস, নন-ডেইরি ক্রিমের, সুগার।',
    origin: 'Myanmar (Burma)',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    bestSeller: false,
    offer: true,
    active: true,
    seoTitle: 'বার্মিজ রিচ কফি ৩০ স্যাচেট - আল আকসা',
    seoDescription: 'খাঁটি বার্মিজ রিচ কফি কিনুন কক্সবাজারের সেরা দামে।'
  },
  {
    productId: 'DRY-0001',
    bengaliName: 'বার্মিজ টক-মিষ্টি সাকুরা প্লাম (Sakura Plum)',
    englishName: 'Burmese Sweet & Sour Sakura Plum',
    brand: 'Sakura Delights',
    categoryId: 'dry-foods-nuts',
    subcategoryId: 'সাকুরা প্লাম / Sakura Pulm',
    shortDescription: 'দারুণ মুখরোচক সাকুরা প্লাম, মুখে দিলে জিভে জল এনে দেবে।',
    description: 'বার্মিজ জনপ্রিয় ড্রাই ফ্রুটস সাকুরা প্লাম। টক, ঝাল ও মিষ্টি স্বাদের অসাধারণ ব্যালেন্স। ভ্রমণে, আড্ডায় বা কাজের ফাঁকে খাওয়ার জন্য সেরা হালকা স্ন্যাক্স।',
    price: 250,
    mrp: 300,
    discount: 50,
    stock: 90,
    sku: 'DRY-SAKURA-01',
    weight: '300',
    unit: 'gm',
    ingredients: 'শুকনো প্লাম ফল, চিনি, লবণ, লেবুর রস ও বার্মিজ স্পাইস।',
    origin: 'Myanmar (Burma)',
    images: [
      'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80'
    ],
    featured: false,
    bestSeller: true,
    offer: true,
    active: true,
    seoTitle: 'বার্মিজ সাকুরা প্লাম - টক মিষ্টি স্বাদ',
    seoDescription: 'কক্সবাজারের আসল সাকুরা প্লাম অর্ডার করুন এখনই।'
  },
  {
    productId: 'CHOCO-0001',
    bengaliName: 'ইমপোর্টেড ক্রিস্পি ওটস চকলেট বার (বড় প্যাক)',
    englishName: 'Crispy Oats Chocolate Choco Bar Pack',
    brand: 'Twin Dolphin',
    categoryId: 'chocolate-confectionery',
    subcategoryId: 'Oat / Oats Bar',
    shortDescription: 'স্বাস্থ্যকর ওটস ও প্রিমিয়াম চকলেটের মুচমুচে সংমিশ্রণ।',
    description: 'বাচ্চা ও বড়দের প্রিয় পুষ্টিকর ওটস চকো বার। মুচমুচে ওটস কোকোয়ার নরম স্বাদের সাথে মিশে তৈরি করে অসাধারণ ক্রাঞ্চ।',
    price: 360,
    mrp: 420,
    discount: 60,
    stock: 50,
    sku: 'CHOCO-OAT-01',
    weight: '400',
    unit: 'gm',
    ingredients: 'ওটস, মিল্ক সলিড, কোকোয়া বাটার, চিনি।',
    origin: 'Malaysia / Imported',
    images: [
      'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80'
    ],
    featured: false,
    bestSeller: false,
    offer: false,
    active: true,
    seoTitle: 'ওটস চকলেট বার - আল আকসা শপ',
    seoDescription: 'ক্রিস্পি ওটস চকলেট বার কিনুন ক্যাশ অন ডেলিভারিতে।'
  },
  {
    productId: 'SKIN-0001',
    bengaliName: 'বার্মিজ প্রাকৃতিক চন্দন লোশন (ন্যাচারাল গ্লো)',
    englishName: 'Original Burmese Sandalwood Chandan Lotion',
    brand: 'Myanmar Royal Herbs',
    categoryId: 'skincare-cosmetics',
    subcategoryId: 'Lotion & Facewash',
    shortDescription: 'খাঁটি চন্দনের স্নিগ্ধ সুবাস ও ত্বক উজ্জ্বলকারী প্রাকৃতিক বডি ও ফেস লোশন।',
    description: 'প্রাকৃতিক চন্দন কাঠের নির্যাস সমৃদ্ধ বার্মিজ লোশন যা ত্বককে কোমল রাখে, কালচে ভাব দূর করে এবং একটি মনোরম চন্দন সৌরভ দেয় দিনভর।',
    price: 390,
    mrp: 480,
    discount: 90,
    stock: 38,
    sku: 'SKIN-CHANDAN-01',
    weight: '200',
    unit: 'ml',
    ingredients: 'স্যান্ডালউড এক্সট্রাক্ট, ভিটামিন ই, গ্লিসারিন ও প্রাকৃতিক ময়েশ্চারাইজার।',
    origin: 'Myanmar (Burma)',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    bestSeller: false,
    offer: true,
    active: true,
    seoTitle: 'বার্মিজ আসল চন্দন লোশন - স্কিন কেয়ার',
    seoDescription: 'ন্যাচারাল চন্দন লোশন দিয়ে ত্বক রাখুন উজ্জ্বল ও দাগহীন।'
  },
  {
    productId: 'BALM-0001',
    bengaliName: 'বার্মিজ আসল গোল্ডেন টাইগার হারবাল পেইন রিলিফ বাম',
    englishName: 'Golden Tiger Burmese Herbal Pain Relief Balm',
    brand: 'Tiger Herbal',
    categoryId: 'balm',
    subcategoryId: 'বার্মিজ হারবাল বাম',
    shortDescription: 'মাথাব্যথা, সর্দি ও পেশীর ব্যথায় তাৎক্ষণিক আরামদায়ক হারবাল বাম।',
    description: 'মিয়ানমারের ঐতিহ্যবাহী হারবাল তেল ও প্রাকৃতিক পুদিনা মেনথল সমৃদ্ধ বাম। দ্রুত ত্বকে শোষিত হয়ে স্নায়ুর উত্তেজনা কমায় ও ব্যথায় আরাম দেয়।',
    price: 180,
    mrp: 240,
    discount: 60,
    stock: 120,
    sku: 'BALM-TIGER-01',
    weight: '50',
    unit: 'gm',
    ingredients: 'মেন্থল, কর্পূর, লবঙ্গ তেল, ইউক্যালিপটাস তেল, উইন্টারগ্রিন অয়েল।',
    origin: 'Myanmar (Burma)',
    images: [
      'https://images.unsplash.com/photo-1608248597359-57352345091a?auto=format&fit=crop&w=800&q=80'
    ],
    featured: false,
    bestSeller: true,
    offer: false,
    active: true,
    seoTitle: 'বার্মিজ টাইগার বাম - পেইন রিলিফ',
    seoDescription: 'আসল বার্মিজ হারবাল বাম মাথাব্যথা ও জয়েন্ট ব্যথায় দারুণ কার্যকরী।'
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    bannerId: 'BAN-001',
    title: 'কক্সবাজারের আসল বার্মিজ স্বাদের সমাহার',
    subtitle: 'লাবণী পয়েন্ট ছাতা মার্কেট থেকে শতভাগ খাঁটি আচার, মিষ্টি তেঁতুল ও চন্দন-থানাকা সরাসরি আপনার দরজায়!',
    cta: 'পণ্য সমূহ দেখুন',
    link: '/category/pickle-chutney',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80',
    active: true,
    order: 1,
    style: 'ken_burns'
  },
  {
    bannerId: 'BAN-002',
    title: 'স্পেশাল ক্রিস্পি চিংড়ি বালাচাও',
    subtitle: 'সাগরের তাজা চিংড়ি ও দেশি পেঁয়াজ বেরেস্তায় তৈরি মুচমুচে খাঁটি বালাচাও। অর্ডার করলেই ক্যাশ অন ডেলিভারি।',
    cta: 'বালাচাও কিনুন',
    link: '/category/balachaw',
    image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=1600&q=80',
    active: true,
    order: 2,
    style: 'fade'
  },
  {
    bannerId: 'BAN-003',
    title: 'প্রাকৃতিক রূপচর্চায় বার্মিজ চন্দন ও থানাকা',
    subtitle: 'শত বছরের ঐতিহ্যবাহী প্রাকৃতিক সানস্ক্রিন ও ব্রণ দূর করার খাঁটি বার্মিজ হার্বাল রূপচর্চা সামগ্রী।',
    cta: 'স্কিন কেয়ার দেখুন',
    link: '/category/chandan-thanaka',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
    active: true,
    order: 3,
    style: 'classic'
  }
];

export const INITIAL_COURIERS: Courier[] = [
  {
    courierId: 'CUR-01',
    courierName: 'Steadfast Courier',
    website: 'https://steadfast.com.bd',
    trackingUrlTemplate: 'https://steadfast.com.bd/t/[TRACKING_NUMBER]',
    phone: '09678-045045',
    active: true
  },
  {
    courierId: 'CUR-02',
    courierName: 'RedX Logistics',
    website: 'https://redx.com.bd',
    trackingUrlTemplate: 'https://redx.com.bd/track-parcel/?trackingId=[TRACKING_NUMBER]',
    phone: '09610-007339',
    active: true
  },
  {
    courierId: 'CUR-03',
    courierName: 'Sundarban Courier Service',
    website: 'https://sundarbancourier.com',
    trackingUrlTemplate: 'https://sundarbancourier.com',
    phone: '02-9564177',
    active: true
  }
];

export const INITIAL_COMBOS: Combo[] = [
  {
    comboId: 'COMBO-01',
    name: 'কক্সবাজার সুপার ফ্যামিলি মেগা কম্বো',
    description: '১টি বার্মিজ তেঁতুলের আচার + ১টি মিষ্টি তেঁতুল বক্স + ১টি স্পেশাল চিংড়ি বালাচাও এর জমজমাট কম্বো প্যাক!',
    productIds: ['PICK-0001', 'SWT-0001', 'BAL-0001'],
    originalPrice: 1110,
    comboPrice: 950,
    discount: 160,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    active: true
  },
  {
    comboId: 'COMBO-02',
    name: 'ন্যাচারাল বার্মিজ বিউটি গ্লো কম্বো',
    description: '১টি অরিজিনাল থানাকা কেক + ১টি চন্দন ন্যাচারাল লোশন একসাথে। রূপচর্চার পূর্ণাঙ্গ সমাধান।',
    productIds: ['THAN-0001', 'SKIN-0001'],
    originalPrice: 710,
    comboPrice: 620,
    discount: 90,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    active: true
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'AQSA50',
    type: 'fixed',
    amount: 50,
    minimumOrder: 800,
    maximumDiscount: 50,
    active: true
  },
  {
    code: 'BURMESE10',
    type: 'percentage',
    amount: 10,
    minimumOrder: 1500,
    maximumDiscount: 200,
    active: true
  }
];

export const FAQS = [
  {
    q: 'আপনারা কি সারা বাংলাদেশে হোম ডেলিভারি দেন?',
    a: 'হ্যাঁ, আমরা কক্সবাজারসহ সারা বাংলাদেশের ৬৪টি জেলায় বিশ্বস্ত কুরিয়ার সার্ভিসের মাধ্যমে হোম ডেলিভারি দিয়ে থাকি।'
  },
  {
    q: 'ডেলিভারি চার্জ কত টাকা?',
    a: 'কক্সবাজার সদর এলাকায় ১০০০ টাকার নিচে অর্ডারে ডেলিভারি চার্জ মাত্র ১০০ টাকা (১০০০ টাকার উপরে ফ্রি)। কক্সবাজারের বাইরে ১৫০০ টাকার নিচে অর্ডারে ডেলিভারি চার্জ ১৫০ টাকা (১৫০০ টাকার উপরে ফ্রি)।'
  },
  {
    q: 'পেমেন্ট কীভাবে করতে হবে?',
    a: 'আমরা ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে মূল্য পরিশোধ) সুবিধা দিচ্ছি। এছাড়া চাইলে বিকাশ (01861007427) বা নগদ (01861007427) এর মাধ্যমেও অগ্রিম বা ডেলিভারির সময় পরিশোধ করতে পারবেন।'
  },
  {
    q: 'পণ্য কত দিনের মধ্যে ডেলিভারি পাওয়া যায়?',
    a: 'কক্সবাজারের ভেতরে সাধারণত ২৪ ঘণ্টার মধ্যে এবং কক্সবাজারের বাইরে ২ থেকে ৩ কার্যদিবসের মধ্যে পণ্য পৌঁছে যায়।'
  },
  {
    q: 'পণ্যগুলো কি শতভাগ আসল বার্মিজ?',
    a: 'হ্যাঁ, আল আকসা বার্মিজ শপ দীর্ঘ বছর ধরে কক্সবাজার লাবণী পয়েন্ট ছাতা মার্কেটে সরাসরি পরিচালিত হচ্ছে। আমাদের প্রতিটি পণ্য শতভাগ অথেনটিক ও কোয়ালিটি নিশ্চিত করে প্যাকেজিং করা হয়।'
  }
];
