export interface QuoteRequest {
  id?: string;
  clientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  projectInfo: {
    title: string;
    description: string;
    category: ProjectCategory;
    deadline?: Date;
    budget: BudgetRange;
    urgency: UrgencyLevel;
  };
  services: ServiceItem[];
  additionalRequirements?: string;
  attachments?: FileAttachment[];
  status: QuoteStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quote {
  id: string;
  requestId: string;
  quoteNumber: string;
  clientInfo: QuoteRequest["clientInfo"];
  projectInfo: QuoteRequest["projectInfo"];
  services: QuoteServiceItem[];
  pricing: {
    subtotal: number;
    tax: number;
    total: number;
    currency: string;
  };
  timeline: {
    estimatedStartDate: Date;
    estimatedEndDate: Date;
    milestones: Milestone[];
  };
  terms: {
    validUntil: Date;
    paymentTerms: string;
    deliverables: string[];
    additionalNotes?: string;
  };
  status: QuoteStatus;
  createdAt: Date;
  updatedAt: Date;
  acceptedAt?: Date;
  paidAt?: Date;
}

export interface QuoteServiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: ServiceCategory;
}

export interface ServiceItem {
  category: ServiceCategory;
  name: string;
  description?: string;
  selected: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  deliverables: string[];
  paymentPercentage: number;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface Payment {
  id: string;
  quoteId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  processedAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
}

export type ProjectCategory =
  | "web-development"
  | "mobile-app"
  | "ui-ux-design"
  | "branding"
  | "e-commerce"
  | "consulting"
  | "maintenance"
  | "seo-marketing"
  | "custom-software"
  | "other";

export type ServiceCategory =
  | "design"
  | "development"
  | "marketing"
  | "consulting"
  | "maintenance"
  | "hosting"
  | "mobile-app"
  | "specialized"
  | "branding"
  | "logo-design"
  | "website-development"
  | "print-design"
  | "marketing-material"
  | "other";

export type BudgetRange =
  | "under-1000"
  | "1000-5000"
  | "5000-10000"
  | "10000-25000"
  | "25000-50000"
  | "over-50000"
  | "to-discuss";

export type UrgencyLevel = "low" | "medium" | "high" | "urgent";

export type QuoteStatus =
  | "draft"
  | "pending"
  | "under-review"
  | "sent"
  | "accepted"
  | "rejected"
  | "expired"
  | "in-progress"
  | "completed"
  | "cancelled";

export type PaymentMethod =
  | "credit-card"
  | "bank-transfer"
  | "paypal"
  | "stripe"
  | "cash"
  | "check";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "refunded";

export interface QuoteFormData {
  step: number;
  clientInfo: Partial<QuoteRequest["clientInfo"]>;
  projectInfo: Partial<QuoteRequest["projectInfo"]>;
  services: ServiceItem[];
  additionalRequirements: string;
  attachments: FileAttachment[];
}
