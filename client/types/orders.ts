export type OrderStatus =
  | "quote_requested"
  | "quote_reviewing"
  | "quote_sent"
  | "quote_accepted"
  | "quote_rejected"
  | "project_started"
  | "project_in_progress"
  | "project_review"
  | "project_completed"
  | "project_delivered"
  | "archived";

export type OrderType = "quote" | "project";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  registeredAt: Date;
  totalOrders: number;
  totalValue: number;
}

export interface ProjectFile {
  id: string;
  orderId: string;
  name: string;
  type: "brief" | "design" | "source" | "deliverable" | "other";
  url: string;
  size: number;
  uploadedBy: "client" | "admin";
  uploadedAt: Date;
}

export interface OrderMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderType: "client" | "admin";
  content: string;
  attachments?: ProjectFile[];
  timestamp: Date;
  read: boolean;
}

export interface Order {
  id: string;
  clientId: string;
  client: Client;
  type: OrderType;
  status: OrderStatus;
  priority: Priority;

  // Informations projet
  title: string;
  category: string;
  description: string;
  budget: string;
  timeline: string;
  additionalRequirements?: string;

  // Suivi
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;

  // Communication
  messages: OrderMessage[];
  files: ProjectFile[];

  // Progression
  progress: number; // 0-100
  milestones: Milestone[];

  // Financier
  quotedPrice?: number;
  finalPrice?: number;
  paid?: boolean;
  invoiceId?: string;
}

export interface Milestone {
  id: string;
  orderId: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
  order: number;
}

export interface Invoice {
  id: string;
  orderId: string;
  amount: number;
  tax: number;
  total: number;
  createdAt: Date;
  dueDate: Date;
  paidAt?: Date;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
}

export interface OrderNotification {
  id: string;
  orderId: string;
  recipientType: "client" | "admin";
  type:
    | "status_change"
    | "new_message"
    | "new_file"
    | "payment_due"
    | "milestone_completed";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  urgent: boolean;
}
