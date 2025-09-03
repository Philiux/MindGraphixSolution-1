export interface ClientInfo {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface BaseServiceData {
  serviceType: ServiceType;
  projectName: string;
  description: string;
  targetAudience: string;
  deadline?: Date;
  budget: string;
  inspiration: string[];
  additionalNotes?: string;
  clientInfo?: ClientInfo;
}

export interface LogoDesignData extends BaseServiceData {
  serviceType: "logo-design";
  companyName: string;
  industry: string;
  logoType: LogoType;
  colorPreferences: ColorPreference[];
  style: LogoStyle[];
  includeText: boolean;
  variations: LogoVariation[];
  usageContext: LogoUsageContext[];
  competitorLogos?: string[];
  brandPersonality: BrandPersonality[];
  customTargetAudience?: string;
}

export interface WebsiteData extends BaseServiceData {
  serviceType: "website-development";
  websiteType: WebsiteType;
  pages: string[];
  features: WebsiteFeature[];
  designStyle: DesignStyle[];
  colorScheme: ColorScheme;
  contentProvided: boolean;
  seoRequired: boolean;
  responsiveDesign: boolean;
  languages: string[];
  hostingRequired: boolean;
  maintenanceRequired: boolean;
  integrations: Integration[];
}

export interface PrintDesignData extends BaseServiceData {
  serviceType: "print-design";
  printType: PrintType;
  dimensions: PrintDimensions;
  orientation: "portrait" | "landscape" | "square";
  colorMode: "cmyk" | "rgb" | "pantone";
  finishType: FinishType[];
  quantity: number;
  printQuality: PrintQuality;
  contentElements: ContentElement[];
  foldingType?: FoldingType;
  bindingType?: BindingType;
  customTargetAudience?: string;
}

export interface BrandingData extends BaseServiceData {
  serviceType: "branding";
  brandingScope: BrandingScope[];
  brandValues: string[];
  brandPersonality: BrandPersonality[];
  targetMarket: string;
  competitorAnalysis: string[];
  brandAssets: BrandAsset[];
  applicationNeeds: BrandApplication[];
  brandGuidelines: boolean;
}

export interface MobileAppData extends BaseServiceData {
  serviceType: "mobile-app";
  platforms: MobilePlatform[];
  appType: AppType;
  features: AppFeature[];
  userAuthentication: boolean;
  offlineMode: boolean;
  pushNotifications: boolean;
  analytics: boolean;
  monetization: MonetizationType[];
  apiIntegration: string[];
  designSystem: boolean;
}

export interface MarketingMaterialData extends BaseServiceData {
  serviceType: "marketing-material";
  materialType: MarketingMaterialType[];
  campaignGoal: string;
  channels: MarketingChannel[];
  messageHierarchy: string[];
  ctaElements: string[];
  brandCompliance: boolean;
  legalRequirements: string[];
}

export type ServiceType =
  | "logo-design"
  | "website-development"
  | "print-design"
  | "branding"
  | "mobile-app"
  | "marketing-material";

export type LogoType =
  | "wordmark"
  | "lettermark"
  | "pictorial"
  | "abstract"
  | "mascot"
  | "combination"
  | "emblem";

export type LogoStyle =
  | "modern"
  | "minimalist"
  | "vintage"
  | "playful"
  | "elegant"
  | "bold"
  | "organic"
  | "geometric";

export type LogoVariation =
  | "horizontal"
  | "vertical"
  | "icon-only"
  | "monochrome"
  | "reversed"
  | "simplified";

export type LogoUsageContext =
  | "website"
  | "business-card"
  | "letterhead"
  | "signage"
  | "social-media"
  | "merchandise"
  | "vehicle"
  | "packaging";

export type BrandPersonality =
  | "trustworthy"
  | "innovative"
  | "friendly"
  | "professional"
  | "creative"
  | "bold"
  | "sophisticated"
  | "approachable"
  | "energetic"
  | "reliable";

export type WebsiteType =
  | "corporate"
  | "e-commerce"
  | "portfolio"
  | "blog"
  | "landing-page"
  | "marketplace"
  | "saas"
  | "educational"
  | "nonprofit";

export type WebsiteFeature =
  | "contact-form"
  | "blog"
  | "gallery"
  | "e-commerce"
  | "booking-system"
  | "membership"
  | "forum"
  | "search"
  | "multilingual"
  | "analytics"
  | "social-integration"
  | "payment-gateway";

export type DesignStyle =
  | "modern"
  | "minimalist"
  | "corporate"
  | "creative"
  | "technical"
  | "artistic"
  | "industrial";

export type PrintType =
  | "business-card"
  | "brochure"
  | "flyer"
  | "poster"
  | "banner"
  | "catalog"
  | "magazine"
  | "book"
  | "packaging"
  | "sticker"
  | "billboard";

export type PrintQuality = "standard" | "premium" | "luxury";

export type FinishType =
  | "matte"
  | "gloss"
  | "satin"
  | "uv-coating"
  | "embossing"
  | "foil-stamping"
  | "die-cutting";

export type ContentElement =
  | "headline"
  | "body-text"
  | "images"
  | "logo"
  | "contact-info"
  | "qr-code"
  | "call-to-action"
  | "social-media";

export type FoldingType =
  | "bi-fold"
  | "tri-fold"
  | "z-fold"
  | "gate-fold"
  | "roll-fold";

export type BindingType =
  | "saddle-stitch"
  | "perfect-bound"
  | "spiral"
  | "wire-o"
  | "case-bound";

export type BrandingScope =
  | "logo-design"
  | "color-palette"
  | "typography"
  | "imagery-style"
  | "voice-tone"
  | "brand-guidelines"
  | "stationery"
  | "digital-assets";

export type BrandAsset =
  | "logo-variations"
  | "color-palette"
  | "typography-system"
  | "icon-library"
  | "pattern-library"
  | "photography-style"
  | "illustration-style";

export type BrandApplication =
  | "business-cards"
  | "letterhead"
  | "website"
  | "social-media"
  | "packaging"
  | "signage"
  | "uniforms"
  | "vehicle-graphics";

export type MobilePlatform = "ios" | "android" | "cross-platform";

export type AppType = "native" | "hybrid" | "web-app" | "pwa";

export type AppFeature =
  | "user-profiles"
  | "messaging"
  | "geolocation"
  | "camera-integration"
  | "offline-sync"
  | "push-notifications"
  | "in-app-purchases"
  | "social-sharing"
  | "real-time-updates"
  | "file-upload";

export type MonetizationType =
  | "free"
  | "paid"
  | "freemium"
  | "subscription"
  | "in-app-purchases"
  | "advertising";

export type MarketingMaterialType =
  | "social-media-posts"
  | "banner-ads"
  | "email-templates"
  | "presentation"
  | "infographic"
  | "white-paper"
  | "case-study"
  | "landing-page";

export type MarketingChannel =
  | "social-media"
  | "email"
  | "website"
  | "print"
  | "outdoor"
  | "radio"
  | "tv"
  | "digital-ads";

export interface ColorPreference {
  color: string;
  preference: "love" | "like" | "neutral" | "dislike" | "avoid";
  reason?: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string[];
  mood: ColorMood;
}

export type ColorMood =
  | "energetic"
  | "calm"
  | "professional"
  | "playful"
  | "elegant"
  | "bold"
  | "natural"
  | "technological";

export interface PrintDimensions {
  width: number;
  height: number;
  unit: "mm" | "cm" | "in" | "px";
  bleed?: number;
}

export interface Integration {
  name: string;
  type: IntegrationType;
  required: boolean;
  description?: string;
}

export type IntegrationType =
  | "payment"
  | "crm"
  | "email"
  | "analytics"
  | "social-media"
  | "shipping"
  | "inventory"
  | "booking"
  | "api";

export interface ServiceExample {
  id: string;
  serviceType: ServiceType;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  style: string;
  colors: string[];
  industry?: string;
}

export interface AIGeneratedContent {
  type:
    | "color-palette"
    | "design-suggestion"
    | "content-idea"
    | "layout-option";
  data: any;
  confidence: number;
  reasoning: string;
}
