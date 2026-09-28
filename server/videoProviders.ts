import { GoogleGenAI } from '@google/genai';

export interface ProductAnalysisResult {
  category: string;
  colors: string[];
  style: string;
  shape?: string;
  material?: string;
  visibleFeatures: string[];
  detectedBrand?: string;
  targetAudience: string;
  advertisingStyle: string;
  backgroundRecommendation: string;
  suggestedPresenterStyle?: string;
  likelyUseCase?: string;
}

export interface GeneratedScenePayload {
  id: string;
  scene_number: number;
  name: string;
  scene_type: string;
  scene_description: string;
  duration: number;
  camera_motion: string;
  visual_theme: string;
  voice_text: string;
  caption_text: string;
  highlight_word?: string;
  badge_text?: string;
  presenter_active: boolean;
  presenter_shot: string;
  b_roll_effect?: string;
}

export interface GeneratedVariationPayload {
  id: string;
  version: 'A' | 'B' | 'C' | 'D' | 'E';
  style_name: string;
  hook: string;
  music_style: string;
  voice_persona: string;
  scenes: GeneratedScenePayload[];
}

export interface GeneratedAdPackage {
  productName: string;
  brandName: string;
  language: string;
  style: string;
  duration: number;
  adConcept: string;
  hook: string;
  script: {
    hook: string;
    problem: string;
    solution: string;
    benefits: string[];
    cta: string;
  };
  scenes: GeneratedScenePayload[];
  variations: GeneratedVariationPayload[];
  selected_variation: 'A' | 'B' | 'C' | 'D' | 'E';
  music_track: string;
  cta: string;
  provider: string;
}

// Modular Provider Interface
export interface IVideoProvider {
  name: string;
  isAvailable(): boolean;
  analyzeProduct(
    imageBase64: string | undefined,
    info: { productName?: string; brandName?: string; mimeType?: string }
  ): Promise<ProductAnalysisResult>;
  generateAdPackage(params: {
    productName: string;
    productDescription?: string;
    brandName?: string;
    price?: string;
    offer?: string;
    websiteUrl?: string;
    language?: string;
    style?: string;
    duration?: string;
    voicePersona?: string;
    presenterId?: string;
    analysis?: ProductAnalysisResult;
  }): Promise<GeneratedAdPackage>;
}

