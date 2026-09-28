import { AIPresenter, VideoScene, VideoVariation } from '../types';

// =====================================================================
// AI PRESENTER CATALOG
// Consistent faces, demographic, hair, clothing, voice personas
// =====================================================================
export const AI_PRESENTERS: AIPresenter[] = [
  {
    id: 'presenter-priya',
    name: 'Priya',
    gender: 'Female',
    demographic: 'Indian',
    style: 'Influencer / UGC',
    tagline: 'Warm, relatable, authentic UGC creator tone',
    avatarColor: '#F43F5E',
    hairStyle: 'long_wavy',
    clothingStyle: 'casual_hoodie',
    voiceId: 'hi-IN-Standard-A',
    voicePitch: 1.08,
    voiceRate: 1.02,
  },
  {
    id: 'presenter-arjun',
    name: 'Arjun',
    gender: 'Male',
    demographic: 'Indian',
    style: 'Professional',
    tagline: 'Authoritative, sharp, tech & business specialist',
    avatarColor: '#1769FF',
    hairStyle: 'short_fade',
    clothingStyle: 'smart_blazer',
    voiceId: 'en-IN-Standard-B',
    voicePitch: 0.95,
    voiceRate: 1.0,
  },
  {
    id: 'presenter-ananya',
    name: 'Ananya',
    gender: 'Female',
    demographic: 'Indian',
    style: 'Luxury',
    tagline: 'Soft, sophisticated, beauty & lifestyle expert',
    avatarColor: '#EC4899',
    hairStyle: 'sleek_bun',
    clothingStyle: 'elegant_dress',
    voiceId: 'hi-IN-Standard-D',
    voicePitch: 1.12,
    voiceRate: 0.96,
  },
  {
    id: 'presenter-marcus',
    name: 'Marcus',
    gender: 'Male',
    demographic: 'International',
    style: 'Energetic',
    tagline: 'Punchy, modern, high-energy product reviewer',
    avatarColor: '#06B6D4',
    hairStyle: 'modern_quiff',
    clothingStyle: 'tech_tshirt',
    voiceId: 'en-US-Standard-C',
    voicePitch: 0.98,
    voiceRate: 1.14,
  },
  {
    id: 'presenter-sophia',
    name: 'Sophia',
    gender: 'Female',
    demographic: 'International',
    style: 'Luxury',
    tagline: 'Chic, premium international commercial spokesperson',
    avatarColor: '#8B5CF6',
    hairStyle: 'chic_bob',
    clothingStyle: 'elegant_dress',
    voiceId: 'en-US-Standard-E',
    voicePitch: 1.05,
    voiceRate: 0.98,
  },
  {
    id: 'presenter-rohan',
    name: 'Rohan',
    gender: 'Male',
    demographic: 'Indian',
    style: 'Friendly',
    tagline: 'Everyday shopper, conversational, genuine recommendation',
    avatarColor: '#10B981',
    hairStyle: 'textured_crop',
    clothingStyle: 'linen_shirt',
    voiceId: 'en-IN-Standard-C',
    voicePitch: 1.0,
    voiceRate: 1.05,
  },
];

// =====================================================================
// PRODUCT CATEGORY INTELLIGENCE
// Maps visual environments, lighting, B-roll motions, and presenter styles
// =====================================================================
export interface CategoryIntelligence {
  id: string;
  name: string;
  keywords: string[];
  defaultPresenterId: string;
  environmentName: string;
  environmentTheme: string;
  lightingStyle: string;
  bRollCameraMotion: string;
  suggestedMusic: string;
  hooks: {
    problemSolution: string;
    ugcReview: string;
    productDemo: string;
    luxuryCommercial: string;
    fastViral: string;
  };
}