// ---------------------------------------------------------------------
// GEMINI MULTIMODAL VIDEO GENERATION ADAPTER
// ---------------------------------------------------------------------
export class GeminiVideoAdapter implements IVideoProvider {
  name = 'Google Gemini 2.5 Multimodal Engine';
  private ai: GoogleGenAI | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build-digitalx-video',
          },
        },
      });
    }
  }

  isAvailable(): boolean {
    return Boolean(this.ai);
  }

  async analyzeProduct(
    imageBase64: string | undefined,
    info: { productName?: string; brandName?: string; mimeType?: string }
  ): Promise<ProductAnalysisResult> {
    const { productName = '', brandName = 'Digital X', mimeType = 'image/jpeg' } = info;

    // High quality intelligent fallback if vision model is not triggered
    const fallback: ProductAnalysisResult = {
      category: productName ? `${productName} Collection` : 'Premium Consumer Product',
      colors: ['Obsidian Black', 'Metallic Silver', 'Cyan Blue Accent'],
      style: 'Modern Premium Commercial',
      shape: 'Ergonomic Contemporary',
      material: 'Engineered Precision Finish',
      visibleFeatures: [
        'Precision industrial craftsmanship',
        'Ergonomic modern silhouette',
        'Engineered for everyday utility',
      ],
      detectedBrand: brandName || 'Brand',
      targetAudience: 'Active online shoppers and quality-focused buyers',
      advertisingStyle: 'High-Retention Kinetic Social Showcase',
      backgroundRecommendation: 'Dark studio backdrop with cinematic radial spotlight',
      suggestedPresenterStyle: 'Influencer / UGC',
      likelyUseCase: 'Daily lifestyle and professional utility',
    };

    if (this.ai && imageBase64 && typeof imageBase64 === 'string') {
      try {
        const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
        const prompt = `You are a world-class commercial video director and product marketing analyst.
Analyze this product image carefully.
CRITICAL RULE: NEVER invent unverified specifications (such as fake battery capacity, medical benefits, unverified ingredients, fake certifications, or imaginary warranty). Only report what is visually evident.
Respond with a STRICT, VALID JSON object only, without any markdown fences, matching this schema:
{
  "category": "specific product category (e.g. Skincare, Tech Gadgets, Fashion, Food, Home, Jewellery, Automobile)",
  "colors": ["dominant color 1", "dominant color 2"],
  "style": "aesthetic style (e.g. Modern Minimalist, Luxury, Sporty, Tech, Casual)",
  "shape": "physical form / geometry",
  "material": "visually identifiable surface material if discernible",
  "visibleFeatures": ["visible feature 1", "visible feature 2", "visible feature 3"],
  "detectedBrand": "${brandName || 'Brand'}",
  "targetAudience": "specific ideal buyer persona",
  "advertisingStyle": "suggested social ad format",
  "backgroundRecommendation": "studio background setting that best complements the product",
  "suggestedPresenterStyle": "Female / Male UGC creator, Tech reviewer, or Luxury presenter",
  "likelyUseCase": "primary practical application"
}`;

        const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType || 'image/jpeg',
                    data: cleanBase64,
                  },
                },
                { text: prompt },
              ],
            },
          ],
        });

        const rawText = response.text || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            category: parsed.category || fallback.category,
            colors: Array.isArray(parsed.colors) && parsed.colors.length ? parsed.colors : fallback.colors,
            style: parsed.style || fallback.style,
            shape: parsed.shape || fallback.shape,
            material: parsed.material || fallback.material,
            visibleFeatures: Array.isArray(parsed.visibleFeatures) && parsed.visibleFeatures.length ? parsed.visibleFeatures : fallback.visibleFeatures,
            detectedBrand: parsed.detectedBrand || brandName || fallback.detectedBrand,
            targetAudience: parsed.targetAudience || fallback.targetAudience,
            advertisingStyle: parsed.advertisingStyle || fallback.advertisingStyle,
            backgroundRecommendation: parsed.backgroundRecommendation || fallback.backgroundRecommendation,
            suggestedPresenterStyle: parsed.suggestedPresenterStyle || fallback.suggestedPresenterStyle,
            likelyUseCase: parsed.likelyUseCase || fallback.likelyUseCase,
          };
        }
      } catch (err) {
        console.warn('Gemini vision analysis failed, using fallback:', err);
      }
    }

    return fallback;
  }

  async generateAdPackage(params: {
    productName: string;
    productDescription?: string;
    brandName?: string;
    price?: string;
    offer?: string;
    websiteUrl?: string;
    language?: string;
    style?: string;
    duration?: string;
    voicePersona?: string;
    presenterId?: string;
    analysis?: ProductAnalysisResult;
  }): Promise<GeneratedAdPackage> {
    const {
      productName = 'Product',
      productDescription = '',
      brandName = 'Digital X',
      price = '',
      offer = '',
      websiteUrl = '',
      language = 'English',
      style = 'Premium',
      duration = '30',
      voicePersona = 'Professional Male',
      analysis,
    } = params;

    const brand = brandName || 'Digital X';
    const prod = productName || 'Product';
    const cleanDuration = Number(duration) || 30;
    const sceneCount = cleanDuration <= 15 ? 5 : 6;
    const sceneTime = Number((cleanDuration / sceneCount).toFixed(1));

    // Try Gemini-powered custom script generation if online
    if (this.ai) {
      try {
        const scriptPrompt = `You are an elite direct-response video ad creator for TikTok, Instagram Reels, and YouTube Shorts.
Create a high-converting, presenter-led social media video ad for:
Product: "${prod}"
Brand: "${brand}"
Category: "${analysis?.category || 'Consumer Product'}"
Language: "${language}"
Duration: ${cleanDuration} seconds (${sceneCount} scenes)
Price: "${price || 'Competitive'}"
Offer: "${offer || 'Limited Time'}"
User Description: "${productDescription}"

RULES:
- Do NOT make unverified claims (e.g. 100% cure, certified number 1, impossible guarantees).
- Alternate between AI PRESENTER (talking directly to camera with emotion and natural hook) and PRODUCT B-ROLL (macro closeups, camera motions, feature demonstrations).
- Structure:
  1. Presenter Hook (grab attention with problem or curiosity)
  2. Product B-Roll (cinematic slow reveal of uploaded product)
  3. Presenter Explanation (explaining how it works)
  4. Product Feature B-Roll (demonstration / callouts)
  5. Value / Offer Badge (pricing / discount highlight)
  6. Presenter CTA (clear instruction to tap link)

Return a STRICT JSON object only matching this exact schema:
{
  "hook": "single most compelling opening line spoken by presenter",
  "script": {
    "hook": "opening spoken hook",
    "problem": "relatable viewer problem",
    "solution": "how this product solves it",
    "benefits": ["benefit 1", "benefit 2", "benefit 3"],
    "cta": "direct CTA message"
  },
  "scenes": [
    {
      "scene_number": 1,
      "name": "Presenter Hook",
      "scene_type": "presenter_hook",
      "scene_description": "Presenter looks into camera and delivers viral hook",
      "duration": ${sceneTime},
      "camera_motion": "slow_zoom_in",
      "visual_theme": "luxury_dark",
      "voice_text": "spoken voiceover for this scene",
      "caption_text": "kinetic on-screen subtitle",
      "highlight_word": "key power word",
      "badge_text": "${brand}",
      "presenter_active": true,
      "presenter_shot": "full_frame",
      "b_roll_effect": "particle_burst"
    }
  ]
}`;

        const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: [{ text: scriptPrompt }] }],
        });

        const rawText = response.text || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed.scenes) && parsed.scenes.length >= 3) {
            const mappedScenes: GeneratedScenePayload[] = parsed.scenes.map((sc: any, idx: number) => ({
              id: `sc-ai-${idx + 1}`,
              scene_number: idx + 1,
              name: sc.name || `Scene ${idx + 1}`,
              scene_type: sc.scene_type || (idx % 2 === 0 ? 'presenter_hook' : 'product_b_roll'),
              scene_description: sc.scene_description || 'High-converting social scene',
              duration: Number(sc.duration) || sceneTime,
              camera_motion: sc.camera_motion || 'slow_zoom_in',
              visual_theme: sc.visual_theme || 'luxury_dark',
              voice_text: sc.voice_text || 'Experience the difference today.',
              caption_text: sc.caption_text || sc.voice_text || 'Experience The Difference',
              highlight_word: sc.highlight_word || 'Difference',
              badge_text: sc.badge_text || brand,
              presenter_active: sc.presenter_active !== false,
              presenter_shot: sc.presenter_shot || (idx % 2 === 0 ? 'full_frame' : 'floating_pip'),
              b_roll_effect: sc.b_roll_effect || 'specular_sweep',
            }));

            // Build 5 variations
            const variations: GeneratedVariationPayload[] = [
              {
                id: 'var-A',
                version: 'A',
                style_name: 'Problem → Solution',
                hook: parsed.hook || `Struggling to find the right ${prod}? Here is your answer.`,
                music_style: 'Luxury Ambient Pulse',
                voice_persona: voicePersona,
                scenes: mappedScenes,
              },
              {
                id: 'var-B',
                version: 'B',
                style_name: 'UGC Creator Review',
                hook: `I was genuinely skeptical about ${prod}, until I tested it myself.`,
                music_style: 'Energetic Modern Beat',
                voice_persona: 'Influencer',
                scenes: mappedScenes.map((s, i) => i === 0 ? {
                  ...s,
                  voice_text: `I honestly didn't expect ${prod} to be this useful. Let me show you why.`,
                  caption_text: `Why everyone is talking about ${prod}`,
                  highlight_word: 'Obsessed',
                } : s),
              },
              {
                id: 'var-C',
                version: 'C',
                style_name: 'Cinematic Product Demo',
                hook: `Watch what happens when you introduce ${prod} to your everyday setup.`,
                music_style: 'Tech Pulse Motion',
                voice_persona: 'Professional Male',
                scenes: mappedScenes.map((s, i) => i === 1 ? {
                  ...s,
                  b_roll_effect: 'macro_texture',
                  caption_text: 'Precision craft in every detail',
                  highlight_word: 'Precision',
                } : s),
              },
              {
                id: 'var-D',
                version: 'D',
                style_name: 'Luxury Commercial',
                hook: `Elevate your lifestyle with the all-new ${prod} by ${brand}.`,
                music_style: 'Chic Velvet Resonance',
                voice_persona: 'Luxury',
                scenes: mappedScenes.map((s) => ({ ...s, visual_theme: 'luxury_dark' })),
              },
              {
                id: 'var-E',
                version: 'E',
                style_name: 'Fast Viral Hook',
                hook: `Stop scrolling! If you are looking for ${prod}, watch this right now.`,
                music_style: 'High-Impact Drop',
                voice_persona: 'Energetic',
                scenes: mappedScenes.map((s, i) => i === 0 ? {
                  ...s,
                  voice_text: `Stop scrolling! This 15-second review will save you time and money.`,
                  caption_text: `STOP SCROLLING • Meet ${prod}`,
                  highlight_word: 'STOP',
                  badge_text: 'Viral',
                } : s),
              },
            ];

            return {
              productName: prod,
              brandName: brand,
              language,
              style,
              duration: cleanDuration,
              adConcept: `${prod} • ${variations[0].style_name}`,
              hook: variations[0].hook,
              script: parsed.script || {
                hook: variations[0].hook,
                problem: 'Customers struggle with low quality alternatives.',
                solution: `${prod} delivers verified excellence.`,
                benefits: ['Premium materials', 'Ergonomic utility', 'Instant convenience'],
                cta: 'Tap below to order yours today.',
              },
              scenes: variations[0].scenes,
              variations,
              selected_variation: 'A',
              music_track: 'Luxury Ambient Pulse',
              cta: websiteUrl ? `Visit ${websiteUrl.replace(/https?:\/\//, '')}` : 'Shop Now',
              provider: this.name,
            };
          }
        }
      } catch (err) {
        console.warn('Gemini script generation fallback triggered:', err);
      }
    }

    // High quality deterministic generation if offline
    return this.buildDeterministicPackage({
      productName: prod,
      brandName: brand,
      productDescription,
      price,
      offer,
      websiteUrl,
      language,
      style,
      cleanDuration,
      sceneCount,
      sceneTime,
      voicePersona,
      analysis,
    });
  }

  private buildDeterministicPackage(data: any): GeneratedAdPackage {
    const {
      productName,
      brandName,
      productDescription,
      price,
      offer,
      websiteUrl,
      language,
      style,
      cleanDuration,
      sceneCount,
      sceneTime,
      voicePersona,
    } = data;

    const isHindi = language === 'Hindi';
    const isHinglish = language === 'Hinglish';

    const getHookA = () => {
      if (isHindi) return `क्या आप भी अपनी दिनचर्या में बेस्ट ${productName} ढूंढ रहे हैं?`;
      if (isHinglish) return `Ready to upgrade your daily routine with the all-new ${productName}?`;
      return `Looking for a smarter, cleaner way to elevate your everyday routine? Meet ${productName}.`;
    };

    const scenesA: GeneratedScenePayload[] = [
      {
        id: 'sc-1',
        scene_number: 1,
        name: 'Presenter Hook',
        scene_type: 'presenter_hook',
        scene_description: 'AI Presenter directly addresses camera delivering high-converting problem hook',
        duration: sceneTime,
        camera_motion: 'slow_zoom_in',
        visual_theme: 'luxury_dark',
        voice_text: getHookA(),
        caption_text: isHindi ? `बेस्ट ${productName} अब आपके लिए` : `Elevate Your Routine With ${productName}`,
        highlight_word: isHindi ? 'बेस्ट' : 'Elevate',
        badge_text: brandName,
        presenter_active: true,
        presenter_shot: 'full_frame',
        b_roll_effect: 'particle_burst',
      },
      {
        id: 'sc-2',
        scene_number: 2,
        name: 'Product B-Roll Spotlight',
        scene_type: 'product_b_roll',
        scene_description: 'Cinematic slow camera push across the real product with specular light sheen',
        duration: sceneTime,
        camera_motion: 'pan_right',
        visual_theme: 'luxury_dark',
        voice_text: isHindi
          ? 'हर एक डिटेल में बेहतरीन फिनिश और प्रीमियम क्वालिटी।'
          : isHinglish
          ? 'Notice the precision craftsmanship and clean modern finish from every angle.'
          : 'Notice the precision craftsmanship and clean modern finish from every single angle.',
        caption_text: isHindi ? 'प्रीमियम फिनिश और शानदार लुक' : 'Precision Craftsmanship & Modern Aesthetic',
        highlight_word: isHindi ? 'प्रीमियम' : 'Precision',
        badge_text: brandName,
        presenter_active: true,
        presenter_shot: 'floating_pip',
        b_roll_effect: 'specular_sweep',
      },
      {
        id: 'sc-3',
        scene_number: 3,
        name: 'Presenter Demonstration',
        scene_type: 'presenter_demo',
        scene_description: 'Presenter explains key real-world benefits with energetic gesturing',
        duration: sceneTime,
        camera_motion: 'parallax_tilt',
        visual_theme: 'fashion_vibe',
        voice_text: isHindi
          ? productDescription ? productDescription.slice(0, 80) : 'आपकी रोजमर्रा की जरूरतों के लिए एकदम परफेक्ट।'
          : productDescription ? productDescription.slice(0, 80) : 'Engineered to deliver exceptional performance and lasting durability right where you need it.',
        caption_text: isHindi ? 'रोजमर्रा की जरूरतों के लिए परफेक्ट' : 'Engineered For Lasting Everyday Durability',
        highlight_word: isHindi ? 'परफेक्ट' : 'Durability',
        badge_text: 'In-Use Demo',
        presenter_active: true,
        presenter_shot: 'full_frame',
      },
      {
        id: 'sc-4',
        scene_number: 4,
        name: 'Feature Callout B-Roll',
        scene_type: 'product_close_up',
        scene_description: 'Macro camera orbit on product with animated indicator lines highlighting craft',
        duration: sceneTime,
        camera_motion: 'macro_orbit',
        visual_theme: 'tech_neon',
        voice_text: isHindi
          ? 'बिना किसी परेशानी के शानदार अनुभव।'
          : 'No bulky design, no unnecessary complexity. Pure streamlined utility.',
        caption_text: isHindi ? 'स्मार्ट और असरदार डिजाइन' : 'Streamlined Utility & Ergonomic Design',
        highlight_word: isHindi ? 'स्मार्ट' : 'Streamlined',
        badge_text: 'Verified Craft',
        presenter_active: true,
        presenter_shot: 'floating_pip',
        b_roll_effect: 'feature_callouts',
      },
      {
        id: 'sc-5',
        scene_number: 5,
        name: 'Special Value Card',
        scene_type: 'presenter_benefit',
        scene_description: 'High-contrast promotional visual card highlighting price and special offer',
        duration: sceneTime,
        camera_motion: 'dolly_reveal',
        visual_theme: 'luxury_dark',
        voice_text: offer
          ? (isHindi ? `सीमित समय के लिए स्पेशल ऑफर: ${offer}!` : `Special announcement: Unlock ${offer} on your order today!`)
          : price
          ? (isHindi ? `केवल ₹${price} में उपलब्ध!` : `Available now starting at just ₹${price} with fast delivery!`)
          : (isHindi ? `आज ही ऑर्डर करें और बेहतरीन बेनिफिट पाएं!` : `Enjoy direct-to-consumer pricing with nationwide express shipping!`),
        caption_text: offer ? `Special Offer: ${offer}` : price ? `Only ₹${price} • Limited Stock` : 'Exclusive Launch Value',
        highlight_word: offer ? offer : price ? `₹${price}` : 'Exclusive',
        badge_text: offer || 'Best Price',
        presenter_active: false,
        presenter_shot: 'off_camera_b_roll',
        b_roll_effect: 'particle_burst',
      },
      {
        id: 'sc-6',
        scene_number: 6,
        name: 'Presenter Call to Action',
        scene_type: 'cta_outro',
        scene_description: 'Presenter gives high-CTR recommendation with pulsing shop button',
        duration: sceneTime,
        camera_motion: 'slow_zoom_in',
        visual_theme: 'luxury_dark',
        voice_text: isHindi
          ? `अभी नीचे दिए गए लिंक पर क्लिक करें और ${brandName} से ऑर्डर करें।`
          : `Tap the link below right now to get yours today before inventory sells out!`,
        caption_text: isHindi ? 'तुरंत ऑर्डर करें • सीमित स्टॉक' : 'Tap Below To Order Today • Fast Delivery',
        highlight_word: isHindi ? 'ऑर्डर' : 'Order',
        badge_text: 'Shop Now',
        presenter_active: true,
        presenter_shot: 'full_frame',
      },
    ].slice(0, sceneCount);

    const variations: GeneratedVariationPayload[] = [
      {
        id: 'var-A',
        version: 'A',
        style_name: 'Problem → Solution',
        hook: getHookA(),
        music_style: 'Luxury Ambient Pulse',
        voice_persona: voicePersona,
        scenes: scenesA,
      },
      {
        id: 'var-B',
        version: 'B',
        style_name: 'UGC Creator Review',
        hook: isHindi
          ? `मैं पहले हैरान था, लेकिन ${productName} ने वाकई मुझे इम्प्रेस कर दिया।`
          : `I was genuinely skeptical about ${productName}, until I tested it myself.`,
        music_style: 'Energetic Modern Beat',
        voice_persona: 'Influencer',
        scenes: scenesA.map((s, i) => i === 0 ? {
          ...s,
          voice_text: isHindi
            ? `मेरा असली रिव्यू: ${productName} ने मेरी उम्मीदों से कहीं ज्यादा काम किया।`
            : `My honest review: ${productName} completely exceeded all my expectations. Here is why.`,
          caption_text: isHindi ? 'ईमानदार रिव्यू: वाकई काम करता है' : 'Honest Review: This Actually Works',
          highlight_word: 'Honest',
        } : s),
      },
      {
        id: 'var-C',
        version: 'C',
        style_name: 'Cinematic Product Demo',
        hook: isHindi
          ? `देखिए कैसे ${productName} आपकी रोजमर्रा की जिंदगी को आसान बनाता है।`
          : `Watch how effortlessly ${productName} performs right out of the box.`,
        music_style: 'Tech Pulse Motion',
        voice_persona: 'Professional Male',
        scenes: scenesA.map((s, i) => i === 1 ? {
          ...s,
          b_roll_effect: 'macro_texture',
          caption_text: isHindi ? 'हर एंगल में बेहतरीन बनावट' : 'Flawless Finish In Every Angle',
          highlight_word: 'Flawless',
        } : s),
      },
      {
        id: 'var-D',
        version: 'D',
        style_name: 'Luxury Commercial',
        hook: isHindi
          ? `प्योर एलिगेंस और बेजोड़ स्टाइल — पेश है नया ${productName}।`
          : `Pure elegance. Unmatched craft. Introducing the new ${productName} by ${brandName}.`,
        music_style: 'Chic Velvet Resonance',
        voice_persona: 'Luxury',
        scenes: scenesA.map((s) => ({ ...s, visual_theme: 'luxury_dark' })),
      },
      {
        id: 'var-E',
        version: 'E',
        style_name: 'Fast Viral Hook',
        hook: isHindi
          ? `रुकिए! अगर आप ${productName} खरीदने की सोच रहे हैं, तो पहले यह देखिए!`
          : `Stop scrolling! If you are shopping for ${productName}, watch this right now!`,
        music_style: 'High-Impact Drop',
        voice_persona: 'Energetic',
        scenes: scenesA.map((s, i) => i === 0 ? {
          ...s,
          voice_text: isHindi
            ? `रुकिए! यह 15 सेकंड का वीडियो आपका समय और पैसा दोनों बचाएगा!`
            : `Stop scrolling! This quick 15-second breakdown will save you time and money!`,
          caption_text: isHindi ? 'रुकिए! पहले यह वीडियो देखिए' : 'STOP SCROLLING • Watch This First',
          highlight_word: 'STOP',
          badge_text: 'Trending',
        } : s),
      },
    ];

    return {
      productName,
      brandName,
      language,
      style,
      duration: cleanDuration,
      adConcept: `${productName} • ${variations[0].style_name}`,
      hook: variations[0].hook,
      script: {
        hook: variations[0].hook,
        problem: 'Consumers waste time on poor quality alternatives.',
        solution: `${productName} provides verified utility and refined design.`,
        benefits: ['High quality build', 'Ergonomic utility', 'Instant convenience'],
        cta: isHindi ? 'अभी नीचे क्लिक करें और अपना ऑर्डर दें!' : 'Tap the link below to order yours today!',
      },
      scenes: variations[0].scenes,
      variations,
      selected_variation: 'A',
      music_track: 'Luxury Ambient Pulse',
      cta: websiteUrl ? `Visit ${websiteUrl.replace(/https?:\/\//, '')}` : 'Shop Now',
      provider: 'Digital X Procedural Synthesis Engine',
    };
  }
}

// ---------------------------------------------------------------------
// OPTIONAL THIRD-PARTY ADAPTER STUBS (Runway, Luma, ElevenLabs)
// Ready for external API keys in production
// ---------------------------------------------------------------------
export class RunwayVideoAdapter implements IVideoProvider {
  name = 'Runway Gen-3 Alpha Video Engine';
  isAvailable(): boolean {
    return Boolean(process.env.RUNWAY_API_KEY);
  }
  async analyzeProduct(img: any, info: any): Promise<ProductAnalysisResult> {
    throw new Error('Runway requires active RUNWAY_API_KEY in .env');
  }
  async generateAdPackage(params: any): Promise<GeneratedAdPackage> {
    throw new Error('Runway requires active RUNWAY_API_KEY in .env');
  }
}

export class ElevenLabsVoiceAdapter {
  name = 'ElevenLabs AI Neural Voice Engine';
  isAvailable(): boolean {
    return Boolean(process.env.ELEVENLABS_API_KEY);
  }
  async synthesizeVoice(text: string, voiceId: string): Promise<ArrayBuffer | null> {
    if (!this.isAvailable()) return null;
    // Ready for elevenlabs voice streaming
    return null;
  }
}