export const CATEGORY_INTELLIGENCE: Record<string, CategoryIntelligence> = {
  beauty_skincare: {
    id: 'beauty_skincare',
    name: 'Beauty & Skincare',
    keywords: ['cream', 'serum', 'lotion', 'lipstick', 'makeup', 'skincare', 'shampoo', 'sunscreen', 'face wash', 'cosmetic'],
    defaultPresenterId: 'presenter-ananya',
    environmentName: 'Chic Vanity Studio & Soft Ambient Lighting',
    environmentTheme: 'beauty_studio',
    lightingStyle: 'Soft diffused vanity glow with warm pastel bokeh',
    bRollCameraMotion: 'macro_orbit',
    suggestedMusic: 'Elegant Cosmetic Bloom',
    hooks: {
      problemSolution: 'Tired of skincare products that never deliver? Here is what actually makes a noticeable difference.',
      ugcReview: 'I was genuinely skeptical at first, but after adding this to my daily routine, I am obsessed.',
      productDemo: 'Watch how effortlessly this blends and absorbs without feeling greasy.',
      luxuryCommercial: 'Pure luxury crafted for radiant, everyday confidence.',
      fastViral: 'Stop scrolling! If you care about your skin routine, you need to see this.',
    },
  },
  fashion: {
    id: 'fashion',
    name: 'Fashion & Apparel',
    keywords: ['shirt', 'dress', 'shoes', 'sneakers', 'jacket', 'tshirt', 'hoodie', 'apparel', 'pants', 'trousers', 'wear'],
    defaultPresenterId: 'presenter-priya',
    environmentName: 'Modern Minimalist Catwalk & City Loft',
    environmentTheme: 'fashion_vibe',
    lightingStyle: 'High-contrast studio rim lighting',
    bRollCameraMotion: 'pan_right',
    suggestedMusic: 'Trendy Fashion Beat',
    hooks: {
      problemSolution: 'Finding stylish outfits that are also comfortable used to be hard — until now.',
      ugcReview: 'This is hands down the most complemented piece in my wardrobe right now.',
      productDemo: 'See how the premium drape and tailored cut elevate any casual or evening look.',
      luxuryCommercial: 'Timeless silhouette. Exceptional tailoring. Redefining your signature style.',
      fastViral: 'The exact outfit piece everyone has been asking me about in my DMs.',
    },
  },
  electronics_tech: {
    id: 'electronics_tech',
    name: 'Electronics & Tech Gadgets',
    keywords: ['watch', 'phone', 'charger', 'earbuds', 'headphones', 'gadget', 'cable', 'speaker', 'laptop', 'tech', 'smartwatch'],
    defaultPresenterId: 'presenter-arjun',
    environmentName: 'Cyber Neon Tech Desk & Floating Particles',
    environmentTheme: 'tech_neon',
    lightingStyle: 'Electric cyan and deep sapphire rim spotlight',
    bRollCameraMotion: 'dolly_reveal',
    suggestedMusic: 'Futuristic Electro Pulse',
    hooks: {
      problemSolution: 'Cluttered desk and slow charging? Here is the smart upgrade you have been waiting for.',
      ugcReview: 'I replaced three different devices with this single setup. Game changer.',
      productDemo: 'Look at the instant response and seamless everyday performance right out of the box.',
      luxuryCommercial: 'Precision engineering meets next-generation performance. Built for the modern builder.',
      fastViral: 'If you love tech gadgets, this is the best purchase you will make this month.',
    },
  },
  food_beverages: {
    id: 'food_beverages',
    name: 'Food & Beverages',
    keywords: ['coffee', 'tea', 'snack', 'drink', 'sauce', 'chocolate', 'biscuit', 'cookie', 'juice', 'protein', 'organic'],
    defaultPresenterId: 'presenter-rohan',
    environmentName: 'Artisan Kitchen Counter & Warm Sunlit Table',
    environmentTheme: 'warm_lifestyle',
    lightingStyle: 'Warm golden hour sunlight highlighting textures',
    bRollCameraMotion: 'slow_zoom_in',
    suggestedMusic: 'Upbeat Acoustic Joy',
    hooks: {
      problemSolution: 'Looking for a healthier, delicious snack that actually satisfies your cravings?',
      ugcReview: 'My morning coffee routine was completely transformed once I tasted this.',
      productDemo: 'Made with authentic ingredients you can see and taste from the very first bite.',
      luxuryCommercial: 'Crafted with passion. Rich, authentic taste in every single serving.',
      fastViral: 'Warning: Once you try this, you will never want to go back to regular store brands.',
    },
  },
  home_living: {
    id: 'home_living',
    name: 'Home, Kitchen & Living',
    keywords: ['organizer', 'lamp', 'cookware', 'bottle', 'pillow', 'decor', 'cleaner', 'curtain', 'chair', 'furniture', 'blender'],
    defaultPresenterId: 'presenter-priya',
    environmentName: 'Sunlit Scandinavian Living Room',
    environmentTheme: 'home_scandi',
    lightingStyle: 'Soft morning daylight with natural warmth',
    bRollCameraMotion: 'ambient_float',
    suggestedMusic: 'Warm Living Harmony',
    hooks: {
      problemSolution: 'Struggling to keep your space clean and clutter-free? This solves it in seconds.',
      ugcReview: 'This is the most satisfying home organization upgrade I have made all year.',
      productDemo: 'Notice how easily it fits into any corner while keeping everything effortlessly organized.',
      luxuryCommercial: 'Elevate your sanctuary with thoughtful everyday design and lasting utility.',
      fastViral: 'Here is the viral home product that actually lives up to all the hype.',
    },
  },
  fitness_sports: {
    id: 'fitness_sports',
    name: 'Fitness & Sports',
    keywords: ['gym', 'fitness', 'dumbbells', 'band', 'shaker', 'mat', 'workout', 'sports', 'yoga', 'protein shaker', 'bottle'],
    defaultPresenterId: 'presenter-marcus',
    environmentName: 'High-Energy Industrial Gym Studio',
    environmentTheme: 'fitness_raw',
    lightingStyle: 'Dynamic volumetric spotlights with energetic contrast',
    bRollCameraMotion: 'parallax_tilt',
    suggestedMusic: 'High-Impact Workout Trap',
    hooks: {
      problemSolution: 'Want to hit your fitness goals faster without bulky equipment? Check this out.',
      ugcReview: 'I use this for every single training session. The grip and build quality are rock solid.',
      productDemo: 'Engineered for high-intensity training that withstands daily heavy workouts.',
      luxuryCommercial: 'Uncompromising performance. Engineered for those who refuse to settle.',
      fastViral: 'Stop wasting gym time with bad gear. Upgrade to this today.',
    },
  },
  jewellery_watches: {
    id: 'jewellery_watches',
    name: 'Jewellery & Luxury Accessories',
    keywords: ['ring', 'necklace', 'earrings', 'bracelet', 'pendant', 'gold', 'silver', 'diamond', 'luxury watch', 'jewellery', 'jewelry'],
    defaultPresenterId: 'presenter-sophia',
    environmentName: 'Black Velvet & Mirror Luxury Showcase',
    environmentTheme: 'luxury_dark',
    lightingStyle: 'Prismatic pinpoint highlights producing specular facet gleam',
    bRollCameraMotion: 'macro_orbit',
    suggestedMusic: 'Luxury Ambient Pulse',
    hooks: {
      problemSolution: 'Looking for a signature statement piece that looks stunning without astronomical retail markups?',
      ugcReview: 'The shimmer when the light hits this is unbelievable. Everyone keeps asking where I got it.',
      productDemo: 'Notice the precision prong setting and hand-polished mirror finish from every angle.',
      luxuryCommercial: 'Crafted for moments that last forever. Pure sophistication in every facet.',
      fastViral: 'This luxury look will elevate your entire style instantly.',
    },
  },
  general: {
    id: 'general',
    name: 'Premium Consumer Product',
    keywords: [],
    defaultPresenterId: 'presenter-arjun',
    environmentName: 'Cinematic Radial Dark Studio',
    environmentTheme: 'luxury_dark',
    lightingStyle: 'Centered 3D spotlight with deep cinematic falloff',
    bRollCameraMotion: 'slow_zoom_in',
    suggestedMusic: 'Inspiring Modern Elevation',
    hooks: {
      problemSolution: 'Still searching for a reliable solution? Meet the product changing the game.',
      ugcReview: 'I did not expect this to be this good, but it has completely exceeded my expectations.',
      productDemo: 'Here is a quick look at how it works and why people are making the switch.',
      luxuryCommercial: 'Exceptional craftsmanship designed to elevate your everyday routine.',
      fastViral: 'Do not scroll past this if you value quality and smart design.',
    },
  },
};

// Detect intelligent category from image analysis or product text
export function detectCategoryIntelligence(
  detectedCategory: string = '',
  productName: string = '',
  productDesc: string = ''
): CategoryIntelligence {
  const combined = `${detectedCategory} ${productName} ${productDesc}`.toLowerCase();

  for (const key of Object.keys(CATEGORY_INTELLIGENCE)) {
    if (key === 'general') continue;
    const item = CATEGORY_INTELLIGENCE[key];
    const match = item.keywords.some((kw) => combined.includes(kw));
    if (match) {
      return item;
    }
  }

  return CATEGORY_INTELLIGENCE.general;
}
